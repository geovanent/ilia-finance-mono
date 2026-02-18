import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './shared/auth/auth.module.js';
import { JwtAuthGuard } from './shared/auth/jwt-auth.guard.js';
import { ApiWrapperInterceptor } from './shared/interceptors/api-wrapper.interceptor.js';
import { WalletModule } from './modules/wallet/wallet.module.js';
import { TransactionEntity } from './modules/wallet/infra/typeorm/entities/Transaction.entity.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_WALLET_HOST'),
        port: configService.get('DB_WALLET_PORT', 5432),
        username: configService.get('DB_WALLET_USER'),
        password: configService.get('DB_WALLET_PASSWORD'),
        database: configService.get('DB_WALLET_NAME'),
        synchronize: true,
        entities: [TransactionEntity],
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    WalletModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_INTERCEPTOR, useClass: ApiWrapperInterceptor },
  ],
})
export class AppModule {}
