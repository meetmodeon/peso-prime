import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService=inject(AuthService);
  const router=inject(Router);
  
  let authReq=req;
  const url=req.url;

  if(url.includes("/login")){
    return next(req);
  }
  const token=authService.getToken();
  if(token != null){
    req =req.clone({
      setHeaders:{
        Authorization:`Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error:HttpErrorResponse)=>{
      if(error.status === 401 ||error.status === 403){
        authService.logout();
        router.navigate(['/login'])
      }
      return throwError(()=>error);
    })
  );
};
