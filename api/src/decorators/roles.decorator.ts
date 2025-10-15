import type { UserRoles } from '@shared/modules/users/enums/roles.enum'
import type { RestaurantStaffMemberRole } from '@shared/modules/restaurants/enums/restaurant-staff-member-roles.enum'

import { SetMetadata } from '@nestjs/common'

export const ROLES_KEY = 'roles'

// Decorador para establecer los roles permitidos para ejecutar la petición
export const Roles = (...roles: UserRoles[] | RestaurantStaffMemberRole[]) => SetMetadata(ROLES_KEY, roles)
