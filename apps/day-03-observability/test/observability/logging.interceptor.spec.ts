import { LoggingInterceptor } from '@day-03-observability/observability/logging.interceptor';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response } from 'express';
import { of, throwError } from 'rxjs';

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;
  const mockRequest = {
    method: 'POST',
    url: '/auth/register',
    'X-Correlation-Id': '12345',
  } as Request;
  const mockResponse = { statusCode: 201 } as Response;
  const mockContext = {
    switchToHttp: () => ({
      getRequest: () => mockRequest,
      getResponse: () => mockResponse,
    }),
  } as ExecutionContext;
  const mockHandler: CallHandler = {
    handle: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggingInterceptor],
    }).compile();
    interceptor = module.get<LoggingInterceptor>(LoggingInterceptor);
    jest.spyOn(mockHandler, 'handle');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should log request and response details on success', (done) => {
    (mockHandler.handle as jest.Mock).mockReturnValue(of('response'));
    const loggerSpy = jest.spyOn(interceptor['logger'], 'log');

    // const now = Date.now();
    interceptor.intercept(mockContext, mockHandler).subscribe({
      complete: () => {
        expect(loggerSpy).toHaveBeenCalledTimes(2);
        // expect(loggerSpy).toHaveBeenCalledWith('Request Received');
        expect(loggerSpy).toHaveBeenCalledWith(
          `Request: POST /auth/register [Correlation-ID: 12345]`,
        );
        expect(loggerSpy).toHaveBeenCalledWith(
          `Response: POST /auth/register [Status: 201, Duration:`,
        );
        done();
      },
    });
  });

  it('should log error details on failure', (done) => {
    (mockHandler.handle as jest.Mock).mockReturnValue(
      throwError(() => new Error('Test error')),
    );
    const loggerSpy = jest.spyOn(interceptor['logger'], 'log');
    const errorSpy = jest.spyOn(interceptor['logger'], 'error');
    interceptor.intercept(mockContext, mockHandler).subscribe({
      error: () => {
        expect(loggerSpy).toHaveBeenCalledWith(
          `Request: POST /auth/register [Correlation-ID: 12345]`,
        );
        expect(errorSpy).toHaveBeenCalledWith(
          expect.stringContaining(
            `Error: POST /auth/register [Status: 201, Duration:`,
          ),
        );
        done();
      },
    });
  });

  it('should handle missing correlation ID', (done) => {
    const noCorrelationRequest = {
      method: 'GET',
      url: '/users',
      'X-Correlation-Id': undefined,
    } as Request;
    const noCorrelationContext = {
      switchToHttp: () => ({
        getRequest: () => noCorrelationRequest,
        getResponse: () => mockResponse,
      }),
    } as ExecutionContext;
    (mockHandler.handle as jest.Mock).mockReturnValue(of({}));
    const loggerSpy = jest.spyOn(interceptor['logger'], 'log');
    interceptor.intercept(noCorrelationContext, mockHandler).subscribe({
      complete: () => {
        expect(loggerSpy).toHaveBeenCalledWith(
          `Request: GET /users [Correlation-ID: N/A]`,
        );
        done();
      },
    });
  });
});
