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

export async function getFlag(countryCode) {
  // Example of an asynchronous function to fetch flag based on countryCode
  try {
    const theFlags = countryCode.map(async (code) => {
      console.log(code);
      const resp = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
      const data = await resp.json();

      console.log(data);
      return { code, flagUrl: data[0].flags.svg };
    });
    let flags = await Promise.all(theFlags);
    return flags;
  } catch (error) {
    console.log(error.message);
  }
}
