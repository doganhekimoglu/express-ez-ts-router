import { MetadataKeys } from './enums/MetadataKeys';
import { RequestHandler } from 'express';

export function Use(middleware: RequestHandler) {
  return function (target: any, key?: string) {
    if (key) {
      const middleWares: RequestHandler[] = Reflect.getMetadata(MetadataKeys.middleware, target, key) || [];
      Reflect.defineMetadata(MetadataKeys.middleware, [...middleWares, middleware], target, key);
    } else {
      const middleWares: RequestHandler[] = Reflect.getMetadata(MetadataKeys.middleware, target) || [];
      Reflect.defineMetadata(MetadataKeys.middleware, [...middleWares, middleware], target);
    }
  };
}
