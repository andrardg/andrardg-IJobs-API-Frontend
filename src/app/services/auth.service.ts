import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // private baseUrl : string = environment.baseUrl
  // private publicHeaders = {
  //   headers : new HttpHeaders({
  //     'content-type' : 'application/json',
  //   }),
  // };
  constructor(
    private router: Router,
    private http: HttpClient) { }

  // login(data: User){
  //   return this.http.post(
  //     this.baseUrl+'api/auth/login',
  //     data,
  //     this.publicHeaders
  //     );
  // }
  // register(data: User){
  //   return this.http.post(
  //     this.baseUrl+'api/auth/register',
  //     data,
  //     this.publicHeaders
  //     );
  // }




  login(email: string, password: string) {
    return this.http.post<any>(`${environment.baseUrl}api/Users/Login`, { email, password })
  }

  register(email: string, firstName: string, lastName: string, password: string) {
    return this.http.post<any>(`${environment.baseUrl}api/Users/Register`, { email, firstName, lastName, password})
  }  
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('Token');
    localStorage.removeItem('Role');
    this.router.navigate(['/login']);
  }
  
}
