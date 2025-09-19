export enum ValidationCodes {
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    BAD_REQUEST = 'BAD_REQUEST'
}

export const ValidationMessages: Record<ValidationCodes, { en: string; es: string }> = {
    [ValidationCodes.VALIDATION_ERROR]: {
        en: 'Validation error',
        es: 'Error de validación'
    },
    [ValidationCodes.BAD_REQUEST]: {
        en: 'Bad request',
        es: 'Solicitud incorrecta'
    }
} 