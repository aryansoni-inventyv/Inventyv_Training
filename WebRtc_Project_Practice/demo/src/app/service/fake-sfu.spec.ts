import { TestBed } from '@angular/core/testing';

import { FakeSfu } from './fake-sfu';

describe('FakeSfu', () => {
  let service: FakeSfu;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FakeSfu);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
