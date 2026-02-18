import { Either } from '../../../shared/either/Either.js';

export abstract class IUsersService {
  abstract checkUserExists(userId: string): Promise<Either<Error, boolean>>;
}
