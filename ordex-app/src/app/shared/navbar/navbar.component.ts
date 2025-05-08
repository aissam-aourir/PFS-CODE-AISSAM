import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
  showDropdown = false;
  cartItemCount = 0;

  constructor(public authService: AuthService, private router: Router,  private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cartCount$.subscribe(count => {
      this.cartItemCount = count;
    });
  
    // Load from local storage on first init
    this.updateCartItemCount();
  }

  updateCartItemCount(): void {
    if (this.authService.isUserAuthenticated()) {
      const username = this.authService.username;
      const cartKey = `cart-${username}`;
      const storedCart = localStorage.getItem(cartKey);
      const cart: Product[] = storedCart ? JSON.parse(storedCart) : [];
  
      this.cartItemCount = cart.reduce((count, product) => count + (product.quantity || 0), 0);
      this.cartService.setCartItems(cart); // 🟡 keep sync
    }
  }

  logout(): void {
    this.authService.logout();
    this.showDropdown = false;
  }
}
