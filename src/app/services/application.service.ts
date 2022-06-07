import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private baseUrl = environment.baseUrl;
  private privateHeaders = {
    headers: new HttpHeaders({
      'content-type': 'application/json;charset=utf-8',
    }),
  };
  
  constructor(private http: HttpClient) { }
  getApplications(){
    return this.http.get<any>(`${environment.baseUrl}api/Applications`, this.privateHeaders);
  }
  getApplicationDetails(id:any){
    return this.http.get<any>(`${environment.baseUrl}api/Applications/${id}`, this.privateHeaders);
  }
  removeApplication(id:any){
    return this.http.delete<any>(`${environment.baseUrl}api/Applications/${id}`, this.privateHeaders);
  }
  saveApplication(Application:any){
    return this.http.put<any>(`${environment.baseUrl}api/Applications/${Application.id}`, Application, this.privateHeaders);
  }
  createApplication(Application:any){
    return this.http.post<any>(`${environment.baseUrl}api/Applications`, Application, this.privateHeaders);
  }
}
