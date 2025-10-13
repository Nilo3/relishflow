import { RestaurantStaffMemberRole } from "../enums/restaurant-staff-member-roles.enum";

export interface ICreateStaffRequestDto {
    restaurantId: string;
    email: string;
    password: string;
    name: string;
    lastName: string;
    role: RestaurantStaffMemberRole
    isActive?: boolean;
}
