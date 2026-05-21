import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from "@nestjs/common";
import { ClientGrpc, ClientKafka } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { firstValueFrom } from "rxjs";
import { Order } from "./order.entity";
import { CreateOrderDto } from "./dto/create-order.dto";
import { StockGrpcClient } from "./stock.interface";

@Injectable()
export class OrdersService implements OnModuleInit {
  private readonly logger = new Logger(OrdersService.name);
  private stockClient: StockGrpcClient;

  constructor(
    @InjectRepository(Order) private readonly repo: Repository<Order>,
    @Inject("STOCK_PACKAGE") private readonly grpcClient: ClientGrpc,
    @Inject("KAFKA_CLIENT") private readonly kafka: ClientKafka,
  ) {}

  async onModuleInit() {
    this.stockClient =
      this.grpcClient.getService<StockGrpcClient>("StockService");
    await this.kafka.connect();
  }

  async create(dto: CreateOrderDto) {
    let stockResp;

    try {
      stockResp = await firstValueFrom(
        this.stockClient.CheckAndReserve({
          productId: dto.productId,
          quantity: dto.quantity,
        }),
      );
    } catch (err) {
      this.logger.error(`stock-service unreachable: ${err.message}`);
      throw new BadRequestException("stock-service unreachable");
    }

    if (!stockResp.available) {
      throw new ConflictException(stockResp.message);
    }

    const order = await this.repo.save(
      this.repo.create({ ...dto, status: "CREATED" }),
    );

    this.kafka.emit("order.created", {
      orderId: order.id,
      productId: order.productId,
      quantity: order.quantity,
      customerEmail: order.customerEmail,
      createdAt: order.createdAt,
    });
    this.logger.log(`Published order.created for orderId=${order.id}`);

    return order;
  }

  findAll() {
    return this.repo.find();
  }

  async findOne(id: number) {
    const order = await this.repo.findOneBy({ id });

    if (!order) throw new NotFoundException(`Order ${id} not found`);

    return order;
  }
}
