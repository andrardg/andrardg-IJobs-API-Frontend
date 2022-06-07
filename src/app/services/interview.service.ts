import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InterviewService {
  private baseUrl = environment.baseUrl;
  private privateHeaders = {
    headers: new HttpHeaders({
      'content-type': 'application/json;charset=utf-8',
    }),
  };
  
  constructor(private http: HttpClient) { }
  getInterviews(){
    return this.http.get<any>(`${environment.baseUrl}api/Interviews`, this.privateHeaders);
  }
  getInterviewDetails(id:any){
    return this.http.get<any>(`${environment.baseUrl}api/Interviews/${id}`, this.privateHeaders);
  }
  removeInterview(id:any){
    return this.http.delete<any>(`${environment.baseUrl}api/Interviews/${id}`, this.privateHeaders);
  }
  saveInterview(Interview:any){
    return this.http.put<any>(`${environment.baseUrl}api/Interviews/${Interview.id}`, Interview, this.privateHeaders);
  }
  createInterview(Interview:any){
    return this.http.post<any>(`${environment.baseUrl}api/Interviews`, Interview, this.privateHeaders);
  }
}
