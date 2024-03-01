import { TestBed } from '@angular/core/testing';

import { GroundingService } from './grounding.service';

describe('GroundingService', () => {
  let service: GroundingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroundingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
