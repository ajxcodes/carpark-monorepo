// src/app/app.component.ts
import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {
  InitialParkingResponse,
  ParkingCompletedResponse
} from './services/car-park'; // Keep only the interfaces needed for results

// Import the new components
import { SpacesStatusComponent } from './components/spaces-status.component';
import { ParkVehicleComponent } from './components/park-vehicle.component';
import { ExitVehicleComponent } from './components/exit-vehicle.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SpacesStatusComponent, // Add new components to imports
    ParkVehicleComponent,
    ExitVehicleComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  // Get a reference to the spaces status component to call its refresh method
  @ViewChild(SpacesStatusComponent) spacesStatusComponent!: SpacesStatusComponent;

  // --- API Result Properties ---
  parkingResult: InitialParkingResponse | null = null;
  exitResult: ParkingCompletedResponse | null = null;
  apiError: string | null = null;

  onVehicleParked(result: InitialParkingResponse): void {
    this.resetState();
    this.parkingResult = result;
    this.spacesStatusComponent.refresh(); // Tell the status component to update
  }

  onVehicleExited(result: ParkingCompletedResponse): void {
    this.resetState();
    this.exitResult = result;
    this.spacesStatusComponent.refresh(); // Tell the status component to update
  }

  onError(message: string): void {
    this.resetState();
    this.apiError = message;
  }

  private resetState(): void {
    this.parkingResult = null;
    this.exitResult = null;
    this.apiError = null;
  }
}
