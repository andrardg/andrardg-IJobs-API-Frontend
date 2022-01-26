import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

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
    //return this.http.get(this.baseUrl + 'api/Companies', this.privateHeader);
    return this.http.get<any>(`${environment.baseUrl}api/Companies`, this.privateHeaders);
  }
  getCompanyDetails(id: any){
    return this.http.get<any>(`${environment.baseUrl}api/Companies/${id}`, this.privateHeaders);
  }
  removeCompany(id: any){
    //return this.http.delete<void>(this.baseUrl + 'api/Companies/:id');
    console.log(`${environment.baseUrl}api/Companies/${id}`);
     return this.http.delete<any>(`${environment.baseUrl}api/Companies/${id}`, this.privateHeaders);
  }
  saveCompany(Company:any){
    // const body = { name: Company.name,
    //               email: Company.email,
    //               passwordHash: Company.passwordHash,
    //               address: Company.address,};
    return this.http.put<any>(`${environment.baseUrl}api/Companies/${Company.id}`, Company, this.privateHeaders);
  }
}
