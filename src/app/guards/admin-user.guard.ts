import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminUserGuard implements CanActivate  {
  constructor(
    private router: Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {

      const rights = sessionStorage.getItem('Admin') || sessionStorage.getItem('User');
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

