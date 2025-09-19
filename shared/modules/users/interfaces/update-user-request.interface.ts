import { UserRoles } from '../enums/roles.enum';

export interface IUpdateUserRequest {
    id: string;
    name?: string;
    surname?: string;
    email?: string;
    role?: UserRoles;
} 