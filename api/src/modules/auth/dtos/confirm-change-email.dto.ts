import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, Length } from 'class-validator'

import { IConfirmChangeEmailRequest } from '@shared/modules/auth/interfaces/confirm-change-email-request.interface'

export class ConfirmChangeEmailRequestDto implements IConfirmChangeEmailRequest {
  @ApiProperty({
    example: '123456'
  })
  @IsNotEmpty({ message: 'Verification code is required' })
  @Length(6, 6, { message: 'Verification code must be 6 digits' })
  code: string

  @ApiProperty({
    example: 'user@example.com'
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email is not valid' })
  email: string
}
