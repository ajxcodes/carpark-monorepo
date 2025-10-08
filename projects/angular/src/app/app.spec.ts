import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CarParkService } from './services/car-park';
import { App } from './app';

describe('App', () => {
  let component: App;
  let fixture: ComponentFixture<App>;
  let mockCarParkService: jasmine.SpyObj<CarParkService>;

  beforeEach(async () => {
    // Create a mock CarParkService with spy methods
    mockCarParkService = jasmine.createSpyObj('CarParkService', ['getSpacesStatus', 'parkVehicle', 'exitVehicle']);

    // Configure the mock methods to return an observable
    mockCarParkService.getSpacesStatus.and.returnValue(of({ availableSpaces: 50, occupiedSpaces: 0 }));
    mockCarParkService.parkVehicle.and.returnValue(of({ vehicleReg: 'TEST-REG', spaceNumber: 1, timeIn: '' }));
    mockCarParkService.exitVehicle.and.returnValue(of({ vehicleReg: 'TEST-REG', vehicleCharge: 5, timeIn: '', timeOut: '' }));

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideZonelessChangeDetection(),
        { provide: CarParkService, useValue: mockCarParkService } // Provide the mock service
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger initial data binding and ngOnInit
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should render the main title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('My Car Park');
  });

  it('should call getSpacesStatus on initialization', () => {
    // ngOnInit is called by fixture.detectChanges() in beforeEach
    expect(mockCarParkService.getSpacesStatus).toHaveBeenCalled();
    expect(component.spacesStatus).toEqual({ availableSpaces: 50, occupiedSpaces: 0 });
  });

  it('should call parkVehicle on park form submission', () => {
    component.parkForm.setValue({ vehicleReg: 'NEW-CAR', vehicleType: 0 });
    component.onParkSubmit();
    expect(mockCarParkService.parkVehicle).toHaveBeenCalledWith({ vehicleReg: 'NEW-CAR', vehicleType: 0 });
  });
});
