import { Methods } from './enums/Methods';
import { MetadataKeys } from './enums/MetadataKeys';

function routeBind(method: Methods) {
  return function (path: string) {
    return function (target: any, key: string) {
      Reflect.defineMetadata(MetadataKeys.path, path, target, key);
      Reflect.defineMetadata(MetadataKeys.method, method, target, key);
    };
  };
}

export const Get = routeBind(Methods.Get);
export const Post = routeBind(Methods.Post);
export const Put = routeBind(Methods.Put);
export const Delete = routeBind(Methods.Delete);
export const Patch = routeBind(Methods.Patch);
export const Head = routeBind(Methods.Head);
export const Options = routeBind(Methods.Options);
export const Connect = routeBind(Methods.Connect);
export const Trace = routeBind(Methods.Trace);
