import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { StockService, StockRequest, StockResponse } from "./stock.service";

@Controller()
export class StockController {
  constructor(private readonly stock: StockService) {}

  @GrpcMethod("StockService", "CheckAndReserve")
  checkAndReserve(data: StockRequest): Promise<StockResponse> {
    return this.stock.checkAndReserve(data);
  }
}
