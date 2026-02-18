import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.WALLET_PORT || 3001;
  await app.listen(port);
}

void bootstrap();
