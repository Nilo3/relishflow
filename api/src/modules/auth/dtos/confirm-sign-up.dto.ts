import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, Length } from 'class-validator'

import { IConfirmSignUpRequest } from '@shared/modules/auth/interfaces/confirm-sign-up-request.interface'

export class ConfirmSignUpRequestDto implements IConfirmSignUpRequest {
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
