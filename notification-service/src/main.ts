import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { Logger } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
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

  const config = new DocumentBuilder()
    .setTitle("Notification Service")
    .setDescription("Kafka-driven notification service — read-only HTTP API")
    .setVersion("1.0")
    .build();
  SwaggerModule.setup("api", app, SwaggerModule.createDocument(app, config));

  await app.startAllMicroservices();
  const port = process.env.PORT ?? 3004;
  await app.listen(port);
  Logger.log(
    `notification-service HTTP on :${port}, subscribed to Kafka — Swagger: http://localhost:${port}/api`,
    "Bootstrap",
  );
}
bootstrap();
