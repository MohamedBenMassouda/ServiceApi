import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { Product } from './products/product.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'catalog.sqlite',
      entities: [Product],
      synchronize: true, // auto-create tables — fine for a TP, never use in production
    }),
    ProductsModule,
  ],
})
export class AppModule {}
