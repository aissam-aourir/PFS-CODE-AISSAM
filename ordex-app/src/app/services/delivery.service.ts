import { Injectable } from '@angular/core';
import { AbstractCrudService } from './abstract-crud.service';
import { Delivery } from '../models/delivery';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService extends AbstractCrudService<Delivery> {

  constructor(http: HttpClient) {
    super(http, 'http://localhost:8080/api/deliveries');
  }
}
