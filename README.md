[![Version][npm-version]][npm-url]&nbsp;&nbsp;
[![Typescript][npm-typescript]][npm-url]&nbsp;&nbsp;
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
// Attach middlewares
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
    // Multiple middlewares can be attached to a request handler. Execution of order bottom to top. In this case anotherMiddleware will be executed first
    Success(req: Request, res: Response) {
        res.status(200).json({});
    }
}
```

|                                   Decorators                                    |                                                Description                                                |
|:-------------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------------------------:|
|                                Controller                                |                                Create a main controller with a main route                                 |
|                                 SubRouter                                |               Create a sub router which can be attached to another sub router or controller               |
|                             UseSubRouter                             |                       Attach a sub router to a controller or to another sub router                        |
|                                 Use                                 |     Attach middleware function to a specific route handler, multiple middlewares can be attached to       |
| Method Decorators: Get, Post, Put, Delete, Patch, Head, Options, Connect, Trace | Turn class method of a controller or sub router into a route handler with one of the http request methods |

[npm-url]: https://www.npmjs.com/package/express-ez-ts-router
[npm-version]: https://img.shields.io/npm/v/express-ez-ts-router
[github-license]: https://img.shields.io/npm/l/express-ez-ts-router
[github-license-url]: https://github.com/doganhekimoglu/express-ez-ts-router/blob/master/LICENSE
[npm-typescript]: https://img.shields.io/npm/types/express-ez-ts-router