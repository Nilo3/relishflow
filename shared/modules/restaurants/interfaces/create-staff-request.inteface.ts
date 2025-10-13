import { RestaurantStaffMemberRole } from "../enums/restaurant-staff-member-roles.enum";

export interface ICreateStaffRequestDto {
    restaurantId: string;
    name: string;
    role: RestaurantStaffMemberRole
    isActive?: boolean;
}
