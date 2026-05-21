import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('query_logs')
export class QueryLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  resolverName: string;

  @CreateDateColumn()
  executedAt: Date;
}
