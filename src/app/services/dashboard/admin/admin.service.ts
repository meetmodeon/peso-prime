import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminDashboardResponse } from '../../model/AdminDashboard.model';
import { ApiResponse } from '../../model/ApiResponse.model';
import { handleApiResponse } from '../../../core/utils/api.utils';

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {
  private readonly BASE_URL=environment.apiUrl
  constructor(
    private httpClient:HttpClient
  ) { }

  getDashboardInfo():Observable<AdminDashboardResponse>{
    return this.httpClient.get<ApiResponse<AdminDashboardResponse>>(`${this.BASE_URL}/admin/dashboardInfo`)
    .pipe(handleApiResponse());
  }
}
