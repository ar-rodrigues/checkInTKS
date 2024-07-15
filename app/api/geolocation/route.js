import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { latitude, longitude } = await request.json();
    const googleApiKey = process.env["GOOGLE_API_KEY"];
    const tomtomApiKey = process.env["TOMTOM_API_KEY"];

    const urlTomtomApi = `https://api.tomtom.com/search/2/reverseGeocode/${latitude},${longitude}.json?returnSpeedLimit=false&radius=100&allowFreeformNewLine=false&returnMatchType=false&view=Unified&key=${tomtomApiKey}`;
    const urlGoogleMapsApi = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleApiKey}`;

    
    const response = await fetch(urlTomtomApi);
    const data = await response.json();

    // Extract the address details from the TomTom API response
    const addressData = data.addresses[0]?.address || {};

    const street = addressData.street || "";
    const city = addressData.municipality || addressData.localName || "";
    const state =
      addressData.countrySubdivisionName ||
      addressData.countrySubdivision ||
      "";
    const postalCode = addressData.postalCode || "";


    return NextResponse.json({ street, city, state, postalCode });
  } catch (error) {
    console.error("Error fetching location:", error);
    return NextResponse.json(
      { error: "No se pudo obtener ubicacion" },
      { status: 500 },
    );
  }
}
