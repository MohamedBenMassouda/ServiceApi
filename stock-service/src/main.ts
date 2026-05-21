import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { resolve } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  // Pure gRPC microservice — no HTTP layer needed. The transport itself is the API.
  // proto file lives at <repo-root>/proto/stock.proto. We always run npm scripts from
  // <repo-root>/stock-service, so resolving against process.cwd() works in both
  // ts-node (start:dev) and compiled (start:prod) modes.
  const protoPath = resolve(process.cwd(), '..', 'proto', 'stock.proto');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'stock',
        protoPath,
        url: process.env.GRPC_URL ?? '0.0.0.0:50051',
      },
    },
  );

  await app.listen();
  Logger.log('stock-service listening on gRPC 0.0.0.0:50051', 'Bootstrap');
}
bootstrap();
