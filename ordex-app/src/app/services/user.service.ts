import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { AbstractCrudService } from './abstract-crud.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService  extends AbstractCrudService<User>{
  private blockUserUrl = 'http://localhost:8080/auth/block'; 
  private unBlockUserUrl = 'http://localhost:8080/auth/unblock'; 
  constructor(http: HttpClient) {
      super(http, 'http://localhost:8080/api/suppliers');
    }

  // Block user
  blockUser(username: string): Observable<any> {
    return this.http.put<any>(`${this.blockUserUrl}/${username}`, {});
  }
  unblockUser(username: string): Observable<any> {
    return this.http.put<any>(`${this.unBlockUserUrl}/${username}`, {});
  }
  
  
}
