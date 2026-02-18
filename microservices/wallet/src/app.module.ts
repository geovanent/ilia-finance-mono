import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './shared/auth/auth.module.js';
import { JwtAuthGuard } from './shared/auth/jwt-auth.guard.js';
import { ApiWrapperInterceptor } from './shared/interceptors/api-wrapper.interceptor.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_INTERCEPTOR, useClass: ApiWrapperInterceptor },
  ],
})
export class AppModule {}
