import { RestaurantStaffMemberRole } from "../enums/restaurant-staff-member-roles.enum";

export interface ICreateStaffRequestDto {
    name: string;
    role: RestaurantStaffMemberRole
    isActive: boolean;
}
