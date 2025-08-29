import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { Logger } from '@nestjs/common';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/register', () => {
    it('should register a user and include correlation ID', async () => {
      const registerDto = {
        Name: 'John Doe',
        Email: 'john@example.com',
        Password: 'Password123!',
      };

      const loggerSpy = jest.spyOn(Logger.prototype, 'log');
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201);

      expect(response.body).toEqual({
        Id: expect.any(String),
        Name: 'John Doe',
        Email: 'john@example.com',
        Password: expect.any(String),
      });
      expect(response.headers['x-correlation-id']).toBeDefined();
      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          `Request: POST /auth/register [Correlation-ID:`,
        ),
      );
      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          `Response: POST /auth/register [Status: 201, Duration:`,
        ),
      );
      loggerSpy.mockRestore();
    });

    it('should return 409 for duplicate email with correlation ID', async () => {
      const registerDto = {
        Name: 'John Doe',
        Email: 'john@example.com',
        Password: 'Password123!',
      };
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto);

      const loggerSpy = jest.spyOn(Logger.prototype, 'error');
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(409);

      expect(response.headers['x-correlation-id']).toBeDefined();
      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          `Error: POST /auth/register [Status: 409, Duration:`,
        ),
      );
      loggerSpy.mockRestore();
    });
  });

  describe('POST /auth/login', () => {
    it('should login a user with valid credentials and include correlation ID', async () => {
      const registerDto = {
        Name: 'John Doe',
        Email: 'john@example.com',
        Password: 'Password123!',
      };
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto);

      const loginDto = {
        Email: 'john@example.com',
        Password: 'Password123!',
      };
      const loggerSpy = jest.spyOn(Logger.prototype, 'log');
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(200);

      expect(response.body).toEqual({
        token: expect.stringContaining('mock-jwt-'),
      });
      expect(response.headers['x-correlation-id']).toBeDefined();
      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining(`Request: POST /auth/login [Correlation-ID:`),
      );
      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          `Response: POST /auth/login [Status: 200, Duration:`,
        ),
      );
      loggerSpy.mockRestore();
    });

    it('should return 401 for invalid credentials with correlation ID', async () => {
      const loginDto = {
        Email: 'john@example.com',
        Password: 'WrongPassword',
      };
      const loggerSpy = jest.spyOn(Logger.prototype, 'error');
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(401);

      expect(response.headers['x-correlation-id']).toBeDefined();
      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          `Error: POST /auth/login [Status: 401, Duration:`,
        ),
      );
      loggerSpy.mockRestore();
    });
  });
});
