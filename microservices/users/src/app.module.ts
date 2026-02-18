import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module.js';
import { UserEntity } from './modules/users/infra/typeorm/entities/User.entity.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_USERS_HOST'),
        port: configService.get('DB_USERS_PORT', 5432),
        username: configService.get('DB_USERS_USER'),
        password: configService.get('DB_USERS_PASSWORD'),
        database: configService.get('DB_USERS_NAME'),
        synchronize: true,
        entities: [UserEntity],
      }),
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
