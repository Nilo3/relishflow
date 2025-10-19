import { ApiBearerAuth, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Body, Controller, Post, Res } from '@nestjs/common'
import { Response } from 'express'
import { ResponseDto } from '@shared/helpers/response.helper'
import { UserRoles } from '@shared/modules/users/enums/roles.enum'
import { ISignInResponse } from '@shared/modules/auth/interfaces/sign-in-response.interface'
import { ISignUpResponse } from '@shared/modules/auth/interfaces/sign-up-response.interface'
import { IConfirmSignUpResponse } from '@shared/modules/auth/interfaces/confirm-sign-up-response.interface'
import { IForgotPasswordResponse } from '@shared/modules/auth/interfaces/forgot-password-response.interface'
import { IResetPasswordResponse } from '@shared/modules/auth/interfaces/reset-password-response.interface'
import { ISignOutResponse } from '@shared/modules/auth/interfaces/sign-out-response.interface'
import { IChangePasswordResponse } from '@shared/modules/auth/interfaces/change-password-response.interface'
import { IChangeEmailResponse } from '@shared/modules/auth/interfaces/change-email-response.interface'
import { IConfirmChangeEmailResponse } from '@shared/modules/auth/interfaces/confirm-change-email-response.interface'
import { IResendCodeResponse } from '@shared/modules/auth/interfaces/resend-code-response.interface'
import { IValidatePasswordResponse } from '@shared/modules/auth/interfaces/validate-password-response.interface'
import { AUTH_BASE_PATH, AUTH_PATHS } from '@shared/modules/auth/auth.endpoints'
import { RestaurantStaffMemberRole } from '@shared/modules/restaurants/enums/restaurant-staff-member-roles.enum'

import { Public } from 'src/decorators/public.decorator'
import { Roles } from 'src/decorators/roles.decorator'
import { AccessToken } from 'src/decorators/access-token.decorator'
import { UserId } from 'src/decorators/user-id.decorator'

import { ResendCodeRequestDto } from './dtos/resend-code-sign-up.dto'
import { AuthService } from './auth.service'
import { ConfirmSignUpRequestDto } from './dtos/confirm-sign-up.dto'
import { ForgotPasswordRequestDto } from './dtos/forgot-password.dto'
import { ResetPasswordRequestDto } from './dtos/reset-password.dto'
import { ChangeEmailRequestDto } from './dtos/change-email.dto'
import { ChangePasswordRequestDto } from './dtos/change-password.dto'
import { ConfirmChangeEmailRequestDto } from './dtos/confirm-change-email.dto'
import { ValidatePasswordRequestDto } from './dtos/validate-password.dto'
import { SignInRequestDto } from './dtos/sign-in-request.dto'
import { SignUpRequestDto } from './dtos/sign-up-request.dto'

