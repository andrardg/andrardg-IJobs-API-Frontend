import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TutorialService {
  private baseUrl = environment.baseUrl;
  private privateHeaders = {
    headers: new HttpHeaders({
      'content-type': 'application/json;charset=utf-8',
    }),
  };
  constructor(private http: HttpClient) { }
  getTutorials(){
    return this.http.get<any>(`${environment.baseUrl}api/Tutorials`, this.privateHeaders);
  }
  getTutorialsFroSubdomain(id:any){
    return this.http.get<any>(`${environment.baseUrl}api/Tutorials/GetAll/${id}`, this.privateHeaders);
  }
  getTutorialDetails(id:any){
    return this.http.get<any>(`${environment.baseUrl}api/Tutorials/${id}`, this.privateHeaders);
  }
  removeTutorial(id:any){
    return this.http.delete<any>(`${environment.baseUrl}api/Tutorials/${id}`, this.privateHeaders);
  }
  saveTutorial(Tutorial:any){
    return this.http.put<any>(`${environment.baseUrl}api/Tutorials/${Tutorial.id}`, Tutorial, this.privateHeaders);
  }
  createTutorial(Tutorial:any){
    return this.http.post<any>(`${environment.baseUrl}api/Tutorials`, Tutorial, this.privateHeaders);
  }
}
