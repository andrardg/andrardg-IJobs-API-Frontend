import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private baseUrl = environment.baseUrl;

  private privateHeaders = {
    headers: new HttpHeaders({
      'content-type': 'application/json;charset=utf-8',
    }),
  };
  
  constructor(private http: HttpClient) { }
  getUsers(){
    return this.http.get<any>(`${environment.baseUrl}api/Users`, this.privateHeaders);
  }
  getUserDetails(id:any){
    return this.http.get<any>(`${environment.baseUrl}api/Users/${id}`, this.privateHeaders);
  }
  saveUser(User:any){
    return this.http.put<any>(`${environment.baseUrl}api/Users/${User.id}`, User, this.privateHeaders);
  }
  removeUser(id: any){
    //return this.http.delete<void>(this.baseUrl + 'api/Companies/:id');
    console.log(`${environment.baseUrl}api/Users/${id}`);
     return this.http.delete<any>(`${environment.baseUrl}api/Users/${id}`, this.privateHeaders);
  }
}
