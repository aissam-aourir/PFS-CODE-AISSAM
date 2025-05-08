import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [RouterModule,RouterOutlet],
  templateUrl: './admin-panel.component.html',
})
export class AdminPanelComponent {

  constructor(private authService:AuthService,private router:Router){

  }


  get username(): string {
    return this.authService.email || 'Guest';  // return default if username is not available
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']); 
  }
  

}
