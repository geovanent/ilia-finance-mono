export class InvalidAmountError extends Error {
  constructor(value: number) {
    super(`Invalid amount: ${value}. Amount must be a positive integer greater than 0.`);
    this.name = 'InvalidAmountError';
  }
}

export class Amount {
  private constructor(private readonly _value: number) {}

  static create(value: number): Amount | InvalidAmountError {
    if (!Number.isInteger(value) || value <= 0) {
      return new InvalidAmountError(value);
    }

    return new Amount(value);
  }

  get value(): number {
    return this._value;
  }
}
