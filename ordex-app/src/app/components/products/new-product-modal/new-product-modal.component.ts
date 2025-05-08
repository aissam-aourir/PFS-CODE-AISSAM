import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { Category } from '../../../models/category';
import { Product } from '../../../models/product';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-new-product-modal',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './new-product-modal.component.html'
})
export class NewProductModalComponent {

  @Input() isOpen: boolean = false;
  @Input() categories: Category[] = [];
  @Input() product?: Product;
  @Output() createProduct = new EventEmitter<Product>();
  @Output() close = new EventEmitter<void>();


  productForm: FormGroup;

  constructor(private fb: FormBuilder,private authService:AuthService) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      imageURL: ['', [Validators.required]],
      category: ['', [Validators.required]],
    });
  }

  closeModal() {
    this.close.emit();
    this.productForm.reset();
  }

  onSubmit() {
    if (this.productForm.valid) {
      const selectedCategoryId = this.productForm.value.category;
      const selectedCategory = this.categories.find(cat => cat.id === +selectedCategoryId);
      
    // Now create a full Product object
    const newProduct: Product = {
      name: this.productForm.value.name,
      description: this.productForm.value.description,
      price: this.productForm.value.price,
      stock: this.productForm.value.stock,
      imageURL: this.productForm.value.imageURL,
      isValidByAdmin:false,
      supplier: { userId: this.authService.userId },
      // createdAt: new Date().toISOString(), // default to now managed on backend don't need it here 
      category: selectedCategory! // you can use `!` if you're sure it exists
    };
      this.createProduct.emit(newProduct);
      this.productForm.reset();
      this.closeModal();
    }
  }

}
