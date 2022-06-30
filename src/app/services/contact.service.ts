import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private baseUrl = environment.baseUrl;
  private privateHeaders = {
    headers: new HttpHeaders({
      'content-type': 'application/json;charset=utf-8',
    }),
  };
  constructor(private http: HttpClient) { }
  getContacts(){
    return this.http.get<any>(`${environment.baseUrl}api/Contact`, this.privateHeaders);
  }
  removeContact(id:any){
    return this.http.delete<any>(`${environment.baseUrl}api/Contact/${id}`, this.privateHeaders);
  }
  saveContact(Contact:any){
    return this.http.put<any>(`${environment.baseUrl}api/Contact/${Contact.id}`, Contact, this.privateHeaders);
  }
  createContact(Contact:any){
    return this.http.post<any>(`${environment.baseUrl}api/Contact`, Contact, this.privateHeaders);
  }
}
