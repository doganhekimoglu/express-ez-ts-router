import { MetadataKeys } from './enums/MetadataKeys';
import { ErrorRequestHandler, RequestHandler } from 'express';
import { RequestHandlerInterface } from './methods';

export function Use(middleware: RequestHandler | ErrorRequestHandler) {
  return function (target: any, key?: string, desc?: RequestHandlerInterface) {
    if (key) {
      const middleWares: RequestHandler[] = Reflect.getMetadata(MetadataKeys.middleware, target, key) || [];
      Reflect.defineMetadata(MetadataKeys.middleware, [...middleWares, middleware], target, key);
    } else {
      const middleWares: RequestHandler[] = Reflect.getMetadata(MetadataKeys.middleware, target) || [];
      Reflect.defineMetadata(MetadataKeys.middleware, [...middleWares, middleware], target);
    }
  };
}
