import {
  Either,
  left,
  right,
  isLeft,
} from '../../../../shared/either/Either.js';
import { Transaction, TransactionType } from '../../domain/entities/Transaction.js';
import { InvalidAmountError } from '../../domain/value-objects/Amount.js';
import { IWalletRepository } from '../../domain/repositories/IWalletRepository.js';
import { IUsersService } from '../../../users/ports/users.service.interface.js';
import {
  InsufficientBalanceError,
  UserNotFoundError,
} from '../errors/index.js';

export type CreateTransactionCommand = {
  userId: string;
  amount: number;
  type: TransactionType;
};

export type CreateTransactionError =
  | InvalidAmountError
  | InsufficientBalanceError
  | UserNotFoundError;

export class CreateTransactionUseCase {
  constructor(
    private readonly walletRepository: IWalletRepository,
    private readonly usersService: IUsersService,
  ) {}

  async execute(
    command: CreateTransactionCommand,
  ): Promise<Either<CreateTransactionError, Transaction>> {
    const transaction = Transaction.create({
      userId: command.userId,
      amount: command.amount,
      type: command.type,
    });

    if (transaction instanceof InvalidAmountError) {
      return left(transaction);
    }

    const userExistsResult = await this.usersService.checkUserExists(
      command.userId,
    );

    if (isLeft(userExistsResult)) {
      return left(new UserNotFoundError(command.userId));
    }

    if (!userExistsResult.value) {
      return left(new UserNotFoundError(command.userId));
    }

    if (transaction.type === TransactionType.DEBIT) {
      const balance = await this.walletRepository.getBalanceByUserId(
        command.userId,
      );

      if (balance.amount < transaction.amount.value) {
        return left(
          new InsufficientBalanceError(
            command.userId,
            transaction.amount.value,
          ),
        );
      }
    }

    await this.walletRepository.save(transaction);

    return right(transaction);
  }
}
