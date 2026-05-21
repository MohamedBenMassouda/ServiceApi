import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { Logger } from "@nestjs/common";
import { resolve } from "path";
import { AppModule } from "./app.module";

async function bootstrap() {
  const protoPath = resolve(process.cwd(), "..", "proto", "stock.proto");

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: "stock",
        protoPath,
        url: process.env.GRPC_URL ?? "0.0.0.0:50051",
      },
    },
  );

  await app.listen();
  Logger.log("stock-service listening on gRPC 0.0.0.0:50051", "Bootstrap");
}

bootstrap();
