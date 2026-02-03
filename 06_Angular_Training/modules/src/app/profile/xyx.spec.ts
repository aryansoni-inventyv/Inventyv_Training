import { TestBed } from '@angular/core/testing';

import { Xyx } from './xyx';

describe('Xyx', () => {
  let service: Xyx;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Xyx);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
