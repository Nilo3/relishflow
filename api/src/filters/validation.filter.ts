import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ValidationCodes, ValidationMessages } from '@shared/constants/validation.constants';
import { ResponseDto } from '@shared/helpers/response.helper';

@Catch(BadRequestException)
export class ValidationFilter implements ExceptionFilter {
    catch(exception: BadRequestException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const exceptionResponse = exception.getResponse() as any;

        // Check if this is a validation error response
        if (Array.isArray(exceptionResponse.message)) {
            const standardResponse: ResponseDto<string[]> = {
                success: false,
                code: ValidationCodes.VALIDATION_ERROR,
                message: ValidationMessages[ValidationCodes.VALIDATION_ERROR].en,
                httpCode: HttpStatus.BAD_REQUEST,
                data: exceptionResponse.message
            };

            response.status(HttpStatus.BAD_REQUEST).json(standardResponse);
            return;
        }

        // If it's not a validation error, return a generic bad request error
        response.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            code: ValidationCodes.BAD_REQUEST,
            message: ValidationMessages[ValidationCodes.BAD_REQUEST].en,
            httpCode: HttpStatus.BAD_REQUEST,
            data: null
        });
    }
} 