import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { CarParkService, ParkingCompletedResponse } from '../services/car-park';

@Component({
  selector: 'app-exit-vehicle',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <article>
      <hgroup>
        <h2>Exit Car Park</h2>
        <h3>Enter registration to calculate charge.</h3>
      </hgroup>
      <form [formGroup]="exitForm" (ngSubmit)="onSubmit()">
        <label for="exit-reg">Vehicle Registration</label>
        <input id="exit-reg" formControlName="vehicleReg" placeholder="e.g., AB12 CDE" required />
        <button type="submit" [disabled]="exitForm.invalid" [attr.aria-busy]="isExiting">Exit Vehicle</button>
      </form>
    </article>
  `
})
export class ExitVehicleComponent implements OnInit {
  private carParkService = inject(CarParkService);
  private fb = inject(FormBuilder);

  @Output() vehicleExited = new EventEmitter<ParkingCompletedResponse>();
  @Output() exitError = new EventEmitter<string>();

  exitForm!: FormGroup;
  isExiting = false;

  ngOnInit(): void {
    this.exitForm = this.fb.group({
      vehicleReg: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.exitForm.invalid || this.isExiting) return;
    this.isExiting = true;
    this.carParkService.exitVehicle(this.exitForm.value)
      .pipe(finalize(() => this.isExiting = false))
      .subscribe({
        next: (res) => this.vehicleExited.emit(res),
        error: (err) => this.exitError.emit(err.error?.title || 'An unknown error occurred while exiting.')
      });
  }
}