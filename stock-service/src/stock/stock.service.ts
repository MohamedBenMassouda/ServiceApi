import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { StockItem } from "./stock-item.entity";

export interface StockRequest {
  productId: number;
  quantity: number;
}

export interface StockResponse {
  available: boolean;
  message: string;
}

@Injectable()
export class StockService {
  private readonly logger = new Logger(StockService.name);

  constructor(
    @InjectRepository(StockItem)
    private readonly repo: Repository<StockItem>,
    private readonly dataSource: DataSource,
  ) {}

  async checkAndReserve({
    productId,
    quantity,
  }: StockRequest): Promise<StockResponse> {
    const id = Number(productId);
    const qty = Number(quantity);

    if (!Number.isInteger(qty) || qty <= 0) {
      return {
        available: false,
        message: "quantity must be a positive integer",
      };
    }

    return this.dataSource.transaction(async (manager) => {
      const item = await manager.findOneBy(StockItem, { productId: id });
      if (!item) {
        return { available: false, message: `unknown productId ${id}` };
      }
      if (item.quantity < qty) {
        return {
          available: false,
          message: `insufficient stock: requested ${qty}, available ${item.quantity}`,
        };
      }
      item.quantity -= qty;
      await manager.save(item);
      this.logger.log(
        `Reserved ${qty} of product ${id} (remaining: ${item.quantity})`,
      );
      return { available: true, message: "reserved" };
    });
  }
}
