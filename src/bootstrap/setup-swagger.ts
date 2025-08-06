import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import metadata from '../metadata';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Feature Toggle Service API')
    .setDescription('Zebra Engineering Assignment – API documentation')
    .addBearerAuth()
    .setVersion('1.0')
    .build();

  SwaggerModule.loadPluginMetadata(metadata)
    .then(() => Logger.log('Swagger metadata loaded', 'Swagger'))
    .catch((err: any) => Logger.error('Failed to load Swagger metadata', err, 'Swagger'));

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/docs', app, documentFactory, {
    swaggerOptions: {
      deepLinking: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      tagsSorter: 'alpha',
      persistAuthorization: true,
    },
    useGlobalPrefix: true,
    swaggerUiEnabled: true,
    jsonDocumentUrl: '/docs',
  });
}
