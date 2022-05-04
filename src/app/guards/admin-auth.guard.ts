import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private toastr: ToastrService){}

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
        this.toastr.clear();
        this.toastr.info("Unauthorized");
        alert('UNAUTHORIZED');
        //this.router.navigate(['/login']);
        return false;
      }
  }
  
}
