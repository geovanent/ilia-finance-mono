import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IUserRepository } from './domain/repository/IUserRepository.js';
import { IAuthService } from './domain/services/IAuthService.js';
import { UserRepositoryAdapter } from './infra/typeorm/repositories/UserRepository.adapter.js';
import { UserEntity } from './infra/typeorm/entities/User.entity.js';
import { AuthAdapter } from './infra/auth/Auth.adapter.js';
import { AuthModule } from './infra/auth/auth.module.js';
import { RegisterUser } from './application/use-cases/RegisterUser.js';
import { LoginUser } from './application/use-cases/LoginUser.js';
import { UsersController } from './presentation/users.controller.js';
import { UsersGrpcServerService } from './infra/grpc/UsersGrpcServer.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    AuthModule,
  ],
  controllers: [UsersController, UsersGrpcServerService],
  providers: [
    {
      provide: IUserRepository,
      useClass: UserRepositoryAdapter,
    },
    {
      provide: IAuthService,
      useClass: AuthAdapter,
    },
    RegisterUser,
    LoginUser,
    UsersGrpcServerService,
  ],
  exports: [IUserRepository],
})
export class UsersModule {}
