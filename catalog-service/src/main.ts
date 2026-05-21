import { NestFactory } from "@nestjs/core";
import { ValidationPipe, Logger } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Reject any request that contains extra fields or that fails class-validator rules.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle("Catalog Service")
    .setDescription("REST CRUD API for product catalog")
    .setVersion("1.0")
    .build();
  SwaggerModule.setup("api", app, SwaggerModule.createDocument(app, config));

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  Logger.log(
    `catalog-service listening on http://localhost:${port} — Swagger: http://localhost:${port}/api`,
    "Bootstrap",
  );
}
bootstrap();
