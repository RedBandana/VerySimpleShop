// core/interceptors/timing.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export const timingInterceptor: HttpInterceptorFn = (req, next) => {
    const startTime = Date.now();

    return next(req).pipe(
        tap(() => {
            const endTime = Date.now();
            console.log(`Request to ${req.url} took ${endTime - startTime}ms`);
        })
    );
};