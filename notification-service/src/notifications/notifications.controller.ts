import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationsService } from './notifications.service';

interface OrderCreatedEvent {
  orderId: number;
  productId: number;
  quantity: number;
  customerEmail: string;
  createdAt: string;
}

@Controller()
export class NotificationsController {
  private readonly logger = new Logger(NotificationsController.name);

  constructor(private readonly notifications: NotificationsService) {}

  @EventPattern('order.created')
  async handleOrderCreated(@Payload() event: OrderCreatedEvent) {
    await this.notifications.save({
      orderId: event.orderId,
      productId: event.productId,
      quantity: event.quantity,
      customerEmail: event.customerEmail,
    });
    this.logger.log(
      `confirmation envoyée à ${event.customerEmail} pour la commande ${event.orderId}`,
    );
  }
}
