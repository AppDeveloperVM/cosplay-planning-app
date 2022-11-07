import { TestBed } from '@angular/core/testing';

import { BrowserGeolocationService } from './browser-geolocation.service';

describe('BrowserGeolocationService', () => {
  let service: BrowserGeolocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrowserGeolocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
