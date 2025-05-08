import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { routes } from './app.routes';
import { TokenInterceptor } from '../app/interceptors/http.interceptor'; // <-- Import TokenInterceptor
import { HTTP_INTERCEPTORS } from '@angular/common/http'; // <-- Import HTTP_INTERCEPTORS

import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    provideToastr(),
  ]
};
