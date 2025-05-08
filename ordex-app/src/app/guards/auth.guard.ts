import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    return this.checkAccess();
  }


  private checkAccess(): boolean {
    const isLoggedIn = this.authService.isAuthenticated;
    const isAdmin = this.authService.hasRole('ADMIN');

    if (isLoggedIn && isAdmin) {
      return true;
    } else {
      this.router.navigate(['/home']);
      return false;
    }
  }
}
