import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Job } from 'app/interfaces/job';
import { environment } from 'environments/environment';
import { CompaniesComponent } from '../companies/companies.component';
import { CompaniesService } from '../companies/companies.service';

@Injectable({
  providedIn: 'root'
})
export class JobsService {

  private baseUrl = environment.baseUrl;

  private privateHeaders = {
    headers: new HttpHeaders({
      'content-type': 'application/json;charset=utf-8',
    }),
  };
  
  constructor(private http: HttpClient) { }

  getJobs(){
    return this.http.get<any>(`${environment.baseUrl}api/Jobs`, this.privateHeaders);
  }
  getCompany(id: any){
    return this.http.get<any>(`${environment.baseUrl}api/Companies/${id}`, this.privateHeaders);
  }
  getJobDetails(id: any){
    return this.http.get<any>(`${environment.baseUrl}api/Jobs/${id}`, this.privateHeaders);
  }
  removeJob(id: any){
     return this.http.delete<any>(`${environment.baseUrl}api/Jobs/${id}`, this.privateHeaders);
  }
  saveJob(Job:any){
    return this.http.put<any>(`${environment.baseUrl}api/Jobs/${Job.id}`, Job, this.privateHeaders);
  }
  createJob(job: Job){
    return this.http.post<any>(`${environment.baseUrl}api/Jobs`, job, this.privateHeaders);
  }
}
