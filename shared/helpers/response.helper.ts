export interface ResponseDto<T> {
    success: boolean;
    code: string;
    message: string;
    httpCode: number;
    data: T | null;
} 