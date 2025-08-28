import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
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
    it('should register a new user', async () => {
      const registerDto = {
        Name: 'John Doe',
        Email: 'john@example.com',
        Password: 'Password123!',
      };

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
    });

    it('should return 409 for duplicate email', async () => {
      const registerDto = {
        Name: 'John Doe',
        Email: 'john@example.com',
        Password: 'Password123!',
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto);
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(409);
    });
  });

  describe('POST /auth/login', () => {
    it('should login a user with valid credentials', async () => {
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
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(200);

      expect(response.body).toEqual({
        token: expect.stringContaining('mock-jwt-'),
      });
    });

    it('should return 401 for invalid credentials', async () => {
      const loginDto = {
        Email: 'john@example.com',
        Password: 'WrongPassword',
      };
      await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(401);
    });
  });
});
