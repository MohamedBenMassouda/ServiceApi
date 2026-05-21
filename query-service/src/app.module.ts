import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { HttpModule } from "@nestjs/axios";
import { TypeOrmModule } from "@nestjs/typeorm";
import { join } from "path";

import { ProductsResolver } from "./products/products.resolver";
import { OrdersResolver } from "./orders/orders.resolver";
import { CatalogClient } from "./products/catalog.client";
import { OrderClient } from "./orders/order.client";
import { QueryLog } from "./database/query-log.entity";
import { QueryLogService } from "./database/query-log.service";
import { SeederService } from "./database/seeder.service";

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "query.sqlite",
      entities: [QueryLog],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([QueryLog]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), "schema.gql"),
      playground: true,
      sortSchema: true,
    }),
  ],
  providers: [
    CatalogClient,
    OrderClient,
    ProductsResolver,
    OrdersResolver,
    QueryLogService,
    SeederService,
  ],
})
export class AppModule {}
