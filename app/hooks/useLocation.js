import { useState } from 'react';

const useLocation = () => {
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const getLocation = async () => {
    setIsLoading(true);
    setError('');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const response = await fetch('/api/geolocation', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ latitude, longitude }),
            });

            const data = await response.json();

            if (response.ok) {
              setLocation({...data, latitude, longitude});
            } else {
              setError(data.error);
            }
          } catch (error) {
            console.error('Error fetching location:', error);
            setError('An unexpected error occurred');
          }

          setIsLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setError(error.message);
          setIsLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setIsLoading(false);
    }
  };

  return { location, isLoading, error, getLocation };
};

export default useLocation;
