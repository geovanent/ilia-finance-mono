import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
} from 'typeorm';
import { TransactionType } from '../../../domain/entities/Transaction.js';

const amountTransformer = {
  to: (value: number): number => value,
  from: (value: string): number => Number(value),
};

@Entity('transactions')
export class TransactionEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('uuid')
  userId!: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: amountTransformer,
  })
  amount!: number;

  @Column({ type: 'enum', enum: TransactionType })
  type!: TransactionType;

  @CreateDateColumn()
  createdAt!: Date;
}
