[![Version][npm-version]][npm-url]&nbsp;&nbsp;
[![Typescript][npm-typescript]][npm-url]&nbsp;&nbsp;
[![Build][github-build]][github-tests-url]&nbsp;&nbsp;
[![License][github-license]][github-license-url]&nbsp;&nbsp;

**Easy to use Typescript decorators for creating Express.js routes**

**To use express-ez-ts-router in your project you need the configurations below in your tsconfig.json file**
```js
{
  "compilerOptions": {
    "target": "es5",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}

```

Examples:

```ts
import express from "express";
import { Router } from "express-ez-ts-router";

const app = express();

// Attach express-ez-ts-router router to express
app.use(Router.getRouter());

app.listen(3000, () => {
    console.log('Listening on port 3000!!!');
})
```

<br>

```ts
// Create your first controller
import { Request, Response } from "express";
import { Get, Controller } from "express-ez-ts-router";

@Controller("/main")
class MainController {
    @Get("/success")
    successRoute(request: Request, response: Response) {
        response.json({ success: true });
    }
}
```
<br>

```ts
// Chain routes
import { Request, Response } from "express";
import { Post, Controller, SubRouter, UseSubRouter } from "express-ez-ts-router";

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

// POST: /api/subroute1/subroute2/login
```

<br>

```ts
// Attach middlewares to methods
import { Request, Response, NextFunction } from "express";
import { Get, Controller, Use } from "express-ez-ts-router";

const protectedRoute = (req: Request, res: Response, next: NextFunction) => {
    res.status(401).json({});
};

const anotherMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Do stuff
  next();
};

@Controller('/main')
class MainController {
    @Get('/success')
    @Use(protectedRoute) // Attach protectedRoute middleware to this route
    @Use(anotherMiddleware) // Attach anotherMiddleware middleware to this route
    // Multiple middlewares can be attached to the same object(controller, subrouter, request handler). Execution of order is from bottom to top. In this case anotherMiddleware will be executed before protectedRoute
    Success(req: Request, res: Response) {
        res.status(200).json({});
    }
}
```

<br>

```ts
// Attach middlewares to controllers
import { Request, Response, NextFunction } from "express";
import { Get, Controller, Use, SubRouter, UseSubRouter } from "express-ez-ts-router";

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

/*
/main/notfound
/main/subroute/user
/main/subroute3/user
/main/subroute/subroute2/user
All defined routes will return status code 401 because the main controller uses the middleware notAuthorized
 */
```

<br>

```ts
// Attach middlewares to sub routers
import { Request, Response, NextFunction } from "express";
import { Get, Controller, Use, SubRouter, UseSubRouter } from "express-ez-ts-router";

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
/*
/api/login expected status 200
/api/subroute3/login expected status 200
/api/subroute1/login expected status 401
/api/subroute1/subroute2/login expected status 401
Only the routes inside SubRouter1 and SubRouter2 will return with status 401
*/
```

|                                   Decorators                                    |                                                                      Description                                                                      |
|:-------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------:|
|                                Controller                                |                                                      Create a main controller with a main route                                                       |
|                                 SubRouter                                |                                     Create a sub router which can be attached to another sub router or controller                                     |
|                             UseSubRouter                             |        Attach a sub router to a controller or to another sub router, multiple sub routers can be attached to a single controller or sub router        |
|                                 Use                                 | Attach middleware function to a controller, sub router or a specific request handler, multiple middlewares can be attached to an object(see examples) |
| Method Decorators: Get, Post, Put, Delete, Patch, Head, Options, Connect, Trace |                      Turn class method of a controller or sub router into a request handler with one of the http request methods                      |

[npm-url]: https://www.npmjs.com/package/express-ez-ts-router
[github-tests-url]: https://github.com/doganhekimoglu/express-ez-ts-router/tree/master/tests
[github-build]: https://img.shields.io/github/actions/workflow/status/doganhekimoglu/express-ez-ts-router/publish.yml
[npm-version]: https://img.shields.io/npm/v/express-ez-ts-router
[github-license]: https://img.shields.io/npm/l/express-ez-ts-router
[github-license-url]: https://github.com/doganhekimoglu/express-ez-ts-router/blob/master/LICENSE
[npm-typescript]: https://img.shields.io/npm/types/express-ez-ts-router