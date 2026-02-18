import { right } from '../../../shared/either/Either.js';
import { IUsersService } from '../ports/users.service.interface.js';

export class UsersServiceMock implements IUsersService {
  async checkUserExists(): Promise<ReturnType<typeof right<boolean>>> {
    return right(true);
  }
}
