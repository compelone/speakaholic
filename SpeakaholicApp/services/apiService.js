export async function getLocationInformation(latitude, longitude) {
  if (latitude !== 0 && longitude !== 0) {
    let url = `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${latitude},${longitude}&limit=10&apikey=iOqng09WWzfouXN7KigEEZn-QVacqaZ-tWGBWAQ5r7Q`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    return await response.json();
  }

  return '';
}
