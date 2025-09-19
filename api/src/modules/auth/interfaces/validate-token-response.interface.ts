export interface IValidateTokenResponse {
    isValid: boolean;
    error?: {
        name: string;
        message: string;
    };
} 