// @ts-nocheck
import express, { Request, Response } from 'express';
import { Controller, Get, Post, Router, SubRouter, UseSubRouter } from '../src';
import request from 'supertest';

let server: any;
let app: any;

beforeAll(() => {
  app = express();
  app.use(Router.getRouter());
  server = app.listen(0);
});

afterAll(() => {
  server.close();
});

test('Attach subrouter to a controller', async () => {
  @SubRouter('/auth')
  class AuthRouter {
    @Post('/login')
    Login(req: Request, res: Response) {
      res.status(200).json({});
    }
  }

  @Controller('/api')
  @UseSubRouter(AuthRouter)
  class MainController {}

  await request(app).post('/api/auth/login').expect(200);
});

test('Attach multiple subrouters to a controller', async () => {
  @SubRouter('/auth')
  class AuthRouter {
    @Post('/login')
    Login(req: Request, res: Response) {
      res.status(200).json({});
    }
  }

  @SubRouter('/protected')
  class ProtectedRoute {
    @Get('/access')
    Login(req: Request, res: Response) {
      res.status(401).json({});
    }
  }

  @Controller('/api')
  @UseSubRouter(AuthRouter)
  @UseSubRouter(ProtectedRoute)
  class MainController {}

  await request(app).post('/api/auth/login').expect(200);
  await request(app).get('/api/protected/access').expect(401);
});

test('Chain subrouters into each other', async () => {
  @SubRouter('/subroute2')
  class SubRouter2 {
    @Post('/login')
    Login(req: Request, res: Response) {
      res.status(200).json({});
    }
  }

  @SubRouter('/subroute1')
  @UseSubRouter(SubRouter2)
  class SubRouter1 {}

  @Controller('/api')
  @UseSubRouter(SubRouter1)
  class MainController {}

  await request(app).post('/api/subroute1/subroute2/login').expect(200);
});
