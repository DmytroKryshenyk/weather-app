import "../styles/styles.scss";
import axios from "axios";

const forecastElement = document.querySelector(".forecast");
const weekdayTodayElement = forecastElement.querySelector(".forecast__weekday--today");
const dateTodayElement = forecastElement.querySelector(".forecast__date--today");
const locationElement = forecastElement.querySelector(".forecast__location");
const degreeTodayElement = forecastElement.querySelector(".forecast__degree-num");
const iconTodayElement = forecastElement.querySelector(".forecast__icon--big");
const humidityTodayElement = forecastElement.querySelector(".forecast__humidity--today");
const windTodayElement = forecastElement.querySelector(".forecast__wind--today");
const windDirectionTodayElement = forecastElement.querySelector(".forecast__wind-direction--today");

const maxSecondsWaitingGeoInfo = 7;
const geoOptions = {
  timeout: maxSecondsWaitingGeoInfo * 1000
};

let nextDaysToShow = 4;

let spinnerStatus = true;

let latitude = null;
let longitude = null;

let API = "https://api.darksky.net/forecast/"; 
const APIkey = "137c1af9ef9b2e1406ff32a352a0f8fc";
const APIlang = "uk";
const APIexclude = "[minutely,hourly]";
const APIunits = "auto";
const proxyServerSettings = "https://cors-anywhere.herokuapp.com/";

let today = {
  weekday: null,
  dayNumber: null,
  monthNumber: null,
  yearNumber: null,
  location: null,
  temperature: null,
  humidity: null,
  windSpeed: null,
  windDirection: null,
  iconName: null
};

function onError(error) {
  alert(`Ошибка при определении положения: ${error.message}`);
} 

function onSuccess(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  updateAPI(); 

  fetchWeatherData(API).then(response => {
    console.log(response);
    updateTodayData(response);
    updateTodayView(today);
    createNextDaysWeatherElements(nextDaysToShow, response, forecastElement);
  });
}

function fetchWeatherData(API) {
  return axios
    .get(API)
    .then(function(response) {
      return response;
    })
    .catch(function(error) {
      alert(error);
    });
}

function updateAPI() {
  API = `${proxyServerSettings}https://api.darksky.net/forecast/${APIkey}/${latitude},${longitude}?lang=${APIlang}&exclude=${APIexclude}&units=${APIunits}`;
}

function convertWindDirection(direction) {
  switch (true) {
    case direction < 25 || direction >= 335:
      return "North";
    case direction < 65:
      return "North East";
    case direction < 115:
      return "East";
    case direction < 155:
      return "South East";
    case direction < 205:
      return "South";
    case direction < 245:
      return "South West";
    case direction < 295:
      return "West";
    case direction < 335:
      return "North West";
    default:
      return direction;
  }
}

function getStringWeekday(date) {
  const weekdayConversationArr = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  const weekdayNumber = date.getDay();
  return weekdayConversationArr[weekdayNumber];
}

function getDayNumber(date) {
  let dayNumber = date.getDate();
  if (dayNumber < 10) dayNumber = "0" + dayNumber;
  return dayNumber;
}

function getMonthNumber(date) {
  let monthNumber = date.getMonth() + 1; //January is 0!
  if (monthNumber < 10) monthNumber = "0" + monthNumber;
  return monthNumber;
}

function updateTodayData(response) {
  const dateInMilliseconds = response.data.currently.time * 1000;
  const date = new Date(dateInMilliseconds);

  const weekday = getStringWeekday(date);
  const dayNumber = getDayNumber(date);
  const monthNumber = getMonthNumber(date);
  const yearNumber = date.getFullYear();
  const location = response.data.timezone;
  const temperature = Math.round(response.data.currently.temperature);
  const humidity = Math.round(response.data.currently.humidity * 100);
  const windSpeed = response.data.currently.windSpeed;
  const windDirection = convertWindDirection(response.data.currently.windBearing);
  const iconName = response.data.currently.icon;

  today = {
    weekday,
    dayNumber,
    monthNumber,
    yearNumber,
    location,
    temperature,
    humidity,
    windSpeed,
    windDirection,
    iconName
  };
}

function updateTodayView(todayData) {
  weekdayTodayElement.textContent = todayData.weekday;
  dateTodayElement.textContent = `${todayData.dayNumber}-${todayData.monthNumber}-${todayData.yearNumber}`;
  locationElement.textContent = todayData.location;
  degreeTodayElement.firstChild.textContent = todayData.temperature;
  humidityTodayElement.lastChild.textContent = " " + todayData.humidity + "%";
  windTodayElement.lastChild.textContent = " " + todayData.windSpeed + "m/s";
  windDirectionTodayElement.lastChild.textContent = " " + todayData.windDirection;
  iconTodayElement.innerHTML = `<i class="wi wi-forecast-io-${todayData.iconName}"></i>`;
}

function createNextDaysWeatherElements(numberOfDays, response, container) {
  const dailyDataArr = response.data.daily.data;
  const workingDailyDataArr = dailyDataArr.slice(1, numberOfDays + 1);

  const elementsArr = workingDailyDataArr.map(current => {
    const dateInMilliseconds = current.time * 1000;
    const date = new Date(dateInMilliseconds);

    const element = document.createElement("div");
    element.classList.add("forecast__day");

    const elementWeekday = document.createElement("p");
    elementWeekday.classList.add("forecast__weekday");
    elementWeekday.textContent = getStringWeekday(date)

    const elementIcon = document.createElement("i");
    elementIcon.classList.add("forecast__icon", "wi", `wi-forecast-io-${current.icon}`);

    const elementDegree = document.createElement("p");
    elementDegree.classList.add("forecast__degree");
    elementDegree.textContent =  Math.round(current.temperatureMax);
    const elementDegreeIcon = document.createElement("i");
    elementDegreeIcon.classList.add("wi", "wi-celsius");
    elementDegree.insertAdjacentElement("beforeend", elementDegreeIcon);

    element.append(elementWeekday, elementIcon, elementDegree);
    return element;
  });

  container.append(...elementsArr);
} 

function init() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError, geoOptions);
  } else {
    alert("Geolocation is not supported for this Browser/OS version yet.");
  }
}

init();
