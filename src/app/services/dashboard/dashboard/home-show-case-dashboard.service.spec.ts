import { TestBed } from '@angular/core/testing';

import { HomeShowCaseDashboardService } from './home-show-case-dashboard.service';

describe('HomeShowCaseDashboardService', () => {
  let service: HomeShowCaseDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeShowCaseDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
