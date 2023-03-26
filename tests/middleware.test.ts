// @ts-nocheck
import express, { NextFunction, Request, Response } from 'express';
import { Controller, Get, Post, Router, SubRouter, Use, UseSubRouter } from '../src';
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

test('Attach middleware to method', async () => {
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

test('Attach middleware to main controller', async () => {
  const notAuthorized = (req: Request, res: Response, next: NextFunction) => {
    res.status(401).json({});
  };

  @SubRouter('/subroute3')
  class SubRoute3 {
    @Get('/user')
    User(req: Request, res: Response) {
      res.status(200).json({});
    }
  }

  @SubRouter('/subroute2')
  class SubRoute2 {
    @Get('/user')
    User(req: Request, res: Response) {
      res.status(200).json({});
    }
  }

  @SubRouter('/subroute')
  @UseSubRouter(SubRoute2)
  class SubRoute {
    @Get('/user')
    User(req: Request, res: Response) {
      res.status(200).json({});
    }
  }

  @Controller('/main')
  @UseSubRouter(SubRoute)
  @UseSubRouter(SubRoute3)
  @Use(notAuthorized)
  class MainController {
    @Get('/notfound')
    NotFound(req: Request, res: Response) {
      res.status(200).json({});
    }
  }
  await request(app).get('/main/notfound').expect(401);
  await request(app).get('/main/subroute/user').expect(401);
  await request(app).get('/main/subroute3/user').expect(401);
  await request(app).get('/main/subroute/subroute2/user').expect(401);
});

test('Attach middleware to sub router', async () => {
  const notAuthorized = (req: Request, res: Response, next: NextFunction) => {
    res.status(401).json({});
  };

  @SubRouter('/subroute3')
  class SubRouter3 {
    @Post('/login')
    Login(req: Request, res: Response) {
      res.status(200).json({});
    }
  }

  @SubRouter('/subroute2')
  class SubRouter2 {
    @Post('/login')
    Login(req: Request, res: Response) {
      res.status(200).json({});
    }
  }

  @SubRouter('/subroute1')
  @UseSubRouter(SubRouter2)
  @Use(notAuthorized)
  class SubRouter1 {
    @Post('/login')
    Login(req: Request, res: Response) {
      res.status(200).json({});
    }
  }

  @Controller('/api')
  @UseSubRouter(SubRouter1)
  @UseSubRouter(SubRouter3)
  class MainController {
    @Post('/login')
    Login(req: Request, res: Response) {
      res.status(200).json({});
    }
  }

  await request(app).post('/api/login').expect(200);
  await request(app).post('/api/subroute3/login').expect(200);
  await request(app).post('/api/subroute1/login').expect(401);
  await request(app).post('/api/subroute1/subroute2/login').expect(401);
});

test('Test middleware order of execution', async () => {
  const logMiddleware = (name) => (req: Request, res: Response, next: NextFunction) => {
    if (!req.middlewareLog) req.middlewareLog = '';
    req.middlewareLog += name + '';
    next();
  };

  @SubRouter('/subroute2')
  @Use(logMiddleware(3))
  @Use(logMiddleware(7))
  class SubRouter2 {
    @Post('/login')
    @Use(logMiddleware(6))
    Login(req: Request, res: Response) {
      res.status(200).json({ middlewareLog: req.middlewareLog });
    }
  }

  @SubRouter('/subroute1')
  @UseSubRouter(SubRouter2)
  @Use(logMiddleware(2))
  class SubRouter1 {
    @Post('/login')
    @Use(logMiddleware(5))
    Login(req: Request, res: Response) {
      res.status(200).json({ middlewareLog: req.middlewareLog });
    }
  }

  @Controller('/api')
  @UseSubRouter(SubRouter1)
  @Use(logMiddleware(1))
  class MainController {
    @Post('/login')
    @Use(logMiddleware(4))
    Login(req: Request, res: Response) {
      res.status(200).json({ middlewareLog: req.middlewareLog });
    }
  }

  await request(app)
    .post('/api/login')
    .expect(200)
    .then((response) => {
      expect(response.body.middlewareLog).toEqual('14');
    });
  await request(app)
    .post('/api/subroute1/login')
    .expect(200)
    .then((response) => {
      expect(response.body.middlewareLog).toEqual('125');
    });
  await request(app)
    .post('/api/subroute1/subroute2/login')
    .expect(200)
    .then((response) => {
      expect(response.body.middlewareLog).toEqual('12736');
    });
});
