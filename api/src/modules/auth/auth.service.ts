import type {
  AdminUpdateUserAttributesCommandInput,
  ChangePasswordCommandInput,
  ConfirmForgotPasswordCommandInput,
  ConfirmSignUpCommandInput,
  ForgotPasswordCommandInput,
  GetUserCommandInput,
  GlobalSignOutCommandInput,
  InitiateAuthCommandInput,
  ResendConfirmationCodeCommandInput,
  VerifyUserAttributeCommandInput
} from '@aws-sdk/client-cognito-identity-provider'
import type { Response } from 'express'

import { createHmac } from 'node:crypto'

import {
  CognitoIdentityProviderClient,
  ResendConfirmationCodeCommand,
  VerifyUserAttributeCommand,
  AdminUpdateUserAttributesCommand,
  ChangePasswordCommand,
  ConfirmForgotPasswordCommand,
  ConfirmSignUpCommand,
  ForgotPasswordCommand,
  GetUserCommand,
  GlobalSignOutCommand,
  InitiateAuthCommand
} from '@aws-sdk/client-cognito-identity-provider'
import { HttpStatus, Injectable, Logger } from '@nestjs/common'
import { decode } from 'jsonwebtoken'
import { ResponseDto } from '@shared/helpers/response.helper'
// Import interfaces
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
// Import constants
import { AuthCodes, AuthMessages } from '@shared/modules/auth/auth.constants'
import { UserRoles } from '@shared/modules/users/enums/roles.enum'
import { UserCodes } from '@shared/modules/users/users.constants'

import { CognitoService } from '../cognito/cognito.service'
import { UsersService } from '../users/users.service'
import { CreateUserRequestDto } from '../users/dtos/create-user.dto'
import AuthConfig from '../../configs/cognito.config'

import { removeCookie, setCookie } from './helpers/cookies.helper'
import { translateAWSError } from './helpers/translate-errors.helper'
import { SignInRequestDto } from './dtos/sign-in-request.dto'
import { SignUpRequestDto } from './dtos/sign-up-request.dto'
import { ConfirmSignUpRequestDto } from './dtos/confirm-sign-up.dto'
import { ForgotPasswordRequestDto } from './dtos/forgot-password.dto'
import { ResetPasswordRequestDto } from './dtos/reset-password.dto'
import { ChangePasswordRequestDto } from './dtos/change-password.dto'
import { ChangeEmailRequestDto } from './dtos/change-email.dto'
import { ConfirmChangeEmailRequestDto } from './dtos/confirm-change-email.dto'
import { ResendCodeRequestDto } from './dtos/resend-code-sign-up.dto'
import { ValidatePasswordRequestDto } from './dtos/validate-password.dto'
import { IRefreshTokenResponse } from './interfaces/refresh-token-response.interface'
import { IValidateTokenResponse } from './interfaces/validate-token-response.interface'

@Injectable()
export class AuthService {
  private readonly auth: CognitoIdentityProviderClient
  private readonly logger = new Logger(AuthService.name)

  constructor(
    private readonly usersService: UsersService,
    private readonly cognitoService: CognitoService
  ) {
    this.auth = AuthConfig
  }

