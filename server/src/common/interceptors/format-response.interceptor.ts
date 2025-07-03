import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class FormatResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    // Logic to be inserted before the route handler

    return next.handle().pipe(
      map((payload: any) => {
        // Logic to transform the response
        const transform = (obj: any) => {
          delete obj.password;
          return obj;
        };

        if (Array.isArray(payload)) {
          return payload.map((item) => transform(item));
        } else if (payload && typeof payload === 'object') {
          return transform(payload);
        } else {
          return payload;
        }
      }),
    );
  }
}
