// services/cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: Product[] = [];
  private cartCount = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCount.asObservable();

  constructor() {}

  setCartItems(items: Product[]) {
    this.cartItems = items;
    this.updateCartCount();
  }

  addToCart(product: Product) {
    const existing = this.cartItems.find(p => p.id === product.id);
    if (!existing) {
      this.cartItems.push({...product, quantity: 1});
      this.updateCartCount();
    }
  }

  getCartItems(): Product[] {
    return this.cartItems;
  }

  updateCartCount() {
    const count = this.cartItems.reduce((sum, p) => sum + (p.quantity || 0), 0);
    this.cartCount.next(count);
  }
}
