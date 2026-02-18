import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../domain/entities/User.js';
import { IUserRepository } from '../../../domain/repository/IUserRepository.js';
import { UserEntity } from '../entities/User.entity.js';

@Injectable()
export class UserRepositoryAdapter implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  async save(user: User): Promise<void> {
    const entity = new UserEntity();
    entity.id = user.id;
    entity.firstName = user.firstName;
    entity.lastName = user.lastName;
    entity.email = user.email;
    entity.passwordHash = user.passwordHash;
    await this.repo.save(entity);
  }

  async findById(id: string): Promise<User | null> {
    const row = await this.repo.findOne({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await this.repo.findOne({ where: { email } });
    return row ? this.toDomain(row) : null;
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.repo.count({ where: { id } });
    return count > 0;
  }

  private toDomain(row: UserEntity): User {
    return User.create({
      id: row.id,
      firstName: row.firstName,
      lastName: row.lastName,
      email: row.email,
      passwordHash: row.passwordHash,
    });
  }
}
