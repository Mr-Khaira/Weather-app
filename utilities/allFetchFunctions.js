import {
  logoAndValue,
  countriesLogos,
  epochToLocalTime,
  addBr,
} from "./helperFunctions.js";

const apiID = process.env.API_ID;

export async function WeatherReportOfCities(cityList, unit) {
  let theList = cityList.map(async (item) => {
    try {
      const weather = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${item.lat}&lon=${item.lon}&appid=${apiID}&units=${unit}`
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
    await displayWeatherSingle(weatherReportList);
  }
  function error() {
    userLocationWeather.style.color = "#FFFFFF";
    userLocationWeather.textContent = "Location access denied";
  }
}

async function displayWeatherSingle(listOfCities) {
  let requiredlogos = countriesLogos(listOfCities);
  const theFlags = await getFlag(requiredlogos);

  listOfCities.forEach((element) => {
    const newDiv = document.createElement("div");
    newDiv.style.width = "25rem";
    newDiv.style.borderRadius = "3px";
    newDiv.style.color = "white";
    newDiv.style.backgroundColor = "#0086F4";
    newDiv.style.display = "inline";

    const cityFlag = theFlags.find((flag) => flag.code === element.sys.country);

    //The top content of the container
    const flagSpan = document.createElement("span");
    if (cityFlag) {
      flagSpan.innerHTML = logoAndValue("", cityFlag.flagUrl);
    }
    newDiv.appendChild(flagSpan);

    const city = document.createElement("span");
    city.innerHTML = element.name + ", ";
    newDiv.appendChild(city);

    const country = document.createElement("span");
    country.innerHTML = element.sys.country + ", ";
    newDiv.appendChild(country);

    const wDescription = document.createElement("span");
    wDescription.innerHTML = element.weather[0].description;
    newDiv.appendChild(wDescription);

    addBr(newDiv);

    // The middle content of the container
    const currTemp = document.createElement("span");
    currTemp.innerHTML = logoAndValue(
      element.main.temp,
      "assets-icons/thermometer-748-svgrepo-com.svg"
    );
    newDiv.appendChild(currTemp);

    const maxTemp = document.createElement("span");
    maxTemp.innerHTML = logoAndValue(
      element.main.temp_max,
      "assets-icons/thermometer-up-740-svgrepo-com.svg"
    );
    newDiv.appendChild(maxTemp);

    const minTemp = document.createElement("span");
    minTemp.innerHTML = logoAndValue(
      element.main.temp_min,
      "assets-icons/thermometer-down-739-svgrepo-com.svg"
    );
    newDiv.appendChild(minTemp);

    addBr(newDiv);

    // The bottom content of the container
    const windS = document.createElement("span");
    windS.innerHTML = logoAndValue(
      element.wind.speed,
      "assets-icons/wind-svgrepo-com.svg"
    );
    newDiv.appendChild(windS);

    const humidity = document.createElement("span");
    humidity.innerHTML = logoAndValue(
      element.main.humidity,
      "assets-icons/humidity-svgrepo-com.svg"
    );
    newDiv.appendChild(humidity);

    const pressure = document.createElement("span");
    pressure.innerHTML = logoAndValue(
      element.main.pressure,
      "assets-icons/gauge-indicator-svgrepo-com.svg"
    );
    newDiv.appendChild(pressure);

    addBr(newDiv);

    const SRise = document.createElement("span");
    SRise.innerHTML = logoAndValue(
      epochToLocalTime(element.sys.sunrise),
      "assets-icons/sunrise-svgrepo-com.svg"
    );
    newDiv.appendChild(SRise);

    addBr(newDiv);

    const SSet = document.createElement("span");
    SSet.innerHTML = logoAndValue(
      epochToLocalTime(element.sys.sunset),
      "assets-icons/sunset-svgrepo-com.svg"
    );
    newDiv.appendChild(SSet);
    addBr(newDiv);

    userLocationWeather.appendChild(newDiv);
  });
}
