import { useState } from 'react';
import './App.css';
import SpacesStatus from './components/SpacesStatus';
import ParkVehicle from './components/ParkVehicle';
import ExitVehicle from './components/ExitVehicle';
import { InitialParkingResponse, ParkingCompletedResponse } from './services/carPark';

function App() {
  const [parkingResult, setParkingResult] = useState<InitialParkingResponse | null>(null);
  const [exitResult, setExitResult] = useState<ParkingCompletedResponse | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [refreshStatus, setRefreshStatus] = useState(false);

  const handleVehicleParked = (result: InitialParkingResponse) => {
    resetState();
    setParkingResult(result);
    setRefreshStatus(prev => !prev);
  };

  const handleVehicleExited = (result: ParkingCompletedResponse) => {
    resetState();
    setExitResult(result);
    setRefreshStatus(prev => !prev);
  };

  const handleError = (message: string) => {
    resetState();
    setApiError(message);
  };

  const resetState = () => {
    setParkingResult(null);
    setExitResult(null);
    setApiError(null);
  };

  return (
    <main className="container">
      <SpacesStatus refresh={refreshStatus} />

      <div className="grid">
        <ParkVehicle onVehicleParked={handleVehicleParked} onParkError={handleError} />
        <ExitVehicle onVehicleExited={handleVehicleExited} onExitError={handleError} />
      </div>

      <section className="results">
        {parkingResult && (
          <article>
            <h3>Vehicle Parked Successfully</h3>
            <p>Registration: {parkingResult.vehicleReg}</p>
            <p>Space Number: {parkingResult.spaceNumber}</p>
            <p>Time In: {new Date(parkingResult.timeIn).toLocaleString()}</p>
          </article>
        )}
        {exitResult && (
          <article>
            <h3>Vehicle Exited Successfully</h3>
            <p>Registration: {exitResult.vehicleReg}</p>
            <p>Charge: £{exitResult.vehicleCharge.toFixed(2)}</p>
            <p>Time Out: {new Date(exitResult.timeOut).toLocaleString()}</p>
          </article>
        )}
        {apiError && (
          <article className="error-card">
            <h3>An Error Occurred</h3>
            <p>{apiError}</p>
          </article>
        )}
      </section>
    </main>
  );
}

export default App;