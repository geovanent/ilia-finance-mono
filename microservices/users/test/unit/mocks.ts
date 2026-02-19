import { User } from '@/modules/users/domain/entities/User';

export const MOCK_USER_ID = '22222222-2222-2222-2222-222222222222';
export const MOCK_TOKEN = 'mock-jwt-access-token';

export const mockUser = User.create({
  id: MOCK_USER_ID,
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  passwordHash: '$2b$10$hashedpassword',
});

export const mockUserRepository = {
  save: jest.fn().mockResolvedValue(undefined),
  findById: jest.fn().mockResolvedValue(null),
  findByEmail: jest.fn().mockResolvedValue(null),
  exists: jest.fn().mockResolvedValue(false),
};

export const mockAuthService = {
  generateToken: jest.fn().mockReturnValue({ access_token: MOCK_TOKEN }),
  hashPassword: jest.fn().mockResolvedValue('$2b$10$hashedpassword'),
  comparePassword: jest.fn().mockResolvedValue(true),
};
