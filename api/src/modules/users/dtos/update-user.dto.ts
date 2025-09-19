import { IsString, IsEmail, IsNotEmpty, IsEnum, IsUUID, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

import { UserRoles } from '@shared/modules/users/enums/roles.enum'
import { IUpdateUserRequest } from '@shared/modules/users/interfaces/update-user-request.interface'

export class UpdateUserRequestDto implements IUpdateUserRequest {
  @ApiProperty({
    example: 'ae55f745-d9cb-47ad-9f27-b00f64cb99a7'
  })
  @IsUUID('4', { message: 'UUID is not valid' })
  @IsNotEmpty({ message: 'UUID is required' })
  id: string

  @ApiProperty({
    example: 'John'
  })
  @IsString({ message: 'Name must be a string' })
  @IsOptional()
  name?: string

  @ApiProperty({
    example: 'Doe'
  })
  @IsString({ message: 'Surname must be a string' })
  @IsOptional()
  surname?: string

  @ApiProperty({
    example: 'user@example.com'
  })
  @IsEmail({}, { message: 'Email is not valid' })
  @IsOptional()
  email?: string

  @ApiProperty({
    example: UserRoles.Tenant
  })
  @IsEnum(UserRoles, { message: 'Role is not valid' })
  @IsOptional()
  role?: UserRoles
}
