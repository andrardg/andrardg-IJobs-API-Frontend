import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PrivateService {

  private baseUrl = environment.baseUrl;
  private privateHeader = {
    headers: new HttpHeaders({
      'content-type' : 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    }),
  };
  constructor(private http: HttpClient) { }

  getUsers(){
    //return this.http.get(this.baseUrl + 'api/Users', this.privateHeader);
    return this.http.get<any>(`${environment.baseUrl}api/Users`);
  }

  // getCompanies(){
  //   //return this.http.get(this.baseUrl + 'api/Companies', this.privateHeader);
  //   return this.http.get<any>(`${environment.baseUrl}api/Companies`);
  // }
}
