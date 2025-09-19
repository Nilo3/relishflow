import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

import { IForgotPasswordRequest } from '@shared/modules/auth/interfaces/forgot-password-request.interface'

export class ForgotPasswordRequestDto implements IForgotPasswordRequest {
  @ApiProperty({
    example: 'user@example.com'
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email is not valid' })
  email: string
}
