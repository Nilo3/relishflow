import { HttpStatus } from '@nestjs/common'
import { AuthCodes, AuthMessages } from '@shared/modules/auth/auth.constants'

interface ErrorResponse {
  code: string;
  message: string;
  httpCode: number;
}

export function translateAWSError(error: any): ErrorResponse {
  const errorName = error?.name || 'UnknownError'

  const errorMap: Record<string, ErrorResponse> = {
    // Registration and Confirmation
    UsernameExistsException: {
      code: AuthCodes.USER_ALREADY_EXISTS,
      message: AuthMessages[AuthCodes.USER_ALREADY_EXISTS].en,
      httpCode: HttpStatus.CONFLICT
    },
    InvalidPasswordException: {
      code: AuthCodes.INVALID_PASSWORD,
      message: AuthMessages[AuthCodes.INVALID_PASSWORD].en,
      httpCode: HttpStatus.BAD_REQUEST
    },
    InvalidParameterException: {
      code: AuthCodes.INVALID_PARAMETERS,
      message: AuthMessages[AuthCodes.INVALID_PARAMETERS].en,
      httpCode: HttpStatus.BAD_REQUEST
    },
    CodeMismatchException: {
      code: AuthCodes.INVALID_CODE,
      message: AuthMessages[AuthCodes.INVALID_CODE].en,
      httpCode: HttpStatus.BAD_REQUEST
    },
    ExpiredCodeException: {
      code: AuthCodes.EXPIRED_CODE,
      message: AuthMessages[AuthCodes.EXPIRED_CODE].en,
      httpCode: HttpStatus.BAD_REQUEST
    },
    UserNotFoundException: {
      code: AuthCodes.USER_NOT_FOUND,
      message: AuthMessages[AuthCodes.USER_NOT_FOUND].en,
      httpCode: HttpStatus.NOT_FOUND
    },
    TooManyRequestsException: {
      code: AuthCodes.TOO_MANY_REQUESTS,
      message: AuthMessages[AuthCodes.TOO_MANY_REQUESTS].en,
      httpCode: HttpStatus.TOO_MANY_REQUESTS
    },

    // Login and Authentication
    NotAuthorizedException: {
      code: AuthCodes.INVALID_CREDENTIALS,
      message: AuthMessages[AuthCodes.INVALID_CREDENTIALS].en,
      httpCode: HttpStatus.UNAUTHORIZED
    },
    PasswordResetRequiredException: {
      code: AuthCodes.PASSWORD_RESET_REQUIRED,
      message: AuthMessages[AuthCodes.PASSWORD_RESET_REQUIRED].en,
      httpCode: HttpStatus.FORBIDDEN
    },
    UserNotConfirmedException: {
      code: AuthCodes.USER_NOT_CONFIRMED,
      message: AuthMessages[AuthCodes.USER_NOT_CONFIRMED].en,
      httpCode: HttpStatus.FORBIDDEN
    },
    MFAMethodNotFoundException: {
      code: AuthCodes.MFA_METHOD_NOT_FOUND,
      message: AuthMessages[AuthCodes.MFA_METHOD_NOT_FOUND].en,
      httpCode: HttpStatus.NOT_FOUND
    },
    SoftwareTokenMFANotFoundException: {
      code: AuthCodes.SOFTWARE_TOKEN_MFA_NOT_FOUND,
      message: AuthMessages[AuthCodes.SOFTWARE_TOKEN_MFA_NOT_FOUND].en,
      httpCode: HttpStatus.NOT_FOUND
    },
    SessionExpiredException: {
      code: AuthCodes.SESSION_EXPIRED,
      message: AuthMessages[AuthCodes.SESSION_EXPIRED].en,
      httpCode: HttpStatus.UNAUTHORIZED
    },

    // Password Recovery
    LimitExceededException: {
      code: AuthCodes.LIMIT_EXCEEDED,
      message: AuthMessages[AuthCodes.LIMIT_EXCEEDED].en,
      httpCode: HttpStatus.TOO_MANY_REQUESTS
    },
    InvalidLambdaResponseException: {
      code: AuthCodes.INVALID_LAMBDA_RESPONSE,
      message: AuthMessages[AuthCodes.INVALID_LAMBDA_RESPONSE].en,
      httpCode: HttpStatus.INTERNAL_SERVER_ERROR
    },
    CodeDeliveryFailureException: {
      code: AuthCodes.CODE_DELIVERY_FAILURE,
      message: AuthMessages[AuthCodes.CODE_DELIVERY_FAILURE].en,
      httpCode: HttpStatus.INTERNAL_SERVER_ERROR
    },
    AliasExistsException: {
      code: AuthCodes.ALIAS_EXISTS,
      message: AuthMessages[AuthCodes.ALIAS_EXISTS].en,
      httpCode: HttpStatus.CONFLICT
    },

    // Email/Profile Change
    InvalidUserPoolConfigurationException: {
      code: AuthCodes.INVALID_USER_POOL_CONFIGURATION,
      message: AuthMessages[AuthCodes.INVALID_USER_POOL_CONFIGURATION].en,
      httpCode: HttpStatus.INTERNAL_SERVER_ERROR
    },
    UserLambdaValidationException: {
      code: AuthCodes.USER_LAMBDA_VALIDATION,
      message: AuthMessages[AuthCodes.USER_LAMBDA_VALIDATION].en,
      httpCode: HttpStatus.BAD_REQUEST
    },

    // Refresh Token and Authentication
    RefreshTokenExpiredException: {
      code: AuthCodes.REFRESH_TOKEN_EXPIRED,
      message: AuthMessages[AuthCodes.REFRESH_TOKEN_EXPIRED].en,
      httpCode: HttpStatus.UNAUTHORIZED
    },
    TokenExpiredException: {
      code: AuthCodes.TOKEN_EXPIRED,
      message: AuthMessages[AuthCodes.TOKEN_EXPIRED].en,
      httpCode: HttpStatus.UNAUTHORIZED
    },

    // Session Errors
    InvalidSessionException: {
      code: AuthCodes.INVALID_SESSION,
      message: AuthMessages[AuthCodes.INVALID_SESSION].en,
      httpCode: HttpStatus.UNAUTHORIZED
    },

    // Unknown Errors
    UnknownError: {
      code: AuthCodes.SERVER_ERROR,
      message: AuthMessages[AuthCodes.SERVER_ERROR].en,
      httpCode: HttpStatus.INTERNAL_SERVER_ERROR
    }
  }

  return errorMap[errorName] || {
    code: AuthCodes.SERVER_ERROR,
    message: AuthMessages[AuthCodes.SERVER_ERROR].en,
    httpCode: HttpStatus.INTERNAL_SERVER_ERROR
  }
}
