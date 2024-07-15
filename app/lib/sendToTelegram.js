export const sendToTelegram = async (message, setMessage) => {
  const url = '/api/telegram'; // Call your Next.js API route
  console.log('Sending message to /api/telegram:', message);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: message,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Message sent via API:', result);
    setMessage('Message sent to Telegram successfully!');
  } catch (error) {
    console.error('Error sending message via API:', error);
    setMessage('Error sending message to Telegram.');
  }
};
