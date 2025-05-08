import { Component, OnInit } from '@angular/core';
import { Product } from '../../../models/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { RouterModule } from '@angular/router';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './shopping-cart.component.html'
})
export class ShoppingCartComponent implements OnInit {

  cart: Product[] = [];
  private username: string = '';

  constructor(private authService: AuthService,private cartService: CartService) {}

  ngOnInit(): void {
    if (this.authService.isUserAuthenticated()) {
      this.username = this.authService.username;
      this.loadCartFromLocalStorage();
    } else {
      // Optionally handle unauthenticated access
      console.warn('User not authenticated. Cart cannot be loaded.');
    }
  }

  private get cartKey(): string {
    return `cart-${this.username}`;
  }

  loadCartFromLocalStorage(): void {
    const storedCart = localStorage.getItem(this.cartKey);
    this.cart = storedCart ? JSON.parse(storedCart) : [];
  }

  saveCartToLocalStorage(): void {
    localStorage.setItem(this.cartKey, JSON.stringify(this.cart));
  }

  updateQuantity(product: Product, value: string): void {
    const qty = parseInt(value, 10);
    if (!isNaN(qty) && qty > 0 && qty <= product.stock) {
      product.quantity = qty;
      this.saveCartToLocalStorage();
    }
  }

  onQuantityChange(product: Product): void {
    if (product.quantity! <= 0) {
      product.quantity = 1;
    } else if (product.quantity! > product.stock) {
      product.quantity = product.stock; // Ensure quantity doesn't exceed stock
    }
    this.saveCartToLocalStorage();
  }

  get totalPrice(): number {
    return this.cart.reduce(
      (sum, product) => sum + (product.price * (product.quantity || 1)), 0
    );
  }


  removeFromCart(productToRemove: Product): void {
    const confirmed = confirm(`Are you sure you want to remove "${productToRemove.name}" from your cart?`);
    if (confirmed) {
      this.cart = this.cart.filter(p => p.id !== productToRemove.id);
      this.saveCartToLocalStorage();
      this.cartService.setCartItems(this.cart);
    }
  }


}
