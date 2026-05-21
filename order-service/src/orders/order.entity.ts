import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export type OrderStatus = 'CREATED' | 'REJECTED';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  productId: number;

  @Column('int')
  quantity: number;

  @Column()
  customerEmail: string;

  @Column({ default: 'CREATED' })
  status: OrderStatus;

  @CreateDateColumn()
  createdAt: Date;
}
