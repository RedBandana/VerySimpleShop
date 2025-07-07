// core/interceptors/caching.interceptor.ts
import { HttpEvent, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';

// Interface definition outside the interceptor
interface CacheEntry {
    response: HttpResponse<any>;
    entryTime: number;
}

// Cache and constants as module-level variables
const CACHE_MAX_AGE = 5 * 60 * 1000; // 5 minutes in milliseconds
const cache = new Map<string, CacheEntry>();

// Helper functions
const createCacheKey = (req: HttpRequest<any>): string => {
    return `${req.urlWithParams}|${JSON.stringify(req.body || {})}`;
};

const getFromCache = (key: string): HttpResponse<any> | null => {
    const entry = cache.get(key);

    if (!entry) {
        return null;
    }

    // Check if cache entry has expired
    const isExpired = (Date.now() - entry.entryTime) > CACHE_MAX_AGE;
    if (isExpired) {
        cache.delete(key);
        return null;
    }

    return entry.response;
};

const addToCache = (key: string, response: HttpResponse<any>): void => {
    // Don't cache error responses
    if (response.status >= 400) {
        return;
    }

    const entry: CacheEntry = {
        response: response,
        entryTime: Date.now()
    };

    // Clean up old entries if cache gets too large
    if (cache.size > 100) {
        const oldestKey = [...cache.keys()][0];
        cache.delete(oldestKey);
    }

    cache.set(key, entry);
};

// The functional interceptor
export const cachingInterceptor: HttpInterceptorFn = (req, next) => {
    // Only cache GET requests that are explicitly marked as cacheable
    if (req.method !== 'GET' || req.headers.get('x-disable-cache') === 'true') {
        return next(req);
    }

    const cacheKey = createCacheKey(req);
    const cachedResponse = getFromCache(cacheKey);

    if (cachedResponse) {
        return of(cachedResponse);
    }

    return next(req).pipe(
        tap(event => {
            if (event instanceof HttpResponse) {
                addToCache(cacheKey, event);
            }
        })
    );
};