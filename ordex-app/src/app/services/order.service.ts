import { Injectable } from '@angular/core';
import { AbstractCrudService } from './abstract-crud.service';
import { Order } from '../models/order';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService extends AbstractCrudService<Order> {
  private readonly baseUrl = 'http://localhost:8080/api/orders';

  constructor(private httpClient: HttpClient) {
    super(httpClient, 'http://localhost:8080/api/orders');
  }

  placeOrder(orderData: any): Observable<any> {
    return this.httpClient.post(this.baseUrl, orderData);
  }

  getOrders(): Observable<Order[]> {
    return this.httpClient.get<Order[]>(this.baseUrl);
  }

  updateOrder(order: any): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}/${order.id}`, order.status);
  }
}
