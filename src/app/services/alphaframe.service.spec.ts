import { TestBed } from '@angular/core/testing';

import { FrameService } from './alphaframe.service';

describe('AlphaframeService', () => {
  let service: FrameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FrameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
