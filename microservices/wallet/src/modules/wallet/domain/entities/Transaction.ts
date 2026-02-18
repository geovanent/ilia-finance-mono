import { randomUUID } from 'node:crypto';
import { Amount, InvalidAmountError } from '../value-objects/Amount.js';

export enum TransactionType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}

interface TransactionProps {
  userId: string;
  amount: number;
  type: TransactionType;
  createdAt?: Date;
}

export class Transaction {
  private constructor(
    private readonly _id: string,
    private readonly _userId: string,
    private readonly _amount: Amount,
    private readonly _type: TransactionType,
    private readonly _createdAt: Date,
  ) {}

  static create(
    props: TransactionProps,
    id?: string,
  ): Transaction | InvalidAmountError {
    const amount = Amount.create(props.amount);

    if (amount instanceof InvalidAmountError) {
      return amount;
    }

    return new Transaction(
      id ?? randomUUID(),
      props.userId,
      amount,
      props.type,
      props.createdAt ?? new Date(),
    );
  }

  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get amount(): Amount {
    return this._amount;
  }

  get type(): TransactionType {
    return this._type;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
}
