import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Category, CreateCategory} from '../models/Category';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({ //як dependency injection
  providedIn: 'root'
})

export class CategoryService {

  constructor(private http: HttpClient) { }

  getCategories() : Observable<Category[]> {
    return this.http.get<Category[]>(environment.apiUrl + 'categories');
  }

  // createCategory(category:CreateCategory):Observable<Category> {
  //   return this.http.post<CreateCategory>(environment.apiUrl + 'categories/create', category)
  // }

}