  async signUp(credentials: SignUpRequestDto): Promise<ResponseDto<ISignUpResponse>> {
    try {
      // First, check if user already exists in our database by email
      const existingUserByEmail = await this.usersService.findByEmail(credentials.email)

      if (existingUserByEmail) {
        this.logger.warn(`User with email ${credentials.email} already exists in database`)

        return {
          success: false,
          code: AuthCodes.USER_ALREADY_EXISTS,
          message: AuthMessages[AuthCodes.USER_ALREADY_EXISTS].en,
          httpCode: HttpStatus.CONFLICT,
          data: null
        }
      }

      // Crear usuario en Cognito primero
      const cognitoResult = await this.cognitoService.createUser({
        email: credentials.email,
        password: credentials.password,
        firstNames: credentials.firstNames,
        lastNames: credentials.lastNames
      })

      if (!cognitoResult.success) {
        this.logger.error(`Error creating user in Cognito: ${cognitoResult.message}`)

        return {
          success: false,
          code: UserCodes.ERROR_CREATING_USER,
          message: cognitoResult.message || 'Error creating user in Cognito',
          httpCode: HttpStatus.BAD_REQUEST,
          data: null
        }
      }

      // Create user in database
      const createUserDto: CreateUserRequestDto = {
        email: credentials.email,
        name: credentials.firstNames,
        lastName: credentials.lastNames,
        documentTypeId: credentials.documentTypeId,
        cityId: credentials.cityId,
        phone: credentials.phone,
        role: UserRoles.Tenant, // Default role
        password: credentials.password,
        cognitoId: cognitoResult.data?.cognitoId ?? '',
        documentNumber: credentials.documentNumber
      }

      const createUserResponse = await this.usersService.create(createUserDto)

      if (!createUserResponse.success) {
        this.logger.error('Error creating user in database', createUserResponse)

        // Rollback in Cognito to avoid orphaned accounts
        try {
          await this.cognitoService.deleteUser(credentials.email)
        } catch (rollbackError) {
          this.logger.error('Failed to rollback Cognito user after DB failure', rollbackError as unknown)
        }

        return {
          success: false,
          code: AuthCodes.ERROR_SIGN_UP,
          message: AuthMessages[AuthCodes.ERROR_SIGN_UP].en,
          httpCode: HttpStatus.INTERNAL_SERVER_ERROR,
          data: null
        }
      }

      // Return the standardized response
      return {
        success: true,
        code: AuthCodes.SIGN_UP_SUCCESS,
        message: AuthMessages[AuthCodes.SIGN_UP_SUCCESS].en,
        httpCode: HttpStatus.CREATED,
        data: {
          id: cognitoResult.data?.cognitoId ?? '',
          email: credentials.email,
          firstNames: credentials.firstNames,
          lastNames: credentials.lastNames
        }
      }
    } catch (error) {
      this.logger.error('Error signing up user', error)

      // Attempt rollback in Cognito to avoid orphaned accounts
      try {
        await this.cognitoService.deleteUser(credentials.email)
      } catch (rollbackError) {
        this.logger.error('Failed to rollback Cognito user after unexpected error', rollbackError as unknown)
      }

      // Handle specific Cognito errors for better UX
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.name === 'UsernameExistsException') {
        return {
          success: false,
          code: AuthCodes.USER_ALREADY_EXISTS,
          message: AuthMessages[AuthCodes.USER_ALREADY_EXISTS].en,
          httpCode: HttpStatus.CONFLICT,
          data: null
        }
      }

      const translatedError = translateAWSError(error)

      return {
        success: false,
        code: translatedError.code,
        message: translatedError.message,
        httpCode: translatedError.httpCode,
        data: null
      }
    }
  }

  async signIn(credentials: SignInRequestDto, response: Response): Promise<ResponseDto<ISignInResponse>> {
    try {
      const secretHash = createHmac('sha256', process.env.USER_POOL_WEB_CLIENT_SECRET!)
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        .update(credentials.email + process.env.USER_POOL_WEB_CLIENT_ID)
        .digest('base64')

      const params: InitiateAuthCommandInput = {
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: process.env.USER_POOL_WEB_CLIENT_ID!,
        AuthParameters: {
          USERNAME: credentials.email,
          PASSWORD: credentials.password,
          SECRET_HASH: secretHash
        }
      }

      try {
        const command = new InitiateAuthCommand(params)
        const result = await this.auth.send(command)

        if (result.AuthenticationResult?.AccessToken) {
          const accessToken = result.AuthenticationResult.AccessToken
          const refreshToken = result.AuthenticationResult.RefreshToken
          const idToken = result.AuthenticationResult.IdToken

          // Set cookies
          if (accessToken) {
            setCookie(response, 'access_token', accessToken, 3600 * 1000)
          }

          if (refreshToken) {
            setCookie(response, 'refresh_token', refreshToken, 3600 * 24 * 30 * 1000)
          }

          if (idToken) {
            setCookie(response, 'id_token', idToken, 3600 * 1000)
          }

          // Get user information from decoded token
          const decodedToken: any = idToken ? decode(idToken) : {}

          // Find user in database or use token information
          const user = {
            id: decodedToken.sub || '',
            email: decodedToken.email || credentials.email,
            name: decodedToken.name || '',
            role: decodedToken['custom:role'] || ''
          }

          return {
            success: true,
            code: AuthCodes.SIGN_IN_SUCCESS,
            message: AuthMessages[AuthCodes.SIGN_IN_SUCCESS].en,
            httpCode: HttpStatus.OK,
            data: {
              accessToken: accessToken || '',
              refreshToken: refreshToken ?? '',
              idToken: idToken ?? '',
              user
            }
          }
        }

        throw new Error('No authentication result returned')
      } catch (error) {
        if (error.name === 'UserNotFoundException') {
          return {
            success: false,
            code: AuthCodes.USER_NOT_FOUND,
            message: AuthMessages[AuthCodes.USER_NOT_FOUND].en,
            httpCode: HttpStatus.NOT_FOUND,
            data: null
          }
        }

        if (error.name === 'NotAuthorizedException') {
          return {
            success: false,
            code: AuthCodes.INVALID_CREDENTIALS,
            message: AuthMessages[AuthCodes.INVALID_CREDENTIALS].en,
            httpCode: HttpStatus.UNAUTHORIZED,
            data: null
          }
        }

        if (error.name === 'UserNotConfirmedException') {
          return {
            success: false,
            code: AuthCodes.USER_NOT_CONFIRMED,
            message: AuthMessages[AuthCodes.USER_NOT_CONFIRMED].en,
            httpCode: HttpStatus.FORBIDDEN,
            data: null
          }
        }

        throw error
      }
    } catch (error) {
      this.logger.error('Error signing in user', error)

      return {
        success: false,
        code: AuthCodes.ERROR_SIGN_IN,
        message: AuthMessages[AuthCodes.ERROR_SIGN_IN].en,
        httpCode: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null
      }
    }
  }

  async confirmSignUp(body: ConfirmSignUpRequestDto): Promise<ResponseDto<IConfirmSignUpResponse>> {
    const secretHash = createHmac('sha256', process.env.USER_POOL_WEB_CLIENT_SECRET!)
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      .update(body.email + process.env.USER_POOL_WEB_CLIENT_ID)
      .digest('base64')

    const params: ConfirmSignUpCommandInput = {
      ClientId: process.env.USER_POOL_WEB_CLIENT_ID,
      Username: body.email,
      ConfirmationCode: body.code,
      SecretHash: secretHash
    }

    this.logger.debug(`Confirmando el usuario ${body.email}...`)

    try {
      const command = new ConfirmSignUpCommand(params)

      this.logger.debug(`Usuario ${body.email} confirmado`)

      await this.auth.send(command)

      return {
        success: true,
        code: AuthCodes.SIGN_UP_CONFIRMATION_SUCCESS,
        message: AuthMessages[AuthCodes.SIGN_UP_CONFIRMATION_SUCCESS].en,
        httpCode: HttpStatus.OK,
        data: null
      }
    } catch (error: unknown) {
      this.logger.error(`Ocurrió un error al confirmar el usuario ${body.email}`, (error as { stack?: string }).stack)

      const errorMessage = translateAWSError(error)

      return {
        success: false,
        code: errorMessage.code || AuthCodes.SERVER_ERROR,
        message: errorMessage.message || AuthMessages[AuthCodes.SERVER_ERROR].en,
        httpCode: errorMessage.httpCode || HttpStatus.INTERNAL_SERVER_ERROR,
        data: null
      }
    }
  }

  async resendCodeSignUp(body: ResendCodeRequestDto): Promise<ResponseDto<IResendCodeResponse>> {
    const secretHash = createHmac('sha256', process.env.USER_POOL_WEB_CLIENT_SECRET!)
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      .update(body.email + process.env.USER_POOL_WEB_CLIENT_ID)
      .digest('base64')

    const params: ResendConfirmationCodeCommandInput = {
      ClientId: process.env.USER_POOL_WEB_CLIENT_ID,
      Username: body.email,
      SecretHash: secretHash
    }

    this.logger.debug(`Reenviando el correo electronico al usuario ${body.email}...`)

    try {
      const command = new ResendConfirmationCodeCommand(params)

      await this.auth.send(command)

      this.logger.debug(`Se envió un correo al usuario ${body.email}`)

      return {
        success: true,
        code: AuthCodes.RESEND_CODE_SUCCESS,
        message: AuthMessages[AuthCodes.RESEND_CODE_SUCCESS].en,
        httpCode: HttpStatus.OK,
        data: null
      }
    } catch (error: unknown) {
      this.logger.error(`Ocurrió un error al reenviar el correo al usuario ${body.email}`, (error as { stack?: string }).stack)

      const errorMessage = translateAWSError(error)

      return {
        success: false,
        code: errorMessage.code || AuthCodes.SERVER_ERROR,
        message: errorMessage.message || AuthMessages[AuthCodes.SERVER_ERROR].en,
        httpCode: errorMessage.httpCode || HttpStatus.INTERNAL_SERVER_ERROR,
        data: null
      }
    }
  }

  async forgotPassword(body: ForgotPasswordRequestDto): Promise<ResponseDto<IForgotPasswordResponse>> {
    const secretHash = createHmac('sha256', process.env.USER_POOL_WEB_CLIENT_SECRET!)
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      .update(body.email + process.env.USER_POOL_WEB_CLIENT_ID)
      .digest('base64')

    const params: ForgotPasswordCommandInput = {
      ClientId: process.env.USER_POOL_WEB_CLIENT_ID,
      Username: body.email,
      SecretHash: secretHash
    }

    this.logger.debug(`Olvidando la contraseña del usuario ${body.email}...`)

    try {
      const command = new ForgotPasswordCommand(params)
      const result = await this.auth.send(command)

      if (!result.CodeDeliveryDetails) {
        return {
          success: false,
          code: AuthCodes.USER_NOT_FOUND,
          message: AuthMessages[AuthCodes.USER_NOT_FOUND].en,
          httpCode: HttpStatus.NOT_FOUND,
          data: null
        }
      }

      this.logger.debug(`Se envió un correo al usuario ${body.email}`)

      return {
        success: true,
        code: AuthCodes.FORGOT_PASSWORD_SUCCESS,
        message: AuthMessages[AuthCodes.FORGOT_PASSWORD_SUCCESS].en,
        httpCode: HttpStatus.OK,
        data: null
      }
    } catch (error: unknown) {
      this.logger.error(`Ocurrió un error al olvidar la contraseña del usuario ${body.email}`, (error as { stack?: string }).stack)

      const errorMessage = translateAWSError(error)

      return {
        success: false,
        code: errorMessage.code || AuthCodes.SERVER_ERROR,
        message: errorMessage.message || AuthMessages[AuthCodes.SERVER_ERROR].en,
        httpCode: errorMessage.httpCode || HttpStatus.INTERNAL_SERVER_ERROR,
        data: null
      }
    }
  }

  async resetPassword(body: ResetPasswordRequestDto): Promise<ResponseDto<IResetPasswordResponse>> {
    const secretHash = createHmac('sha256', process.env.USER_POOL_WEB_CLIENT_SECRET!)
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      .update(body.email + process.env.USER_POOL_WEB_CLIENT_ID)
      .digest('base64')

    const params: ConfirmForgotPasswordCommandInput = {
      ClientId: process.env.USER_POOL_WEB_CLIENT_ID,
      Username: body.email,
      ConfirmationCode: body.code,
      Password: body.newPassword,
      SecretHash: secretHash
    }

    this.logger.debug(`Restableciendo la contraseña del usuario ${body.email}...`)

    try {
      const command = new ConfirmForgotPasswordCommand(params)

      await this.auth.send(command)

      this.logger.debug(`Se restablecio la contraseña del usuario ${body.email}`)

      return {
        success: true,
        code: AuthCodes.RESET_PASSWORD_SUCCESS,
        message: AuthMessages[AuthCodes.RESET_PASSWORD_SUCCESS].en,
        httpCode: HttpStatus.OK,
        data: null
      }
    } catch (error: unknown) {
      this.logger.error(`Ocurrió un error al restablecer la contraseña del usuario ${body.email}`, (error as { stack?: string }).stack)

      const errorMessage = translateAWSError(error)

      return {
        success: false,
        code: errorMessage.code || AuthCodes.SERVER_ERROR,
        message: errorMessage.message || AuthMessages[AuthCodes.SERVER_ERROR].en,
        httpCode: errorMessage.httpCode || HttpStatus.INTERNAL_SERVER_ERROR,
        data: null
      }
    }
  }

  async signOut(accesToken: string | undefined, response: Response): Promise<ResponseDto<ISignOutResponse>> {
    if (!accesToken) {
      return {
        success: false,
        code: AuthCodes.INVALID_SESSION,
        message: AuthMessages[AuthCodes.INVALID_SESSION].en,
        httpCode: HttpStatus.NOT_FOUND,
        data: null
      }
    }

    const params: GlobalSignOutCommandInput = {
      AccessToken: accesToken
    }

    this.logger.debug(`Cerrando sesión...`)

    try {
      const command = new GlobalSignOutCommand(params)

      await this.auth.send(command)

      removeCookie(response, 'access_token')
      removeCookie(response, 'refresh_token')
      removeCookie(response, 'id_token')
      removeCookie(response, 'my_user')

      this.logger.debug(`Sesión cerrada`)

      return {
        success: true,
        code: AuthCodes.SIGN_OUT_SUCCESS,
        message: AuthMessages[AuthCodes.SIGN_OUT_SUCCESS].en,
        httpCode: HttpStatus.OK,
        data: null
      }
    } catch (error: unknown) {
      this.logger.error(`Ocurrió un error al cerrar la sesión`, (error as { stack?: string }).stack)

      const errorMessage = translateAWSError(error)

      return {
        success: false,
        code: errorMessage.code || AuthCodes.SERVER_ERROR,
        message: errorMessage.message || AuthMessages[AuthCodes.SERVER_ERROR].en,
        httpCode: errorMessage.httpCode || HttpStatus.INTERNAL_SERVER_ERROR,
        data: null
      }
    }
  }

  async refreshToken(refreshToken: string, subId: string, response: Response): Promise<ResponseDto<IRefreshTokenResponse>> {
    const clientSecret = process.env.USER_POOL_WEB_CLIENT_SECRET!
    const clientId = process.env.USER_POOL_WEB_CLIENT_ID!

    // For refresh token flow, we need to generate the secret hash using the subId + client ID
    const secretHash = createHmac('sha256', clientSecret)
      .update(subId + clientId)
      .digest('base64')

    const params: InitiateAuthCommandInput = {
      ClientId: clientId,
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
        SECRET_HASH: secretHash,
        USERNAME: subId
      }
    }

    this.logger.debug(`Refrescando token...`)

    try {
      const command = new InitiateAuthCommand(params)
      const result = await this.auth.send(command)

      const { AuthenticationResult } = result

      if (!AuthenticationResult) {
        return {
          success: false,
          code: AuthCodes.INVALID_CREDENTIALS,
          message: AuthMessages[AuthCodes.INVALID_CREDENTIALS].en,
          httpCode: HttpStatus.UNAUTHORIZED,
          data: null
        }
      }

      // Establecer cookies
      if (AuthenticationResult.AccessToken) {
        setCookie(response, 'access_token', AuthenticationResult.AccessToken, 1000 * 60 * 60 * 24)
      }
      if (AuthenticationResult.RefreshToken) {
        setCookie(response, 'refresh_token', AuthenticationResult.RefreshToken, 1000 * 60 * 60 * 24 * 30)
      }

      this.logger.debug(`Token refrescado`)

      // Retornar los tokens en la propiedad data
      return {
        success: true,
        code: AuthCodes.SIGN_IN_SUCCESS,
        message: AuthMessages[AuthCodes.SIGN_IN_SUCCESS].en,
        httpCode: HttpStatus.OK,
        data: {
          accessToken: AuthenticationResult.AccessToken ?? '',
          refreshToken: AuthenticationResult.RefreshToken ?? '',
          idToken: AuthenticationResult.IdToken ?? ''
        }
      }
    } catch (error: unknown) {
      this.logger.error(`Ocurrió un error al refrescar el token`, (error as { stack?: string }).stack)

      const errorMessage = translateAWSError(error)

      return {
        success: false,
        code: errorMessage.code || AuthCodes.SERVER_ERROR,
        message: errorMessage.message || AuthMessages[AuthCodes.SERVER_ERROR].en,
        httpCode: errorMessage.httpCode || HttpStatus.INTERNAL_SERVER_ERROR,
        data: null
      }
    }
  }

  async changePassword(body: ChangePasswordRequestDto, accessToken: string): Promise<ResponseDto<IChangePasswordResponse>> {
    const params: ChangePasswordCommandInput = {
      AccessToken: accessToken,
      PreviousPassword: body.oldPassword,
      ProposedPassword: body.newPassword
    }

    this.logger.debug(`Cambiando la contraseña del usuario...`)

    try {
      const command = new ChangePasswordCommand(params)

      await this.auth.send(command)
      this.logger.debug(`Se cambio la contraseña del usuario`)

      return {
        success: true,
        code: AuthCodes.PASSWORD_CHANGE_SUCCESS,
        message: AuthMessages[AuthCodes.PASSWORD_CHANGE_SUCCESS].en,
        httpCode: HttpStatus.OK,
        data: null
      }
    } catch (error: unknown) {
      this.logger.error(`Ocurrió un error al cambiar la contraseña del usuario`, (error as { stack?: string }).stack)

      const errorMessage = translateAWSError(error)

      return {
        success: false,
        code: errorMessage.code || AuthCodes.SERVER_ERROR,
        message: errorMessage.message || AuthMessages[AuthCodes.SERVER_ERROR].en,
        httpCode: errorMessage.httpCode || HttpStatus.INTERNAL_SERVER_ERROR,
        data: null
      }
    }
  }

  async changeEmail(body: ChangeEmailRequestDto, userId?: string): Promise<ResponseDto<IChangeEmailResponse>> {
    // If a userId is provided, verify the user exists before changing the email
    if (userId) {
      const userResult = await this.usersService.find(userId)

      if (!userResult.success) {
        return {
          success: false,
          code: userResult.code,
          message: userResult.message,
          httpCode: userResult.httpCode,
          data: null
        }
      }
    }

    const params: AdminUpdateUserAttributesCommandInput = {
      UserPoolId: process.env.USER_POOL_ID,
      Username: body.email,
      UserAttributes: [
        {
          Name: 'email',
          Value: body.email
        },
        {
          Name: 'email_verified',
          Value: 'false'
        }
      ]
    }

    this.logger.debug(`Cambiando el correo electronico del usuario ${body.email}...`)

    try {
      const command = new AdminUpdateUserAttributesCommand(params)

      await this.auth.send(command)

      this.logger.debug(`Se cambio el correo electronico del usuario`)

      return {
        success: true,
        code: AuthCodes.EMAIL_CHANGE_SUCCESS,
        message: AuthMessages[AuthCodes.EMAIL_CHANGE_SUCCESS].en,
        httpCode: HttpStatus.OK,
        data: null
      }
    } catch (error: unknown) {
      this.logger.error(`Ocurrió un error al cambiar el correo electronico del usuario`, (error as { stack?: string }).stack)

      const errorMessage = translateAWSError(error)

      return {
        success: false,
        code: errorMessage.code || AuthCodes.SERVER_ERROR,
        message: errorMessage.message || AuthMessages[AuthCodes.SERVER_ERROR].en,
        httpCode: errorMessage.httpCode || HttpStatus.INTERNAL_SERVER_ERROR,
        data: null
      }
    }
  }

  async confirmChangeEmail(body: ConfirmChangeEmailRequestDto, accessToken: string): Promise<ResponseDto<IConfirmChangeEmailResponse>> {
    const params: VerifyUserAttributeCommandInput = {
      AccessToken: accessToken,
      Code: body.code,
      AttributeName: 'email'
    }

    this.logger.debug(`Confirmando el correo electronico del usuario ${body.email}...`)

    try {
      const command = new VerifyUserAttributeCommand(params)

      await this.auth.send(command)

      // Get the user ID from the access token
      const decodedToken = decode(accessToken) as { sub: string }
      const userId = decodedToken.sub

      if (!userId) {
        return {
          success: false,
          code: AuthCodes.INVALID_SESSION,
          message: AuthMessages[AuthCodes.INVALID_SESSION].en,
          httpCode: HttpStatus.UNAUTHORIZED,
          data: null
        }
      }

      // Update the user's email in the database
      await this.usersService.update({ id: userId, email: body.email })

      this.logger.debug(`Se confirmo el correo electronico del usuario ${body.email}`)

      return {
        success: true,
        code: AuthCodes.EMAIL_CHANGE_CONFIRMATION_SUCCESS,
        message: AuthMessages[AuthCodes.EMAIL_CHANGE_CONFIRMATION_SUCCESS].en,
        httpCode: HttpStatus.OK,
        data: null
      }
    } catch (error: unknown) {
      this.logger.error(`Ocurrió un error al confirmar el correo electronico del usuario ${body.email}`, (error as { stack?: string }).stack)

      const errorMessage = translateAWSError(error)

      return {
        success: false,
        code: errorMessage.code || AuthCodes.SERVER_ERROR,
        message: errorMessage.message || AuthMessages[AuthCodes.SERVER_ERROR].en,
        httpCode: errorMessage.httpCode || HttpStatus.INTERNAL_SERVER_ERROR,
        data: null
      }
    }
  }

  async validateAccessToken(accessToken: string): Promise<IValidateTokenResponse> {
    this.logger.debug('Validando token de acceso con Cognito...')

    const params: GetUserCommandInput = {
      AccessToken: accessToken
    }

    const command = new GetUserCommand(params)

    try {
      await this.auth.send(command)
      this.logger.debug('Token de acceso válido.')

      return { isValid: true }
    } catch (error) {
      this.logger.error('Error al validar el token de acceso con Cognito.', error)

      return {
        isValid: false,
        error: {
          name: error.name || 'UnknownError',
          message: error.message || 'Unknown error occurred'
        }
      }
    }
  }

  async validatePassword(body: ValidatePasswordRequestDto): Promise<ResponseDto<IValidatePasswordResponse>> {
    const clientSecret = process.env.USER_POOL_WEB_CLIENT_SECRET!
    const clientId = process.env.USER_POOL_WEB_CLIENT_ID!

    const secretHash = createHmac('sha256', clientSecret)
      .update(body.email + clientId)
      .digest('base64')

    const params: InitiateAuthCommandInput = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: clientId,
      AuthParameters: {
        USERNAME: body.email,
        PASSWORD: body.password,
        SECRET_HASH: secretHash
      }
    }

    this.logger.log('Validando la contraseña del usuario con Cognito...')

    const command = new InitiateAuthCommand(params)

    try {
      await this.auth.send(command)

      this.logger.log('La contraseña del usuario es válida.')

      return {
        success: true,
        code: AuthCodes.PASSWORD_VALIDATION_SUCCESS,
        message: AuthMessages[AuthCodes.PASSWORD_VALIDATION_SUCCESS].en,
        httpCode: HttpStatus.OK,
        data: null
      }
    } catch (error) {
      this.logger.error('Error al validar la contraseña del usuario con Cognito.', error)

      const errorMessage = translateAWSError(error)

      return {
        success: false,
        code: errorMessage.code || AuthCodes.SERVER_ERROR,
        message: errorMessage.message || AuthMessages[AuthCodes.SERVER_ERROR].en,
        httpCode: errorMessage.httpCode || HttpStatus.INTERNAL_SERVER_ERROR,
        data: null
      }
    }
  }

  decodeAccessToken(token: string): Record<string, any> | null {
    this.logger.debug('Decodificando token de acceso...')

    try {
      return decode(token) as Record<string, any>
    } catch (error) {
      this.logger.error('Error al decodificar el token de acceso.', error)

      return null
    }
  }
}
