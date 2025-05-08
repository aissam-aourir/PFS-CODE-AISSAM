import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-supplier-panel',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './supplier-panel.component.html'
})
export class SupplierPanelComponent {

  constructor(private authService: AuthService, private router: Router) {}

  get username(): string {
    return this.authService.username || 'Supplier';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
