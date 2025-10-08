import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { CarParkService, InitialParkingResponse, VehicleType } from '../services/car-park';

@Component({
  selector: 'app-park-vehicle',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <article>
      <hgroup>
        <h2>Park a Vehicle</h2>
        <h3>Enter vehicle details to park.</h3>
      </hgroup>
      <form [formGroup]="parkForm" (ngSubmit)="onSubmit()">
        <label for="park-reg">Vehicle Registration</label>
        <input id="park-reg" formControlName="vehicleReg" placeholder="e.g., AB12 CDE" required />

        <label for="park-type">Vehicle Type</label>
        <select id="park-type" formControlName="vehicleType" required>
          @for(type of vehicleTypeOptions; track type.value) {
            <option [value]="type.value">{{ type.name }}</option>
          }
        </select>
        <button type="submit" [disabled]="parkForm.invalid" [attr.aria-busy]="isParking">Park Vehicle</button>
      </form>
    </article>
  `
})
export class ParkVehicleComponent implements OnInit {
  private carParkService = inject(CarParkService);
  private fb = inject(FormBuilder);

  @Output() vehicleParked = new EventEmitter<InitialParkingResponse>();
  @Output() parkError = new EventEmitter<string>();

  parkForm!: FormGroup;
  isParking = false;
  vehicleTypeOptions = [
    { name: 'Car', value: VehicleType.Car },
    { name: 'Motorbike', value: VehicleType.Motorbike },
    { name: 'Van', value: VehicleType.Van }
  ];

  ngOnInit(): void {
    this.parkForm = this.fb.group({
      vehicleReg: ['', Validators.required],
      vehicleType: [VehicleType.Car, Validators.required]
    });
  }

  onSubmit(): void {
    if (this.parkForm.invalid || this.isParking) return;
    this.isParking = true;
    this.carParkService.parkVehicle(this.parkForm.value)
      .pipe(finalize(() => this.isParking = false))
      .subscribe({
        next: (res) => this.vehicleParked.emit(res),
        error: (err) => this.parkError.emit(err.error?.title || 'An unknown error occurred while parking.')
      });
  }
}