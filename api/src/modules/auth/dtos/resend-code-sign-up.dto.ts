import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

import { IResendCodeRequest } from '@shared/modules/auth/interfaces/resend-code-request.interface'

export class ResendCodeRequestDto implements IResendCodeRequest {
  @ApiProperty({
    example: 'user@example.com'
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email is not valid' })
  email: string
}
