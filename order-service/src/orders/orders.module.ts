import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { resolve } from 'path';
import { Order } from './order.entity';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { SeederService } from '../database/seeder.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    ClientsModule.register([
      {
        name: 'STOCK_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'stock',
          protoPath: resolve(process.cwd(), '..', 'proto', 'stock.proto'),
          url: process.env.STOCK_GRPC_URL ?? 'localhost:50051',
        },
      },
      {
        name: 'KAFKA_CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'order-service',
            brokers: [process.env.KAFKA_BROKER ?? 'localhost:9092'],
          },
          producer: {
            allowAutoTopicCreation: true,
          },
        },
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, SeederService],
})
export class OrdersModule {}
