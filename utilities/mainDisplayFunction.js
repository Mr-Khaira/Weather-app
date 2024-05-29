/******************************************************************************
 ***
 * WEB422 – Assignment 1
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students.
 *
 * Name: Harkaran Singh Khaira Student ID: 170321210 Date: 28/05/2024
 *
 *
 ******************************************************************************
 **/
import {
  logoAndValue,
  countriesLogos,
  epochToLocalTime,
  addBr,
} from "./helperFunctions.js";
import { getFlag } from "./allFetchFunctions.js";

const previousPage = document.getElementById("prevPage");
const nextPage = document.getElementById("nextPage");
const allTheLocationsDisplayed = document.getElementById(
  "allTheLocationsDisplayed"
);
const userLocationWeather = document.getElementById("userLocationWeather");

let copiedListOfCities = [];
let currentPage = 0;
const itemsPerPage = 4;

previousPage.addEventListener("click", async () => {
  if (currentPage > 0) {
    currentPage--;

    await displayWeatherAllLocations(copiedListOfCities, true);

    console.log("previous page");
  }
});

nextPage.addEventListener("click", async () => {
  if ((currentPage + 1) * itemsPerPage < copiedListOfCities.length) {
    currentPage++;

    await displayWeatherAllLocations(copiedListOfCities, true);

    console.log("next page");
  }
});

export async function displayWeatherAllLocations(
  listOfCities,
  allLocations = true
) {
  // Clearing previous data.
  allTheLocationsDisplayed.innerHTML = "";
  copiedListOfCities = listOfCities;

  const start = currentPage * itemsPerPage;
  const end = Math.min(start + itemsPerPage, listOfCities.length);

  let requiredlogos = countriesLogos(listOfCities);
  const theFlags = await getFlag(requiredlogos);

  for (let i = start; i < end; i++) {
    const element = listOfCities[i];
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

    if (allLocations) {
      allTheLocationsDisplayed.appendChild(newDiv);
    } else {
      userLocationWeather.appendChild(newDiv);
    }
  }
}
