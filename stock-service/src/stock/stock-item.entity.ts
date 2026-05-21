import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('stock_items')
export class StockItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  productId: number;

  @Column('int')
  quantity: number;
}
