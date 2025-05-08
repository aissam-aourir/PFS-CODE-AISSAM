import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-verify-code',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, ToastrModule],
  templateUrl: './verify-code.component.html'
})
export class VerifyCodeComponent {
  verifyCodeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    // Initialisation du formulaire
    this.verifyCodeForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  handleVerifyCode() {
    if (this.verifyCodeForm.valid) {
      const { code } = this.verifyCodeForm.value;
      this.authService.verifyResetCode(code).subscribe({
        next: (response) => {
          this.toastr.success('Code vérifié avec succès. Vous pouvez maintenant réinitialiser votre mot de passe.', 'Succès', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
            progressBar: true,
            toastClass: 'ngx-toastr toast custom-success-toast',
            titleClass: 'toast-title',
            messageClass: 'toast-message'
          });
          // Redirection vers une page de réinitialisation de mot de passe (à créer plus tard)
          this.router.navigateByUrl('/reset-password');
        },
        error: (error) => {
          this.toastr.error(error.error?.error || 'Échec de la vérification du code. Veuillez réessayer.', 'Erreur', {
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
      this.toastr.error('Veuillez entrer un code valide (6 chiffres).', 'Erreur', {
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
