/**
 * Generated from users.proto - types for users_internal.UsersInternalService
 */
export interface CheckUserExistsRequest {
  userId?: string;
  user_id?: string;
}

export interface CheckUserExistsResponse {
  exists?: boolean;
}

export interface IUsersInternalService {
  checkUserExists(
    request: CheckUserExistsRequest,
  ): Promise<CheckUserExistsResponse>;
}
