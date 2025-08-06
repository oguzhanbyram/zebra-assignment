import { INestApplication } from '@nestjs/common';

import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

export function setupLogger(app: INestApplication) {
  app.useLogger(app.get(Logger));
  app.flushLogs();

  app.useGlobalInterceptors(new LoggerErrorInterceptor());
}
