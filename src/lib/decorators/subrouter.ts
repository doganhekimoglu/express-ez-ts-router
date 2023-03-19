import { MetadataKeys } from './enums/MetadataKeys';

export function SubRouter(path: string) {
  return function (target: Function) {
    Reflect.defineMetadata(MetadataKeys.path, path, target);
  };
}
