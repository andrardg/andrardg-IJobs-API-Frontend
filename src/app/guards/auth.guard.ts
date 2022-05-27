import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot){
      
      const currentUser = sessionStorage.getItem('User') || sessionStorage.getItem('Admin') || sessionStorage.getItem('Company');
      console.log(currentUser);
      if(currentUser){

        //logged in so return true
        return true;
      }
      else{
        sessionStorage.clear();
        alert('UNAUTHORIZED');
        this.router.navigate(['/login']);
        return false;
      }
    }
}
