import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import * as moment from 'moment';

describe('TutorialController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());

        await app.init();
    });

    it('/tutorial (POST)', async () => {
        const title = `Nodejs com Nestjs${Math.floor(Math.random() * 10000)}`
        const content = 'Nodejs com nestjs'
        const tutorial = await createTutorial({ title, content })
        expect(tutorial.statusCode).toBe(201)
        expect(tutorial.body.title).toBe(title)
        expect(tutorial.body).toHaveProperty('id')
    });

    it('/tutorial (POST) return error Unauthorized', async () => {
        const getResponse = await request(app.getHttpServer())
            .post(`/tutorial`)
            .expect(401);
        expect(getResponse.body.message).toBe("Unauthorized");
    });

    it.each([
        "",
        { title: "nest" },
        { title: 1, content: "nest" },
        { content: "nest" },
        { title: "nest", content: 1 },
    ])('/tutorial (POST) return error body invalid  with "%s"', async (tutorial) => {
        const postResponse = await createTutorial(tutorial)
        expect(postResponse.statusCode).toBe(400)
        expect(postResponse.body.error).toEqual("Bad Request")
    });

    it('/tutorial (GET)', async () => {
        const title = `Nodejs com Nestjs${Math.floor(Math.random() * 10000)}`
        const content = 'Nodejs com nestjs'
        await createTutorial({ title, content })
        const auth = await login()
        const tutorials = await request(app.getHttpServer())
            .get('/tutorial')
            .set('Authorization', `Bearer ${auth.body.token}`)
            .set('Accept', 'application/json')
        expect(tutorials.statusCode).toBe(200)
        expect(tutorials.body.length).not.toBe(0)
        expect(tutorials.body[0]).toHaveProperty('id')
        expect(tutorials.body[0]).toHaveProperty('title')
        expect(tutorials.body[0]).toHaveProperty('user')
    });

    it('/tutorial (GET) filter by title', async () => {
        const title = `Nodejs com Nestjs${Math.floor(Math.random() * 10000)}`
        const content = 'Nodejs com nestjs'
        await createTutorial({ title, content })
        const auth = await login()
        const tutorials = await request(app.getHttpServer())
            .get(`/tutorial?title=${title}`)
            .set('Authorization', `Bearer ${auth.body.token}`)
            .set('Accept', 'application/json')
        expect(tutorials.statusCode).toBe(200)
        expect(tutorials.body.length).toBe(1)
        expect(tutorials.body[0].title).toBe(title)
    });

    it('/tutorial (GET) filter by date', async () => {
        const title = `Nodejs com Nestjs${Math.floor(Math.random() * 10000)}`
        const content = 'Nodejs com nestjs'
        const date = moment().format("YYYY-MM-DD")
        await createTutorial({ title, content })
        const auth = await login()
        const getResponse = await request(app.getHttpServer())
            .get(`/tutorial?date=${date}`)
            .set('Authorization', `Bearer ${auth.body.token}`)
            .set('Accept', 'application/json')
        expect(getResponse.statusCode).toBe(200)
        expect(getResponse.body.length).not.toBe(0)
        const tutorial = getResponse.body[0]
        console.log(tutorial, date)
        const condition = (moment(tutorial.createdAt).format("YYYY-MM-DD")) == date || (moment(tutorial.updatedAt).format("YYYY-MM-DD")) == date
        expect(condition).toBe(true)
    });

    it('/tutorial (GET) return error Unauthorized', async () => {
        const getResponse = await request(app.getHttpServer())
            .get(`/tutorial`)
            .expect(401);
        expect(getResponse.body.message).toBe("Unauthorized");
    });

    it.each([
        "date=8",
        "limit='a'",
        "limit=10&page=1&date=1",
        "limit=10&page=0&date=1",
    ])('/tutorial (POST) return error body invalid  with "%s"', async (query) => {
        const auth = await login()
        const tutorials = await request(app.getHttpServer())
            .get(`/tutorial?${query}`)
            .set('Authorization', `Bearer ${auth.body.token}`)
            .set('Accept', 'application/json')
            .expect(400)
        expect(tutorials.body.error).toEqual("Bad Request")
    });

    it('/tutorial/:id (GET)', async () => {
        const title = `Nodejs com Nestjs${Math.floor(Math.random() * 10000)}`
        const content = 'Nodejs com nestjs'
        const auth = await login()
        const postResponse = await request(app.getHttpServer())
            .post('/tutorial')
            .set('Authorization', `Bearer ${auth.body.token}`)
            .send({ title, content })
            .set('Accept', 'application/json')

        const tutorial = await request(app.getHttpServer())
            .get(`/tutorial/${postResponse.body.id}`)
            .set('Authorization', `Bearer ${auth.body.token}`)
            .set('Accept', 'application/json')
        expect(tutorial.statusCode).toBe(200)
        expect(tutorial.body.title).toBe(title)
    });

    it('/tutorial/:id (GET) return error Unauthorized', async () => {
        const getResponse = await request(app.getHttpServer())
            .get(`/tutorial/1`)
            .expect(401);
        expect(getResponse.body.message).toBe("Unauthorized");
    });

    it('/tutorial/:id (GET) return not found', async () => {
        const title = `Nodejs com Nestjs${Math.floor(Math.random() * 10000)}`
        const content = 'Nodejs com nestjs'
        const postResponse = await createTutorial({ title, content })
        const auth = await login()

        const tutorials = await request(app.getHttpServer())
            .get(`/tutorial/${postResponse.body.id}`)
            .set('Authorization', `Bearer ${auth.body.token}`)
            .set('Accept', 'application/json')
        expect(tutorials.statusCode).toBe(404)
    });

    it('/tutorial/:id (PATCH)', async () => {
        let title = `Nodejs com Nestjs${Math.floor(Math.random() * 10000)}`
        const content = 'Nodejs com nestjs'
        const auth = await login()
        const postResponse = await request(app.getHttpServer())
            .post('/tutorial')
            .set('Authorization', `Bearer ${auth.body.token}`)
            .send({ title, content })
            .set('Accept', 'application/json')

        title = `Nodejs com Nestjs${Math.floor(Math.random() * 10000)}`
        const id = postResponse.body.id
        const tutorial = await request(app.getHttpServer())
            .patch(`/tutorial/${id}`)
            .set('Authorization', `Bearer ${auth.body.token}`)
            .send({ title, content })
            .set('Accept', 'application/json')
        expect(tutorial.statusCode).toBe(200)
        expect(tutorial.body.title).toBe(title)
        expect(tutorial.body.id).toBe(id)
    });

    it('/tutorial/:id (PATCH) return error Unauthorized', async () => {
        const getResponse = await request(app.getHttpServer())
            .patch(`/tutorial/id`)
            .expect(401);
        expect(getResponse.body.message).toBe("Unauthorized");
    });

    it.each([
        "",
        { title: "nest" },
        { title: 1, content: "nest" },
        { content: "nest" },
        { title: "nest", content: 1 },
    ])('/tutorial (PATCH) return error body invalid  with "%s"', async (tutorial) => {
        const postResponse = await createTutorial(tutorial)
        const auth = await login()

        const id = postResponse.body.id
        const patchResponse = await request(app.getHttpServer())
            .patch(`/tutorial/${id}`)
            .set('Authorization', `Bearer ${auth.body.token}`)
            .send(tutorial)
            .set('Accept', 'application/json')
        expect(patchResponse.statusCode).toBe(400)
        expect(patchResponse.body.error).toEqual("Bad Request")
    });

    it('/tutorial/:id (DELETE)', async () => {
        const title = `Nodejs com Nestjs${Math.floor(Math.random() * 10000)}`
        const content = 'Nodejs com nestjs'
        const auth = await login()
        const postResponse = await request(app.getHttpServer())
            .post('/tutorial')
            .set('Authorization', `Bearer ${auth.body.token}`)
            .send({ title, content })
            .set('Accept', 'application/json')

        const tutorial = await request(app.getHttpServer())
            .delete(`/tutorial/${postResponse.body.id}`)
            .set('Authorization', `Bearer ${auth.body.token}`)
            .set('Accept', 'application/json')
        expect(tutorial.statusCode).toBe(200)
    });

    it('/tutorial/:id (DELETE) return error Unauthorized', async () => {
        const getResponse = await request(app.getHttpServer())
            .delete(`/tutorial/1`)
            .expect(401);
        expect(getResponse.body.message).toBe("Unauthorized");
    });

    it('/tutorial/:id (DELETE) return not found', async () => {
        const title = `Nodejs com Nestjs${Math.floor(Math.random() * 10000)}`
        const content = 'Nodejs com nestjs'
        const postResponse = await createTutorial({ title, content })
        const auth = await login()

        const tutorials = await request(app.getHttpServer())
            .delete(`/tutorial/${postResponse.body.id}`)
            .set('Authorization', `Bearer ${auth.body.token}`)
            .set('Accept', 'application/json')
        expect(tutorials.statusCode).toBe(404)
    });

    const createTutorial = async (tutorial: any) => {
        const auth = await login()
        return await request(app.getHttpServer())
            .post('/tutorial')
            .set('Authorization', `Bearer ${auth.body.token}`)
            .send(tutorial)
            .set('Accept', 'application/json')
    }

    const login = async () => {
        const user = {
            username: `bet.process${Math.floor(Math.random() * 10000)}`,
            password: "123456",
            name: "Maria"
        }
        await request(app.getHttpServer())
            .post('/user/signup')
            .send(user)
            .set('Accept', 'application/json')

        return await request(app.getHttpServer())
            .post('/user/login')
            .send(user)
            .set('Accept', 'application/json')
    }
})