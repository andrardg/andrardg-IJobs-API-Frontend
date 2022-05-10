import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //Get Token data from local storage
    let tokenInfo = JSON.parse(JSON.stringify(sessionStorage.getItem('token')) || '{}');
    console.log(tokenInfo)
    if (tokenInfo) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${tokenInfo}`
        }
      });
    }

    return next.handle(request);
  }
}
