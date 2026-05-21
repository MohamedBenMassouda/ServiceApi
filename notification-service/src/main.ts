import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { Logger } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: "notification-service",
        brokers: [process.env.KAFKA_BROKER ?? "localhost:9092"],
      },
      consumer: {
        groupId: "notification-consumer",
      },
    },
  });

  await app.startAllMicroservices();
  const port = process.env.PORT ?? 3004;
  await app.listen(port);
  Logger.log(
    `notification-service HTTP on :${port}, subscribed to Kafka`,
    "Bootstrap",
  );
}
bootstrap();
