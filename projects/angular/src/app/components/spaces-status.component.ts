import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarParkService, SpacesResponse } from '../services/car-park';

@Component({
  selector: 'app-spaces-status',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header>
      <h1>Car Park</h1>
      @if (spacesStatus) {
        <article>
          <p>Available Spaces: <strong>{{ spacesStatus.availableSpaces }}</strong></p>
          <p>Occupied Spaces: <strong>{{ spacesStatus.occupiedSpaces }}</strong></p>
        </article>
      } @else {
        <p><progress indeterminate></progress>Loading parking status...</p>
      }
    </header>
  `
})
export class SpacesStatusComponent implements OnInit {
  private carParkService = inject(CarParkService);
  public spacesStatus: SpacesResponse | null = null;

  ngOnInit(): void { this.refresh(); }

  public refresh(): void { this.carParkService.getSpacesStatus().subscribe(data => this.spacesStatus = data); }
}