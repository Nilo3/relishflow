import type { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import type { Observable } from 'rxjs'
import type { Response } from 'express'
import type { ModelRequest } from 'types'

import { Injectable, Logger } from '@nestjs/common'
import { tap, catchError } from 'rxjs/operators'

// Intercepta las peticiones HTTP y crea logs en la consola
@Injectable()
export class LoggingInterceptor<T> implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name)

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<ModelRequest>()
    const response = context.switchToHttp().getResponse<Response>()

    const method = request.method
    const url = request.url
    const body = JSON.stringify((request as { body?: Record<string, unknown> }).body)
    const params = JSON.stringify(request.params)
    const query = JSON.stringify(request.query)
    const accessToken = JSON.stringify(request.headers.authorization)
    const ip = request.ip
    const now = Date.now()

    const user = request.userId ? `Usuario: ${request.userId}` : 'Usuario no autenticado'

    this.logger.log(`Petición -> Método: ${method} | URL: ${url} | Params: ${params} | Query: ${query} | IP: ${ip} | ${user}`)

    return next.handle().pipe(
      tap((data: T) => {
        const statusCode = response.statusCode
        const executionTime = Date.now() - now

        const responseSize = JSON.stringify(data).length

        this.logger.log(`Respuesta -> Método: ${method} | URL: ${url} | Estado: ${statusCode} | Tiempo de ejecución: ${executionTime}ms | Tamaño de la respuesta: ${responseSize} bytes`)
      }),
      catchError((error: unknown) => {
        const statusCode = (error as { status?: number }).status || 500
        const executionTime = Date.now() - now

        this.logger.error(
          `Error -> Método: ${method} | URL: ${url} | Estado: ${statusCode} | Tiempo de ejecución: ${executionTime}ms - ${(error as { message?: string }).message} | IP: ${ip} | ${user}`
        )

        this.logger.debug(`Petición Body: ${body}`)
        this.logger.debug(`Petición Token: ${accessToken}`)

        throw error
      })
    )
  }
}
