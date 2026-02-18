import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  amount!: number;

  @IsNotEmpty()
  @IsIn(['CREDIT', 'DEBIT'])
  type!: 'CREDIT' | 'DEBIT';
}

export class TransactionResponseDto {
  @IsString()
  id!: string;

  @IsString()
  userId!: string;

  @IsNumber()
  amount!: number;

  @IsIn(['CREDIT', 'DEBIT'])
  type!: string;

  createdAt!: Date;
}

export class BalanceResponseDto {
  @IsNumber()
  amount!: number;
}
