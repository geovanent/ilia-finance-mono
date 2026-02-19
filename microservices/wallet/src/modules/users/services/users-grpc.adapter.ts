import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientGrpc } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import * as jwt from 'jsonwebtoken';
import { firstValueFrom } from 'rxjs';
import { left, right } from '../../../shared/either/Either.js';
import { IUsersService } from '../ports/users.service.interface.js';
import { UserIntegrationError } from '../errors/user-integration.error.js';

interface UsersInternalService {
  checkUserExists(
    request: { user_id: string },
    metadata?: Metadata,
  ): import('rxjs').Observable<{ exists: boolean }>;
}

const USERS_GRPC_CLIENT = 'USERS_GRPC_CLIENT';

@Injectable()
export class UsersGrpcAdapter implements IUsersService, OnModuleInit {
  private usersInternalService!: UsersInternalService;

  constructor(
    @Inject(USERS_GRPC_CLIENT)
    private readonly client: ClientGrpc,
    private readonly configService: ConfigService,
  ) {}

  static getClientToken(): string {
    return USERS_GRPC_CLIENT;
  }

  onModuleInit(): void {
    this.usersInternalService =
      this.client.getService<UsersInternalService>('UsersInternalService');
  }

  async checkUserExists(userId: string) {
    try {
      const token = this.createInternalToken();
      const metadata = new Metadata();
      metadata.set('authorization', `Bearer ${token}`);

      const checkExists = this.usersInternalService.checkUserExists.bind(
        this.usersInternalService,
      ) as (
        req: { user_id: string },
        meta?: Metadata,
      ) => import('rxjs').Observable<{ exists: boolean }>;
      const response = await firstValueFrom(
        checkExists({ user_id: userId }, metadata),
      );

      return right(response.exists);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'User service unavailable';
      return left(new UserIntegrationError(message, err));
    }
  }

  private createInternalToken(): string {
    const secret = this.configService.getOrThrow<string>('JWT_SECRET_INTERNAL');
    return jwt.sign(
      { sub: 'wallet', scope: 'internal' },
      secret,
      { expiresIn: '1m' },
    );
  }
}
