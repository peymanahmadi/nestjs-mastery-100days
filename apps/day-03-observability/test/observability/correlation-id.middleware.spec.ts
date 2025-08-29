import { CorrelationIdMiddleware } from '@day-03-observability/observability/correlation-id.middleware';
import { Test, TestingModule } from '@nestjs/testing';
import { NextFunction, Request, Response } from 'express';
import * as uuid from 'uuid';

describe('CorrelationIdMiddleware', () => {
  let middleware: CorrelationIdMiddleware;
  const mockRequest = {} as Request;
  const mockResponse = { setHeader: jest.fn() } as unknown as Response;
  const mockNext = jest.fn() as NextFunction;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CorrelationIdMiddleware],
    }).compile();
    middleware = module.get<CorrelationIdMiddleware>(CorrelationIdMiddleware);
    jest.spyOn(uuid, 'v4').mockReturnValue('12345');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should assign correlation ID to request and response', () => {
    middleware.use(mockRequest, mockResponse, mockNext);
    expect(mockRequest['X-Correlation-Id']).toBe('12345');
    expect(mockResponse.setHeader).toHaveBeenCalledWith(
      'X-Correlation-Id',
      '12345',
    );
    expect(mockNext).toHaveBeenCalled();
  });

  it('should log correlation ID assignment', () => {
    const loggerSpy = jest.spyOn(middleware['logger'], 'log');
    middleware.use(mockRequest, mockResponse, mockNext);
    expect(loggerSpy).toHaveBeenCalledWith('Assigned Correlation ID: 12345');
  });
});
