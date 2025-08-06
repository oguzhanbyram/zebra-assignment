import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { LoggerModule, Params } from 'nestjs-pino';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): Params => {
        const isDev = configService.get<string>('NODE_ENV') === 'development';

        const transport = isDev && {
          target: 'pino-pretty',
          options: {
            colorize: true,
            singleLine: true,
            translateTime: 'yyyy-mm-dd HH:MM:ss.l',
            ignore: 'pid,hostname',
          },
        };

        return {
          pinoHttp: {
            level: configService.get<string>('LOG_LEVEL') || 'info',
            transport: transport || undefined,
            redact: {
              paths: ['req.headers.authorization'],
              remove: true,
            },
            customLogLevel: (req, res, err) => {
              if (res.statusCode >= 500 || err) return 'error';
              if (res.statusCode >= 400) return 'warn';
              return 'info';
            },
            customSuccessMessage: (req, res) => {
              return `${req.method} ${req.url} ${res.statusCode}`;
            },
            customErrorMessage: (req, res, err) => {
              return `Request errored: ${err?.message || 'Unknown error'}`;
            },
            nestedKey: 'payload',
          },
        };
      },
    }),
  ],
})
export class LoggerConfigModule {}
