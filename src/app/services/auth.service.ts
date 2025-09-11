import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {AuthToken} from '../models/Auth';

@Injectable({ //як dependency injection
  providedIn: 'root'
})

export class AuthService {

  constructor(private http: HttpClient) { }

  register(formData: FormData): Observable<AuthToken> {
    return this.http.post<AuthToken>(environment.apiUrl + 'account/register', formData)
  }


}
