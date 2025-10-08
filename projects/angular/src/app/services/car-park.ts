// src/app/services/car-park.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
// This interface matches the SpacesResponse from your .NET API.
export interface SpacesResponse {
  availableSpaces: number;
  occupiedSpaces: number;
}

// This enum should match your VehicleType enum in the .NET domain project.
export enum VehicleType {
  Car = 0,
  Motorbike = 1,
  Van = 2
}

// Matches ParkingRequest.cs
export interface ParkingRequest {
  vehicleReg: string;
  vehicleType: VehicleType;
}

// Matches InitialParkingResponse.cs
export interface InitialParkingResponse {
  vehicleReg: string;
  spaceNumber: number;
  timeIn: string; // In JSON, DateTime is serialized as a string
}

// Matches ParkingExitRequest.cs
export interface ParkingExitRequest {
  vehicleReg: string;
}

// Matches ParkingCompletedResponse.cs
export interface ParkingCompletedResponse {
  vehicleReg: string;
  vehicleCharge: number;
  timeIn: string;
  timeOut: string;
}

@Injectable({
  providedIn: 'root'
})
export class CarParkService {
  // Replace with your actual .NET API base URL
  // API URL is now configured in src/environments/environment.ts
  private apiUrl = environment.httpApiUrl;

  constructor(private http: HttpClient) { }

  // Method to get the status of parking spaces
  getSpacesStatus(): Observable<SpacesResponse> {
    return this.http.get<SpacesResponse>(`${this.apiUrl}/api/parking`);
  }

  // Method to park a vehicle
  parkVehicle(request: ParkingRequest): Observable<InitialParkingResponse> {
    return this.http.post<InitialParkingResponse>(`${this.apiUrl}/api/parking`, request);
  }

  // Method for a vehicle to exit the car park
  exitVehicle(request: ParkingExitRequest): Observable<ParkingCompletedResponse> {
    return this.http.post<ParkingCompletedResponse>(`${this.apiUrl}/api/parking/exit`, request);
  }
}
