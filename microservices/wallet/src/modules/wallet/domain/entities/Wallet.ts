export class Wallet {
  private constructor(private readonly _userId: string) {}

  static create(userId: string): Wallet {
    return new Wallet(userId);
  }

  get userId(): string {
    return this._userId;
  }
}
