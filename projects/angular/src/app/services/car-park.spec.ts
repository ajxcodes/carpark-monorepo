import { TestBed } from '@angular/core/testing';

import { CarPark } from './car-park';

describe('CarPark', () => {
  let service: CarPark;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarPark);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
