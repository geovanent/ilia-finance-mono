export class InsufficientBalanceError extends Error {
  constructor(userId: string, amount: number) {
    super(`Insufficient balance for user ${userId}. Required amount: ${amount}.`);
    this.name = 'InsufficientBalanceError';
  }
}

export class UserNotFoundError extends Error {
  constructor(userId: string) {
    super(`User not found: ${userId}.`);
    this.name = 'UserNotFoundError';
  }
}
