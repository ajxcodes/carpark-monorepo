import { useState, useEffect } from 'react';
import { getSpacesStatus, SpacesResponse } from '../services/carPark';

interface SpacesStatusProps {
  refresh: boolean;
}

const SpacesStatus = ({ refresh }: SpacesStatusProps) => {
  const [spacesStatus, setSpacesStatus] = useState<SpacesResponse | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await getSpacesStatus();
        setSpacesStatus(data);
      } catch (error) {
        console.error('Failed to fetch spaces status:', error);
      }
    };

    fetchStatus();
  }, [refresh]);

  return (
    <header>
      <h1>Car Park</h1>
      {spacesStatus ? (
        <article>
          <p>Available Spaces: <strong>{spacesStatus.availableSpaces}</strong></p>
          <p>Occupied Spaces: <strong>{spacesStatus.occupiedSpaces}</strong></p>
        </article>
      ) : (
        <p><progress></progress>Loading parking status...</p>
      )}
    </header>
  );
};

export default SpacesStatus;