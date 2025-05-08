import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule,ToastrModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm: FormGroup;

  loginError: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService,private router: Router,private toastr: ToastrService) {
    // Initialize the form
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  handleLogin() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authService.login(username, password).subscribe({
        next: (response) => {
          console.log('JWT Token:', response['access-token']);
          
          // Store token and load user profile
          this.authService.loadProfile(response);
  
          // Check user role
          const roles: string = this.authService.roles;
         
  
          if (roles.includes('ADMIN')) {
            this.router.navigateByUrl('/admin');
          } else if (roles.includes('CLIENT')) {
            this.router.navigateByUrl('/home/main');

          } else if (roles.includes('SUPPLIER')){
            this.router.navigateByUrl('/supplier');
          } else {
            console.error('Unknown role, staying on login page');
          }
          
        },
        error: (error) => {
          this.toastr.error(error.error?.error || 'Invalid username or password', "Error", {
            timeOut: 3000,
            positionClass: 'toast-top-right',
            progressBar: true,
            toastClass: 'ngx-toastr toast custom-error-toast',
            titleClass: 'toast-title',
            messageClass: 'toast-message'
          });
          
          // this.loginError = error.error?.error || 'Invalid username or password';
        }
      });
    } else {
      this.toastr.error('Please fill in all fields.', "Error", {
        timeOut: 3000,
        positionClass: 'toast-top-right',
        progressBar: true,
        toastClass: 'ngx-toastr toast custom-error-toast',
        titleClass: 'toast-title',
        messageClass: 'toast-message'
      });
    }
  }
  
}
