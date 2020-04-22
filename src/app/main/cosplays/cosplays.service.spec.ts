import { TestBed } from '@angular/core/testing';

import { CosplaysService } from './cosplays.service';

describe('CosplaysService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CosplaysService = TestBed.get(CosplaysService);
    expect(service).toBeTruthy();
  });
});
