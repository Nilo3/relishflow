import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

import { IValidatePasswordRequest } from '@shared/modules/auth/interfaces/validate-password-request.interface'

export class ValidatePasswordRequestDto implements IValidatePasswordRequest {
  @ApiProperty({
    example: 'user@example.com'
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email is not valid' })
  email: string

  @ApiProperty({
    example: 'SecurePassword123!'
  })
  @IsNotEmpty({ message: 'Password is required' })
  password: string
}
