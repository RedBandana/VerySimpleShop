// core/interceptors/api-prefix.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const apiPrefixInterceptor: HttpInterceptorFn = (req, next) => {
    // Skip prefixing for absolute URLs or URLs that should bypass this interceptor
    if (req.url.startsWith('http') || req.url.startsWith('assets/')) {
        return next(req);
    }

    // Ensure URL format is correct with slashes
    const apiUrl = environment.apiUrl.endsWith('/')
        ? environment.apiUrl
        : `${environment.apiUrl}/`;

    const url = req.url.startsWith('/')
        ? req.url.substring(1)
        : req.url;

    const apiReq = req.clone({ url: `${apiUrl}${url}` });
    return next(apiReq);
};