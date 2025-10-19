import { RestaurantStaffMemberRole } from '../enums/restaurant-staff-member-roles.enum'

export interface IFindAllStaffResponse {
    id: string
    name: string
    lastName: string
    email: string
    role: RestaurantStaffMemberRole
    isActive: boolean
}