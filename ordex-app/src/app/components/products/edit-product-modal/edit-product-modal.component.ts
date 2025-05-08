import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Product } from '../../../models/product';
import { Category } from '../../../models/category';


@Component({
  selector: 'app-edit-product-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-product-modal.component.html'
})
export class EditProductModalComponent {

  @Input() isOpen: boolean = false;
  @Input() product?: Product;
  @Input() categories: Category[] = [];
  @Output() updateProduct = new EventEmitter<Product>();
  @Output() close = new EventEmitter<void>();

  productForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      imageURL: ['', [Validators.required]],
      category: ['', [Validators.required]],
    });
  }

  ngOnChanges() {
    if (this.product) {
      this.productForm.patchValue({
        name: this.product.name,
        description: this.product.description,
        price: this.product.price,
        stock: this.product.stock,
        imageURL: this.product.imageURL,
        category: this.product.category.id
      });
    }
  }

  closeModal() {
    this.close.emit();
  }

  onSubmit() {
    if (this.productForm.valid && this.product) {
      const updatedProduct: Product = {
        ...this.product,
        name: this.productForm.value.name,
        description: this.productForm.value.description,
        price: this.productForm.value.price,
        stock: this.productForm.value.stock,
        imageURL: this.productForm.value.imageURL,
        category: this.categories.find(c => c.id === +this.productForm.value.category)!
      };
      this.updateProduct.emit(updatedProduct);
      this.closeModal();
    }
  }
}
