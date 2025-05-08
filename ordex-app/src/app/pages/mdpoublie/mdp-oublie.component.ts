import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-mdp-oublie',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, ToastrModule],
  templateUrl: './mdp-oublie.component.html'
})
export class MdpOublieComponent {
  forgotPasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    // Initialisation du formulaire
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  handleForgotPassword() {
    if (this.forgotPasswordForm.valid) {
      const { email } = this.forgotPasswordForm.value;
      this.authService.requestPasswordReset(email).subscribe({
        next: (response) => {
          this.toastr.success('Un code de réinitialisation a été envoyé à votre email.', 'Succès', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
            progressBar: true,
            toastClass: 'ngx-toastr toast custom-success-toast',
            titleClass: 'toast-title',
            messageClass: 'toast-message'
          });
          // Redirection vers la page de connexion
          this.router.navigateByUrl('/login');
        },
        error: (error) => {
          this.toastr.error(error.error?.error || 'Échec de l\'envoi du code de réinitialisation. Veuillez réessayer.', 'Erreur', {
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
      this.toastr.error('Veuillez entrer une adresse email valide.', 'Erreur', {
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
