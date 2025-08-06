import { Logger } from '@nestjs/common';

import { createApp } from './bootstrap';

async function bootstrap() {
  const app = await createApp();
  const url = await app.getUrl();
  Logger.log(`Server running on ${url}`, 'Bootstrap');
}

bootstrap();
