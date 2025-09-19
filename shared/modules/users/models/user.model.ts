import { UserRoles } from '../enums/roles.enum'

export interface UserModel {
  id: string

  name: string

  email: string

  role: UserRoles

  createdAt: Date

  updatedAt: Date
}
