import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  private readonly logger = new Logger(CorrelationIdMiddleware.name);
  use(req: Request, res: Response, next: NextFunction) {
    const correlationId = uuidv4();
    req['X-Correlation-Id'] = correlationId;;
    res.setHeader('X-Correlation-Id', correlationId);
    this.logger.log(`Assigned Correlation ID: ${correlationId}`);
    next();
  }
}
