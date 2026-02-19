import { right } from '@/shared/either/Either';

export const TEST_USER_ID = '11111111-1111-1111-1111-111111111111';
export const TEST_AMOUNT = 100;

export const mockWalletRepository = {
  save: jest.fn().mockResolvedValue(undefined),
  findTransactionsByUserId: jest.fn().mockResolvedValue([]),
  getBalanceByUserId: jest.fn().mockResolvedValue({ amount: 0 }),
};

export const mockUsersService = {
  checkUserExists: jest.fn().mockResolvedValue(right(true)),
};
