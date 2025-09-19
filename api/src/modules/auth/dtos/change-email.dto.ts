import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

import { IChangeEmailRequest } from '@shared/modules/auth/interfaces/change-email-request.interface'

export class ChangeEmailRequestDto implements IChangeEmailRequest {
  @ApiProperty({
    example: 'new.email@example.com'
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email is not valid' })
  email: string
}
