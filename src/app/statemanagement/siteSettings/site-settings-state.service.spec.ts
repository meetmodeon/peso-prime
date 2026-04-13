import { TestBed } from '@angular/core/testing';

import { SiteSettingsStateService } from './site-settings-state.service';

describe('SiteSettingsStateService', () => {
  let service: SiteSettingsStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SiteSettingsStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
