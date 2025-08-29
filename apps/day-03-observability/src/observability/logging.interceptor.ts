import {
  CallHandler,
  ExecutionContext,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const method = request.method;
    const url = request.url;
    const correlationId = request['X-Correlation-Id'] || 'N/A';
    const now = Date.now();

    this.logger.log(
      `Request: ${method} ${url} [Correlation-ID: ${correlationId}]`,
    );

    return next.handle().pipe(
      tap({
        next: () => {
          const response = httpContext.getResponse();
          const statusCode = response.statusCode;
          const duration = Date.now() - now;
          this.logger.log(
            `Response: ${method} ${url} [Status: ${statusCode}, Duration: ${duration}ms, Correlation-ID: ${correlationId}]`,
          );
        },
        error: (error) => {
          const response = httpContext.getResponse();
          const statusCode = response.statusCode;
          const duration = Date.now() - now;
          this.logger.error(
            `Error: ${method} ${url} [Status: ${statusCode}, Duration: ${duration}ms, Correlation-ID: ${correlationId}, Message: ${error.message}]`,
          );
        },
      }),
    );
  }
}
