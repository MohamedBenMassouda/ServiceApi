import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("notifications")
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("int")
  orderId: number;

  @Column("int")
  productId: number;

  @Column("int")
  quantity: number;

  @Column()
  customerEmail: string;

  @CreateDateColumn()
  sentAt: Date;
}
