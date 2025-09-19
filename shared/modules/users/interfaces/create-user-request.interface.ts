import { UserRoles } from '../enums/roles.enum';

export interface ICreateUserRequest {
    name: string;
    surname: string;
    email: string;
    role: UserRoles;
    password: string;
    cognitoId?: string;
} 