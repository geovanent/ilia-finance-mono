import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Transaction,
  TransactionType,
} from '../../../domain/entities/Transaction.js';
import {
  Amount,
  InvalidAmountError,
} from '../../../domain/value-objects/Amount.js';
import {
  BalanceResult,
  IWalletRepository,
} from '../../../domain/repositories/IWalletRepository.js';
import { TransactionEntity } from '../entities/Transaction.entity.js';

@Injectable()
export class WalletRepositoryAdapter implements IWalletRepository {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly repo: Repository<TransactionEntity>,
  ) {}

  async save(transaction: Transaction): Promise<void> {
    const entity = new TransactionEntity();
    entity.id = transaction.id;
    entity.userId = transaction.userId;
    entity.amount = transaction.amount.value;
    entity.type = transaction.type;
    entity.createdAt = transaction.createdAt;
    await this.repo.save(entity);
  }

  async findTransactionsByUserId(
    userId: string,
    type?: TransactionType,
  ): Promise<Transaction[]> {
    const qb = this.repo
      .createQueryBuilder('t')
      .where('t.userId = :userId', { userId })
      .orderBy('t.createdAt', 'DESC');

    if (type) {
      qb.andWhere('t.type = :type', { type });
    }

    const rows = await qb.getMany();

    return rows.map((row) => {
      const amount = Amount.create(Number(row.amount));
      if (amount instanceof InvalidAmountError) {
        throw new Error(`Invalid stored amount: ${row.amount}`);
      }
      const transaction = Transaction.create(
        {
          userId: row.userId,
          amount: amount.value,
          type: row.type,
          createdAt: row.createdAt,
        },
        row.id,
      );
      if (transaction instanceof InvalidAmountError) {
        throw new Error(`Invalid stored amount: ${row.amount}`);
      }
      return transaction;
    });
  }

  async getBalanceByUserId(userId: string): Promise<BalanceResult> {
    const result = await this.repo
      .createQueryBuilder('t')
      .select(
        `SUM(CASE WHEN t.type = 'CREDIT' THEN t.amount ELSE -t.amount END)`,
        'balance',
      )
      .where('t.userId = :userId', { userId })
      .getRawOne<{ balance: string | null }>();

    const amount = result?.balance != null ? Number(result.balance) : 0;

    return { amount };
  }
}
