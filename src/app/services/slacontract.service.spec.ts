import { TestBed, inject } from '@angular/core/testing';

import { Web3Service } from './slacontract.service';

describe('EthcontractService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Web3Service]
    });
  });

  it('should be created', inject([Web3Service], (service: Web3Service) => {
    expect(service).toBeTruthy();
  }));
});
