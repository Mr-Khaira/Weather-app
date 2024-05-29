import {
  logoAndValue,
  countriesLogos,
  epochToLocalTime,
  addBr,
} from "./utilities.js";
import { getFlag } from "./allFetchFunctions.js";

export async function displayWeatherAllLocations(
  listOfCities,
  allLocations = true
) {
  // Clearing previous data.
  allTheLocationsDisplayed.innerHTML = "";

  const newDiv = document.createElement("div");

  let requiredlogos = countriesLogos(listOfCities);
  const theFlags = await getFlag(requiredlogos);

  console.log("List of cities ", listOfCities);

  listOfCities.forEach((element) => {
    const newDiv = document.createElement("div");
    newDiv.className = "containor-fluid";
    newDiv.style.borderRadius = "3px";
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

    addBr(newDiv);

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

    addBr(newDiv);

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

    // This ele is created at the top of the file.
  });
}
