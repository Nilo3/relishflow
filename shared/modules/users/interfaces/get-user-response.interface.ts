import { UserRoles } from '../enums/roles.enum';

export interface IGetUserResponse {
    id: string;
    name: string;
    surname: string;
    email: string;
    role: UserRoles;
    createdAt: Date;
    updatedAt: Date;
} 