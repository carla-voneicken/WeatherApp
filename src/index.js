//Get values for the current date, including weekdays and months
function getDoubleDigits(digit) {
  if (digit < 10) {
    return `0${digit}`;
  } else {
    return `${digit}`;
  }
}

let now = new Date();
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let minute = getDoubleDigits(now.getMinutes());
let hour = getDoubleDigits(now.getHours());
let date = now.getDate();
let day = days[now.getDay()];
let month = months[now.getMonth()];
let year = now.getFullYear();

//Determine ordinal rank of a date (e.g. 1st, 2nd, 3rd,)
function getOrdinalRank(day) {
  if (day === 1 || day === 21 || day === 31) {
    return "st";
  } else {
    if (day === 2 || day === 22) {
      return "nd";
    } else {
      if (day === 3 || day === 23) {
        return "rd";
      } else {
        return "th";
      }
    }
  }
}
let ordinalRank = getOrdinalRank(date);

//Change date
let currentDate = document.querySelector("h5");
currentDate.innerHTML = `${day}, ${month} ${date}${ordinalRank} ${year}, ${hour}:${minute}`;

//Change Fahrenheit and Celcius
function changeToCelsius(event) {
  event.preventDefault();
  let temperature = document.querySelector("#current-temperature");
  temperature.innerHTML = "19";
  let activeDegree = document.querySelector("#celsius");
  activeDegree.classList.add("active-degree");
  let inactiveDegree = document.querySelector("#fahrenheit");
  inactiveDegree.classList.remove("active-degree");
}

function changeToFahrenheit(event) {
  event.preventDefault();
  let temperature = document.querySelector("#current-temperature");
  temperature.innerHTML = "66";
  let activeDegree = document.querySelector("#fahrenheit");
  activeDegree.classList.add("active-degree");
  let inactiveDegree = document.querySelector("#celsius");
  inactiveDegree.classList.remove("active-degree");
}

let celsius = document.querySelector("#celsius");
celsius.addEventListener("click", changeToCelsius);

let fahrenheit = document.querySelector("#fahrenheit");
fahrenheit.addEventListener("click", changeToFahrenheit);

//Display current temperature, city name, etc.
function displayCurrentWeather(response) {
  console.log(response);
  document.querySelector("#current-temperature").innerHTML = Math.round(
    response.data.temperature.current
  );

  document.querySelector("#feels-like").innerHTML = Math.round(
    response.data.temperature.feels_like
  );
  document.querySelector("#humidity").innerHTML = Math.round(
    response.data.temperature.humidity
  );
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed * 3.6
  );

  document.querySelector("#city").innerHTML = response.data.city;
  document.querySelector("#country").innerHTML = response.data.country;

  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `images/${response.data.condition.description}.png`
  );
  iconElement.setAttribute("alt", `${response.data.condition.description}`);
}

//Get data from weather API for specific city
function handleSubmit(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");
  getWeatherData(cityInput.value);
}

function getWeatherData(city) {
  let unit = "metric";
  let apiKey = "004446411fd5455tcb3a0d7cfdoca57a";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=${unit}`;

  axios.get(apiUrl).then(displayCurrentWeather);
}

let cityForm = document.querySelector("#search-city");
cityForm.addEventListener("submit", handleSubmit);

//Get data from weather API for current location
function getWeatherDataCurrentLocation(position) {
  let lon = position.coords.longitude;
  let lat = position.coords.latitude;
  let unit = "metric";
  let apiKey = "004446411fd5455tcb3a0d7cfdoca57a";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${lon}&lat=${lat}&key=${apiKey}&units=${unit}`;

  axios.get(apiUrl).then(displayCurrentWeather);
}

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", function () {
  navigator.geolocation.getCurrentPosition(getWeatherDataCurrentLocation);
});

//Display default city on loading
getWeatherData("Berlin");
