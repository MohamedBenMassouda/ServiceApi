import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/product.entity';

@Injectable()
export class SeederService implements OnModuleInit {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(Product)
    private readonly products: Repository<Product>,
  ) {}

  async onModuleInit() {
    if ((await this.products.count()) > 0) return;
    await this.products.save([
      { name: 'Laptop', price: 1200, stock: 10 },
      { name: 'Wireless Mouse', price: 25, stock: 50 },
      { name: 'Mechanical Keyboard', price: 110, stock: 20 },
    ]);
    this.logger.log('Seeded 3 products');
  }
}
