import 'reflect-metadata';
import { Controller } from './lib/decorators/controller';
import { Get, Post, Put, Patch, Delete, Connect, Head, Trace, Options } from './lib/decorators/methods';
import { Use } from './lib/decorators/use';
import { UseSubRouter } from './lib/decorators/usesubrouter';
import { SubRouter } from './lib/decorators/subrouter';
import { Router } from './lib/router';

export {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Connect,
  Head,
  Trace,
  Options,
  Use,
  UseSubRouter,
  SubRouter,
  Router,
};
