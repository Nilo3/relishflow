import { Injectable, Logger, HttpStatus } from '@nestjs/common'
import { createHmac } from 'crypto'
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  SignUpCommandInput
} from '@aws-sdk/client-cognito-identity-provider'
import AuthConfig from '../../configs/cognito.config'
import { ResponseDto } from '@shared/helpers/response.helper'
import { AuthCodes, AuthMessages } from '@shared/modules/auth/auth.constants'

@Injectable()
export class CognitoService {
  private readonly auth: CognitoIdentityProviderClient
  private readonly logger = new Logger(CognitoService.name)

  constructor() {
    this.auth = AuthConfig
  }

  /**
   * Crea un usuario en Cognito
   */
  async createUser(userData: {
    email: string
    password: string
    firstNames: string
    lastNames: string
  }): Promise<ResponseDto<{ cognitoId: string }>> {
    try {
      this.logger.debug(`Creando usuario en Cognito: ${userData.email}`)

      const secretHash = createHmac('sha256', process.env.USER_POOL_WEB_CLIENT_SECRET as string)
        .update(userData.email + process.env.USER_POOL_WEB_CLIENT_ID)
        .digest('base64')

      const params: SignUpCommandInput = {
        ClientId: process.env.USER_POOL_WEB_CLIENT_ID as string,
        Username: userData.email,
        Password: userData.password,
        SecretHash: secretHash,
        UserAttributes: [
          {
            Name: 'email',
            Value: userData.email
          },
          {
            Name: 'given_name',
            Value: userData.firstNames
          },
          {
            Name: 'family_name',
            Value: userData.lastNames
          }
        ]
      }

      const response = await this.auth.send(new SignUpCommand(params))

      this.logger.debug(`Usuario creado exitosamente en Cognito: ${userData.email}`)

      return {
        success: true,
        code: AuthCodes.SIGN_UP_SUCCESS,
        message: AuthMessages[AuthCodes.SIGN_UP_SUCCESS].es,
        httpCode: HttpStatus.CREATED,
        data: {
          cognitoId: response.UserSub || ''
        }
      }
    } catch (error) {
      this.logger.error(`Error creando usuario en Cognito: ${userData.email}`, error)

      let authCode: AuthCodes
      let httpCode: HttpStatus

      if (error.name === 'UsernameExistsException') {
        authCode = AuthCodes.USER_ALREADY_EXISTS
        httpCode = HttpStatus.CONFLICT
      } else if (error.name === 'InvalidPasswordException') {
        authCode = AuthCodes.INVALID_PASSWORD
        httpCode = HttpStatus.BAD_REQUEST
      } else if (error.name === 'InvalidParameterException') {
        authCode = AuthCodes.INVALID_PARAMETERS
        httpCode = HttpStatus.BAD_REQUEST
      } else {
        authCode = AuthCodes.ERROR_SIGN_UP
        httpCode = HttpStatus.INTERNAL_SERVER_ERROR
      }

      return {
        success: false,
        code: authCode,
        message: AuthMessages[authCode].es,
        httpCode: httpCode,
        data: null
      }
    }
  }

  /**
   * Elimina un usuario de Cognito
   */
  async deleteUser(email: string): Promise<ResponseDto<null>> {
    try {
      this.logger.debug(`Eliminando usuario de Cognito: ${email}`)

      const { AdminDeleteUserCommand } = await import('@aws-sdk/client-cognito-identity-provider')

      const params = {
        UserPoolId: process.env.USER_POOL_ID,
        Username: email
      }

      await this.auth.send(new AdminDeleteUserCommand(params))

      this.logger.debug(`Usuario eliminado exitosamente de Cognito: ${email}`)

      return {
        success: true,
        code: AuthCodes.USER_DELETED,
        message: AuthMessages[AuthCodes.USER_DELETED].es,
        httpCode: HttpStatus.OK,
        data: null
      }
    } catch (error) {
      this.logger.error(`Error eliminando usuario de Cognito: ${email}`, error)

      let authCode: AuthCodes
      let httpCode: HttpStatus

      if (error.name === 'UserNotFoundException') {
        authCode = AuthCodes.USER_NOT_FOUND
        httpCode = HttpStatus.NOT_FOUND
      } else if (error.name === 'InvalidParameterException') {
        authCode = AuthCodes.INVALID_PARAMETERS
        httpCode = HttpStatus.BAD_REQUEST
      } else {
        authCode = AuthCodes.ERROR_DELETING_USER
        httpCode = HttpStatus.INTERNAL_SERVER_ERROR
      }

      return {
        success: false,
        code: authCode,
        message: AuthMessages[authCode].es,
        httpCode: httpCode,
        data: null
      }
    }
  }

}