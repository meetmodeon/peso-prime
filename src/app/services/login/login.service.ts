import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { loginRequest, loginResponse } from '../model/login.model';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ApiResponse } from '../model/ApiResponse.model';
import { handleApiResponse } from '../../core/utils/api.utils';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
 

  constructor(private http: HttpClient) {}

  login(payload: loginRequest): Observable<loginResponse> {
    return this.http
      .post<ApiResponse<loginResponse>>(`${environment.apiUrl}/auth/login`, payload)
      .pipe(handleApiResponse());
  }
 
}
