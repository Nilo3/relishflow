import { UserRoles } from '../enums/roles.enum';

export interface ICreateUserRequest {
    name: string;
    lastName: string;
    email: string;
    role: UserRoles;
    password: string;
    cognitoId?: string;
} 