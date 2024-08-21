import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  it('/user/signup (POST)', async () => {
    const username = `bet.process${Math.floor(Math.random() * 10000)}`
    const user = {
      username: username,
      password: "123456",
      name: "Maria"
    }
    const postResponse = await createUser(user)
    expect(postResponse.statusCode).toBe(201)
    expect(postResponse.body.username).toEqual(username)
  });

  it.each([
    "",
    { username: "testeUsername" },
    { password: "testeusername" },
    { username: "123", password: "123456" },
    { username: "bet", password: "123456" },
    { username: "bet.user", password: "12346" },
  ])('/user/signup (POST) return error body invalid  with "%s"', async (user) => {
    const postResponse = await createUser(user)
    expect(postResponse.statusCode).toBe(400)
    expect(postResponse.body.error).toEqual("Bad Request")
  });

  it('/user/login (POST)', async () => {
    const username = `bet.process${Math.floor(Math.random() * 10000)}`
    const user = {
      username: username,
      password: "123456",
      name: "Maria"
    }
    await createUser(user)

    const postResponse = await login(user)
    expect(postResponse.statusCode).toBe(201)
    expect(typeof postResponse.body.token).toBe('string');
  });

  it('/user/login (POST) return error credentials', async () => {
    const postResponse = await login({
      username: "teste",
      password: "258484",
    })

    expect(postResponse.statusCode).toBe(401)
    expect(postResponse.body.message).toBe("Credentials invalids!");
  });

  it.each([
    "",
    { username: "testeUsername" },
    { password: "testeusername" },
  ])('/user/login (POST) return error body invalid  with "%s"', async (user) => {
    const postResponse = await login(user)
    expect(postResponse.statusCode).toBe(400)
    expect(postResponse.body.error).toEqual("Bad Request")
  });

  const createUser = async (user: any) => {
    return await request(app.getHttpServer())
      .post('/user/signup')
      .send(user)
      .set('Accept', 'application/json')
  }

  const login = async (user: any) => {
    return await request(app.getHttpServer())
      .post('/user/login')
      .send(user)
      .set('Accept', 'application/json')
  }
});
