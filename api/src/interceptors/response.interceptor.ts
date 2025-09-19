import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';
import { ResponseDto } from '@shared/helpers/response.helper';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const httpContext = context.switchToHttp();
        const response = httpContext.getResponse<Response>();

        return next.handle().pipe(
            map((data: ResponseDto<any>) => {
                // Set the HTTP status code from the ResponseDto
                if (data?.httpCode) {
                    response.status(data.httpCode);
                }
                return data;
            }),
        );
    }
} 