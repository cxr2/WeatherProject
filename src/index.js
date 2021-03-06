function formatDate(timestamp) {
  let now = new Date(timestamp);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = days[now.getDay()];
  let date = now.getDate();
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let month = months[now.getMonth()];
  return `${formatHours(timestamp)}, ${day}, ${month} ${date}`;
}

function formatHours(timestamp) {
  let now = new Date(timestamp);
  let hours = now.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`;
}

function displayWeather(response) {
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let countryElement = document.querySelector("#country");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#windspeed");
  let dateElement = document.querySelector("#datetime");
  let iconElement = document.querySelector("#icon");

  celsiusTemperature = response.data.main.temp;

  temperatureElement.innerHTML = Math.round(response.data.main.temp);
  cityElement.innerHTML = response.data.name;
  countryElement.innerHTML = response.data.sys.country;
  descriptionElement.innerHTML = response.data.weather[0].main;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed) + " km/h";
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
}

function showCelsius(event) {
  event.preventDefault();
  let temperature = document.querySelector("#temperature");
  celsiusButton.classList.add("active");
  fahrenheitButton.classList.remove("active");
  temperature.innerHTML = Math.round(celsiusTemperature);
}

let celsiusButton = document.querySelector("#celsius");
celsiusButton.addEventListener("click", showCelsius);

function convertFahrenheit(event) {
  event.preventDefault();
  let temperature = document.querySelector("#temperature");
  celsiusButton.classList.remove("active");
  fahrenheitButton.classList.add("active");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperature.innerHTML = Math.round(fahrenheitTemperature);
}

let fahrenheitButton = document.querySelector("#fahrenheit");
fahrenheitButton.addEventListener("click", convertFahrenheit);
let celsiusTemperature = null;

function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null;
  let forecast = null;

  for (let index = 0; index <= 4; index++) {
    forecast = response.data.list[index];
    forecastElement.innerHTML += `
    <div class="col">
      <div class="card forecast">
  <div class="card-body">
    <h5 class="card-title">${formatHours(forecast.dt * 1000)}</h5>
    <p class="card-text forecast"><img class="icons" src="http://openweathermap.org/img/wn/${
      forecast.weather[0].icon
    }@2x.png"><span class="weektemp"><strong>${Math.round(
      forecast.main.temp_max
    )}°</strong> ${Math.round(forecast.main.temp_min)}°</span></p>
  </div>
</div></div>`;
  }
}

function searchCity(city) {
  let apiKey = "15351fed24e9858d556a9255a2af3e61";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeather);
  let searchInput = document.querySelector("#cityInput");

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#cityInput").value;
  searchCity(city);
}

let searchForm = document.querySelector("#search");
searchForm.addEventListener("click", handleSubmit);
searchCity("London");

function searchLocation(position) {
  let apiKey = "38610e778dfb23c2f5bc0f2dc89e84b3";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeather);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayCurrentForecast);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

let currentLocationButton = document.querySelector("#currentlocation");
currentLocationButton.addEventListener("click", getCurrentLocation);

function displayCurrentForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null;
  let forecast = null;

  for (let index = 0; index <= 4; index++) {
    forecast = response.data.list[index];
    forecastElement.innerHTML += `
    <div class="col">
      <div class="card forecast">
  <div class="card-body">
    <h5 class="card-title">${formatHours(forecast.dt * 1000)}</h5>
    <p class="card-text forecast"><img class="icons" src="http://openweathermap.org/img/wn/${
      forecast.weather[0].icon
    }@2x.png"><span class="weektemp"><strong>${Math.round(
      forecast.main.temp_max
    )}°</strong> ${Math.round(forecast.main.temp_min)}°</span></p>
  </div>
</div></div>`;
  }
}
