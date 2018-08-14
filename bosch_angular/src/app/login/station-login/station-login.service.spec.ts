import { TestBed, inject } from '@angular/core/testing';

import { StationLoginService } from './station-login.service';

describe('StationLoginService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StationLoginService]
    });
  });

  it('should be created', inject([StationLoginService], (service: StationLoginService) => {
    expect(service).toBeTruthy();
  }));
});
