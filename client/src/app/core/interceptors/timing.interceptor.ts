// core/interceptors/timing.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { LogService } from '../services/log.service';

export const timingInterceptor: HttpInterceptorFn = (req, next) => {
    const startTime = Date.now();
    const logService = new LogService(timingInterceptor.name);

    return next(req).pipe(
        tap(() => {
            const endTime = Date.now();
            logService.log(`Request to ${req.url} took ${endTime - startTime}ms`);
        })
    );
};