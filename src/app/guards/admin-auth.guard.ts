import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {
  constructor(
    private router: Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {

      const admin = sessionStorage.getItem('Admin');
      if(admin){
        //admin logged in is true
      return true;
      }
      else{
        sessionStorage.clear();
        alert('UNAUTHORIZED');
        this.router.navigate(['/dashboard']);
        return false;
      }
  }
  
}
