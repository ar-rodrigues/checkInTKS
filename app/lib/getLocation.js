// getLocation.js
export default async function getLocation(
  setCoordinates,
  setLocation,
  setLocationError,
  setIsLoadingLocation,
  setFormData  
) {
  setIsLoadingLocation(true);
  setLocationError('');

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setFormData((prevData) => ({
          ...prevData,
          coordinates: `${latitude}, ${longitude}`
        }));

        try {
          const response = await fetch('/api/geolocation', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ latitude, longitude })
          });

          const data = await response.json();
          if (response.ok) {
            setLocation(data); // Update location state directly
          } else {
            setLocationError(data.error);
          }
        } catch (error) {
          setLocationError('An unexpected error occurred');
        }

        setIsLoadingLocation(false);
      },
      (error) => {
        setLocationError(error.message);
        setIsLoadingLocation(false);
      }
    );
  } else {
    setLocationError('Geolocation is not supported by this browser.');
    setIsLoadingLocation(false);
  }
}
