import { TestBed } from '@angular/core/testing';

import { TeamMemberStateService } from './team-member-state.service';

describe('TeamMemberStateService', () => {
  let service: TeamMemberStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamMemberStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
