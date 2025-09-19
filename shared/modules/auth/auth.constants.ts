export enum AuthCodes {
    SIGN_IN_SUCCESS = 'SIGN_IN_SUCCESS',
    SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS',
    SIGN_UP_CONFIRMATION_SUCCESS = 'SIGN_UP_CONFIRMATION_SUCCESS',
    SIGN_OUT_SUCCESS = 'SIGN_OUT_SUCCESS',
    PASSWORD_CHANGE_SUCCESS = 'PASSWORD_CHANGE_SUCCESS',
    EMAIL_CHANGE_SUCCESS = 'EMAIL_CHANGE_SUCCESS',
    EMAIL_CHANGE_CONFIRMATION_SUCCESS = 'EMAIL_CHANGE_CONFIRMATION_SUCCESS',
    FORGOT_PASSWORD_SUCCESS = 'FORGOT_PASSWORD_SUCCESS',
    RESET_PASSWORD_SUCCESS = 'RESET_PASSWORD_SUCCESS',
    RESEND_CODE_SUCCESS = 'RESEND_CODE_SUCCESS',
    PASSWORD_VALIDATION_SUCCESS = 'PASSWORD_VALIDATION_SUCCESS',

    USER_NOT_FOUND = 'USER_NOT_FOUND',
    INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
    INVALID_CODE = 'INVALID_CODE',
    EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
    USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
    USER_NOT_CONFIRMED = 'USER_NOT_CONFIRMED',
    INVALID_PASSWORD = 'INVALID_PASSWORD',
    INVALID_PARAMETERS = 'INVALID_PARAMETERS',
    EXPIRED_CODE = 'EXPIRED_CODE',
    TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
    PASSWORD_RESET_REQUIRED = 'PASSWORD_RESET_REQUIRED',
    MFA_METHOD_NOT_FOUND = 'MFA_METHOD_NOT_FOUND',
    SOFTWARE_TOKEN_MFA_NOT_FOUND = 'SOFTWARE_TOKEN_MFA_NOT_FOUND',
    SESSION_EXPIRED = 'SESSION_EXPIRED',
    LIMIT_EXCEEDED = 'LIMIT_EXCEEDED',
    ALIAS_EXISTS = 'ALIAS_EXISTS',
    USER_LAMBDA_VALIDATION = 'USER_LAMBDA_VALIDATION',
    REFRESH_TOKEN_EXPIRED = 'REFRESH_TOKEN_EXPIRED',
    TOKEN_EXPIRED = 'TOKEN_EXPIRED',
    INVALID_SESSION = 'INVALID_SESSION',

    SERVER_ERROR = 'SERVER_ERROR',
    INVALID_LAMBDA_RESPONSE = 'INVALID_LAMBDA_RESPONSE',
    CODE_DELIVERY_FAILURE = 'CODE_DELIVERY_FAILURE',
    INVALID_USER_POOL_CONFIGURATION = 'INVALID_USER_POOL_CONFIGURATION',

    ERROR_SIGN_IN = 'ERROR_SIGN_IN',
    ERROR_SIGN_UP = 'ERROR_SIGN_UP',
    ERROR_SIGN_UP_CONFIRMATION = 'ERROR_SIGN_UP_CONFIRMATION',
    ERROR_SIGN_OUT = 'ERROR_SIGN_OUT',
    ERROR_PASSWORD_CHANGE = 'ERROR_PASSWORD_CHANGE',
    ERROR_EMAIL_CHANGE = 'ERROR_EMAIL_CHANGE',
    ERROR_EMAIL_CHANGE_CONFIRMATION = 'ERROR_EMAIL_CHANGE_CONFIRMATION',
    ERROR_FORGOT_PASSWORD = 'ERROR_FORGOT_PASSWORD',
    ERROR_RESET_PASSWORD = 'ERROR_RESET_PASSWORD',
    ERROR_RESEND_CODE = 'ERROR_RESEND_CODE',
    ERROR_PASSWORD_VALIDATION = 'ERROR_PASSWORD_VALIDATION',
    ERROR_DELETING_USER = 'ERROR_DELETING_USER',
    USER_DELETED = 'USER_DELETED',

    ACCESS_TOKEN_REQUIRED = 'ACCESS_TOKEN_REQUIRED',
    ID_TOKEN_REQUIRED = 'ID_TOKEN_REQUIRED',
    INVALID_ID_TOKEN = 'INVALID_ID_TOKEN'
}

