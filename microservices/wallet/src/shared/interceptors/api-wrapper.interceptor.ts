import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common';
import { type Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { type Response } from 'express';

export interface ApiWrapperResponse<T> {
  metadata: {
    timestamp: string;
    status: number;
    path: string;
  };
  data: T;
}

@Injectable()
export class ApiWrapperInterceptor<T>
  implements NestInterceptor<T, ApiWrapperResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiWrapperResponse<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    return next.handle().pipe(
      map((data) => ({
        metadata: {
          timestamp: new Date().toISOString(),
          status: response.statusCode,
          path: request.url ?? request.path,
        },
        data,
      })),
    );
  }
}
