"use strict";

import { searchError, logoAndValue, countriesLogos } from "./utilities.js";
import { WeatherReportOfCities, getFlag } from "./allFetchFunctions.js";

const allTheLocationsDisplayed = document.getElementById(
  "allTheLocationsDisplayed"
);

document.addEventListener("DOMContentLoaded", function () {
  const searchBar = document.getElementById("searchBar");
  const searchBarInput = document.getElementById("searchBarInput");

  searchBar.addEventListener("submit", async function (event) {
    event.preventDefault();
    allTheLocationsDisplayed.innerHTML = "";

    let query = searchBarInput.value;
    query = query.toLowerCase();

    const commaExist = query.search(","); // -1 if not existing.
    const commaAt = query.indexOf(",");

    // The search returns -1 if the string to be searched is not found.
    if (commaExist !== -1) {
      const city = query.slice(0, commaAt).trim();
      const country = query.slice(commaAt + 1).trim(); // Index inclusive therfore + 1.
      let weatherObj = await weather(city, country, currentTempUnit);
      if (weatherObj === 0) {
        searchError();
      }
    } else {
      const city = query.trim();
      let weatherObj = await weather(city, "", currentTempUnit);
      if (weatherObj === 0) {
        searchError();
      }
    }
  });

  //The temp unit selection :-
  let currentTempUnit = undefined;

  const tempInK = this.getElementById("tempUnitK");
  tempInK.addEventListener("click", () => {
    currentTempUnit = "standard";
  });

  const tempInC = this.getElementById("tempUnitC");
  tempInC.addEventListener("click", () => {
    currentTempUnit = "metric";
  });

  const tempInF = this.getElementById("tempUnitF");
  tempInF.addEventListener("click", () => {
    currentTempUnit = "emperial";
  });
});

async function weather(city, country = "", unit = "metric") {
  // appid=e48dd7e2b32f4f907d573e78970b1e8e
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
    displayWeather(weatherReportList);
    // We have got the weather info of all the cities in weatherReportList variable.
    // Next step is to exteact the values to be displayed.
  } catch (error) {
    console.error("Fetch operation failed:", error);
  }
  // cityList has the latitude and the longitude of all the cities in the world.
}

async function displayWeather(listOfCities) {
  const newDiv = document.createElement("div");

  let requiredlogos = countriesLogos(listOfCities);
  const theFlags = await getFlag(requiredlogos);

  listOfCities.forEach((element) => {
    const newDiv = document.createElement("div");
    newDiv.className = "containor-fluid";
    newDiv.style.color = "white";
    newDiv.style.backgroundColor = "#0086F4";
    newDiv.style.display = "inline";

    const cityFlag = theFlags.find((flag) => flag.code === element.sys.country);

    //The top content of the containor
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

    const brTag = document.createElement("br");
    newDiv.appendChild(brTag);

    // The middle content of the containor

    const currTemp = document.createElement("span");
    currTemp.innerHTML = logoAndValue(
      element.main.temp,
      "assets-icons/thermometer-low-svgrepo-com.svg"
    );
    newDiv.appendChild(currTemp);

    const maxTemp = document.createElement("span");
    maxTemp.innerHTML = logoAndValue(
      element.main.temp_max,
      "assets-icons/thermometer-sun-svgrepo-com.svg"
    );
    newDiv.appendChild(maxTemp);

    const minTemp = document.createElement("span");
    minTemp.innerHTML = logoAndValue(
      element.main.temp_min,
      "assets-icons/thermometer-snow-svgrepo-com.svg"
    );
    newDiv.appendChild(minTemp);

    const brTag2 = document.createElement("br");
    newDiv.appendChild(brTag2);

    // The bottom content of the containor

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

    const SRise = document.createElement("span");
    SRise.innerHTML = logoAndValue(
      element.sys.sunrise,
      "assets-icons/sunrise-svgrepo-com.svg"
    );
    newDiv.appendChild(SRise);

    const SSet = document.createElement("span");
    SSet.innerHTML = logoAndValue(
      element.sys.sunset,
      "assets-icons/sunset-svgrepo-com.svg"
    );
    newDiv.appendChild(SSet);
    const brTag3 = document.createElement("br");
    newDiv.appendChild(brTag3);

    allTheLocationsDisplayed.appendChild(newDiv);
    // This ele is created at the top of the file.
  });
}

// Use the prevoius lec's pagination. Data table

// Geolocation library

// Do The coutry logo thing and then display the logo.
