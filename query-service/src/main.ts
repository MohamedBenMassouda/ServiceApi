import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3003;
  await app.listen(port);
  Logger.log(
    `query-service listening on http://localhost:${port}/graphql`,
    'Bootstrap',
  );
}
bootstrap();
