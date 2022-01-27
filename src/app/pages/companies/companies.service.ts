import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {

  private baseUrl = environment.baseUrl;

  private privateHeaders = {
    headers: new HttpHeaders({
      'content-type': 'application/json;charset=utf-8',
    }),
  };
  
  constructor(private http: HttpClient) { }

  getCompanies(){
    return this.http.get<any>(`${environment.baseUrl}api/Companies`, this.privateHeaders);
  }
  getCompanyDetails(id: any){
    return this.http.get<any>(`${environment.baseUrl}api/Companies/${id}`, this.privateHeaders);
  }
  removeCompany(id: any){
    console.log(`${environment.baseUrl}api/Companies/${id}`);
    return this.http.delete<any>(`${environment.baseUrl}api/Companies/${id}`, this.privateHeaders);
  }
  saveCompany(Company:any){
    return this.http.put<any>(`${environment.baseUrl}api/Companies/${Company.id}`, Company, this.privateHeaders);
  }
}
