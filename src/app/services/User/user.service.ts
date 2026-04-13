import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { ApiResponse } from '../model/ApiResponse.model';
import { handleApiResponse } from '../../core/utils/api.utils';

export interface SystemUserResponse{
  username: string;
  name:string;
  email:string;
  userRole:string;
  password:string;
  phone:string;
}

export interface SystemUserRequest{
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http= inject(HttpClient);
  private readonly API_URL= environment.apiUrl;

  getAll(page=0,size=10):Observable<PageResponse<SystemUserResponse>>{
    return this.http.get<ApiResponse<PageResponse<SystemUserResponse>>>(`${this.API_URL}/user`,{
      params:{page,size}
    }).pipe(handleApiResponse());
  }
  addSystemUser(payload:SystemUserRequest):Observable<SystemUserResponse>{
    return this.http.post<ApiResponse<SystemUserResponse>>(`${this.API_URL}/user/add`,payload)
    .pipe(handleApiResponse());
  }

  deleteUserByUsername(username:string):Observable<Map<string,string>>{
    return this.http.delete<ApiResponse<Map<string,string>>>(`${this.API_URL}/user/delete?username=${username}`)
    .pipe(handleApiResponse());
  }

  getUserByUsername(username:string|null):Observable<SystemUserResponse>{
    return this.http.get<ApiResponse<SystemUserResponse>>(`${this.API_URL}/user/getUser?username=${username}`)
    .pipe(handleApiResponse());
  }

  updateSystemUserInfo(username:string,payload:SystemUserRequest):Observable<SystemUserResponse>{
    return this.http.put<ApiResponse<SystemUserResponse>>(`${this.API_URL}/user/update/${username}`,payload)
    .pipe(handleApiResponse())
  }

}
