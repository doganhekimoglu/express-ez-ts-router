// @ts-nocheck
import express, { NextFunction, Request, Response } from 'express';
import { Controller, Get, Router, Use } from '../src';
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

test('Attach middleware', async () => {
  const protectedRoute = (req: Request, res: Response, next: NextFunction) => {
    res.status(401).json({});
  };

  @Controller('/main')
  class MainController {
    @Get('/success')
    @Use(protectedRoute)
    Success(req: Request, res: Response) {
      res.status(200).json({});
    }
  }

  await request(app).get('/main/success').expect(401);
});
