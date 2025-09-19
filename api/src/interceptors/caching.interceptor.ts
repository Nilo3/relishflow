/* eslint-disable @typescript-eslint/no-misused-promises */
import type { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import type { Observable } from 'rxjs'

import { Cache } from 'cache-manager'
import { Injectable, Inject, Logger } from '@nestjs/common'
import { of } from 'rxjs'
import { tap } from 'rxjs/operators'
import { CACHE_MANAGER } from '@nestjs/cache-manager'

// Intercepta las peticiones y las guarda en el caché - PREGUNTAR A JAVIER COMO USARLO
@Injectable()
export class CachingInterceptor<T> implements NestInterceptor {
  private readonly logger = new Logger(CachingInterceptor.name)

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>()
    const key = `${request.method}-${request.url}`

    this.logger.debug(`Generando cache key: ${key}`)

    const cachedResponse = await this.cacheManager.get(key)

    if (cachedResponse) {
      this.logger.log(`Devolviendo respuesta desde el caché para la clave: ${key}`)
      this.logger.debug(`Respuesta almacenada en el caché: ${JSON.stringify(cachedResponse)}`)

      return of(cachedResponse)
    }

    this.logger.log(`No hay respuesta almacenada en el caché para la clave: ${key}`)

    return next.handle().pipe(
      tap(async (response: T) => {
        this.logger.debug(`Almacenando respuesta
         en el caché para la clave: ${key}`)
        await this.cacheManager.set(key, response)
        this.logger.log(`Respuesta almacenada en caché para la clave: ${key}`)
        this.logger.debug(`Respuesta: ${JSON.stringify(response)}`)
      })
    )
  }
}
