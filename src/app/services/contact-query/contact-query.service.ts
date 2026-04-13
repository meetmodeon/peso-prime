import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  AdminReplyRequest,
  ContactQueryRequest,
  ContactQueryResponse,
  UpdateQueryStatusRequest,
} from '../model/contact-query.model';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ApiResponse } from '../model/ApiResponse.model';
import { PageResponse } from '../User/user.service';
import { QueryStatus } from '../model/FileType.model';

@Injectable({
  providedIn: 'root',
})
export class ContactQueryService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  addContactQuery(
    request: ContactQueryRequest,
  ): Observable<ContactQueryResponse> {
    return this.http
      .post<
        ApiResponse<ContactQueryResponse>
      >(`${this.baseUrl}/public/contact/addContactQuery`, request)
      .pipe(
        map((res) => res.data),

        catchError((error) => {
          console.error('Add Contect Query Error:', error);
          return this.handleError(error);
        }),
      );
  }
  getAll(page:number,size:number,search:string,status:string):Observable<PageResponse<ContactQueryResponse>> {
    let params=new HttpParams()
    .set('page',page)
    .set('size',size);

    if(search && search.trim() !== ''){
      params=params.set('search',search.trim());
    }
    if(status && status != 'ALL'){
      params=params.set('status',status);
    }

    return this.http.get<ApiResponse<PageResponse<ContactQueryResponse>>>(
       `${this.baseUrl}/contact/getAllContactQuery`,{params}
    ).pipe(
      map((res)=>res.data),
      catchError((error)=>this.handleError(error))
    )
  }

  getById(id:number):Observable<ContactQueryResponse>{
    return this.http.get<ApiResponse<ContactQueryResponse>>(
      `${this.baseUrl}/contact/getContactQueryById/${id}`
    ).pipe(map((res)=>res.data),
    catchError((error)=>this.handleError(error))
  )
  }

  delete(id:number):Observable<ContactQueryResponse>{
    return this.http.delete<ApiResponse<ContactQueryResponse>>(
      `${this.baseUrl}/contact/deleteContentQueryById/${id}`
    ).pipe(map((res)=>res.data),
    catchError((error)=>this.handleError(error))
  )
  }

  updateStatus(updateQueryStatusRequest:UpdateQueryStatusRequest):Observable<ContactQueryResponse>{
    return this.http.post<ApiResponse<ContactQueryResponse>>(`${this.http}/contact/updateContactQueryStatusById`,updateQueryStatusRequest)
    .pipe(
      map((res)=>res.data),
      catchError((error)=>this.handleError(error))
  
  )
    
  }
  adminReply(id:number,adminReplyRequest:AdminReplyRequest):Observable<ContactQueryResponse>{
    return this.http.put<ApiResponse<ContactQueryResponse>>(`${this.baseUrl}/contact/adminToReply/${id}`,adminReplyRequest)
    .pipe(
      map((res)=>res.data),
      catchError((error)=>this.handleError(error))
    )
  }

  private handleError(error: any) {
    const message = error?.error?.message || error?.message || 'Server error';

    return throwError(() => new Error(message));
  }
}
