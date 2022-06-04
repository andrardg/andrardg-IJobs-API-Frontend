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
    return this.http.post<any>(`${environment.baseUrl}api/Users/Login`, user, this.privateHeaders);
  }
  loginCompany(company: Account) {
    return this.http.post<any>(`${environment.baseUrl}api/Companies/Login`, company, this.privateHeaders);
  }
  register(user: User) {
    return this.http.post<any>(`${environment.baseUrl}api/Users/Register`, user, this.privateHeaders);
  }  
  registerCompany(company: Company){
    return this.http.post<any>(`${environment.baseUrl}api/Companies/Register`, company, this.privateHeaders);
  }
  logout() {
    // remove user from local storage to log user out
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('User');
    sessionStorage.removeItem('Admin');
    sessionStorage.removeItem('Company');
    sessionStorage.removeItem('reloadedBefore');
    sessionStorage.removeItem('name');
    sessionStorage.removeItem('companyId');
    sessionStorage.removeItem('jobId');
    this.router.navigate(['/login']);
  }
  logoutAdmin() {
    // remove user from local storage to log user out
    sessionStorage.clear();
    this.router.navigate(['/dashboard']);
  }
  private isExpired(token: string) {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }
  
  public isAuthenticated(): boolean {
    const token = sessionStorage.getItem('token');

    if (token === null || token === '') {
      sessionStorage.removeItem('User');
      return false;
    }
    else {
      return !this.isExpired(token);
    }
  }
}
