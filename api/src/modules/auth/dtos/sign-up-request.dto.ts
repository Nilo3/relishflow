import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { ISignUpRequest } from '@shared/modules/auth/interfaces/sign-up-request.interface'

export class SignUpRequestDto implements ISignUpRequest {
  @ApiProperty({
    example: 'John'
  })
  @IsNotEmpty({ message: 'First names cannot be empty' })
  @IsString({ message: 'First names must be a string' })
  firstNames: string

  @ApiProperty({
    example: 'CC'
  })
  @IsNotEmpty({ message: 'Document type cannot be empty' })
  @IsString({ message: 'Document type must be a string' })
  documentTypeId: string

  @ApiProperty({
    example: '1234567890'
  })
  @IsNotEmpty({ message: 'Document number cannot be empty' })
  @IsString({ message: 'Document number must be a string' })
  documentNumber: string

  @ApiProperty({
    example: '1234567890'
  })
  @IsNotEmpty({ message: 'Phone cannot be empty' })
  @IsString({ message: 'Phone must be a string' })
  phone: string

  @ApiProperty({
    example: 'Doe'
  })
  @IsNotEmpty({ message: 'Last names cannot be empty' })
  @IsString({ message: 'Last names must be a string' })
  lastNames: string

  @ApiProperty({
    example: '1234567890'
  })
  @IsNotEmpty({ message: 'City cannot be empty' })
  @IsString({ message: 'City must be a string' })
  cityId: string

  @ApiProperty({
    example: 'john.doe@example.com'
  })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  @IsEmail({}, { message: 'Email is not valid' })
  email: string

  @ApiProperty({
    example: 'SecurePassword123!'
  })
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @IsString({ message: 'Password must be a string' })
  password: string
}
