import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { join } from 'node:path';
import { AppModule } from './app.module.js';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const grpcUrl = process.env.USERS_GRPC_URL ?? '0.0.0.0:50051';
  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      package: 'users_internal',
      protoPath: join(__dirname, 'shared/grpc/users.proto'),
      url: grpcUrl,
    },
  });

  await app.startAllMicroservices();

  const httpPort = process.env.USERS_PORT ?? 3002;
  await app.listen(httpPort);

  const logger = new Logger('Bootstrap');
  logger.log(`HTTP server listening on port ${httpPort}`);
  logger.log(`gRPC server listening on ${grpcUrl}`);
}

void bootstrap();
