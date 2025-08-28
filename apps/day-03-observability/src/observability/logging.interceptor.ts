import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    console.log('Request Received');
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();

    const method = request.method;
    const url = request.url;
    const now = Date.now();

    console.log(`>>> [Request] ${method} ${url} - Start`);

    return next.handle().pipe(
      tap({
        next: (value) => {
          const response = httpContext.getResponse();
          const statusCode = response.statusCode;
          const duration = Date.now() - now;

          // Log the successful outcome
          console.log(
            `<<< [Success] ${method} ${url} - ${statusCode} - ${duration}ms`,
          );
        },
        error: (error) => {
          const response = httpContext.getResponse();
          const statusCode = response.statusCode;
          const duration = Date.now() - now;

          // Log the failed outcome
          console.log(
            `<<< [Error] ${method} ${url} - ${statusCode} - ${duration}ms`,
          );
        },
      }),
    );
  }
}
