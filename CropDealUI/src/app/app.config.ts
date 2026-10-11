import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './utils/auth.interceptor';
import { environment } from '../environments/environment';

import { routes } from './app.routes';

// Warm up backend on app start to avoid cold-start delays
fetch(`${environment.monolithicUrl}/api/user/health`, { method: 'GET' }).catch(() =>
  fetch(`${environment.monolithicUrl}/health`, { method: 'GET' }).catch(() => {})
);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withRouterConfig({ onSameUrlNavigation: 'reload' })),
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};
