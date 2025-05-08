import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouteReuseStrategy, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule,ToastrModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder,private authService: AuthService,private router: Router,private toastr: ToastrService) {
    // Initialize the form
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  handleRegister() {
    if (this.registerForm.valid) {
      const { username, email, password } = this.registerForm.value;
      this.authService.register(username, email, password).subscribe({
        next: (response) => {
          this.toastr.success("Registration Successful",'', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
            progressBar: true,
            toastClass: 'ngx-toastr toast toast-success rounded shadow-sm w-72',
          });
          // Store token and load user profile
          this.authService.loadProfile(response);
          this.router.navigateByUrl('/home/main');
        },
        error: (error) => {
          this.toastr.error(error, 'Registration Failed', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
            progressBar: true,
            toastClass: 'ngx-toastr toast custom-error-toast',
            titleClass: 'toast-title',
            messageClass: 'toast-message'
          });
          
        }
      });
    } else {
      this.toastr.error('Form is not valid', 'Error', {
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
