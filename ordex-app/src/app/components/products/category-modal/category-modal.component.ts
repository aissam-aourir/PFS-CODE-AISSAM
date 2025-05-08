import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, of } from 'rxjs'; // ✨ import catchError and of
import { Category } from '../../../models/category';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-category-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-modal.component.html'
})
export class CategoryModalComponent {
  @Input() isOpen: boolean = false;
  @Input() categories: Category[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() categoryDeleted = new EventEmitter<number>(); // ✨ changed name to categoryDeleted
  @Output() addCategory = new EventEmitter<string>();

  categoryForm: FormGroup;
  errorMessage: string | null = null; // ✨ error message field

  constructor(private fb: FormBuilder, private categoryService: CategoryService) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.categoryForm.valid) {
      this.addCategory.emit(this.categoryForm.value.name);
      this.categoryForm.reset();
    }
  }

  closeModal() {
    this.close.emit();
  }
}
