import {
  Either,
  left,
  right,
} from '../../../../shared/either/Either.js';
import { Transaction } from '../../domain/entities/Transaction.js';
import { InvalidAmountError } from '../../domain/value-objects/Amount.js';
import { IWalletRepository } from '../../domain/repositories/IWalletRepository.js';
import {
  CreateTransactionInput,
  TransactionOutput,
} from '../dtos/CreateTransactionDto.js';

export class CreateTransactionUseCase {
  constructor(private readonly walletRepository: IWalletRepository) {}

  async execute(
    input: CreateTransactionInput,
  ): Promise<Either<InvalidAmountError, TransactionOutput>> {
    const transaction = Transaction.create({
      userId: input.userId,
      amount: input.amount,
      type: input.type,
    });

    if (transaction instanceof InvalidAmountError) {
      return left(transaction);
    }

    await this.walletRepository.save(transaction);

    return right({
      id: transaction.id,
      userId: transaction.userId,
      amount: transaction.amount.value,
      type: transaction.type,
      createdAt: transaction.createdAt,
    });
  }
}
