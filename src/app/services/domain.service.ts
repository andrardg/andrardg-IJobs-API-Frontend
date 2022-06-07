import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DomainService {
  private baseUrl = environment.baseUrl;
  private privateHeaders = {
    headers: new HttpHeaders({
      'content-type': 'application/json;charset=utf-8',
    }),
  };
  constructor(private http: HttpClient) { }
  getDomains(){
    return this.http.get<any>(`${environment.baseUrl}api/Domains`, this.privateHeaders);
  }
  getDomainDetails(id:any){
    return this.http.get<any>(`${environment.baseUrl}api/Domains/${id}`, this.privateHeaders);
  }
  removeDomain(id:any){
    return this.http.delete<any>(`${environment.baseUrl}api/Domains/${id}`, this.privateHeaders);
  }
  saveDomain(Domain:any){
    return this.http.put<any>(`${environment.baseUrl}api/Domains/${Domain.id}`, Domain, this.privateHeaders);
  }
  createDomain(Domain:any){
    return this.http.post<any>(`${environment.baseUrl}api/Domains`, Domain, this.privateHeaders);
  }
}
