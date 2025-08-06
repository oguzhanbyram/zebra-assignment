import { INestApplication } from '@nestjs/common';

import { setupGlobalPipes } from './setup-global-pipes';
import { setupLogger } from './setup-logger';
import { setupSwagger } from './setup-swagger';

export class AppSetup {
  constructor(private readonly app: INestApplication) {
    this.app.setGlobalPrefix('/api');
  }

  withGlobalPipes(): this {
    setupGlobalPipes(this.app);
    return this;
  }

  withGlobalInterceptors(): this {
    setupLogger(this.app);
    return this;
  }

  withSwagger(): this {
    setupSwagger(this.app);
    return this;
  }

  async done(): Promise<INestApplication> {
    return this.app;
  }
}
