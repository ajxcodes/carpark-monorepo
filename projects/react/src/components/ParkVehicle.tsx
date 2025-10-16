import { useState } from 'react';
import { parkVehicle, VehicleType, InitialParkingResponse } from '../services/carPark';

interface ParkVehicleProps {
  onVehicleParked: (response: InitialParkingResponse) => void;
  onParkError: (message: string) => void;
}

const ParkVehicle = ({ onVehicleParked, onParkError }: ParkVehicleProps) => {
  const [vehicleReg, setVehicleReg] = useState('');
  const [vehicleType, setVehicleType] = useState(VehicleType.SmallCar);
  const [isParking, setIsParking] = useState(false);

  const vehicleTypeOptions = [
    { name: 'SmallCar', value: VehicleType.SmallCar },
    { name: 'MediumCar', value: VehicleType.MediumCar },
    { name: 'LargeCar', value: VehicleType.LargeCar }
  ];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!vehicleReg || isParking) return;

    setIsParking(true);
    try {
      const response = await parkVehicle({ vehicleReg, vehicleType });
      onVehicleParked(response);
      setVehicleReg('');
    } catch (error: any) {
      onParkError(error.message || 'An unknown error occurred while parking.');
    } finally {
      setIsParking(false);
    }
  };

  return (
    <article>
      <hgroup>
        <h2>Park a Vehicle</h2>
        <h3>Enter vehicle details to park.</h3>
      </hgroup>
      <form onSubmit={handleSubmit}>
        <label htmlFor="park-reg">Vehicle Registration</label>
        <input
          id="park-reg"
          value={vehicleReg}
          onChange={(e) => setVehicleReg(e.target.value)}
          placeholder="e.g., AB12 CDE"
          required
        />

        <label htmlFor="park-type">Vehicle Type</label>
        <select
          id="park-type"
          value={vehicleType}
          onChange={(e) => setVehicleType(Number(e.target.value))}
          required
        >
          {vehicleTypeOptions.map((type) => (
            <option key={type.value} value={type.value}>
              {type.name}
            </option>
          ))}
        </select>
        <button type="submit" disabled={!vehicleReg || isParking} aria-busy={isParking}>
          Park Vehicle
        </button>
      </form>
    </article>
  );
};

export default ParkVehicle;