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
  temperature.innerHTML = Math.round(celsiusTemperature);
  let activeDegree = document.querySelector("#celsius");
  activeDegree.classList.add("active-degree");
  let inactiveDegree = document.querySelector("#fahrenheit");
  inactiveDegree.classList.remove("active-degree");
}

function changeToFahrenheit(event) {
  event.preventDefault();
  let fahrenheitTemperature = Math.round((celsiusTemperature * 9) / 5 + 32);
  let temperature = document.querySelector("#current-temperature");
  temperature.innerHTML = fahrenheitTemperature;
  let activeDegree = document.querySelector("#fahrenheit");
  activeDegree.classList.add("active-degree");
  let inactiveDegree = document.querySelector("#celsius");
  inactiveDegree.classList.remove("active-degree");
}

let celsius = document.querySelector("#celsius");
celsius.addEventListener("click", changeToCelsius);

let fahrenheit = document.querySelector("#fahrenheit");
fahrenheit.addEventListener("click", changeToFahrenheit);

//Call API for Forecast

function displayForecast(response) {
  console.log(response.data);

  let forecastElement = document.querySelector("#forecast");
  let days = ["Sat", "Sun", "Mon", "Tue", "Wed"];

  let forecastHTML = `<div class="row">`;
  days.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      `<div class="col forecast">
          <img src="images/rain-day.png" alt="" class="image-forecast" />
          <div class="date-forecast">${day}</div>
          <div class="temperature-forecast">
            <span class="forecast-temperature-max"></span>°C/
            <span class="forecast-temperature-min"></span>°C
          </div>
        </div>`;
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

//Display current temperature, city name, etc.
function displayCurrentWeather(response) {
  celsiusTemperature = Math.round(response.data.temperature.current);

  document.querySelector("#current-temperature").innerHTML = celsiusTemperature;

  document.querySelector("#humidity").innerHTML = Math.round(
    response.data.temperature.humidity
  );
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed * 3.6
  );

  document.querySelector("#city").innerHTML = response.data.city;
  document.querySelector("#country").innerHTML = response.data.country;

  document.querySelector("#description").innerHTML =
    response.data.condition.description;

  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute("src", `images/${response.data.condition.icon}.png`);
  iconElement.setAttribute("alt", `${response.data.condition.icon}`);
}

//Get data from weather API for specific city
function getWeatherData(city) {
  let unit = "metric";
  let apiKey = "004446411fd5455tcb3a0d7cfdoca57a";
  let apiUrlCurrent = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=${unit}`;
  let apiUrlForecast = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=${unit}
`;

  axios.get(apiUrlCurrent).then(displayCurrentWeather);
  axios.get(apiUrlForecast).then(displayForecast);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");
  getWeatherData(cityInput.value);
}

let cityForm = document.querySelector("#search-city");
cityForm.addEventListener("submit", handleSubmit);

//Get data from weather API for current location
function getWeatherDataCurrentLocation(position) {
  let lon = position.coords.longitude;
  let lat = position.coords.latitude;
  let unit = "metric";
  let apiKey = "004446411fd5455tcb3a0d7cfdoca57a";
  let apiUrlCurrent = `https://api.shecodes.io/weather/v1/current?lon=${lon}&lat=${lat}&key=${apiKey}&units=${unit}`;
  let apiUrlForecast = `https://api.shecodes.io/weather/v1/current?lat=${lat}&lon=${lon}&key=${apiKey}&units=${unit}
`;

  axios.get(apiUrlCurrent).then(displayCurrentWeather);
  axios.get(apiUrlForecast).then(displayForecast);
}

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", function () {
  navigator.geolocation.getCurrentPosition(getWeatherDataCurrentLocation);
});

let celsiusTemperature = null;

//Display default city on loading
getWeatherData("Berlin");
