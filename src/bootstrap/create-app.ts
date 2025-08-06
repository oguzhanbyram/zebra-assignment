import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from '../app.module';
import { AppSetup } from './app-setup';

export async function createApp(): Promise<INestApplication> {
  const app = await NestFactory.create<INestApplication>(AppModule, {
    bufferLogs: true,
  });

  await new AppSetup(app).withGlobalPipes().withSwagger().withGlobalInterceptors().done();
  await app.listen(process.env.PORT || 3000);

  return app;
}
