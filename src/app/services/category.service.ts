import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Category} from '../models/Category';
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

   createCategory(formData: FormData) {
     return this.http.post(environment.apiUrl + 'categories/create', formData)
   }

   getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(environment.apiUrl + `categories/${id}`);
   }

   updateCategory(formData: FormData) {
    console.log("formData edit",formData.values());
    return this.http.put(environment.apiUrl + 'categories/edit', formData)
   }

   deleteCategory(id: number) {
    return this.http.delete(environment.apiUrl + `categories/${id}`);
   }

}
