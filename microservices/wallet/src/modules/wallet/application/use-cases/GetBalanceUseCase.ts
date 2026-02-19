import { Inject } from '@nestjs/common';
import { IWalletRepository } from '../../domain/repositories/IWalletRepository.js';
import { BalanceOutput, GetBalanceInput } from '../dtos/GetBalanceDto.js';

export class GetBalanceUseCase {
  constructor(
    @Inject(IWalletRepository) private readonly walletRepository: IWalletRepository,
  ) {}

  async execute(input: GetBalanceInput): Promise<BalanceOutput> {
    const balance = await this.walletRepository.getBalanceByUserId(
      input.userId,
    );

    return { amount: balance.amount };
  }
}
