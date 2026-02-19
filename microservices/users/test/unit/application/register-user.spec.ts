import { ConflictException } from '@nestjs/common';
import { RegisterUser } from '@/modules/users/application/use-cases/RegisterUser';
import {
  mockAuthService,
  mockUser,
  mockUserRepository,
  MOCK_TOKEN,
} from '../mocks';

describe('RegisterUser', () => {
  let registerUser: RegisterUser;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockAuthService.hashPassword.mockResolvedValue('$2b$10$hashedpassword');
    mockAuthService.generateToken.mockReturnValue({ access_token: MOCK_TOKEN });

    registerUser = new RegisterUser(
      mockUserRepository as any,
      mockAuthService as any,
    );
  });

  it('should register a new user successfully', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);

    const result = await registerUser.execute({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
    });

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
      'john@example.com',
    );
    expect(mockAuthService.hashPassword).toHaveBeenCalledWith('password123');
    expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
    expect(mockAuthService.generateToken).toHaveBeenCalledTimes(1);

    expect(result.access_token).toBe(MOCK_TOKEN);
    expect(result.user.email).toBe('john@example.com');
    expect(result.user.firstName).toBe('John');
    expect(result.user.lastName).toBe('Doe');
    expect(result.user.id).toBeDefined();
  });

  it('should throw ConflictException if email already exists', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(mockUser);

    await expect(
      registerUser.execute({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      }),
    ).rejects.toThrow(ConflictException);

    await expect(
      registerUser.execute({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      }),
    ).rejects.toThrow('Email already registered');

    expect(mockUserRepository.save).not.toHaveBeenCalled();
    expect(mockAuthService.hashPassword).not.toHaveBeenCalled();
  });
});
