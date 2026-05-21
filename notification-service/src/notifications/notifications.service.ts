import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Notification } from "./notification.entity";

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly repo: Repository<Notification>,
  ) {}

  save(data: {
    orderId: number;
    productId: number;
    quantity: number;
    customerEmail: string;
  }) {
    return this.repo.save(this.repo.create(data));
  }

  findAll() {
    return this.repo.find({ order: { sentAt: "DESC" } });
  }
}
