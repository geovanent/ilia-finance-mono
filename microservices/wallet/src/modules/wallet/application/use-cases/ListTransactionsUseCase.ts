import { Inject } from '@nestjs/common';
import { IWalletRepository } from '../../domain/repositories/IWalletRepository.js';
import { ListTransactionsInput } from '../dtos/ListTransactionsDto.js';
import { TransactionOutput } from '../dtos/CreateTransactionDto.js';

export class ListTransactionsUseCase {
  constructor(
    @Inject(IWalletRepository) private readonly walletRepository: IWalletRepository,
  ) {}

  async execute(input: ListTransactionsInput): Promise<TransactionOutput[]> {
    const transactions = await this.walletRepository.findTransactionsByUserId(
      input.userId,
      input.type,
    );

    return transactions.map((t) => ({
      id: t.id,
      userId: t.userId,
      amount: t.amount.value,
      type: t.type,
      createdAt: t.createdAt,
    }));
  }
}