export const AuthMessages: Record<AuthCodes, Record<string, string>> = {
    [AuthCodes.SIGN_IN_SUCCESS]: {
        en: 'User signed in successfully',
        es: 'Usuario inició sesión exitosamente'
    },
    [AuthCodes.SIGN_UP_SUCCESS]: {
        en: 'User registered successfully',
        es: 'Usuario registrado exitosamente'
    },
    [AuthCodes.SIGN_UP_CONFIRMATION_SUCCESS]: {
        en: 'User confirmation successful',
        es: 'Confirmación de usuario exitosa'
    },
    [AuthCodes.SIGN_OUT_SUCCESS]: {
        en: 'User signed out successfully',
        es: 'Usuario cerró sesión exitosamente'
    },
    [AuthCodes.PASSWORD_CHANGE_SUCCESS]: {
        en: 'Password changed successfully',
        es: 'Contraseña cambiada exitosamente'
    },
    [AuthCodes.EMAIL_CHANGE_SUCCESS]: {
        en: 'Email change requested successfully',
        es: 'Cambio de correo solicitado exitosamente'
    },
    [AuthCodes.EMAIL_CHANGE_CONFIRMATION_SUCCESS]: {
        en: 'Email changed successfully',
        es: 'Correo cambiado exitosamente'
    },
    [AuthCodes.FORGOT_PASSWORD_SUCCESS]: {
        en: 'Password reset code sent',
        es: 'Código de restablecimiento de contraseña enviado'
    },
    [AuthCodes.RESET_PASSWORD_SUCCESS]: {
        en: 'Password reset successfully',
        es: 'Contraseña restablecida exitosamente'
    },
    [AuthCodes.RESEND_CODE_SUCCESS]: {
        en: 'Confirmation code resent successfully',
        es: 'Código de confirmación reenviado exitosamente'
    },
    [AuthCodes.PASSWORD_VALIDATION_SUCCESS]: {
        en: 'Password validated successfully',
        es: 'Contraseña validada exitosamente'
    },
    [AuthCodes.USER_NOT_FOUND]: {
        en: 'User not found',
        es: 'Usuario no encontrado'
    },
    [AuthCodes.INVALID_CREDENTIALS]: {
        en: 'Invalid username or password',
        es: 'Nombre de usuario o contraseña inválidos'
    },
    [AuthCodes.INVALID_CODE]: {
        en: 'Invalid confirmation code',
        es: 'Código de confirmación inválido'
    },
    [AuthCodes.EMAIL_ALREADY_EXISTS]: {
        en: 'Email already exists',
        es: 'El correo ya existe'
    },
    [AuthCodes.USER_ALREADY_EXISTS]: {
        en: 'User already exists',
        es: 'El usuario ya existe'
    },
    [AuthCodes.USER_NOT_CONFIRMED]: {
        en: 'User is not confirmed',
        es: 'El usuario no está confirmado'
    },
    [AuthCodes.INVALID_PASSWORD]: {
        en: 'Invalid password',
        es: 'Contraseña inválida'
    },
    [AuthCodes.INVALID_PARAMETERS]: {
        en: 'Invalid parameters',
        es: 'Parámetros inválidos'
    },
    [AuthCodes.EXPIRED_CODE]: {
        en: 'Confirmation code has expired',
        es: 'El código de confirmación ha expirado'
    },
    [AuthCodes.TOO_MANY_REQUESTS]: {
        en: 'Too many requests',
        es: 'Demasiadas solicitudes'
    },
    [AuthCodes.PASSWORD_RESET_REQUIRED]: {
        en: 'Password reset required',
        es: 'Se requiere restablecer la contraseña'
    },
    [AuthCodes.MFA_METHOD_NOT_FOUND]: {
        en: 'MFA method not found',
        es: 'Método MFA no encontrado'
    },
    [AuthCodes.SOFTWARE_TOKEN_MFA_NOT_FOUND]: {
        en: 'Software token MFA not found',
        es: 'Token MFA de software no encontrado'
    },
    [AuthCodes.SESSION_EXPIRED]: {
        en: 'Session has expired',
        es: 'La sesión ha expirado'
    },
    [AuthCodes.LIMIT_EXCEEDED]: {
        en: 'Limit exceeded',
        es: 'Límite excedido'
    },
    [AuthCodes.ALIAS_EXISTS]: {
        en: 'Alias already exists',
        es: 'El alias ya existe'
    },
    [AuthCodes.USER_LAMBDA_VALIDATION]: {
        en: 'User lambda validation failed',
        es: 'La validación lambda del usuario falló'
    },
    [AuthCodes.REFRESH_TOKEN_EXPIRED]: {
        en: 'Refresh token has expired',
        es: 'El token de actualización ha expirado'
    },
    [AuthCodes.TOKEN_EXPIRED]: {
        en: 'Token has expired',
        es: 'El token ha expirado'
    },
    [AuthCodes.INVALID_SESSION]: {
        en: 'Invalid session',
        es: 'Sesión inválida'
    },
    [AuthCodes.SERVER_ERROR]: {
        en: 'Server error',
        es: 'Error del servidor'
    },
    [AuthCodes.INVALID_LAMBDA_RESPONSE]: {
        en: 'Invalid lambda response',
        es: 'Respuesta lambda inválida'
    },
    [AuthCodes.CODE_DELIVERY_FAILURE]: {
        en: 'Code delivery failure',
        es: 'Error en la entrega del código'
    },
    [AuthCodes.INVALID_USER_POOL_CONFIGURATION]: {
        en: 'Invalid user pool configuration',
        es: 'Configuración inválida del grupo de usuarios'
    },
    [AuthCodes.ERROR_SIGN_IN]: {
        en: 'Error during sign in',
        es: 'Error durante el inicio de sesión'
    },
    [AuthCodes.ERROR_SIGN_UP]: {
        en: 'Error during sign up',
        es: 'Error durante el registro'
    },
    [AuthCodes.ERROR_SIGN_UP_CONFIRMATION]: {
        en: 'Error during sign up confirmation',
        es: 'Error durante la confirmación del registro'
    },
    [AuthCodes.ERROR_SIGN_OUT]: {
        en: 'Error during sign out',
        es: 'Error durante el cierre de sesión'
    },
    [AuthCodes.ERROR_PASSWORD_CHANGE]: {
        en: 'Error changing password',
        es: 'Error al cambiar la contraseña'
    },
    [AuthCodes.ERROR_EMAIL_CHANGE]: {
        en: 'Error requesting email change',
        es: 'Error al solicitar cambio de correo'
    },
    [AuthCodes.ERROR_EMAIL_CHANGE_CONFIRMATION]: {
        en: 'Error confirming email change',
        es: 'Error al confirmar cambio de correo'
    },
    [AuthCodes.ERROR_FORGOT_PASSWORD]: {
        en: 'Error sending password reset code',
        es: 'Error al enviar código de restablecimiento de contraseña'
    },
    [AuthCodes.ERROR_RESET_PASSWORD]: {
        en: 'Error resetting password',
        es: 'Error al restablecer contraseña'
    },
    [AuthCodes.ERROR_RESEND_CODE]: {
        en: 'Error resending confirmation code',
        es: 'Error al reenviar código de confirmación'
    },
    [AuthCodes.ERROR_PASSWORD_VALIDATION]: {
        en: 'Error validating password',
        es: 'Error al validar contraseña'
    },
    [AuthCodes.ERROR_DELETING_USER]: {
        en: 'Error deleting user',
        es: 'Error al eliminar usuario'
    },
    [AuthCodes.USER_DELETED]: {
        en: 'User deleted successfully',
        es: 'Usuario eliminado exitosamente'
    },
    [AuthCodes.ACCESS_TOKEN_REQUIRED]: {
        en: 'Access token is required',
        es: 'El token de acceso es requerido'
    },
    [AuthCodes.ID_TOKEN_REQUIRED]: {
        en: 'ID token is required',
        es: 'El token de identificación es requerido'
    },
    [AuthCodes.INVALID_ID_TOKEN]: {
        en: 'Invalid or expired ID token',
        es: 'El token de identificación es inválido o ha expirado'
    }
}; 