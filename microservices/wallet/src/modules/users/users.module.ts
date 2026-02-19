import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'node:path';
import { IUsersService } from './ports/users.service.interface.js';
import { UsersGrpcAdapter } from './services/users-grpc.adapter.js';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: UsersGrpcAdapter.getClientToken(),
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'users_internal',
            protoPath: join(__dirname, '../../shared/grpc/users.proto'),
            url:
              configService.get('USERS_GRPC_URL') ?? 'users_app:50051',
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [
    {
      provide: IUsersService,
      useClass: UsersGrpcAdapter,
    },
  ],
  exports: [IUsersService],
})
export class UsersModule {}
