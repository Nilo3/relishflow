import type { UserRoles } from '@shared/modules/users/enums/roles.enum'

import { SetMetadata } from '@nestjs/common'

export const ROLES_KEY = 'roles'

// Decorador para establecer los roles permitidos para ejecutar la petición
export const Roles = (...roles: UserRoles[]) => SetMetadata(ROLES_KEY, roles)
