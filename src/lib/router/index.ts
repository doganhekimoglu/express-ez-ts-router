import express from 'express';

export class Router {
  private static instance: express.Router;

  static getRouter(): express.Router {
    if (!Router.instance) {
      Router.instance = express.Router();
    }

    return Router.instance;
  }

  static setRouter(router: express.Router) {
    Router.instance = router;

    return Router.instance;
  }
}
