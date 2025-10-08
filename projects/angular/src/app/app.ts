// src/app/app.component.ts
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { finalize } from 'rxjs';
import {
  CarParkService,
  SpacesResponse,
  VehicleType,
  InitialParkingResponse,
  ParkingCompletedResponse
} from './services/car-park';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  // Using the new `inject` function for dependency injection
  private carParkService = inject(CarParkService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  // A property to hold the parking space status.
  // Initialize with null to handle the state before the API call completes.
  public spacesStatus: SpacesResponse | null = null;

  // ngOnInit is a lifecycle hook that runs once after the component is initialized
  ngOnInit(): void {
    this.getSpaces();

    this.parkForm = this.fb.group({
      vehicleReg: ['', Validators.required],
      vehicleType: [VehicleType.Car, Validators.required]
    });

    this.exitForm = this.fb.group({
      vehicleReg: ['', Validators.required]
    });
  }

  // --- Form Properties ---
  parkForm!: FormGroup;
  exitForm!: FormGroup;
  vehicleTypeOptions = [
    { name: 'Car', value: VehicleType.Car },
    { name: 'Motorbike', value: VehicleType.Motorbike },
    { name: 'Van', value: VehicleType.Van }
  ];

  // --- API Result Properties ---
  parkingResult: InitialParkingResponse | null = null;
  exitResult: ParkingCompletedResponse | null = null;
  apiError: string | null = null;

  // --- UI State Properties ---
  isParking = false;
  isExiting = false;

  getSpaces(): void {
    this.carParkService.getSpacesStatus().subscribe(data => {
      this.spacesStatus = data;
      this.cdr.markForCheck(); // Manually trigger change detection
    });
  }

  onParkSubmit(): void {
    if (this.parkForm.invalid || this.isParking) return;
    this.resetState();
    this.isParking = true;
    this.carParkService.parkVehicle(this.parkForm.value)
      .pipe(finalize(() => {
        this.isParking = false;
        this.cdr.markForCheck();
      }))
      .subscribe({
        next: (res) => {
          this.parkingResult = res;
          this.getSpaces(); // This will now trigger a UI update
        },
        error: (err) => { this.apiError = err.error?.title || 'An unknown error occurred.'; this.cdr.markForCheck(); },
        complete: () => this.cdr.markForCheck()
      });
  }

  onExitSubmit(): void {
    if (this.exitForm.invalid || this.isExiting) return;
    this.resetState();
    this.isExiting = true;
    this.carParkService.exitVehicle(this.exitForm.value)
      .pipe(finalize(() => {
        this.isExiting = false;
        this.cdr.markForCheck();
      }))
      .subscribe({
        next: (res) => {
          this.exitResult = res;
          this.getSpaces(); // This will now trigger a UI update
        },
        error: (err) => { this.apiError = err.error?.title || 'An unknown error occurred.'; this.cdr.markForCheck(); },
        complete: () => this.cdr.markForCheck()
      });
  }

  private resetState(): void {
    this.parkingResult = null;
    this.exitResult = null;
    this.apiError = null;
    this.cdr.markForCheck();
  }
}
