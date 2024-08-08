import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import ConfirmationDialog from './confirmation';
import useLocation from '../hooks/useLocation';
import useSendData from '../hooks/useSendData';
import useFingerprint from '../hooks/useFingerprint';


const Form = ({ user }) => {
  const [formData, setFormData] = useState({
    empleado: user,
    options: null,
    location: '',
    coordinates: '',
    uniqueKey: null,
  });
  const [options, setOptions] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { location, isLoading, error, getLocation } = useLocation();
  const { message, sendData } = useSendData();
  const fingerprint = useFingerprint();

  const formRef = useRef(null);

  useEffect(() => {
    fetch('/api/data')
      .then(response => response.json())
      .then(data => {
        const options = data.centrosTrabajo.map(option => ({ value: option, label: option }));
        setOptions(options);
      });
  }, []);

  useEffect(() => {
    if (location) {
      setFormData(prevData => ({
        ...prevData,
        location,
        coordinates: `${location.latitude}, ${location.longitude}`, 
      }));
    }
  }, [location]);

  useEffect(() => {
    if (fingerprint) {
      setFormData(prevData => ({
        ...prevData,
        uniqueKey: fingerprint,
      }));
    }
  }, [fingerprint]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!formData.empleado || !formData.options || !formData.location.street) {
      alert('Por favor complete todos los campos');
      return;
    }
    setShowConfirmation(true);
  };

  const handleChange = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };

  const confirmAndSend = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await sendData(formData);
      setIsSubmitting(false);
      setShowConfirmation(false);
    } catch (error) {
      console.error('Error sending data:', error);
      setIsSubmitting(false);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setShowConfirmation(false);
  };

  return (
    <form ref={formRef} className="items-center justify-center w-full max-w-lg p-4 mx-auto text-black bg-white rounded-lg shadow-md min-w-[300px] ">
      {/* Empleado */}
      <div className="mb-4">
        <label className="block text-gray-700">Empleado:</label>
        <input
          type="text"
          value={formData.empleado}
          disabled
          onChange={(e) => handleChange('Empleado', e.target.value)}
          className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-[#fa2541] sm:text-sm"
          aria-label="Empleado"
        />
      </div>
      {/* Centros de Trabajo */}
      <div className="mb-4">
        <label className="block text-gray-700">Centro de Trabajo:</label>
        <Select
          value={formData.options}
          onChange={(option) => handleChange('options', option)}
          options={options}
          placeholder="Seleccione el Centro de Trabajo"
          isClearable
          className="mt-1"
          aria-label="Centro de Trabajo"
        />
      </div>
      
      {/* Localizacion */}
      <div className="mb-4">
  <button
    onClick={getLocation}
    type="button"
    className="flex items-center justify-center px-4 py-2 text-center text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
      <path d="M12 2C8.13401 2 5 5.13401 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13401 15.866 2 12 2ZM12 11.5C10.6193 11.5 9.5 10.3807 9.5 9C9.5 7.61929 10.6193 6.5 12 6.5C13.3807 6.5 14.5 7.61929 14.5 9C14.5 10.3807 13.3807 11.5 12 11.5Z" fill="white"/>
    </svg>
    Mi Ubicacion
  </button>
  
  {isLoading && <div className="mt-2 text-gray-500">Cargando...</div>}
  {error && <div className="mt-2 text-red-500">{error}</div>}
  <div className="mt-2 text-gray-700">{formData.location ? `${formData.location.street}, ${formData.location.city}, ${formData.location.state}, ${formData.location.postalCode}` : ''}</div>
</div>
      
<div className="mb-4">
        <button
          onClick={handleSend}
          type="button"
          className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Enviar
        </button>
      </div>

      {showConfirmation && (
        <ConfirmationDialog
          message={formData}
          onConfirm={confirmAndSend}
          onCancel={handleCancel}
          onSubmitting={isSubmitting}
        />
      )}
    </form>
  );
};

export default Form;
