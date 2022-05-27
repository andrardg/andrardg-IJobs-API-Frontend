import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminCompanyGuard implements CanActivate  {
  constructor(
    private router: Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {

      const rights = sessionStorage.getItem('Admin') || sessionStorage.getItem('Company');
      if(rights){
        return true;
      }
      else{
        //sessionStorage.clear();
        alert('UNAUTHORIZED');
        //this.router.navigate(['/login']);
        return false;
      }
  }
  
}

