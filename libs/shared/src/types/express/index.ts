import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      'X-Correlation-Id'?: string;
    }
  }
}

export {}; // Important: make this a module
