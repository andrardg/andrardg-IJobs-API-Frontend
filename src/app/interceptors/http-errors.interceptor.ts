import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class HttpErrorsInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log(request);
    return next.handle(request).pipe(catchError((error:HttpErrorResponse)=> {
      //console.log(error.status, error.error.message)

      if(error.status == 500){
        console.log(error.message);
        //alert('EROARE 500');
      }

      if(error.status == 400){
        //location.reload();
      }

      if(error.status == 401){
        this.authService.logout();
      }
      if(error.status == 403){
        //window.location.reload();
        alert('Nu aveti permisiuni');
      }
      return throwError(error)
    }));
  }
}
