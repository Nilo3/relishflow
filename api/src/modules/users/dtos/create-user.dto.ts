import { IsString, IsEmail, IsNotEmpty, IsEnum, IsOptional, IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { UserRoles } from '@shared/modules/users/enums/roles.enum'
import { ICreateUserRequest } from '@shared/modules/users/interfaces/create-user-request.interface'

export class CreateUserRequestDto implements ICreateUserRequest {
  @ApiProperty({
    example: 'John'
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string

  @ApiProperty({
    example: 'Doe'
  })
  @IsString({ message: 'Surname must be a string' })
  @IsNotEmpty({ message: 'Surname is required' })
  lastName: string

  @ApiProperty({
    example: 'user@example.com'
  })
  @IsEmail({}, { message: 'Email is not valid' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string

  @ApiProperty({
    example: '1234567890'
  })
  @IsString({ message: 'Document number must be a string' })
  @IsNotEmpty({ message: 'Document number is required' })
  documentNumber: string

  @ApiProperty({
    example: '1234567890'
  })
  @IsString({ message: 'Phone must be a string' })
  @IsNotEmpty({ message: 'Phone is required' })
  phone: string

  @ApiProperty({
    example: UserRoles.Tenant
  })
  @IsEnum(UserRoles, { message: 'Role is not valid' })
  @IsNotEmpty({ message: 'Role is required' })
  role: UserRoles

  @ApiProperty({
    example: 'SecurePassword123!'
  })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  password: string

  @ApiProperty({
    example: 'ae55f745-d9cb-47ad-9f27-b00f64cb99a7'
  })
  @IsUUID('4', { message: 'Cognito ID must be a valid UUID' })
  @IsOptional()
  cognitoId?: string
}
