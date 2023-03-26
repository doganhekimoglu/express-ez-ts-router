// @ts-nocheck
import express, { Request, Response } from 'express';
import { Controller, Get, Post, Router } from '../src';
import request from 'supertest';

let server: any;
let app: any;

beforeEach(() => {
  app = express();
  const router = express.Router();
  app.use(Router.setRouter(router));
  server = app.listen(0);
});

afterEach(() => {
  server.close();
});

test('Attach controller', async () => {
  @Controller('/main')
  class MainController {
    @Get('/success')
    Success(req: Request, res: Response) {
      res.status(200).json({});
    }
  }

  await request(app).get('/main/success').expect(200);
});

test('Attach multiple controllers', async () => {
  @Controller('/auth')
  class MainController {
    @Post('/login')
    Login(req: Request, res: Response) {
      res.status(200).json({});
    }
  }

  @Controller('/posts')
  class MainController2 {
    @Get('/getpost')
    Success(req: Request, res: Response) {
      res.status(200).json({});
    }
  }

  await request(app).post('/auth/login').expect(200);
  await request(app).get('/posts/getpost').expect(200);
});
