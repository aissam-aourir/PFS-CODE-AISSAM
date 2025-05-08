import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { AbstractCrudService } from './abstract-crud.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService  extends AbstractCrudService<User>{

  constructor(http: HttpClient) {
      super(http, 'http://localhost:8080/api/clients');
    }
}
