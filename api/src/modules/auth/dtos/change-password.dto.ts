import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

import { IChangePasswordRequest } from '@shared/modules/auth/interfaces/change-password-request.interface'

export class ChangePasswordRequestDto implements IChangePasswordRequest {
  @ApiProperty({
    example: 'CurrentPassword123!'
  })
  @IsNotEmpty({ message: 'Current password is required' })
  oldPassword: string

  @ApiProperty({
    example: 'NewSecurePassword123!'
  })
  @IsNotEmpty({ message: 'New password is required' })
  newPassword: string
}
