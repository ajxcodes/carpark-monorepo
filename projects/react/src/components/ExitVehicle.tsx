import { useState } from 'react';
import { exitVehicle, ParkingCompletedResponse } from '../services/carPark';

interface ExitVehicleProps {
  onVehicleExited: (response: ParkingCompletedResponse) => void;
  onExitError: (message: string) => void;
}

const ExitVehicle = ({ onVehicleExited, onExitError }: ExitVehicleProps) => {
  const [vehicleReg, setVehicleReg] = useState('');
  const [isExiting, setIsExiting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!vehicleReg || isExiting) return;

    setIsExiting(true);
    try {
      const response = await exitVehicle({ vehicleReg });
      onVehicleExited(response);
      setVehicleReg('');
    } catch (error: any) {
      onExitError(error.message || 'An unknown error occurred while exiting.');
    } finally {
      setIsExiting(false);
    }
  };

  return (
    <article>
      <hgroup>
        <h2>Exit Car Park</h2>
        <h3>Enter registration to calculate charge.</h3>
      </hgroup>
      <form onSubmit={handleSubmit}>
        <label htmlFor="exit-reg">Vehicle Registration</label>
        <input
          id="exit-reg"
          value={vehicleReg}
          onChange={(e) => setVehicleReg(e.target.value)}
          placeholder="e.g., AB12 CDE"
          required
        />
        <button type="submit" disabled={!vehicleReg || isExiting} aria-busy={isExiting}>
          Exit Vehicle
        </button>
      </form>
    </article>
  );
};

export default ExitVehicle;