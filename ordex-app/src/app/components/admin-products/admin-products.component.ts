import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-products.component.html',
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  currentPage = 1;
  itemsPerPage = 6;
  searchName: string = '';
  searchPrice: number | '' = '';
  searchCategory: string = '';
  searchSupplier: string = '';
  searchStock: number | '' = '';

  constructor(
    private productService: ProductService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data;
        this.searchProducts(); // Trigger search to initialize filtered products
      },
      error: (err) => {
        console.error('Error loading products', err);
      }
    });
  }

  searchProducts(): void {
    this.currentPage = 1; // Reset to the first page when searching
  }

  get paginatedProducts(): Product[] {
    // Filter products based on the search criteria
    let filteredProducts = this.products;

    if (this.searchName || this.searchPrice !== '' || this.searchCategory || this.searchSupplier || this.searchStock !== '') {
      filteredProducts = this.products.filter(product => {
        const nameSearch = this.searchName.toLowerCase().trim();
        const priceSearch = this.searchPrice;
        const categorySearch = this.searchCategory.toLowerCase().trim();
        const supplierSearch = this.searchSupplier.toLowerCase().trim();
        const stockSearch = this.searchStock;

        const matchesName = !nameSearch || product.name?.toLowerCase().includes(nameSearch) || false;
        const matchesPrice = priceSearch === '' || (typeof priceSearch === 'number' && product.price === priceSearch) || false;
        const matchesCategory = !categorySearch || product.category?.name?.toLowerCase().includes(categorySearch) || false;
        const matchesSupplier = !supplierSearch || (product.supplier?.username?.toLowerCase() || 'N/A').includes(supplierSearch) || false;
        const matchesStock = stockSearch === '' || (typeof stockSearch === 'number' && product.stock === stockSearch) || false;

        return matchesName && matchesPrice && matchesCategory && matchesSupplier && matchesStock;
      });
    }

    // Paginate the filtered products
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    // Calculate total pages based on filtered products
    let filteredProducts = this.products;

    if (this.searchName || this.searchPrice !== '' || this.searchCategory || this.searchSupplier || this.searchStock !== '') {
      filteredProducts = this.products.filter(product => {
        const nameSearch = this.searchName.toLowerCase().trim();
        const priceSearch = this.searchPrice;
        const categorySearch = this.searchCategory.toLowerCase().trim();
        const supplierSearch = this.searchSupplier.toLowerCase().trim();
        const stockSearch = this.searchStock;

        const matchesName = !nameSearch || product.name?.toLowerCase().includes(nameSearch) || false;
        const matchesPrice = priceSearch === '' || (typeof priceSearch === 'number' && product.price === priceSearch) || false;
        const matchesCategory = !categorySearch || product.category?.name?.toLowerCase().includes(categorySearch) || false;
        const matchesSupplier = !supplierSearch || (product.supplier?.username?.toLowerCase() || 'N/A').includes(supplierSearch) || false;
        const matchesStock = stockSearch === '' || (typeof stockSearch === 'number' && product.stock === stockSearch) || false;

        return matchesName && matchesPrice && matchesCategory && matchesSupplier && matchesStock;
      });
    }

    return Math.ceil(filteredProducts.length / this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  validateProduct(product: Product): void {
    if (!product.id) return;

    const confirmValidation = window.confirm('Are you sure you want to validate this product?');

    if (confirmValidation) {
      const updatedProduct = { ...product, isValidByAdmin: true };

      this.productService.update(product.id, updatedProduct).subscribe({
        next: () => {
          this.toastr.success("Product is valid now", "Product validated", {
            timeOut: 3000,
            positionClass: 'toast-top-right',
            progressBar: true,
            toastClass: 'ngx-toastr toast toast-success rounded shadow-sm w-72',
          });
          this.loadProducts();
        },
        error: (err) => {
          this.toastr.error("Validation failed", "Error", {
            timeOut: 3000,
            positionClass: 'toast-top-right',
            progressBar: true,
            toastClass: 'ngx-toastr toast toast-danger rounded shadow-sm w-72',
          });
        }
      });
    } else {
      console.log('Product validation canceled by the user');
    }
  }

  deleteProduct(id?: number): void {
    if (!id) {
      alert('Product ID is missing');
      return;
    }

    const confirmDelete = confirm('Are you sure you want to delete this product?');
    if (!confirmDelete) {
      return;
    }

    this.productService.delete(id).subscribe({
      next: () => {
        this.loadProducts();
      },
      error: (err) => {
        console.error('Error deleting product', err);
      }
    });
  }

  resetSearch(): void {
    this.searchName = '';
    this.searchPrice = '';
    this.searchCategory = '';
    this.searchSupplier = '';
    this.searchStock = '';
    this.currentPage = 1;
    this.searchProducts(); // Trigger search to reset filtered products
  }
}
