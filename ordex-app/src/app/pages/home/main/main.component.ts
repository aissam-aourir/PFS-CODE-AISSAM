import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Product } from '../../../models/product';
import { ProductService } from '../../../services/product.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main.component.html'
})
export class MainComponent implements OnInit {

  products: Product[] = [];

  constructor(private productService: ProductService,public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  showDropdown = false;
  
  loadProducts(): void {
    this.productService.getValidProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data.slice(0, 10); // already filtered from backend
      },
      error: (err) => {
        console.error('Error loading valid products', err);
      }
    });
  }
  

  handleAddToCart(product: Product): void {
    if (this.authService.isUserAuthenticated()) {
      console.log('added', product);
      // Optional: Add to cart logic here
    } else {
      this.router.navigate(['/login']);
    }
  }
  

}
