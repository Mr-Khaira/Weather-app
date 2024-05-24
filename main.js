"use strict";

const allTheLocationsDisplayed = document.getElementById(
  "allTheLocationsDisplayed"
);

document.addEventListener("DOMContentLoaded", function () {
  const searchBar = document.getElementById("searchBar");
  const searchBarInput = document.getElementById("searchBarInput");

  searchBar.addEventListener("submit", function (event) {
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
      let WatherObj = weather(city, country, currentTempUnit);
    } else {
      const city = query.trim();
      let WatherObj = weather(city, "", currentTempUnit);
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

    const weatherReportList = await WeatherReportOfCities(cityList, unit);
    displayWeather(weatherReportList);
    // We have got the weather info of all the cities in weatherReportList variable.
    // Next step is to exteact the values to be displayed.
  } catch (error) {
    console.error("Fetch operation failed:", error);
  }
  // cityList has the latitude and the longitude of all the cities in the world.
}

// function displayWaeather(unit) {
//   // This will just display the weather and not re-fetch the api only the seatch button will refetch the api.
// }

async function WeatherReportOfCities(cityList, unit) {
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

async function displayWeather(listOfCities) {
  const newDiv = document.createElement("div");

  let requiredlogos = countriesLogos(listOfCities);
  const theLogos = await getFlag(requiredlogos);

  listOfCities.forEach((element) => {
    const newDiv = document.createElement("div");
    newDiv.className = "containor-fluid";

    // The top content of the containor
    const flagSpan = document.createElement("span");
    flagSpan.innerHTML = getFlag(element.sys.country); // Assuming getFlag is an async function to fetch flag

    newDiv.appendChild(flag);
    const city = document.createElement("span");
    city.innerHTML = element.name;
    newDiv.appendChild(city);

    const country = document.createElement("span");
    country.innerHTML = element.sys.country;
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

    const maxTemp = document.createElement("span");
    maxTemp.innerHTML = logoAndValue(
      element.main.temp_max,
      "assets-icons/thermometer-sun-svgrepo-com.svg"
    );

    const minTemp = document.createElement("span");
    minTemp.innerHTML = logoAndValue(
      element.main.temp_min,
      "assets-icons/thermometer-snow-svgrepo-com.svg"
    );

    const brTag2 = document.createElement("br");
    newDiv.appendChild(brTag2);

    // The bottom content of the containor

    const windS = document.createElement("span");
    windS.innerHTML = logoAndValue(
      element.wind.speed,
      "assets-icons/wind-svgrepo-com.svg"
    );

    const humidity = document.createElement("span");
    humidity.innerHTML = logoAndValue(
      element.main.humidity,
      "assets-icons/humidity-svgrepo-com.svg"
    );

    const pressure = document.createElement("span");
    pressure.innerHTML = logoAndValue(
      element.main.pressure,
      "assets-icons/gauge-indicator-svgrepo-com.svg"
    );

    const SRise = document.createElement("span");
    SRise.innerHTML = logoAndValue(
      element.sys.sunrise,
      "assets-icons/sunrise-svgrepo-com.svg"
    );

    const SSet = document.createElement("span");
    SSet.innerHTML = logoAndValue(
      element.sys.sunset,
      "assets-icons/sunset-svgrepo-com.svg"
    );

    allTheLocationsDisplayed.appendChild(newDiv);
    // This ele is created at the top of the file.
  });
}

async function getFlag(countryCode) {
  // Example of an asynchronous function to fetch flag based on countryCode

  const theFlags = countryCode.map(async (ele) => {
    const resp = await fetch(`https://restcountries.com/v3.1/alpha/${ele}`);
    const data = await resp.json();
    console.log(data);
    console.log(data[0].coatOfArms.svg);
    return data.coatOfArms.svg;
  });
  let flags = await Promise.all(theFlags);
  console.log(flags);
  return flags;
}

function createLogoAndValue(value, iconPath) {
  const span = document.createElement("span");
  span.innerHTML = logoAndValue(value, iconPath);
  return span;
}

function logoAndValue(value, iconPath) {
  return `<img src="${iconPath}" alt="icon">${value}`;
}

function countriesLogos(listOfCities) {
  let newList = [];
  for (let i = 0; i < listOfCities.length; i++) {
    const element = listOfCities[i].sys.country;
    newList.push(element);
  }

  function removeDuplicates(newList) {
    return newList.filter((item, index) => newList.indexOf(item) === index);
  }
  newList = removeDuplicates(newList);
  console.log(newList);
  return newList;
}
// Use the prevoius lec's pagination. Data table

// Geolocation library

// Do The coutry logo thing and then display the logo.
