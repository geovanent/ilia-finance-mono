import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { IUserRepository } from '../../domain/repository/IUserRepository.js';

interface CheckUserExistsRequest {
  user_id: string;
}

interface CheckUserExistsResponse {
  exists: boolean;
}

@Controller()
export class UsersGrpcServerService {
  constructor(private readonly userRepository: IUserRepository) {}

  @GrpcMethod('UsersInternalService', 'CheckUserExists')
  async checkUserExists(
    data: CheckUserExistsRequest,
  ): Promise<CheckUserExistsResponse> {
    const exists = await this.userRepository.exists(data.user_id);
    return { exists };
  }
}
