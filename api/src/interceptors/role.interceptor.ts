import type { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import type { Observable } from 'rxjs'
import type { UserRoles } from '@shared/modules/users/enums/roles.enum'
import type { ModelRequest } from 'types'

import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { ROLES_KEY } from 'src/decorators/roles.decorator'
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator'

// Intercepta las peticiones HTTP y comprueba si el usuario tiene los roles permitidos
@Injectable()
export class RolesInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()])

    if (isPublic) {
      return next.handle()
    }

    const roles = this.reflector.getAllAndOverride<UserRoles[] | undefined>(ROLES_KEY, [context.getHandler(), context.getClass()])

    if (!roles || roles.length === 0) {
      throw new HttpException(
        {
          message: 'Debe definir roles permitidos para esta ruta',
          statusCode: 'RoleNotDefined'
        },
        HttpStatus.BAD_REQUEST
      )
    }

    const request: ModelRequest = context.switchToHttp().getRequest()
    const userRole = request.userRole

    if (!userRole) throw new HttpException({ message: 'Es obligatorio definir un rol en los headers', statusCode: 'RoleNotDefined' }, HttpStatus.UNAUTHORIZED)

    if (!this.userHasRole(userRole, roles)) {
      throw new HttpException(
        {
          message: 'No tiene permisos para acceder a esta ruta'
        },
        HttpStatus.FORBIDDEN
      )
    }

    return next.handle()
  }

  private userHasRole(userRole: UserRoles, roles: UserRoles[]): boolean {
    return roles.some((role) => userRole.includes(role))
  }
}
