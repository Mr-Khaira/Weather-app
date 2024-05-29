export function searchError() {
  const brTag = document.createElement("br");
  searchBar.appendChild(brTag);
  const errorSpan = document.getElementById("errorSpan");
  errorSpan.style.color = "#FFFFFF";
  errorSpan.textContent = "No such Place exists ";
}

export function searchErrorRemove() {
  const errorSpan = document.getElementById("errorSpan");
  errorSpan.textContent = "";
}

export function createLogoAndValue(value, iconPath) {
  const span = document.createElement("span");
  span.innerHTML = logoAndValue(value, iconPath);
  return span;
}

export function logoAndValue(value, iconPath) {
  return `<img src="${iconPath}" style =" height: 25px; width: 25px" alt="icon"> ${value} `;
}

export function countriesLogos(listOfCities) {
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

export function epochToLocalTime(epochTime) {
  const baseTime = new Date(epochTime * 1000);
  // converting secs to milis bec Date obj expets times in seconds.

  const date = baseTime.getDate();
  const month = baseTime.getMonth() + 1;
  const year = baseTime.getFullYear();

  let hour = baseTime.getHours();
  let amPm = "AM";
  if (hour >= 12) {
    amPm = "PM";
    hour = hour > 12 ? hour - 12 : hour;
  } else {
    hour = hour === 0 ? 12 : hour;
  }

  const min = baseTime.getMinutes();
  // Print the result
  return `${hour}:${min}${amPm} ${date}-${month}-${year}`;
}

export function addBr(element) {
  return element.appendChild(document.createElement("br"));
}
