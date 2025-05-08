import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products-page.component.html'
})
export class ProductsPageComponent implements OnInit {
  products: Product[] = [];
  cart: Product[] = [];
  selectedProduct: Product | null = null;
  filteredProducts: Product[] = [];
  searchName: string = '';
  searchPrice: string = '';
  searchCategory: string = '';
  searchSupplier: string = '';

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCartFromLocalStorage();
  }

  loadProducts(): void {
    this.productService.getValidProducts().subscribe({
      next: (data: Product[]) => {
        this.products = this.authService.isUserAuthenticated() ? data : data.slice(0, 10);
        this.filteredProducts = [...this.products]; // Display all products initially
      },
      error: (err) => {
        console.error('Error loading products', err);
      }
    });
  }

  getCartKey(): string {
    return `cart-${this.authService.username || 'guest'}`;
  }

  loadCartFromLocalStorage(): void {
    const key = this.getCartKey();
    const storedCart = localStorage.getItem(key);
    const cart = storedCart ? JSON.parse(storedCart) : [];
    this.cart = cart;
    this.cartService.setCartItems(this.cart);
  }

  addToCart(product: Product): void {
    const existingProduct = this.cart.find(p => p.id === product.id);

    if (!existingProduct) {
      this.cart.push({ ...product, quantity: 1 });
      localStorage.setItem(this.getCartKey(), JSON.stringify(this.cart));
      this.cartService.setCartItems(this.cart);
    } else {
      alert("This product is already in your cart!");
    }
  }

  isInCart(productId: number): boolean {
    return this.cart.some(p => p.id === productId);
  }

  showProductDetails(product: Product): void {
    this.selectedProduct = { ...product };
  }

  closeProductDetails(): void {
    this.selectedProduct = null;
  }

  filterProducts(): void {
    if (!this.products.length) return;

    this.filteredProducts = this.products.filter(product => {
      // Convert search terms to lowercase and trim for case-insensitive comparison
      const nameSearch = this.searchName.toLowerCase().trim();
      const priceSearch = this.searchPrice.toLowerCase().trim();
      const categorySearch = this.searchCategory.toLowerCase().trim();
      const supplierSearch = this.searchSupplier.toLowerCase().trim();

      // Apply filters only if the search term is non-empty
      const matchesName = !nameSearch || product.name?.toLowerCase().includes(nameSearch) || false;
      const matchesPrice = !priceSearch || product.price?.toString().toLowerCase().includes(priceSearch) || false;
      const matchesCategory = !categorySearch || product.category?.name?.toLowerCase().includes(categorySearch) || false;
      const matchesSupplier = !supplierSearch || product.supplier?.username?.toLowerCase().includes(supplierSearch) || false;

      // Product must match all non-empty criteria
      return matchesName && matchesPrice && matchesCategory && matchesSupplier;
    });
  }

  resetSearch(): void {
    this.searchName = '';
    this.searchPrice = '';
    this.searchCategory = '';
    this.searchSupplier = '';
    this.filteredProducts = [...this.products]; // Reset to all products
  }
}
