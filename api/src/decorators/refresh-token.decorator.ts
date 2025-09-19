import type { ExecutionContext } from '@nestjs/common'
import type { Request } from 'express'

import { createParamDecorator } from '@nestjs/common'

// Decorador para obtener el token de refresco
export const RefreshToken = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const request: Request = ctx.switchToHttp().getRequest()

  return request.refreshToken
})
