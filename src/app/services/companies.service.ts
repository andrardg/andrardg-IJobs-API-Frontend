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
  private privateHeaders2 = {
    headers: new HttpHeaders({
      //'content-type': 'undefined ',
      'Accept': '*/*',
    }),
  };
  constructor(private http: HttpClient) { }

  getCompanies(){
    return this.http.get<any>(`${environment.baseUrl}api/Companies`, this.privateHeaders);
  }
  getCompaniesByName(Name:string){
    return this.http.get<any>(`${environment.baseUrl}api/Companies/Search/${Name}`, this.privateHeaders);
  }
  getCompanyDetails(id: any){
    return this.http.get<any>(`${environment.baseUrl}api/Companies/${id}`, this.privateHeaders);
  }
  removeCompany(id: any){
    return this.http.delete<any>(`${environment.baseUrl}api/Companies/${id}`, this.privateHeaders);
  }
  saveCompany(id:any, form:any){
    return this.http.put<any>(`${environment.baseUrl}api/Companies/${id}`, form, this.privateHeaders2);
  }
}
