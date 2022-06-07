import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubdomainService {
  private baseUrl = environment.baseUrl;
  private privateHeaders = {
    headers: new HttpHeaders({
      'content-type': 'application/json;charset=utf-8',
    }),
  };
  constructor(private http: HttpClient) { }
  getSubdomains(){
    return this.http.get<any>(`${environment.baseUrl}api/Subdomains`, this.privateHeaders);
  }
  getSubdomainsFromDomain(id:any){
    return this.http.get<any>(`${environment.baseUrl}api/Subdomains/GetAll/${id}`, this.privateHeaders);
  }
  getSubdomainDetails(id:any){
    return this.http.get<any>(`${environment.baseUrl}api/Subdomains/${id}`, this.privateHeaders);
  }
  removeSubdomain(id:any){
    return this.http.delete<any>(`${environment.baseUrl}api/Subdomains/${id}`, this.privateHeaders);
  }
  saveSubdomain(Subdomain:any){
    return this.http.put<any>(`${environment.baseUrl}api/Subdomains/${Subdomain.id}`, Subdomain, this.privateHeaders);
  }
  createSubdomain(Subdomain:any){
    return this.http.post<any>(`${environment.baseUrl}api/Subdomains`, Subdomain, this.privateHeaders);
  }
}
