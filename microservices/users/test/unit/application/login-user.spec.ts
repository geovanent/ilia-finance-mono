import { UnauthorizedException } from '@nestjs/common';
import { LoginUser } from '@/modules/users/application/use-cases/LoginUser';
import {
  mockAuthService,
  mockUser,
  mockUserRepository,
  MOCK_TOKEN,
} from '../mocks';

describe('LoginUser', () => {
  let loginUser: LoginUser;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUserRepository.findByEmail.mockResolvedValue(mockUser);
    mockAuthService.comparePassword.mockResolvedValue(true);
    mockAuthService.generateToken.mockReturnValue({ access_token: MOCK_TOKEN });

    loginUser = new LoginUser(
      mockUserRepository as any,
      mockAuthService as any,
    );
  });

  it('should login successfully with valid credentials', async () => {
    const result = await loginUser.execute({
      email: 'john@example.com',
      password: 'password123',
    });

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
      'john@example.com',
    );
    expect(mockAuthService.comparePassword).toHaveBeenCalledWith(
      'password123',
      mockUser.passwordHash,
    );
    expect(mockAuthService.generateToken).toHaveBeenCalledWith(mockUser);

    expect(result.access_token).toBe(MOCK_TOKEN);
    expect(result.user.id).toBe(mockUser.id);
    expect(result.user.email).toBe(mockUser.email);
    expect(result.user.firstName).toBe(mockUser.firstName);
    expect(result.user.lastName).toBe(mockUser.lastName);
  });

  it('should throw UnauthorizedException when user not found', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);

    await expect(
      loginUser.execute({
        email: 'unknown@example.com',
        password: 'password123',
      }),
    ).rejects.toThrow(UnauthorizedException);

    await expect(
      loginUser.execute({
        email: 'unknown@example.com',
        password: 'password123',
      }),
    ).rejects.toThrow('Invalid email or password');

    expect(mockAuthService.comparePassword).not.toHaveBeenCalled();
    expect(mockAuthService.generateToken).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedException when password is incorrect', async () => {
    mockAuthService.comparePassword.mockResolvedValue(false);

    await expect(
      loginUser.execute({
        email: 'john@example.com',
        password: 'wrongpassword',
      }),
    ).rejects.toThrow(UnauthorizedException);

    await expect(
      loginUser.execute({
        email: 'john@example.com',
        password: 'wrongpassword',
      }),
    ).rejects.toThrow('Invalid email or password');

    expect(mockAuthService.generateToken).not.toHaveBeenCalled();
  });
});
