import "../styles/styles.scss";
import axios from "axios";

let latitude = null;
let longitude = null;

let today = {
  weekday: null,
  dayNumber: null,
  monthNumber: null,
  yearNumber: null,
  location: null,
  temperature: null,
  humidity: null,
  wind: null,
  wind_direction: null
};

const APIkey = "137c1af9ef9b2e1406ff32a352a0f8fc";
const APIlang = "uk";
const APIexclude = "[minutely,hourly]";
const APIunits = "auto";
const proxyServerSettings = "https://cors-anywhere.herokuapp.com/";
let API = "https://api.darksky.net/forecast/";

const forecastElement = document.querySelector(".forecast");
const weekdayTodayElement = forecastElement.querySelector(".forecast__weekday--today");
const dateTodayElement = forecastElement.querySelector(".forecast__date--today");
const locationElement = forecastElement.querySelector(".forecast__location");
const degreeTodayElement = forecastElement.querySelector(".forecast__degree-num");
const iconTodayElement = forecastElement.querySelector(".forecast__icon--big");
const humidityTodayElement = forecastElement.querySelector(".forecast__humidity--today");
const windTodayElement = forecastElement.querySelector(".forecast__wind--today");
const directionTodayElement = forecastElement.querySelector(".forecast__wind-direction--today");

function onError(error) {
  alert(`Ошибка при определении положения: ${error.message}`);
}

function onSuccess(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;

  updateAPI();

  fetchWeatherData(API).then(response => {
    updateTodayData(response);
    updateTodayView(today);
  });
}

function fetchWeatherData(API) {
  return axios
    .get(API)
    .then(function(response) {
      console.log(response);
      return response;
    })
    .catch(function(error) {
      alert(error);
    });
}

function updateAPI() {
  API = `${proxyServerSettings}https://api.darksky.net/forecast/${APIkey}/${latitude},${longitude}?lang=${APIlang}&exclude=${APIexclude}&units=${APIunits}`;
}

function updateTodayData(response) {
  const dataInSeconds = response.data.currently.time;

  const weekdayConversation = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const date = new Date(dataInSeconds * 1000);

  const weekdayNumber = date.getDay();
  const weekday = weekdayConversation[weekdayNumber];

  let dayNumber = date.getDate();
  if (dayNumber < 10) {
    dayNumber = "0" + dayNumber;
  }

  let monthNumber = date.getMonth() + 1; //January is 0!
  if (monthNumber < 10) {
    monthNumber = "0" + monthNumber;
  }

  const yearNumber = date.getFullYear();
  const location = response.data.timezone;
  const temperature = Number.parseInt(response.data.currently.temperature);
  // Допиши humidity, wind, wind_direction 

  today = { weekday, dayNumber, monthNumber, yearNumber, location, temperature };
}

function updateTodayView(todayData) {
  weekdayTodayElement.textContent = todayData.weekday;
  dateTodayElement.textContent = `${todayData.dayNumber}-${todayData.monthNumber}-${todayData.yearNumber}`;
  locationElement.textContent = todayData.location;
  // Допиши тепрературу
  // Це показує тілки градус, без одиниць виміру і іконки degreeTodayElement.textContent = todayData.temperature;
}

function init() {
  navigator.geolocation.getCurrentPosition(onSuccess, onError);
}

init();
