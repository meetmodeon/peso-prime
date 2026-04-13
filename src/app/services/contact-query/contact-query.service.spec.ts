import { TestBed } from '@angular/core/testing';

import { ContactQueryService } from './contact-query.service';

describe('ContactQueryService', () => {
  let service: ContactQueryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactQueryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
