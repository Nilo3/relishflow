import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, Length } from 'class-validator'

import { IResetPasswordRequest } from '@shared/modules/auth/interfaces/reset-password-request.interface'

export class ResetPasswordRequestDto implements IResetPasswordRequest {
  @ApiProperty({ example: 'user@example.com' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email is not valid' })
  email: string

  @ApiProperty({ example: 'NewSecurePassword123!' })
  @IsNotEmpty({ message: 'New password is required' })
  newPassword: string

  @ApiProperty({ example: '123456' })
  @IsNotEmpty({ message: 'Verification code is required' })
  @Length(6, 6, { message: 'Verification code must be 6 characters' })
  code: string
}
