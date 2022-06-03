import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PreviousRouteService {
  private previousUrl2: string = '';
  private previousUrl: string = '';
  private currentUrl: string = '';

  constructor(private router : Router) { 
    this.currentUrl = this.router.url;
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.previousUrl2 = this.previousUrl;
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
      };
    });
  }
  public getPreviousUrl(){
    return this.previousUrl;
  } 
  public getPreviousUrl2(){
    return this.previousUrl2;
  } 
}
