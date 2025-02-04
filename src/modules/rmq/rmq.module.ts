import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { queueKeys } from '@shared/contants/queue';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: queueKeys.QUEUE_NAME,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RMQ_URL || 'amqp://localhost:5672'],
          queue: queueKeys.QUEUE_NAME,
          queueOptions: { durable: true },
          persistent: true,
          prefetchCount: 8,
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class RmqModule {}
