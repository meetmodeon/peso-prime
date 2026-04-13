import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import 'chart.js/auto';
import AOS from 'aos';
import { PortfolioDashboardService } from '../../services/dashboard/portfolioDashboard/portfolio-dashboard.service';
import { PortfolioDashboardResponse } from '../../services/model/PortfolioDashoboard.model';
import { getExpirenceYear } from '../../core/utils/api.utils';
import { CommonModule } from '@angular/common';
import { SeoService } from '../../services/seo/seo.service';
import { SEO_CONFIG } from '../../services/model/SEO_CONFIG.model';

export interface ProvinceUI {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [ChartModule, CommonModule],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss',
})
export class PortfolioComponent implements OnInit {
  portfolioDashoboardInfo!: PortfolioDashboardResponse;

  labels: string[] = [];
  values: number[] = [];
  totalProjectCount: number = 0;

  data: any;
  options: any;

  provinceUIList: ProvinceUI[] = [];

  constructor(private portfolioDashboardService: PortfolioDashboardService,
    private seoService:SeoService
  ) {}

  // ✅ SINGLE SOURCE OF TRUTH FOR COLORS
  private provinceColors: any[] = [
    { name: 'KOSHI', color: '#3b82f6' },
    { name: 'MADHESH', color: '#ef4444' },
    { name: 'BAGMATI', color: '#22c55e' },
    { name: 'GANDAKI', color: '#f59e0b' },
    { name: 'LUMBINI', color: '#8b5cf6' },
    { name: 'KARNALI', color: '#94a3b8' },
    { name: 'SUDURPASHCHIM', color: '#f97316' },
  ];

  ngOnInit() {
    AOS.init({
      duration: 800,
      once: false,
      easing: 'ease-in-out',
      offset: 120,
    });

    this.loadDashboard();
    this.seoService.setSEO(SEO_CONFIG.portfolis)
  }

  private loadDashboard() {
    this.portfolioDashboardService
      .getPortfoliDashboardInfo()
      .subscribe((res: any) => {
        this.portfolioDashoboardInfo = res;

        const chartData = this.portfolioDashoboardInfo?.provenceChartResponses;

        if (!chartData) return;

        // sort (optional but better UI)
        chartData.sort((a: any, b: any) => b.projectNo - a.projectNo);

        this.totalProjectCount = chartData.reduce(
          (sum: number, item: any) => sum + item.projectNo,
          0
        );

        // labels
        this.labels = chartData.map((item: any) =>
          this.formatProvinceName(item.provenceName)
        );

        // values
        this.values = chartData.map((item: any) => item.projectNo);

        // UI LIST
        this.provinceUIList = chartData.map((item: any) => {
          const percentage =
            this.totalProjectCount > 0
              ? (item.projectNo / this.totalProjectCount) * 100
              : 0;

          return {
            name: this.formatProvinceName(item.provenceName),
            value: item.projectNo,
            percentage,
            color: this.getColor(item.provenceName),
          };
        });

        // CHART DATA (SYNC COLORS)
        this.data = {
          labels: this.labels,
          datasets: [
            {
              label: 'Projects by Province',
              data: this.values,
              backgroundColor: chartData.map((item: any) =>
                this.getColor(item.provenceName)
              ),
              hoverBackgroundColor: chartData.map((item: any) =>
                this.getColor(item.provenceName)
              ),
            },
          ],
        };

        this.options = {
          cutout: '60%',
          plugins: {
            legend: {
              position: 'bottom',
            },
          },
        };
      });
  }

  // ✅ get exact same color everywhere
  private getColor(province: string): string {
    return (
      this.provinceColors.find(p => p.name === province)?.color || '#64748b'
    );
  }

  // format name
  private formatProvinceName(name: string): string {
    return name.charAt(0) + name.slice(1).toLowerCase();
  }

  // percentage helper
  getPercentage(val: number): string {
    return ((val / this.totalProjectCount) * 100).toFixed(2);
  }

  getEstYear() {
    return getExpirenceYear();
  }
}