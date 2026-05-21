import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Order } from "../orders/order.entity";

@Injectable()
export class SeederService implements OnModuleInit {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(Order)
    private readonly orders: Repository<Order>,
  ) {}

  async onModuleInit() {
    if ((await this.orders.count()) > 0) return;
    await this.orders.save([
      {
        productId: 1,
        quantity: 1,
        customerEmail: "alice@example.com",
        status: "CREATED",
      },
      {
        productId: 2,
        quantity: 3,
        customerEmail: "bob@example.com",
        status: "CREATED",
      },
      {
        productId: 1,
        quantity: 2,
        customerEmail: "charlie@example.com",
        status: "CREATED",
      },
    ]);
    this.logger.log("Seeded 3 orders");
  }
}
