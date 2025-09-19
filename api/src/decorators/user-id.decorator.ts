import type { ExecutionContext } from '@nestjs/common'
import type { Request } from 'express'

import { createParamDecorator } from '@nestjs/common'

// Decorador para obtener el id del usuario que hace la petición
export const UserId = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const request: Request = ctx.switchToHttp().getRequest()

  return request.userId
})
