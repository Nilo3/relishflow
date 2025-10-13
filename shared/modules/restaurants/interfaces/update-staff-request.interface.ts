import { RestaurantStaffMemberRole } from "../enums/restaurant-staff-member-roles.enum";

export interface IUpdateStaffRequestDto {
    name?: string;
    role?: RestaurantStaffMemberRole;
    isActive?: boolean;
}
