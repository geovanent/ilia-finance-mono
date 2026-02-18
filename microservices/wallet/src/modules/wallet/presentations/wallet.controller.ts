import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Post,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateTransactionUseCase } from '../application/use-cases/create-transaction.use-case.js';
import { GetBalanceUseCase } from '../application/use-cases/GetBalanceUseCase.js';
import { ListTransactionsUseCase } from '../application/use-cases/ListTransactionsUseCase.js';
import { InvalidAmountError } from '../domain/value-objects/Amount.js';
import { TransactionType } from '../domain/entities/Transaction.js';
import { type CreateTransactionError } from '../application/use-cases/create-transaction.use-case.js';
import {
  InsufficientBalanceError,
  UserNotFoundError,
} from '../application/errors/index.js';
import { isLeft } from '../../../shared/either/Either.js';
import { JwtPayload } from '../../../shared/auth/jwt.strategy.js';
import { CreateTransactionDto } from './dtos/transaction.dto.js';

@Controller('wallet')
export class WalletController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly getBalanceUseCase: GetBalanceUseCase,
    private readonly listTransactionsUseCase: ListTransactionsUseCase,
  ) {}

  @Post('transactions')
  async createTransaction(
    @Req() req: Request & { user?: JwtPayload },
    @Body() body: CreateTransactionDto,
  ) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    const result = await this.createTransactionUseCase.execute({
      userId,
      amount: body.amount,
      type: body.type as TransactionType,
    });

    if (isLeft(result)) {
      const error = result.value as CreateTransactionError;
      if (error instanceof InvalidAmountError) {
        throw new BadRequestException(error.message);
      }
      if (error instanceof InsufficientBalanceError) {
        throw new ForbiddenException(error.message);
      }
      if (error instanceof UserNotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException((error as Error).message);
    }

    const t = result.value;
    return {
      id: t.id,
      userId: t.userId,
      amount: t.amount.value,
      type: t.type,
      createdAt: t.createdAt,
    };
  }

  @Get('balance')
  async getBalance(@Req() req: Request & { user?: JwtPayload }) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    const balance = await this.getBalanceUseCase.execute({ userId });
    return { amount: balance.amount };
  }

  @Get('transactions')
  async listTransactions(
    @Req() req: Request & { user?: JwtPayload },
    @Query('type') type?: string,
  ) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    const typeFilter =
      type === 'CREDIT' || type === 'DEBIT' ? (type as TransactionType) : undefined;

    const list = await this.listTransactionsUseCase.execute({
      userId,
      type: typeFilter,
    });

    return list;
  }
}
