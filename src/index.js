//Get double digits for values under 10
function getDoubleDigits(digit) {
  if (digit < 10) {
    return `0${digit}`;
  } else {
    return `${digit}`;
  }
}

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

//Display current date
function displayCurrentDate(response) {
  let now = new Date(response.data.timestamp * 1000);
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

  let date = now.getDate();
  let day = days[now.getDay()];
  let month = months[now.getMonth()];
  let year = now.getFullYear();

  let ordinalRank = getOrdinalRank(date);

  let currentDate = document.querySelector("#date");
  currentDate.innerHTML = `${day}, ${month} ${date}${ordinalRank} ${year}`;
}

//Get timestamp for current location
//(This API isn't perfect because the output of the time is only completely
//correct if user is in GMT-zone. I couldn't find a good alternative though.)
function getCurrentTime(coordinates) {
  apiKey = "R7G2IHJQIUY6";
  apiUrl = `https://api.timezonedb.com/v2.1/get-time-zone?key=${apiKey}&format=json&by=position&lat=${coordinates.latitude}&lng=${coordinates.longitude}`;

  axios.get(apiUrl).then(changeCurrentTime);
}

//Determine date for forecast
function formatDay(timestamp) {
  let forecastDate = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  let date = getDoubleDigits(forecastDate.getDate());
  let month = getDoubleDigits(1 + forecastDate.getMonth());
  let day = days[forecastDate.getDay()];
  return `${day} ${date}.${month}.`;
}

//Display forecast data
function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index > 0 && index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="col forecast">
          <img src="images/${forecastDay.condition.icon}.png" alt="${
          forecastDay.condition.icon
        }" class="image-forecast" />
          <div class="date-forecast">${formatDay(forecastDay.time)}</div>
          <div class="temperature-forecast">
            <span class="forecast-temperature-max">${Math.round(
              forecastDay.temperature.maximum
            )}</span>°C/
            <span class="forecast-temperature-min">${Math.round(
              forecastDay.temperature.minimum
            )}</span>°C
          </div>
        </div>`;
      formatDay(forecastDay.time);
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

//Display current city name and data
function displayCurrentWeather(response) {
  document.querySelector("#city").innerHTML = response.data.city;
  document.querySelector("#country").innerHTML = response.data.country;

  document.querySelector("#current-temperature").innerHTML = Math.round(
    response.data.temperature.current
  );

  document.querySelector("#description").innerHTML =
    response.data.condition.description;
  document.querySelector("#humidity").innerHTML = Math.round(
    response.data.temperature.humidity
  );
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed * 3.6
  );

  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute("src", `images/${response.data.condition.icon}.png`);
  iconElement.setAttribute("alt", `${response.data.condition.icon}`);

  getCurrentTime(response.data.coordinates);
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
  let apiUrlForecast = `https://api.shecodes.io/weather/v1/forecast?lat=${lat}&lon=${lon}&key=${apiKey}&units=${unit}`;

  axios.get(apiUrlCurrent).then(displayCurrentWeather);
  axios.get(apiUrlForecast).then(displayForecast);
}

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", function () {
  navigator.geolocation.getCurrentPosition(getWeatherDataCurrentLocation);
});

//Display default city on loading
getWeatherData("Berlin");
