import { NestFactory } from "@nestjs/core";
import { ValidationPipe, Logger } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle("Order Service")
    .setDescription("Order management API (REST + gRPC to stock-service + Kafka)")
    .setVersion("1.0")
    .build();
  SwaggerModule.setup("api", app, SwaggerModule.createDocument(app, config));

  const port = process.env.PORT ?? 3002;
  await app.listen(port);
  Logger.log(
    `order-service listening on http://localhost:${port} — Swagger: http://localhost:${port}/api`,
    "Bootstrap",
  );
}
bootstrap();
