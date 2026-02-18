import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IWalletRepository } from './domain/repositories/IWalletRepository.js';
import { WalletRepositoryAdapter } from './infra/typeorm/repositories/WalletRepository.adapter.js';
import { TransactionEntity } from './infra/typeorm/entities/Transaction.entity.js';
import { CreateTransactionUseCase } from './application/use-cases/create-transaction.use-case.js';
import { GetBalanceUseCase } from './application/use-cases/GetBalanceUseCase.js';
import { ListTransactionsUseCase } from './application/use-cases/ListTransactionsUseCase.js';
import { WalletController } from './presentations/wallet.controller.js';
import { UsersModule } from '../users/users.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionEntity]),
    UsersModule,
  ],
  controllers: [WalletController],
  providers: [
    {
      provide: IWalletRepository,
      useClass: WalletRepositoryAdapter,
    },
    CreateTransactionUseCase,
    GetBalanceUseCase,
    ListTransactionsUseCase,
  ],
  exports: [IWalletRepository, CreateTransactionUseCase],
})
export class WalletModule {}
