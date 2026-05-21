import { Query, Resolver } from '@nestjs/graphql';
import { Product } from './product.model';
import { CatalogClient } from './catalog.client';
import { QueryLogService } from '../database/query-log.service';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(
    private readonly catalog: CatalogClient,
    private readonly queryLog: QueryLogService,
  ) {}

  @Query(() => [Product], { name: 'products' })
  products() {
    void this.queryLog.log('products');
    return this.catalog.findAll();
  }
}
