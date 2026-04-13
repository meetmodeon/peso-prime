import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { catchError, map, Observable, throwError } from 'rxjs';
import {  ProjectsHeroSectionRequest, ProjectsHeroSectionResponse, SiteSettingsRequest, SiteSettingsRespone } from '../model/siteSettings.model';
import { ApiResponse } from '../model/ApiResponse.model';
import { handleApiResponse } from '../../core/utils/api.utils';

@Injectable({
  providedIn: 'root'
})
export class SiteSettingService {

  private http= inject(HttpClient);
  private apiUrl= environment.apiUrl;

  getSettings():Observable<SiteSettingsRespone>{
    return this.http.get<ApiResponse<SiteSettingsRespone>>(`${this.apiUrl}/public/setting/getInfo`)
    .pipe(handleApiResponse())
  }

  createHero(hero:ProjectsHeroSectionRequest):Observable<ProjectsHeroSectionResponse>{
    return this.http.post<ApiResponse<ProjectsHeroSectionResponse>>(`${this.apiUrl}/projectHero/add`,hero)
    .pipe(handleApiResponse());
  }

  updateHero(id:number,hero:ProjectsHeroSectionRequest):Observable<ProjectsHeroSectionResponse>{
    return this.http.put<ApiResponse<ProjectsHeroSectionResponse>>(`${this.apiUrl}/projectHero/updateById/${id}`,hero)
    .pipe(handleApiResponse());
  }

  deleteHero(id:number):Observable<Map<string,string>>{
    return this.http.delete<ApiResponse<Map<string,string>>>(`${this.apiUrl}/projectHero/deleteById/${id}`)
    .pipe(handleApiResponse())
  }


  addSiteSettings(request:SiteSettingsRequest):Observable<SiteSettingsRespone>{
    return this.http.post<ApiResponse<SiteSettingsRespone>>(`${this.apiUrl}/setting/addInfo`,request)
    .pipe(handleApiResponse())
  }

  updateSiteInfo(id:number,request:SiteSettingsRequest):Observable<SiteSettingsRespone>{
    return this.http.put<ApiResponse<SiteSettingsRespone>>(`${this.apiUrl}/setting/updateSiteInfo/${id}`,request)
    .pipe(handleApiResponse())
  }

  
}
