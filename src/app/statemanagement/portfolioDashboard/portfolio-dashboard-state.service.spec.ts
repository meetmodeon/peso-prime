import { TestBed } from '@angular/core/testing';

import { PortfolioDashboardStateService } from './portfolio-dashboard-state.service';

describe('PortfolioDashboardStateService', () => {
  let service: PortfolioDashboardStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PortfolioDashboardStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
