import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

import { ISignInRequest } from '@shared/modules/auth/interfaces/sign-in-request.interface'

export class SignInRequestDto implements ISignInRequest {
    @ApiProperty({
        example: 'proxum-patient@yopmail.com'
    })
    @IsNotEmpty({ message: 'Email cannot be empty' })
    @IsEmail({}, { message: 'Email is not valid' })
    email: string

    @ApiProperty({
        example: 'Hola123@'
    })
    @IsNotEmpty({ message: 'Password cannot be empty' })
    password: string
}