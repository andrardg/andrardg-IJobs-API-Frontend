import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

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
  getJobDetails(id: any){
    return this.http.get<any>(`${environment.baseUrl}api/Jobs/${id}`, this.privateHeaders);
  }
  removeJob(id: any){
    console.log(`${environment.baseUrl}api/Jobs/${id}`);
     return this.http.delete<any>(`${environment.baseUrl}api/Jobs/${id}`, this.privateHeaders);
  }
  saveJob(Job:any){
    return this.http.put<any>(`${environment.baseUrl}api/Jobs/${Job.id}`, Job, this.privateHeaders);
  }
}
