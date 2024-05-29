import { displayWeatherAllLocations } from "./mainDisplayFunction.js";

export async function weather(city, country = "", unit = "metric") {
  // appid=e48dd7e2b32f4f907d573e78970b1e8e
  console.log("The unit", unit);
  try {
    const theLocationsList = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city},${country}&appid=e48dd7e2b32f4f907d573e78970b1e8e&limit=0&units=${unit}`
    );
    // limit 10 is the maximum allowed by the api.

    if (!theLocationsList.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const resp = await theLocationsList.json();

    let cityList = [];
    resp.forEach((element) => {
      let latLonObj = { lon: element.lon, lat: element.lat };
      cityList.push(latLonObj);
    });

    if (cityList.length === 0) {
      return 0;
    }

    const weatherReportList = await WeatherReportOfCities(cityList, unit);

    return weatherReportList;

    // We have got the weather info of all the cities in weatherReportList variable.
    // Next step is to exteact the values to be displayed.
  } catch (error) {
    console.error("Fetch operation failed:", error);
  }
  // cityList has the latitude and the longitude of all the cities in the world.
}

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

const userLocationWeather = document.getElementById("userLocationWeather");

export function userLocation(currentTempUnit) {
  // using built in JS property navigator, returns object type Navigator.
  userLocationWeather.textContent = "";

  navigator.geolocation.getCurrentPosition(successfull, error);

  async function successfull(params) {
    const userCity = [
      { lat: params.coords.latitude, lon: params.coords.longitude },
    ];
    const weatherReportList = await WeatherReportOfCities(
      userCity,
      currentTempUnit
    );
    displayWeatherAllLocations(weatherReportList, false);
    console.log(params);
  }
  function error() {
    userLocationWeather.style.color = "#FFFFFF";
    userLocationWeather.textContent = "Location access denied";
  }
}
