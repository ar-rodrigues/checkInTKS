import React from 'react';

const ConfirmationDialog = ({ message, onConfirm, onCancel, onSubmitting }) => {
    const {empleado, options, location, coordinates} = message;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-lg w-[80%]   ">
        <h1 className='py-4 font-bold text-md'>Confirme que deseas enviar los datos</h1>
        <div className="p-4 mb-4 text-left text-gray-700 bg-gray-100 rounded-md">
            <p><strong>Empleado:</strong> {empleado}</p>
            <p><strong>Centro de Trabajo:</strong> {options?.label}</p>
            <p><strong>Calle:</strong> {location?.street}</p>
            <p><strong>Ciudad:</strong> {location?.city}</p>
            <p><strong>Estado:</strong> {location?.state}</p>
            <p><strong>CP:</strong> {location?.postalCode}</p>
        </div>
        <div className="flex justify-end py-4 space-x-2">
          <button
            onClick={onCancel}
            disabled={onSubmitting}
            className="px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={onSubmitting}
            className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            {onSubmitting ? 'Enviando...' : 'Enviar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
