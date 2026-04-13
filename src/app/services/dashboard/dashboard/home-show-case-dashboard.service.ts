import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HomeShowCaseResponse } from '../../model/HomeShowCase.model';
import { ApiResponse } from '../../model/ApiResponse.model';
import { handleApiResponse } from '../../../core/utils/api.utils';

@Injectable({
  providedIn: 'root',
})
export class HomeShowCaseDashboardService {
  private readonly BASE_URL = environment.apiUrl;

  constructor(private httpClient:HttpClient) {}

  getHomeShowCaseInfo():Observable<HomeShowCaseResponse>{
    return this.httpClient.get<ApiResponse<HomeShowCaseResponse>>(`${this.BASE_URL}/public/home/getHomeShowCase`)
    .pipe(handleApiResponse());
  }
}
