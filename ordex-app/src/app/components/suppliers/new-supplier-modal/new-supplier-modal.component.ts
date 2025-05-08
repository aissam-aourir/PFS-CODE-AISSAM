import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../models/user'; // adjust the path if needed

@Component({
  selector: 'app-new-supplier-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-supplier-modal.component.html',
})
export class NewSupplierModalComponent {
  @Input() isOpen = false;
  @Output() createSupplier = new EventEmitter<User>();
  @Output() close = new EventEmitter<void>();

  supplierForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.supplierForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required], // ✅ added password
      email: ['', [Validators.required, Validators.email]]
    });
  }

  submit() {
    if (this.supplierForm.valid) {
      const supplier: User = {
        username: this.supplierForm.value.username,
        password: this.supplierForm.value.password,
        email: this.supplierForm.value.email
      };
      this.createSupplier.emit(supplier);     
      this.supplierForm.reset({
        role: 'SUPPLIER' // reset form and set default role again
      });
    }
  }

  closeModal() {
    this.close.emit();
    this.supplierForm.reset({
      role: 'SUPPLIER'
    });
  }
}
