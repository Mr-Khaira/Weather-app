"use strict";

import { searchError, searchErrorRemove } from "./utilities.js";
import { WeatherReportOfCities, userLocation } from "./allFetchFunctions.js";
import { displayWeatherAllLocations } from "./mainDisplayFunction.js";

const allTheLocationsDisplayed = document.getElementById(
  "allTheLocationsDisplayed"
);

let currentTempUnit = "metric";

userLocation(currentTempUnit);

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
      } else {
        searchErrorRemove();
      }
    } else {
      const city = query.trim();
      let weatherObj = await weather(city, "", currentTempUnit);
      if (weatherObj === 0) {
        searchError();
      } else {
        searchErrorRemove();
      }
    }
  });

  //The temp unit selection :-

  const tempInK = document.getElementById("tempUnitK");
  tempInK.addEventListener("click", () => {
    currentTempUnit = "standard";
    UpdateDisplay(currentTempUnit);
    userLocation(currentTempUnit);
  });

  const tempInC = document.getElementById("tempUnitC");
  tempInC.addEventListener("click", () => {
    currentTempUnit = "metric";
    UpdateDisplay(currentTempUnit);
    userLocation(currentTempUnit);
  });

  const tempInF = document.getElementById("tempUnitF");
  tempInF.addEventListener("click", () => {
    currentTempUnit = "imperial";
    UpdateDisplay(currentTempUnit);
    userLocation(currentTempUnit);
  });
});

async function UpdateDisplay(currUnit) {
  // console.log("Current temp", currUnit);
  const searchBarInput = document.getElementById("searchBarInput");
  let query = searchBarInput.value;
  query = query.toLowerCase();

  const commaExist = query.search(","); // -1 if not existing.
  const commaAt = query.indexOf(",");

  // The search returns -1 if the string to be searched is not found.
  if (commaExist !== -1) {
    const city = query.slice(0, commaAt).trim();
    const country = query.slice(commaAt + 1).trim(); // Index inclusive therfore + 1.
    const theList = await weather(city, country, currUnit);
  } else {
    const city = query.trim();
    const theList = await weather(city, "", currUnit);
  }
}

async function weather(city, country = "", unit = "metric") {
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

    await displayWeatherAllLocations(weatherReportList, true);

    // We have got the weather info of all the cities in weatherReportList variable.
    // Next step is to exteact the values to be displayed.
  } catch (error) {
    console.error("Fetch operation failed:", error);
  }
  // cityList has the latitude and the longitude of all the cities in the world.
}
