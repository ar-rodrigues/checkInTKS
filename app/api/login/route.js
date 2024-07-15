import { google } from 'googleapis';

export const POST = async (req) => {
  // Variables for credentials
  const typeAcc = process.env['GOOGLE_TYPE'];
  const projectId = process.env['GOOGLE_PROJECT_ID'];
  const privateKeyId = process.env['GOOGLE_PRIVATE_KEY_ID'];
  const privateKey = process.env['GOOGLE_PRIVATE_KEY'].replace(/\\n/g, '\n'); // Ensure newlines are correctly formatted
  const clientEmail = process.env['GOOGLE_CLIENT_EMAIL'];
  const clientId = process.env['GOOGLE_CLIENT_ID'];

  // Parse the service account credentials from the environment variable
  const credentials = {
    type: typeAcc,
    project_id: projectId,
    private_key_id: privateKeyId,
    private_key: privateKey,
    client_email: clientEmail,
    client_id: clientId,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${clientEmail}`,
    universe_domain: "googleapis.com"
  };

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = process.env['SPREADSHEET_ID']; // replace with your Google Sheets ID
  const range = 'samanthoBotBase!A1:Z'; // replace with your desired sheet name and range
  try {
    const { name, password } = await req.json();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const data = response.data.values;
    // Assuming your data has headers in the first row
    const headers = data[0];
    const rows = data.slice(1);

    // Initialize the output structure
    const formattedData = {
      users: []
    };

    // Parse the rows and fill the formattedData structure
    rows.forEach(row => {
      const user = {
        name: row[0] || '',
        password: row[1] || ''
      };
      if (user.name && user.password) {
        formattedData.users.push(user);
      }
    });
    // Find the specific user
    const user = formattedData.users.find(user => user.name === name && user.password === password);

    if (user) {
      return new Response(JSON.stringify({ user: user.name, message: 'Login successful' }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, max-age=0',
        },
      });
    } else {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, max-age=0',
        },
      });
    }
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    return new Response(JSON.stringify({ error: 'Error fetching data from Google Sheets' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  }
};
