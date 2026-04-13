import { Injectable, signal } from '@angular/core';
import { PortfolioDashboardResponse } from '../../services/model/PortfolioDashoboard.model';
import { PortfolioDashboardService } from '../../services/dashboard/portfolioDashboard/portfolio-dashboard.service';

@Injectable({
  providedIn: 'root'
})
export class PortfolioDashboardStateService {
  private _portfolioDashboardInfo=signal<PortfolioDashboardResponse>({
    provenceChartResponses:[],
    totalProject:0,
    totalTeamMember:0,
    totalServices:0
  });

  portfolioDashboardInfo=this._portfolioDashboardInfo.asReadonly();
  
  constructor(private portfolioDashboardService:PortfolioDashboardService) { }

  getPortfolioDashboardInfo(){
    this.portfolioDashboardService.getPortfoliDashboardInfo().subscribe({
      next:(res)=>{
        this._portfolioDashboardInfo.set(res);
      },
      error:(err:Error)=>{
        console.log(err.message || 'Something went wrong to fetch the portfolio dashboard info');
      }
    })
  }
}
