import { NestFactory } from '@nestjs/core';
import { config } from 'config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(config.port);
  console.log(`App listening on port ${config.port}`);
}

bootstrap();
