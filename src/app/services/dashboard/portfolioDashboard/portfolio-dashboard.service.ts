import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { PortfolioDashboardResponse } from '../../model/PortfolioDashoboard.model';
import { ApiResponse } from '../../model/ApiResponse.model';
import { handleApiResponse } from '../../../core/utils/api.utils';

@Injectable({
  providedIn: 'root'
})
export class PortfolioDashboardService {
  private readonly BASE_URL=environment.apiUrl
  constructor(private httpClient:HttpClient) { }

  getPortfoliDashboardInfo():Observable<PortfolioDashboardResponse>{
    return this.httpClient.get<ApiResponse<PortfolioDashboardResponse>>(`${this.BASE_URL}/public/portfolio/getPortfolioInfo`)
    .pipe(handleApiResponse())
  }
}
