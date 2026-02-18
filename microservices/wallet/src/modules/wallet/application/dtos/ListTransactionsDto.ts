import { TransactionType } from '../../domain/entities/Transaction.js';

export interface ListTransactionsInput {
  userId: string;
  type?: TransactionType;
}
