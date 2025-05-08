import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedSupplierGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    return this.checkAccess();
  }

  private checkAccess(): boolean {
    const isLoggedIn = this.authService.isUserAuthenticated();
    const isSupplier = this.authService.hasRole('SUPPLIER');

    if (isLoggedIn && isSupplier) {
      return true;
    } else {
      this.router.navigate(['/home']);
      return false;
    }
  }
}
