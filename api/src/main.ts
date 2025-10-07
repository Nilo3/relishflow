/* eslint-disable no-console */
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
import cookieParser from 'cookie-parser'

import { AppModule } from './app.module'
import { ResponseInterceptor } from './interceptors/response.interceptor'
import { ValidationFilter } from './filters/validation.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const config = new DocumentBuilder()
    .setTitle('RelishFlow API V1')
    .setDescription('API para la gestión de restaurantes')
    .setVersion('1.0.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
      name: 'Authorization',
      description: 'Ingrese su token JWT en el encabezado de autorización con el formato "<token>".'
    })
    .build()

  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('api', app, document, {
    explorer: true,
    swaggerOptions: {
      filter: true,
      showRequestDuration: true
    }
  })

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    transformOptions: {
      enableImplicitConversion: true
    }
  }))
  app.useGlobalInterceptors(new ResponseInterceptor())
  app.useGlobalFilters(new ValidationFilter())

  // Configure cookie parser middleware
  app.use(cookieParser())

  // Configure CORS for cross-origin cookie support
  app.enableCors({
    origin: [process.env.FRONTEND_URL, 'http://localhost:3000'].filter((origin): origin is string => Boolean(origin)),
    credentials: true, // Allow cookies to be sent with requests
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-refresh-token', 'x-id-token'],
  })
  await app.listen(process.env.PORT ?? 4000)

  if (process.env.NODE_ENV !== 'production') {
    console.table({
      ENV: process.env.NODE_ENV,

      DB_HOST: process.env.DB_HOST,
      DB_PORT: process.env.DB_PORT,
      DB_USERNAME: process.env.DB_USERNAME,
      DB_PASSWORD: process.env.DB_PASSWORD,
      DB_NAME: process.env.DB_NAME,
      SSL_REJECT_UNAUTHORIZED: process.env.SSL_REJECT_UNAUTHORIZED,
      AUTO_LOAD_ENTITIES: process.env.AUTO_LOAD_ENTITIES,
      SYNCHRONIZE: process.env.SYNCHRONIZE,
      DEFAULT_LIMIT: process.env.DEFAULT_LIMIT,

      REGION: process.env.AWS_REGION,
      ACCESS_KEY: process.env.AWS_ACCESS_KEY_ID,
      SECRET_ACCESS: process.env.AWS_SECRET_ACCESS_KEY,

      USER_POOL_ID: process.env.USER_POOL_WEB_CLIENT_ID,
      USER_POOL_WEB_CLIENT_SECRET: process.env.USER_POOL_WEB_CLIENT_SECRET,

      MAIL_FROM: process.env.MAIL_FROM,
      MAIL_HOST: process.env.MAIL_HOST,
      MAIL_PASSWORD: process.env.MAIL_PASSWORD,
      MAIL_USER: process.env.MAIL_USER,

      S3_BUCKET_NAME: process.env.S3_BUCKET_NAME
    })
  }
}

bootstrap()
