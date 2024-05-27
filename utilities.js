export function searchError() {
  const brTag = document.createElement("br");
  searchBar.appendChild(brTag);
  const errorSpan = document.createElement("span");
  errorSpan.style.color = "#FFFFFF";
  errorSpan.textContent = "No such Place exists ";
  searchBar.appendChild(errorSpan);
}

export function createLogoAndValue(value, iconPath) {
  const span = document.createElement("span");
  span.innerHTML = logoAndValue(value, iconPath);
  return span;
}

export function logoAndValue(value, iconPath) {
  return `<img src="${iconPath}" style =" height: 25px; width: 25px" alt="icon">${value} `;
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
