import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'

import { AuthModule } from './modules/auth/auth.module'
import { UsersModule } from './modules/users/users.module'
import { S3Module } from './modules/s3/s3.module'
import { HealthModule } from './modules/health/health.module'
import { AuthGuard } from './guards/auth.guard'
import { RolesInterceptor } from './interceptors/role.interceptor'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.' + process.env.NODE_ENV,
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT?.toString() ?? '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      retryDelay: parseInt(process.env.RETRY_DELAY ?? '3000'),
      autoLoadEntities: true,
      synchronize: JSON.parse(process.env.SYNCHRONIZE ?? 'false') as boolean,
      migrations: ['migration/*.js'],
      namingStrategy: new SnakeNamingStrategy(),
      ssl: JSON.parse(process.env.SSL_REJECT_UNAUTHORIZED ?? 'true')
        ? {
          rejectUnauthorized: false
        }
        : undefined
    }),
    AuthModule,
    UsersModule,
    S3Module,
    HealthModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RolesInterceptor
    }
  ]
})
export class AppModule { }
