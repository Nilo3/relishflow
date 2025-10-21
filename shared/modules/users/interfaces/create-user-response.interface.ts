import { UserRoles } from '../enums/roles.enum';

export interface ICreateUserResponse {
    id: string;
    name: string;
    lastName: string;
    email: string;
    documentNumber: string;
    documentTypeId: string;
    cityId: string;
    phone: string;
    role: UserRoles;
    createdAt: Date;
    updatedAt: Date;
} 