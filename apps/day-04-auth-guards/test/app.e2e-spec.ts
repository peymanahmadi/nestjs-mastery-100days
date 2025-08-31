import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { Logger } from '@nestjs/common';

describe('App (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );
    await app.init();

    // Register and login to get a token
    const registerDto = {
      Name: 'John Doe',
      Email: 'john@example.com',
      Password: 'Password123!',
    };
    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerDto)
      .expect(201);
    userId = registerResponse.body.Id;

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ Email: 'john@example.com', Password: 'Password123!' })
      .expect(200);

    token = loginResponse.body.token;
    expect(loginResponse.headers['x-access-token']).toBe(token);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /users', () => {
    it('should return users with valid token', async () => {
      const loggerSpy = jest.spyOn(Logger.prototype, 'log');
      const response = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toContainEqual(
        expect.objectContaining({ Id: userId }),
      );
      expect(response.headers['x-correlation-id']).toBeDefined();
      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining(`Request: GET /users [Correlation-ID:`),
      );
      loggerSpy.mockRestore();
    });

    it('should return 401 for missing token', async () => {
      const loggerSpy = jest.spyOn(Logger.prototype, 'error');
      const response = await request(app.getHttpServer())
        .get('/users')
        .expect(401);
      expect(response.body).toMatchObject({
        message: 'Invalid or missing token',
      });
      expect(response.headers['x-correlation-id']).toBeDefined();
      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining(`Error: GET /users [Status: 401, Duration:`),
      );
      loggerSpy.mockRestore();
    });

    it('should return 401 for invalid token', async () => {
      const loggerSpy = jest.spyOn(Logger.prototype, 'error');
      const response = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
      expect(response.body).toMatchObject({ message: 'Invalid token' });
      expect(response.headers['x-correlation-id']).toBeDefined();
      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining(`Error: GET /users [Status: 401, Duration:`),
      );
      loggerSpy.mockRestore();
    });
  });

  describe('GET /users/:id', () => {
    it('should return user with valid token', async () => {
      const loggerSpy = jest.spyOn(Logger.prototype, 'log');
      const response = await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toMatchObject({
        Id: userId,
        Email: 'john@example.com',
      });
      expect(response.headers['x-correlation-id']).toBeDefined();
      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          `Request: GET /users/${userId} [Correlation-ID:`,
        ),
      );
      loggerSpy.mockRestore();
    });

    it('should return 401 for invalid token', async () => {
      const loggerSpy = jest.spyOn(Logger.prototype, 'error');
      const response = await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
      expect(response.body).toMatchObject({ message: 'Invalid token' });
      expect(response.headers['x-correlation-id']).toBeDefined();
      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          `Error: GET /users/${userId} [Status: 401, Duration:`,
        ),
      );
      loggerSpy.mockRestore();
    });
  });

  describe('POST /auth/register', () => {
    it('should register a user without token', async () => {
      const registerDto = {
        Name: 'Jane Doe',
        Email: 'jane@example.com',
        Password: 'Password123!',
      };
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201);

      expect(response.body).toMatchObject({
        Name: 'Jane Doe',
        Email: 'jane@example.com',
      });
      expect(response.headers['x-correlation-id']).toBeDefined();
    });
  });

  describe('POST /auth/login', () => {
    it('should login a user without token', async () => {
      const loginDto = {
        Email: 'john@example.com',
        Password: 'Password123!',
      };
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(200);

      expect(response.body).toEqual({
        token: expect.stringContaining('mock-jwt-'),
      });
      expect(response.headers['x-access-token']).toBeDefined();
      expect(response.headers['x-correlation-id']).toBeDefined();
    });
  });
});
