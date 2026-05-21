import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { Order } from './order.model';
import { OrderClient } from './order.client';
import { QueryLogService } from '../database/query-log.service';

@Resolver(() => Order)
export class OrdersResolver {
  constructor(
    private readonly orderClient: OrderClient,
    private readonly queryLog: QueryLogService,
  ) {}

  @Query(() => [Order], { name: 'orders' })
  orders() {
    void this.queryLog.log('orders');
    return this.orderClient.findAll();
  }

  @Query(() => Order, { name: 'orderById', nullable: true })
  orderById(@Args('id', { type: () => ID }) id: number) {
    void this.queryLog.log('orderById');
    return this.orderClient.findOne(Number(id));
  }
}