@ApiTags('Auth')
@Controller(AUTH_BASE_PATH)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'User sign in' })
  @Public()
  @Post(AUTH_PATHS.SIGN_IN)
  async signIn(@Body() credentials: SignInRequestDto, @Res({ passthrough: true }) res: Response): Promise<ResponseDto<ISignInResponse>> {
    return await this.authService.signIn(credentials, res)
  }

  @ApiOperation({ summary: 'User sign up' })
  @Public()
  @Post(AUTH_PATHS.SIGN_UP)
  async signUp(@Body() body: SignUpRequestDto): Promise<ResponseDto<ISignUpResponse>> {
    return await this.authService.signUp(body)
  }

  @ApiOperation({ summary: 'Confirm user registration' })
  @Public()
  @Post(AUTH_PATHS.CONFIRM_SIGN_UP)
  async confirm(@Body() body: ConfirmSignUpRequestDto): Promise<ResponseDto<IConfirmSignUpResponse>> {
    return await this.authService.confirmSignUp(body)
  }

  @ApiOperation({ summary: 'Request a password reset' })
  @Public()
  @Post(AUTH_PATHS.FORGOT_PASSWORD)
  async forgotPassword(@Body() body: ForgotPasswordRequestDto): Promise<ResponseDto<IForgotPasswordResponse>> {
    return await this.authService.forgotPassword(body)
  }

  @ApiOperation({ summary: 'Reset the user password' })
  @Public()
  @Post(AUTH_PATHS.RESET_PASSWORD)
  async resetPassword(@Body() body: ResetPasswordRequestDto): Promise<ResponseDto<IResetPasswordResponse>> {
    return await this.authService.resetPassword(body)
  }

  @ApiOperation({ summary: 'Sign out the user' })
  @Roles(UserRoles.SuperAdmin, UserRoles.Tenant, RestaurantStaffMemberRole.CASHIER, RestaurantStaffMemberRole.COOK, RestaurantStaffMemberRole.WAITER, RestaurantStaffMemberRole.OTHER)
  @ApiBearerAuth()
  @ApiHeader({ name: 'x-refresh-token' })
  @ApiHeader({ name: 'x-id-token' })
  @Post(AUTH_PATHS.SIGN_OUT)
  async signOut(@AccessToken() accessToken: string, @Res({ passthrough: true }) res: Response): Promise<ResponseDto<ISignOutResponse>> {
    return await this.authService.signOut(accessToken, res)
  }

  @ApiOperation({ summary: 'Change user password' })
  @Roles(UserRoles.SuperAdmin, UserRoles.Tenant)
  @ApiBearerAuth()
  @ApiHeader({ name: 'x-refresh-token' })
  @ApiHeader({ name: 'x-id-token' })
  @Post(AUTH_PATHS.CHANGE_PASSWORD)
  async changePassword(@AccessToken() accessToken: string, @Body() body: ChangePasswordRequestDto): Promise<ResponseDto<IChangePasswordResponse>> {
    return await this.authService.changePassword(body, accessToken)
  }

  @ApiOperation({ summary: 'Change user email' })
  @Roles(UserRoles.SuperAdmin, UserRoles.Tenant)
  @ApiBearerAuth()
  @ApiHeader({ name: 'x-refresh-token' })
  @ApiHeader({ name: 'x-id-token' })
  @Post(AUTH_PATHS.CHANGE_EMAIL)
  async changeEmail(@Body() body: ChangeEmailRequestDto, @UserId() userId: string): Promise<ResponseDto<IChangeEmailResponse>> {
    return await this.authService.changeEmail(body, userId)
  }

  @ApiOperation({ summary: 'Confirm email change' })
  @ApiBearerAuth()
  @ApiHeader({ name: 'x-refresh-token' })
  @ApiHeader({ name: 'x-id-token' })
  @Roles(UserRoles.SuperAdmin, UserRoles.Tenant)
  @Post(AUTH_PATHS.CONFIRM_CHANGE_EMAIL)
  async confirmChangeEmail(@Body() body: ConfirmChangeEmailRequestDto, @AccessToken() accessToken: string): Promise<ResponseDto<IConfirmChangeEmailResponse>> {
    return await this.authService.confirmChangeEmail(body, accessToken)
  }

  @ApiOperation({ summary: 'Resend confirmation code' })
  @Public()
  @Post(AUTH_PATHS.RESEND_CODE)
  async resendCode(@Body() body: ResendCodeRequestDto): Promise<ResponseDto<IResendCodeResponse>> {
    return await this.authService.resendCodeSignUp(body)
  }

  @ApiOperation({ summary: 'Validate user password' })
  @ApiBearerAuth()
  @ApiHeader({ name: 'x-refresh-token' })
  @ApiHeader({ name: 'x-id-token' })
  @Roles(UserRoles.SuperAdmin, UserRoles.Tenant)
  @Post(AUTH_PATHS.VALIDATE_PASSWORD)
  async validatePassword(@Body() body: ValidatePasswordRequestDto): Promise<ResponseDto<IValidatePasswordResponse>> {
    return await this.authService.validatePassword(body)
  }
}
