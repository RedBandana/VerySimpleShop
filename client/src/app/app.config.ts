import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, SecurityContext } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { MARKED_OPTIONS, MarkdownModule, MarkedOptions, MarkedRenderer } from 'ngx-markdown';
import { Language } from './core/enums/language.enum';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { apiPrefixInterceptor } from './core/interceptors/api-prefix.interceptor';
import { cachingInterceptor } from './core/interceptors/caching.interceptor';
import { timingInterceptor } from './core/interceptors/timing.interceptor';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

export function markedOptionsFactory(): MarkedOptions {
  const renderer = new MarkedRenderer();

  renderer.heading = ({ tokens, depth }: { tokens: any[]; depth: number }) => {
    const text = tokens.map(token => token.raw || token.text || '').join('');
    const escapedText = text
      .toLowerCase()
      .replace(/[^a-zA-Z0-9À-ÿ\s]/g, '|')
      .replace('||39|', '')
      .replace('|', '')
      .replace(/\s+/g, '-');
    return `<h${depth} id="${escapedText}">${text}</h${depth}>`;
  };

  return {
    renderer: renderer,
    gfm: true,
    breaks: true,
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
      }),
    ),
    provideClientHydration(withEventReplay()),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        apiPrefixInterceptor,
        cachingInterceptor,
        timingInterceptor
      ])
    ),
    importProvidersFrom(
      CommonModule,
      BrowserModule,
      FormsModule,
      ReactiveFormsModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
        defaultLanguage: Language.ENGLISH,
      }),
      MarkdownModule.forRoot({
        sanitize: SecurityContext.NONE,
        markedOptions: {
          provide: MARKED_OPTIONS,
          useFactory: markedOptionsFactory,
        },
      }),
    )
  ]
};
