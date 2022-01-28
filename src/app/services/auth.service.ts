import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.baseUrl;

  private privateHeaders = {
    headers: new HttpHeaders({
      'content-type': 'application/json;charset=utf-8',
    }),
  };
  
  constructor(
    private router: Router,
    private http: HttpClient) { }

  login(user: User) {
    return this.http.post<any>(`${environment.baseUrl}api/Users/Login`, user, this.privateHeaders);
  }

  register(user: User) {
    return this.http.post<any>(`${environment.baseUrl}api/Users/Register`, user, this.privateHeaders);
  }  
  logout() {
    // remove user from local storage to log user out
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
  logoutAdmin() {
    // remove user from local storage to log user out
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
  
}
