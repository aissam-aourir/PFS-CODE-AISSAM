import { Injectable } from '@angular/core';
import { AbstractCrudService } from './abstract-crud.service';
import { Category } from '../models/category';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends AbstractCrudService<Category> {

  constructor(http: HttpClient) {
    super(http, 'http://localhost:8080/api/categories');
  }
}
