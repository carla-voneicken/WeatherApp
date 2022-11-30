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
