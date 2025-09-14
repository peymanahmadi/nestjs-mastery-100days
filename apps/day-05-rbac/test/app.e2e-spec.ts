import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { Logger } from '@nestjs/common';
import { Role } from '../src/enum/role.enum';

describe('App (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let userToken: string;
  let adminUserId: string;
  let userUserId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );
    await app.init();

    // Register admin
    const adminRegister = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        Name: 'Admin User',
        Email: 'admin@example.com',
        Password: 'Admin123!',
        Roles: [Role.Admin],
      })
      .expect(201);
    adminUserId = adminRegister.body.Id;
    const adminLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ Email: 'admin@example.com', Password: 'Admin123!' })
      .expect(200);
    adminToken = adminLogin.body.token;

    // Register regular user
    const userRegister = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        Name: 'Regular User',
        Email: 'user@example.com',
        Password: 'User123!',
        // Defaults to [Role.User]
      })
      .expect(201);
    userUserId = userRegister.body.Id;
    const userLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ Email: 'user@example.com', Password: 'User123!' })
      .expect(200);
    userToken = userLogin.body.token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /users', () => {
    it('should return users for authenticated user (no role required)', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.headers['x-correlation-id']).toBeDefined();
    });

    it('should return 401 for unauthenticated', async () => {
      await request(app.getHttpServer()).get('/users').expect(401);
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete user for admin', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/users/${userUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200); // Or 204 if no content
      expect(response.body).toBeUndefined(); // Assuming delete returns void
      expect(response.headers['x-correlation-id']).toBeDefined();
    });

    it('should return 403 for non-admin', async () => {
      await request(app.getHttpServer())
        .delete(`/users/${adminUserId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    it('should return 401 for unauthenticated', async () => {
      await request(app.getHttpServer())
        .delete(`/users/${userUserId}`)
        .expect(401);
    });
  });

  describe('POST /auth/register', () => {
    it('should register with default user role', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          Name: 'Default User',
          Email: 'default@example.com',
          Password: 'Default123!',
        })
        .expect(201);
      expect(response.body.Roles).toEqual([Role.User]);
    });
  });

  describe('POST /auth/login', () => {
    it('should login and return token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ Email: 'admin@example.com', Password: 'Admin123!' })
        .expect(200);
      expect(response.body.token).toMatch(/mock-jwt-/);
    });
  });
});
