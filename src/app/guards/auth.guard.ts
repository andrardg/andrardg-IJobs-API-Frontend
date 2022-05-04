import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private toastr: ToastrService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot){
      
      const currentUser = sessionStorage.getItem('User') || sessionStorage.getItem('Admin');
      console.log(currentUser);
      if(currentUser){

        //logged in so return true
        return true;
      }
      else{
        sessionStorage.clear();
        this.toastr.clear();
        this.toastr.info("Unauthorized");
        alert('UNAUTHORIZED');
        this.router.navigate(['/login']);
        return false;
      }
    }
}
