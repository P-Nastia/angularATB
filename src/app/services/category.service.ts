import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Category} from '../models/Category';
import {Observable} from 'rxjs';

@Injectable({ //як dependency injection
  providedIn: 'root'
})

export class CategoryService {
  private apiUrl='http://localhost:5126/api/';

  constructor(private http: HttpClient) { }

  getCategories() : Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl + 'categories');
  }
}
