import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { PageResponse } from '../User/user.service';
import { ProjectResponse } from '../model/ProjectResponse.model';
import { ApiResponse } from '../model/ApiResponse.model';
import { ProjectRequest } from '../model/ProjectRequest.model';
import { handleApiResponse } from '../../core/utils/api.utils';
import { StatusFilter } from '../model/FileType.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly BASE_URL=environment.apiUrl;

  constructor(private http:HttpClient) { }

  getAll(status:StatusFilter,page=0,size=10):Observable<PageResponse<ProjectResponse>>{
    let params=new HttpParams();
    params=params.set('page',page);
    params=params.set('size',size);
    if( status && status !=='ALL'){
      params=params.set('status',status);
    }
    
    
    return this.http
    .get<ApiResponse<PageResponse<ProjectResponse>>>(`${this.BASE_URL}/public/project/getAllProject`,{params})
    .pipe(handleApiResponse());
  }

  getById(id:number):Observable<ProjectResponse>{
    return this.http
    .get<ApiResponse<ProjectResponse>>(`${this.BASE_URL}/public/project/getProjectById/${id}`)
    .pipe(handleApiResponse());
  }

  add(request:ProjectRequest):Observable<ProjectResponse>{
    return this.http
    .post<ApiResponse<ProjectResponse>>(`${this.BASE_URL}/project/add`,request)
    .pipe(handleApiResponse());
  }

  update(id:number,request:ProjectRequest):Observable<ProjectResponse>{
    return this.http
    .put<ApiResponse<ProjectResponse>>(`${this.BASE_URL}/project/updateProjectById/${id}`,request)
    .pipe(handleApiResponse());
  }

  delete(id:number):Observable<Record<string,string>>{
    return this.http
    .delete<ApiResponse<Record<string,string>>>(`${this.BASE_URL}/deleteProjectById/${id}`)
    .pipe(handleApiResponse());
  }

}
