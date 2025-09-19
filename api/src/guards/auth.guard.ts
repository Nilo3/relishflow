import { Injectable, ExecutionContext, CanActivate, UnauthorizedException, Logger, HttpStatus } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthService } from '../modules/auth/auth.service'
import { UsersService } from '../modules/users/users.service'
import { IS_PUBLIC_KEY } from '../decorators/public.decorator'
import { removeCookie } from '../modules/auth/helpers/cookies.helper'
import { translateAWSError } from '../modules/auth/helpers/translate-errors.helper'
import type { UserRoles } from '@shared/modules/users/enums/roles.enum'
import type { ISignInResponse } from '@shared/modules/auth/interfaces/sign-in-response.interface'
import type { Request } from 'express'
import { AuthCodes, AuthMessages } from '@shared/modules/auth/auth.constants'

interface RequestWithUser extends Request {
    userId?: string
    userEmail?: string
    userRole?: UserRoles
    accessToken?: string
    refreshToken?: string
}

@Injectable()
export class AuthGuard implements CanActivate {
    private readonly logger = new Logger(AuthGuard.name)

    constructor(
        private readonly reflector: Reflector,
        private readonly authService: AuthService,
        private readonly usersService: UsersService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass()
        ])

        if (isPublic) {
            this.logger.debug('Ruta pública detectada, omitiendo validación de token')
            return true
        }

        const request = context.switchToHttp().getRequest<RequestWithUser>()
        const response = context.switchToHttp().getResponse()

        // Extract tokens from httpOnly cookies instead of headers
        const accessToken = request.cookies?.access_token
        const refreshToken = request.cookies?.refresh_token
        const idToken = request.cookies?.id_token

        if (!accessToken) {
            this.logger.warn('Token de acceso ausente en la solicitud.')
            throw new UnauthorizedException({
                success: false,
                code: AuthCodes.ACCESS_TOKEN_REQUIRED,
                message: AuthMessages[AuthCodes.ACCESS_TOKEN_REQUIRED].en,
                httpCode: HttpStatus.UNAUTHORIZED,
                data: null
            })
        }

        if (!idToken) {
            this.logger.warn('Token de identificación ausente en la solicitud.')
            throw new UnauthorizedException({
                success: false,
                code: AuthCodes.ID_TOKEN_REQUIRED,
                message: AuthMessages[AuthCodes.ID_TOKEN_REQUIRED].en,
                httpCode: HttpStatus.UNAUTHORIZED,
                data: null
            })
        }

        const validationResult = await this.authService.validateAccessToken(accessToken)

        if (!validationResult.isValid) {
            if (refreshToken) {
                try {
                    return await this.handleTokenRefresh(request, response, refreshToken, idToken)
                } catch (refreshError) {
                    this.logger.error('Token refresh failed', refreshError)
                    this.clearCookies(response)
                    throw refreshError
                }
            }

            this.clearCookies(response)
            const errorMessage = translateAWSError({ name: validationResult.error?.name })
            throw new UnauthorizedException({
                success: false,
                code: errorMessage.code as AuthCodes,
                message: errorMessage.message,
                httpCode: errorMessage.httpCode,
                data: null
            })
        }

        return this.processTokens(request, accessToken, idToken)
    }

    private async handleTokenRefresh(
        request: RequestWithUser,
        response: any,
        refreshToken: string,
        idToken: string
    ): Promise<boolean> {
        this.logger.debug('Refreshing access token...')

        const decodedIdToken = this.authService.decodeAccessToken(idToken)
        if (!decodedIdToken) {
            this.logger.error('Could not decode ID token during refresh')
            throw new UnauthorizedException({
                success: false,
                code: AuthCodes.INVALID_ID_TOKEN,
                message: AuthMessages[AuthCodes.INVALID_ID_TOKEN].en,
                httpCode: HttpStatus.UNAUTHORIZED,
                data: null
            })
        }

        const subId = decodedIdToken.sub || ''
        if (!subId) {
            this.logger.error('ID token does not contain sub during refresh')
            throw new UnauthorizedException({
                success: false,
                code: AuthCodes.INVALID_ID_TOKEN,
                message: AuthMessages[AuthCodes.INVALID_ID_TOKEN].en,
                httpCode: HttpStatus.UNAUTHORIZED,
                data: null
            })
        }

        const refreshResponse = await this.authService.refreshToken(refreshToken, subId, response)

        if (!refreshResponse.success || !refreshResponse.data) {
            this.logger.error('Refresh token response error', refreshResponse)
            throw new UnauthorizedException({
                success: false,
                code: AuthCodes.REFRESH_TOKEN_EXPIRED,
                message: AuthMessages[AuthCodes.REFRESH_TOKEN_EXPIRED].en,
                httpCode: HttpStatus.UNAUTHORIZED,
                data: null
            })
        }

        const tokens = refreshResponse.data as ISignInResponse
        request.accessToken = tokens.accessToken
        request.refreshToken = tokens.refreshToken
        
        if (!request.cookies) request.cookies = {}
        request.cookies.access_token = tokens.accessToken
        request.cookies.refresh_token = tokens.refreshToken

        const newValidationResult = await this.authService.validateAccessToken(tokens.accessToken)

        if (!newValidationResult.isValid) {
            this.logger.error('New access token is invalid after refresh')
            throw new UnauthorizedException({
                success: false,
                code: AuthCodes.INVALID_ID_TOKEN,
                message: AuthMessages[AuthCodes.INVALID_ID_TOKEN].en,
                httpCode: HttpStatus.UNAUTHORIZED,
                data: null
            })
        }

        this.logger.debug('Access token refreshed and valid')
        return this.processTokens(request, tokens.accessToken, idToken)
    }

    private async processTokens(request: RequestWithUser, accessToken: string, idToken: string): Promise<boolean> {
        const decodedToken = this.authService.decodeAccessToken(idToken)
        if (!decodedToken) {
            this.logger.warn('Token de identificación inválido.')
            throw new UnauthorizedException({
                success: false,
                code: AuthCodes.INVALID_ID_TOKEN,
                message: AuthMessages[AuthCodes.INVALID_ID_TOKEN].en,
                httpCode: HttpStatus.UNAUTHORIZED,
                data: null
            })
        }

        if (!decodedToken.sub) {
            this.logger.warn('Token de identificación no contiene sub (ID de usuario).')
            throw new UnauthorizedException({
                success: false,
                code: AuthCodes.INVALID_ID_TOKEN,
                message: AuthMessages[AuthCodes.INVALID_ID_TOKEN].en,
                httpCode: HttpStatus.UNAUTHORIZED,
                data: null
            })
        }

        const user = await this.usersService.findByIdCognito(decodedToken.sub.toString())

        if (!user) {
            this.logger.warn(`Usuario con ID ${decodedToken.sub} no encontrado en la base de datos.`)
            throw new UnauthorizedException({
                success: false,
                code: AuthCodes.USER_NOT_FOUND,
                message: AuthMessages[AuthCodes.USER_NOT_FOUND].en,
                httpCode: HttpStatus.UNAUTHORIZED,
                data: null
            })
        }

        // Set user role from database instead of Cognito custom field
        request.userRole = user.role
        request.userId = user.id
        request.userEmail = (decodedToken as { email: string }).email
        request.accessToken = accessToken

        return true
    }

    private clearCookies(response: any): void {
        removeCookie(response, 'access_token')
        removeCookie(response, 'refresh_token')
        removeCookie(response, 'id_token')
    }
}