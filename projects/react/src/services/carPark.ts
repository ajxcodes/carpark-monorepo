const API_URL = 'http://localhost:5118/api/parking';

export interface SpacesResponse {
  availableSpaces: number;
  occupiedSpaces: number;
}

// Corrected to match the .NET VehicleType enum
export enum VehicleType {
  SmallCar = 0,
  MediumCar = 1,
  LargeCar = 2,
}

export interface ParkingRequest {
  vehicleReg: string;
  vehicleType: VehicleType;
}

export interface InitialParkingResponse {
  vehicleReg: string;
  spaceNumber: number;
  timeIn: string;
}

export interface ParkingExitRequest {
  vehicleReg: string;
}

export interface ParkingCompletedResponse {
  vehicleReg: string;
  vehicleCharge: number;
  timeIn: string;
  timeOut: string;
}

export const getSpacesStatus = async (): Promise<SpacesResponse> => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch spaces status');
  }
  return response.json();
};

export const parkVehicle = async (request: ParkingRequest): Promise<InitialParkingResponse> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.title || 'Failed to park vehicle');
  }
  return response.json();
};

export const exitVehicle = async (request: ParkingExitRequest): Promise<ParkingCompletedResponse> => {
  const response = await fetch(`${API_URL}/exit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.title || 'Failed to exit vehicle');
  }
  return response.json();
};