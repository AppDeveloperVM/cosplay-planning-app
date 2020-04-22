import { TestBed } from '@angular/core/testing';

import { MyCosplaysService } from './my-cosplays.service';

describe('MyCosplaysService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MyCosplaysService = TestBed.get(MyCosplaysService);
    expect(service).toBeTruthy();
  });
});
