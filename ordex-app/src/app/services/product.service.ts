import { Injectable } from '@angular/core';
import { AbstractCrudService } from './abstract-crud.service';
import { Product } from '../models/product';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends AbstractCrudService<Product> {

  constructor(http: HttpClient) {
    super(http, 'http://localhost:8080/api/products');
  }

    // Override create to use /create endpoint
    override create(entity: Partial<Product>): Observable<Product> {
      return this.http.post<Product>(`${this.apiUrl}/create`, entity);
    }

      // New method to fetch products by supplier ID
  getProductsBySupplier(supplierId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/by-supplier/${supplierId}`);
  }

  getValidProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('http://localhost:8080/api/products/valid');
  }
  
}
