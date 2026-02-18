import { TransactionType } from '../../domain/entities/Transaction.js';

export interface CreateTransactionInput {
  userId: string;
  amount: number;
  type: TransactionType;
}

export interface TransactionOutput {
  id: string;
  userId: string;
  amount: number;
  type: TransactionType;
  createdAt: Date;
}
