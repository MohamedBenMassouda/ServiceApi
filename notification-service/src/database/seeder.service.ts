import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../notifications/notification.entity';

@Injectable()
export class SeederService implements OnModuleInit {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(Notification)
    private readonly notifications: Repository<Notification>,
  ) {}

  async onModuleInit() {
    if ((await this.notifications.count()) > 0) return;
    await this.notifications.save([
      { orderId: 1, productId: 1, quantity: 1, customerEmail: 'alice@example.com' },
      { orderId: 2, productId: 2, quantity: 3, customerEmail: 'bob@example.com' },
      { orderId: 3, productId: 1, quantity: 2, customerEmail: 'charlie@example.com' },
    ]);
    this.logger.log('Seeded 3 notifications');
  }
}
