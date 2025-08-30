import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Category} from '../models/Category';
import {Observable} from 'rxjs';
import {environment} from '../../envs/environment';

@Injectable({ //як dependency injection
  providedIn: 'root'
})

export class CategoryService {

  constructor(private http: HttpClient) { }

  getCategories() : Observable<Category[]> {
    return this.http.get<Category[]>(environment.apiUrl + 'categories');
  }
}
