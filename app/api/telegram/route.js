import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { text } = await request.json();
    console.log(text)
    const BOT_TOKEN = process.env['TELEGRAM_BOT_TOKEN'];
    const CHAT_ID = process.env['TELEGRAM_CHAT_ID']; // Chat ID or Group ID
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: text
      })
    });
    // console.log(CHAT_ID)
    const data = await response.json();

   // console.log(data)
    if (!response.ok) {
      throw new Error(data.description);
    }

    return NextResponse.json({ message: 'Message sent successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
