import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message: string | object = 'Internal server error';

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            message = exception.getResponse();
        } else if (exception instanceof Error) {
            // Handle yahoo-finance2 specific errors or other common errors
            if (exception.message.includes('data not available')) {
                status = HttpStatus.BAD_REQUEST;
                message = 'Data not available for the requested range. Intraday data is limited to the last 730 days.';
            } else if (exception.message.includes('Invalid enum value')) {
                status = HttpStatus.BAD_REQUEST;
                message = exception.message;
            } else {
                // Retain original message for debugging, but maybe sanitize for prod (omitted for now)
                message = exception.message;
            }
        }

        response
            .status(status)
            .json({
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url,
                message: message,
            });
    }
}
