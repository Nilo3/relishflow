import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { Handler, Context } from 'aws-lambda';
import express from 'express';
import cookieParser from 'cookie-parser';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createServer, proxy } = require('aws-serverless-express');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { eventContext } = require('aws-serverless-express/middleware');

import { AppModule } from './app.module';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { ValidationFilter } from './filters/validation.filter';

let server: any;

async function bootstrap(): Promise<any> {
  const expressApp = express();
  const adapter = new ExpressAdapter(expressApp);

  const app = await NestFactory.create(AppModule, adapter);

  const config = new DocumentBuilder()
    .setTitle('Ingrese aquí el título de su aplicación')
    .setDescription('Ingrese aquí la descripción de su aplicación')
    .setVersion('1.0.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
      name: 'Authorization',
      description: 'Ingrese su token JWT en el encabezado de autorización con el formato "<token>".'
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, {
    explorer: true,
    swaggerOptions: {
      filter: true,
      showRequestDuration: true
    }
  });

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    transformOptions: {
      enableImplicitConversion: true
    }
  }));

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new ValidationFilter());

  // Configure cookie parser middleware
  app.use(cookieParser());

  // Configure CORS for cross-origin cookie support
  app.enableCors({
    origin: [process.env.FRONTEND_URL, 'http://localhost:3000'].filter((origin): origin is string => Boolean(origin)),
    credentials: true, // Allow cookies to be sent with requests
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-refresh-token', 'x-id-token'],
  });

  app.use(eventContext());

  await app.init();

  return createServer(expressApp);
}

export const handler: Handler = async (event: any, context: Context) => {
  server ??= await bootstrap();

  return proxy(server, event, context, 'PROMISE').promise;
};