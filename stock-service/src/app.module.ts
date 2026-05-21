import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockController } from './stock/stock.controller';
import { StockService } from './stock/stock.service';
import { StockItem } from './stock/stock-item.entity';
import { SeederService } from './database/seeder.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'stock.sqlite',
      entities: [StockItem],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([StockItem]),
  ],
  controllers: [StockController],
  providers: [StockService, SeederService],
})
export class AppModule {}
