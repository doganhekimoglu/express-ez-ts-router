import { MetadataKeys } from './enums/MetadataKeys';

export function UseSubRouter(subRouter: Function) {
  return function (target: Function) {
    const subRouters = Reflect.getMetadata(MetadataKeys.subrouter, target) || [];
    Reflect.defineMetadata(MetadataKeys.subrouter, [...subRouters, subRouter], target);
  };
}
