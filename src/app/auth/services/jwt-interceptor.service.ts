import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthToken } from '../models/token';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptorService implements HttpInterceptor{

  private _authService: AuthService;
  
  constructor(private injector: Injector) {
  }
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    var token: AuthToken = this.authService.getCurrentToken;
    if(token && token.isValid()) {            
      const JWT = `Bearer ${token.token()}`;
      //console.log("yes" + JWT);
      req = req.clone({
        setHeaders: {
          Authorization: JWT,
        },
      });      
    }
    return next.handle(req);
  }

  private get authService(): AuthService {
    if(!this._authService) {
      this._authService = this.injector.get(AuthService);
    }
    return this._authService;
  }

}
