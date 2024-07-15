import { google } from 'googleapis';

export const POST = async (req, res) => {
  try {
    const body = await req.json(); 
    const { empleado, options, location, coordinates } = body;

    // Variables for credentials
    const typeAcc = process.env['GOOGLE_TYPE'];
    const projectId = process.env['GOOGLE_PROJECT_ID'];
    const privateKeyId = process.env['GOOGLE_PRIVATE_KEY_ID'];
    const privateKey = process.env['GOOGLE_PRIVATE_KEY'].replace(/\\n/g, '\n'); // Ensure newlines are correctly formatted
    const clientEmail = process.env['GOOGLE_CLIENT_EMAIL'];
    const clientId = process.env['GOOGLE_CLIENT_ID'];
    // Parse the service account credentials from the environment variable
    const credentials = {
        "type": typeAcc,
        "project_id": projectId,
        "private_key_id": privateKeyId,
        "private_key": privateKey,
        "client_email": clientEmail,
        "client_id": clientId,
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": `https://www.googleapis.com/robot/v1/metadata/x509/${clientEmail}`,
        "universe_domain": "googleapis.com"
    };

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const spreadsheetId = process.env['SPREADSHEET_ID']; // replace with your Google Sheets ID
    const range = 'baseDatos!A2:Z'; // replace with your desired sheet name and range

    const formattedDate = new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'America/Mexico_City'
    }).format(new Date());

    const formattedTime = new Intl.DateTimeFormat('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'America/Mexico_City'
    }).format(new Date());
    
    const values = [
      [
        empleado,
        options.value,
        location.street,
        location.city,
        location.state,
        location.postalCode,
        coordinates,
        formattedDate, // Date part
        formattedTime // Time part
      ]
    ];

    const resource = {
      values,
    };

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      resource,
    });

    return new Response(JSON.stringify({ message: 'Data sent to Google Sheets', response }), { status: 200 });
  } catch (error) {
    console.error('Error sending data to Google Sheets:', error);
    return new Response(JSON.stringify({ message: 'Error sending data to Google Sheets', error }), { status: 500 });
  }
};
