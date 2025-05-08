import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getAccessToken(); // Get token from sessionStorage via AuthService

    // const isAuthLoginRequest = req.url.includes('/auth/login');
    
    // const isProductsGetRequest = req.url.includes('/api/products') && req.method === 'GET';

    // const shouldExclude = isAuthLoginRequest || isProductsGetRequest;

    if (token) {
      const clonedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(clonedReq);
    }

    return next.handle(req);
  }
}
