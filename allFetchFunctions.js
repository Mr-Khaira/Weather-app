export async function WeatherReportOfCities(cityList, unit) {
  let theList = cityList.map(async (item) => {
    try {
      const weather = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${item.lat}&lon=${item.lon}&appid=e48dd7e2b32f4f907d573e78970b1e8e&units=${unit}`
      );

      const resp = await weather.json();

      //console.log(resp);
      return resp;
    } catch (error) {
      console.error("Error fetching weather data:", error);
      return null;
    }
  });

  const weatherReportList = await Promise.all(theList);
  return weatherReportList;
}
export async function getFlag(countryCodes) {
  // Example of an asynchronous function to fetch flag based on countryCode
  try {
    const theFlags = countryCodes.map(async (code) => {
      try {
        const resp = await fetch(
          `https://restcountries.com/v3.1/alpha/${code}`
        );
        if (!resp.ok) {
          throw new Error(`HTTP error! status: ${resp.status}`);
        }
        const data = await resp.json();
        return { code, flagUrl: data[0].flags.svg };
      } catch (error) {
        console.log(`Failed to fetch flag for ${code}: ${error.message}`);
        return { code, flagUrl: "" }; // Return an empty flagUrl if fetch fails
      }
    });
    const flags = await Promise.all(theFlags);
    return flags;
  } catch (error) {
    console.log(`General error: ${error.message}`);
    return countryCodes.map((code) => ({ code, flagUrl: "" }));
  }
}
