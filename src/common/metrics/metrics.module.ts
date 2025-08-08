import { Module } from '@nestjs/common';

import { PrometheusModule } from '@willsoto/nestjs-prometheus';

import { MetricsController } from '@common/metrics/metrics.controller';

@Module({
  imports: [
    PrometheusModule.register({
      controller: MetricsController,
    }),
  ],
  providers: [],
  exports: [PrometheusModule],
})
export class MetricsModule {}
