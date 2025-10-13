import { RestaurantStaffMemberRole } from "../enums/restaurant-staff-member-roles.enum";

export interface IUpdateStaffRequestDto {
    restaurantId: string;
    name?: string;
    role?: RestaurantStaffMemberRole;
    isActive?: boolean;
}
