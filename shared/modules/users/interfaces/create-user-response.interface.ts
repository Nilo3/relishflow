import { UserRoles } from '../enums/roles.enum';

export interface ICreateUserResponse {
    id: string;
    name: string;
    surname: string;
    email: string;
    role: UserRoles;
    createdAt: Date;
    updatedAt: Date;
} 