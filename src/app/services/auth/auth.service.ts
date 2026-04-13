import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';

export interface MyJwtPayload extends JwtPayload{
  sub?:string;
  authorities?:string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isLoggedInSubject= new BehaviorSubject<boolean>(false);
  isLoggedIn$=this.isLoggedInSubject.asObservable();
  
  constructor(
    private http:HttpClient,
    private route:Router
  ) { 
    this.restoreLoginState()
  }

  private restoreLoginState(){
    const token=localStorage.getItem('token');
    if(token){
      this.isLoggedInSubject.next(true);
    }
  }

  saveToken(token:string):void{
    localStorage.removeItem('token');
    localStorage.setItem('token',token);
  }

  getToken():string|null{
    return localStorage.getItem('token');
  }

  logout():void{
    window.localStorage.removeItem('token');
    this.isLoggedInSubject.next(false);
    this.route.navigate(['/login']);
  }

  private decodeToken():MyJwtPayload|null{
    const token=this.getToken();
    if(!token) return null;

    try{
      return jwtDecode<JwtPayload>(token);
    }catch(e){
      return null;
    }
  }

  getUsername():string|null{
    return this.decodeToken()?.sub??null;
  }

  getUserRole():string[]{
    return this.decodeToken()?.authorities??[];
  }
  
  isAdmin():boolean{
    if(this.getUserRole().includes('ADMIN')){
      return true;
    }
    return false;
  }

  isLoggedIn():boolean{
    const token=this.getToken();

    if(!token) return false;

    const decoded =this.decodeToken();

    if(!decoded || !decoded?.exp) return false;

    const isExpired=Date.now() >= decoded.exp *1000;
    return !isExpired;
  }

  hasRole(role:string):boolean{
    return this.getUserRole().includes(role);
  }
}
