import { left, right } from '@/shared/either/Either';
import { TransactionType } from '@/modules/wallet/domain/entities/Transaction';
import { InvalidAmountError } from '@/modules/wallet/domain/value-objects/Amount';
import { CreateTransactionUseCase } from '@/modules/wallet/application/use-cases/create-transaction.use-case';
import {
  InsufficientBalanceError,
  UserNotFoundError,
} from '@/modules/wallet/application/errors/index';
import {
  mockUsersService,
  mockWalletRepository,
  TEST_AMOUNT,
  TEST_USER_ID,
} from '../mocks';

describe('CreateTransactionUseCase', () => {
  let useCase: CreateTransactionUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUsersService.checkUserExists.mockResolvedValue(right(true));
    mockWalletRepository.getBalanceByUserId.mockResolvedValue({ amount: 500 });
    mockWalletRepository.save.mockResolvedValue(undefined);

    useCase = new CreateTransactionUseCase(
      mockWalletRepository as any,
      mockUsersService as any,
    );
  });

  it('should create a credit transaction successfully', async () => {
    const result = await useCase.execute({
      userId: TEST_USER_ID,
      amount: TEST_AMOUNT,
      type: TransactionType.CREDIT,
    });

    expect(result._tag).toBe('right');
    if (result._tag === 'right') {
      expect(result.value.type).toBe(TransactionType.CREDIT);
      expect(result.value.userId).toBe(TEST_USER_ID);
      expect(result.value.amount.value).toBe(TEST_AMOUNT);
    }
    expect(mockUsersService.checkUserExists).toHaveBeenCalledWith(TEST_USER_ID);
    expect(mockWalletRepository.save).toHaveBeenCalled();
    expect(mockWalletRepository.getBalanceByUserId).not.toHaveBeenCalled();
  });

  it('should create a debit transaction with sufficient balance', async () => {
    mockWalletRepository.getBalanceByUserId.mockResolvedValue({
      amount: 200,
    });

    const result = await useCase.execute({
      userId: TEST_USER_ID,
      amount: 100,
      type: TransactionType.DEBIT,
    });

    expect(result._tag).toBe('right');
    if (result._tag === 'right') {
      expect(result.value.type).toBe(TransactionType.DEBIT);
      expect(result.value.amount.value).toBe(100);
    }
    expect(mockWalletRepository.getBalanceByUserId).toHaveBeenCalledWith(
      TEST_USER_ID,
    );
    expect(mockWalletRepository.save).toHaveBeenCalled();
  });

  it('should return InsufficientBalanceError for debit with insufficient balance', async () => {
    mockWalletRepository.getBalanceByUserId.mockResolvedValue({ amount: 50 });

    const result = await useCase.execute({
      userId: TEST_USER_ID,
      amount: 100,
      type: TransactionType.DEBIT,
    });

    expect(result._tag).toBe('left');
    if (result._tag === 'left') {
      expect(result.value).toBeInstanceOf(InsufficientBalanceError);
      expect((result.value as InsufficientBalanceError).message).toContain(
        TEST_USER_ID,
      );
    }
    expect(mockWalletRepository.save).not.toHaveBeenCalled();
  });

  it('should return InvalidAmountError for zero amount', async () => {
    const result = await useCase.execute({
      userId: TEST_USER_ID,
      amount: 0,
      type: TransactionType.CREDIT,
    });

    expect(result._tag).toBe('left');
    if (result._tag === 'left') {
      expect(result.value).toBeInstanceOf(InvalidAmountError);
    }
    expect(mockUsersService.checkUserExists).not.toHaveBeenCalled();
    expect(mockWalletRepository.save).not.toHaveBeenCalled();
  });

  it('should return InvalidAmountError for negative amount', async () => {
    const result = await useCase.execute({
      userId: TEST_USER_ID,
      amount: -1,
      type: TransactionType.CREDIT,
    });

    expect(result._tag).toBe('left');
    if (result._tag === 'left') {
      expect(result.value).toBeInstanceOf(InvalidAmountError);
    }
    expect(mockWalletRepository.save).not.toHaveBeenCalled();
  });

  it('should return UserNotFoundError when user does not exist (Right(false))', async () => {
    mockUsersService.checkUserExists.mockResolvedValue(right(false));

    const result = await useCase.execute({
      userId: TEST_USER_ID,
      amount: TEST_AMOUNT,
      type: TransactionType.CREDIT,
    });

    expect(result._tag).toBe('left');
    if (result._tag === 'left') {
      expect(result.value).toBeInstanceOf(UserNotFoundError);
      expect((result.value as UserNotFoundError).message).toContain(
        TEST_USER_ID,
      );
    }
    expect(mockWalletRepository.save).not.toHaveBeenCalled();
  });

  it('should return UserNotFoundError when checkUserExists returns Left', async () => {
    mockUsersService.checkUserExists.mockResolvedValue(
      left(new Error('Service error')),
    );

    const result = await useCase.execute({
      userId: TEST_USER_ID,
      amount: TEST_AMOUNT,
      type: TransactionType.CREDIT,
    });

    expect(result._tag).toBe('left');
    if (result._tag === 'left') {
      expect(result.value).toBeInstanceOf(UserNotFoundError);
    }
    expect(mockWalletRepository.save).not.toHaveBeenCalled();
  });
});
