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
      
      const currentUser = localStorage.getItem('user') || localStorage.getItem('admin');
      if(currentUser){

        //if(route.data[role] && route.data[role].indexOf(localStorage.getItem('role')) === -1)
//logged in so return true
        return true;
      }
      else{
        localStorage.clear();
        this.toastr.clear();
        this.toastr.info("Unauthorized");
        alert('UNAUTHORIZED');
        //this.router.navigate(['/login']);
        return false;
      }
    //       //If token data exist, user may login to application
    // if (localStorage.getItem('token') && localStorage.getItem('role')) {
    //   var role = localStorage.getItem('role');
    //   if(route.data['role'] && role != route.data['role']) {
    //     this.toastr.clear()
    //     this.toastr.info("Unauthorized");
    //     this.router.navigate(['/']);
    //     return false;
    //   }

      //return true;
    }

    // otherwise redirect to login page with the return url
    // this.toastr.clear()
    // this.toastr.info("Login required");
    // this.router.navigate(['/login']);
    // return false;
    // }
  
}
