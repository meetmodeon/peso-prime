import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageResponse } from '../User/user.service';
import { TeamMemberRequest, TeamMemberResponse } from '../model/team-member.model';
import { ApiResponse } from '../model/ApiResponse.model';
import { handleApiResponse } from '../../core/utils/api.utils';

@Injectable({
  providedIn: 'root'
})
export class TeamMemberService {
  private readonly BASE_URL=environment.apiUrl;
  constructor(private http:HttpClient) { }

  getAll(page:number=0,size:number=10):Observable<PageResponse<TeamMemberResponse>>{
    const params=new HttpParams()
    .set('page',page)
    .set('size',size);
    return this.http.get<ApiResponse<PageResponse<TeamMemberResponse>>>(`${this.BASE_URL}/public/team-member/get`,{params})
    .pipe(handleApiResponse())
    ;
  }

  add(request:TeamMemberRequest):Observable<TeamMemberResponse>{
    return this.http.post<ApiResponse<TeamMemberResponse>>(`${this.BASE_URL}/team-member/add`,request)
    .pipe(handleApiResponse())
    ;
  }

  update(id:number,request:TeamMemberRequest):Observable<TeamMemberResponse>{
    return this.http.put<ApiResponse<TeamMemberResponse>>(`${this.BASE_URL}/team-member/update/${id}`,request)
    .pipe(handleApiResponse());
  }

  delete(id:number):Observable<Record<string,string>>{
    return this.http.delete<ApiResponse<Record<string,string>>>(`${this.BASE_URL}/team-member/remove/${id}`)
    .pipe(handleApiResponse());
  }

  getById(id:number):Observable<TeamMemberResponse>{
    return this.http.get<ApiResponse<TeamMemberResponse>>(`${this.BASE_URL}/team-member/getByMemberId/${id}`)
    .pipe(handleApiResponse());
  }
}
