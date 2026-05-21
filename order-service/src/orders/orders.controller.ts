import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";

@ApiTags("orders")
@Controller("orders")
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Post()
  @ApiOperation({ summary: "Place an order (validates stock via gRPC, emits Kafka event)" })
  @ApiResponse({ status: 201, description: "Order created" })
  @ApiResponse({ status: 400, description: "Validation error or insufficient stock" })
  create(@Body() dto: CreateOrderDto) {
    return this.orders.create(dto);
  }

  @Get()
  @ApiOperation({ summary: "List all orders" })
  @ApiResponse({ status: 200, description: "Array of orders" })
  findAll() {
    return this.orders.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get an order by ID" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({ status: 200, description: "Order found" })
  @ApiResponse({ status: 404, description: "Order not found" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.orders.findOne(id);
  }
}
