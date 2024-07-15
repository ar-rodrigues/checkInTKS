import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useState } from 'react';
import ConfirmationDialog from './confirmation'; // Adjust the import path as needed
import { sendToTelegram } from '../lib/sendToTelegram';

const GeneratedText = ({ formData, message, setMessage }) => {
  const { empleado, options, location, coordinates} = formData;
  const items = [
    { label: 'Empleado', value: empleado },
    { label: 'Centro de Trabajo', value: options ? options.label : '' },
    { label: 'Calle', value: location.street },
    { label: 'Ciudad', value: location.city },
    { label: 'Estado', value: location.state },
    { label: 'CP', value: location.postalCode },
    { label: 'Fecha y Hora', value: new Date().toLocaleString() },
  ];
  const [copyStatus, setCopyStatus] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);

  const fullAddress = items.map(item => `${item.label}: ${item.value}`).join('\n');

  const handleSendToTelegram = async (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleCopy = (index) => {
    setCopyStatus((prevState) => ({ ...prevState, [index]: true }));
    setTimeout(() => {
      setCopyStatus((prevState) => ({ ...prevState, [index]: false }));
    }, 2000);
  };

  const confirmAndSend = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/sendToGoogleSheet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        console.log('Data sent to Google Sheets:', result);
        sendToTelegram(fullAddress, setMessage);
        setMessage('Mensaje enviada con exito!');
        window.alert('Operación exitosa!');
        window.location.reload();
      } else {
        console.error('Error sending data to Google Sheets:', result);
        setMessage('Error enviando el mensaje a Google Sheets.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error enviando el mensaje.');
    }
    
    setShowConfirmation(false);
  };

  return (
    <div className="p-4 mt-4 bg-gray-200 rounded-lg">
      <h3 className="mb-4 font-semibold text-center text-gray-700">Texto Generado</h3>
      <div className="flex items-center col-span-2 mt-2 justify-left">
        <CopyToClipboard text={fullAddress} onCopy={() => handleCopy('fullAddress')}>
          <button
            onClick={(e) => e.preventDefault()}
            className={`px-2 py-1 text-center items-center text-xs rounded-lg ${copyStatus['fullAddress'] ? 'bg-green-500 text-white' : 'bg-gray-100 text-blue-500'}`}
          >
            {copyStatus['fullAddress'] ? 'Copiado' : 'Copiar todo'}
          </button>
        </CopyToClipboard>
      </div>
      <div className="mb-2 text-sm text-gray-700">
        {items.map((item, index) => (
          <div key={index} className={`${item.label === 'Fecha y Hora' ? 'hidden' : 'block' } `}> {/**Hide Fecha y hora */}
            <div className='flex flex-wrap items-center justify-between gap-2 py-1 place-items-end'>
              <div className='max-w-[70%]'>
                <p className="font-semibold">{item.label}:</p>
                <p>{item.value}</p>
              </div>
              <div className='my-2'>
                <CopyToClipboard text={item.value} onCopy={() => handleCopy(index)}>
                  <button
                    onClick={(e) => e.preventDefault()}
                    className={`px-2 py-1 text-center items-center text-xs rounded-lg ${copyStatus[index] ? 'bg-green-500 text-white' : 'bg-gray-100 text-blue-500'}`}
                  >
                    {copyStatus[index] ? 'Copiado' : 'Copiar'}
                  </button>
                </CopyToClipboard>
              </div>
            </div>
            <hr className='w-full h-1 bg-gray-100'/>
          </div>
        ))}
      </div>
      {fullAddress && (
        <div className="mt-4">
          <button
            onClick={handleSendToTelegram}
            className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue -500 focus:ring-opacity-50"
          >
            Enviar
          </button>
          {message && <div className="mt-2 text-gray-700">{message}</div>}
        </div>
      )}
      {showConfirmation && (
        <ConfirmationDialog 
          message={formData}
          onConfirm={confirmAndSend}
          onCancel={(e) => {
            e.preventDefault();
            setShowConfirmation(false)}
          }
        />
      )}
    </div>
  );
};

export default GeneratedText;


