import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Invite } from 'app/classes/invite';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InviteService {
  private baseUrl = environment.baseUrl;

  private privateHeaders = {
    headers: new HttpHeaders({
      'content-type': 'application/json;charset=utf-8',
    }),
  };
  constructor(private http: HttpClient) { }
  
  getInvites(){
    return this.http.get<any>(`${environment.baseUrl}api/invites`, this.privateHeaders);
  }
  getInviteDetails(id: any){
    return this.http.get<any>(`${environment.baseUrl}api/invites/${id}`, this.privateHeaders);
  }
  removeInvite(id: any){
    return this.http.delete<any>(`${environment.baseUrl}api/invites/${id}`, this.privateHeaders);
 }
 createInvite(invite: Invite){
  return this.http.post<any>(`${environment.baseUrl}api/invites`, invite, this.privateHeaders);
}
}
