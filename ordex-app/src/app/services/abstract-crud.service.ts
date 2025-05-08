import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export abstract class AbstractCrudService<T> {

  constructor(
    protected http: HttpClient,
    protected apiUrl: string
  ) {}

  create(entity: Partial<T>): Observable<T> {
    return this.http.post<T>(this.apiUrl, entity);
  }

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.apiUrl);
  }

  getById(id: number): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${id}`);
  }

  update(id: number, entity: T): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${id}`, entity);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
