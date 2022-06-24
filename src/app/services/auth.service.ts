import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Account } from 'app/classes/account';
import { Company } from 'app/classes/company';
import { environment } from 'environments/environment';
import { Subject } from 'rxjs';
import { User } from '../classes/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.baseUrl;
  public name = new Subject();
  private privateHeaders = {
    headers: new HttpHeaders({
      'content-type': 'application/json;charset=utf-8',
    }),
  };
  
  constructor(
    private router: Router,
    private http: HttpClient) {
      
     }
  login(user: Account) {
    return this.http.post<any>(`${environment.baseUrl}api/Account/Login`, user, this.privateHeaders);
  }
  register(user: Account) {
    return this.http.post<any>(`${environment.baseUrl}api/Account/Register`, user, this.privateHeaders);
  }  
  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
  private isExpired(token: string) {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }
  public isAuthenticated(): boolean {
    const token = sessionStorage.getItem('token');

    if (token === null || token === '') {
      sessionStorage.clear();
      return false;
    }
    else {
      return !this.isExpired(token);
    }
  }
}
