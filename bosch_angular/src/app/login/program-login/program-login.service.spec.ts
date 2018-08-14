import { TestBed, inject } from '@angular/core/testing';

import { ProgramLoginService } from './program-login.service';

describe('ProgramLoginService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProgramLoginService]
    });
  });

  it('should be created', inject([ProgramLoginService], (service: ProgramLoginService) => {
    expect(service).toBeTruthy();
  }));
});
