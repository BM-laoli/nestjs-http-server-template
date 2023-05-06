import { Inject, Injectable, OnModuleInit, Scope } from '@nestjs/common';
import { ContextIdFactory, ModuleRef, REQUEST } from '@nestjs/core';
import { TransientService } from './transient.service';

@Injectable({ scope: Scope.REQUEST })
export class AppService implements OnModuleInit {
  constructor(
    private moduleRef: ModuleRef,
    @Inject(REQUEST) private request: Record<string, unknown>,
  ) {}
  async onModuleInit() {
    const contextId = ContextIdFactory.create();
    const transientServices = await Promise.all([
      this.moduleRef.resolve(TransientService, contextId),
      this.moduleRef.resolve(TransientService, contextId),
    ]);
    console.log(transientServices[0] === transientServices[1]); // true
  }

  getHello(): string {
    this.onModuleInit();
    // console.log('this.request', this.request);

    return 'Hello World!';
  }
}
