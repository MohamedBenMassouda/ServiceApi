import { Args, Query, Resolver } from "@nestjs/graphql";
import { Product } from "./product.model";
import { CatalogClient } from "./catalog.client";
import { QueryLogService } from "../database/query-log.service";

@Resolver(() => Product)
export class ProductsResolver {
  constructor(
    private readonly catalog: CatalogClient,
    private readonly queryLog: QueryLogService,
  ) {}

  @Query(() => [Product], { name: "products" })
  products() {
    void this.queryLog.log("products");
    return this.catalog.findAll();
  }

  @Query(() => [Product], { name: "searchProducts" })
  async searchProducts(@Args("query") query: string) {
    void this.queryLog.log("searchProducts");
    const all = await this.catalog.findAll();
    const q = query.toLowerCase();
    return all.filter((p) => p.name.toLowerCase().includes(q));
  }
}
