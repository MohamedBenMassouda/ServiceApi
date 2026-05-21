import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockItem } from '../stock/stock-item.entity';

@Injectable()
export class SeederService implements OnModuleInit {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(StockItem)
    private readonly stockItems: Repository<StockItem>,
  ) {}

  async onModuleInit() {
    if ((await this.stockItems.count()) > 0) return;
    await this.stockItems.save([
      { productId: 1, quantity: 10 },
      { productId: 2, quantity: 50 },
      { productId: 3, quantity: 20 },
    ]);
    this.logger.log('Seeded 3 stock items');
  }
}
