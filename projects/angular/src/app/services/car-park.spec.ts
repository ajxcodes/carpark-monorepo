import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { CarParkService, ParkingRequest, SpacesResponse, VehicleType } from './car-park';

describe('CarParkService', () => {
  let service: CarParkService;
  let httpTestingController: HttpTestingController;
  let apiUrl: string;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        CarParkService
      ]
    });
    service = TestBed.inject(CarParkService);
    httpTestingController = TestBed.inject(HttpTestingController);
    // Access the private member for testing purposes to ensure our URLs are correct
    apiUrl = (service as any).apiUrl;
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get parking space status via GET', () => {
    const mockSpaces: SpacesResponse = { availableSpaces: 10, occupiedSpaces: 5 };

    service.getSpacesStatus().subscribe(data => {
      expect(data).toEqual(mockSpaces);
    });

    const req = httpTestingController.expectOne(`${apiUrl}/api/parking`);
    expect(req.request.method).toBe('GET');
    req.flush(mockSpaces);
  });

  it('should park a vehicle via POST', () => {
    const mockRequest: ParkingRequest = { vehicleReg: 'TEST-123', vehicleType: VehicleType.Car };
    const mockResponse = { vehicleReg: 'TEST-123', spaceNumber: 1, timeIn: new Date().toISOString() };

    service.parkVehicle(mockRequest).subscribe(data => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`${apiUrl}/api/parking`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRequest);
    req.flush(mockResponse);
  });

  it('should exit a vehicle via POST to the exit endpoint', () => {
    const mockRequest = { vehicleReg: 'TEST-123' };
    const mockResponse = {
      vehicleReg: 'TEST-123',
      vehicleCharge: 5.00,
      timeIn: new Date().toISOString(),
      timeOut: new Date().toISOString()
    };

    service.exitVehicle(mockRequest).subscribe(data => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`${apiUrl}/api/parking/exit`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRequest);
    req.flush(mockResponse);
  });
});
