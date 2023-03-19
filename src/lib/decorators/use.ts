import { MetadataKeys } from './enums/MetadataKeys';
import { RequestHandler } from 'express';

export function Use(middleware: RequestHandler) {
  return function (target: any, key: string) {
    const middleWares = Reflect.getMetadata(MetadataKeys.middleware, target, key) || [];
    Reflect.defineMetadata(MetadataKeys.middleware, [...middleWares, middleware], target, key);
  };
}
