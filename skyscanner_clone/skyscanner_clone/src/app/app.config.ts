import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Enable zone-based change detection with event coalescing for better performance
    provideZoneChangeDetection({ eventCoalescing: true }),
    
    // Provide router with our routes configuration
    provideRouter(routes),
    
    // Provide HTTP Client with fetch API (Angular 21 best practice)
    provideHttpClient(withFetch())
  ]
};