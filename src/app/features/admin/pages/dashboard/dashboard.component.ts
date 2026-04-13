import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminDashboardResponse } from '../../../../services/model/AdminDashboard.model';
import { AdminDashboardService } from '../../../../services/dashboard/admin/admin.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  dashboardInfoData = signal<AdminDashboardResponse>({
    totalService: 0,
    totalTeamMember: 0,
    totalOngoingProject: 0,
    totalCompletedProject: 0,
  });
  constructor(private adminDashboardInfoService: AdminDashboardService) {}

  ngOnInit() {
    this.loadInfo();
  }
  loadInfo() {
    this.adminDashboardInfoService.getDashboardInfo().subscribe({
      next: (res) => {
        this.dashboardInfoData.set(res);
      },
    });
  }
}
