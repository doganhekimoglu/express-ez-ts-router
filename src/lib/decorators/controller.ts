import { RequestHandler } from 'express';
import { MetadataKeys } from './enums/MetadataKeys';
import { Router } from '../router';
import { Methods } from './enums/Methods';

export function Controller(prefix: string) {
  return function (target: Function) {
    const router = Router.getRouter();

    const controllerMiddlewares: RequestHandler[] = Reflect.getMetadata(MetadataKeys.middleware, target) || [];

    function attachRoutes(
      target: any,
      parentRouterPath?: string,
      routerPath?: string,
      parentMiddlewares: RequestHandler[] = [],
    ) {
      for (const key in target.prototype) {
        const routeHandler = target.prototype[key];
        const method: Methods = Reflect.getMetadata(MetadataKeys.method, target.prototype, key);
        const middlewares: RequestHandler[] = Reflect.getMetadata(MetadataKeys.middleware, target.prototype, key) || [];
        const path = Reflect.getMetadata(MetadataKeys.path, target.prototype, key);
        if (method && path) {
          router[method](
            `${prefix}${parentRouterPath || ''}${routerPath || ''}${path}`,
            ...controllerMiddlewares,
            ...parentMiddlewares,
            ...middlewares,
            routeHandler,
          );
        }
      }
    }

    attachRoutes(target);
    function attachSubRouters(entryPoint: Function, parentPath?: string, parentMiddlewares: RequestHandler[] = []) {
      const subRouters = Reflect.getMetadata(MetadataKeys.subrouter, entryPoint) || [];
      for (const subRouter of subRouters) {
        const subRouterPath = Reflect.getMetadata(MetadataKeys.path, subRouter);
        const subRouterMiddlewares: RequestHandler[] = Reflect.getMetadata(MetadataKeys.middleware, subRouter) || [];
        attachRoutes(subRouter, parentPath, subRouterPath, [...parentMiddlewares, ...subRouterMiddlewares]);
        attachSubRouters(subRouter, subRouterPath, [...parentMiddlewares, ...subRouterMiddlewares]);
      }
    }
    attachSubRouters(target);
  };
}
