// useSendData.js
import { useState } from 'react';
import { sendToTelegram } from '../lib/sendToTelegram';

const useSendData = () => {
  const [message, setMessage] = useState('');

  const sendData = async (formData) => {
    try {
      const response = await fetch('/api/sendToGoogleSheet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Data sent to Google Sheets:', result);
        const fullAddress = `${formData.location.street}, ${formData.location.city}, ${formData.location.state}, ${formData.location.postalCode}\nClabe Unica: ${formData.uniqueKey}`;
        sendToTelegram(fullAddress, setMessage);
        setMessage('Mensaje enviada con exito!');
        window.alert('Operación exitosa!');
        window.location.reload();
      } else {
        setMessage('Error enviando el mensaje a Google Sheets.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error enviando el mensaje.');
    }
  };

  return { message, sendData };
};

export default useSendData;
