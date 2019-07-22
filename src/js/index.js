import "../styles/styles.scss";
import axios from "axios";

class Forecast {
  constructor() {
    this.forecastElement = document.querySelector(".forecast");
    this.weekdayTodayElement = this.forecastElement.querySelector(".forecast__weekday--today");
    this.dateTodayElement = this.forecastElement.querySelector(".forecast__date--today");
    this.locationElement = this.forecastElement.querySelector(".forecast__location");
    this.degreeTodayElement = this.forecastElement.querySelector(".forecast__degree-num");
    this.iconTodayElement = this.forecastElement.querySelector(".forecast__icon--big");
    this.humidityTodayElement = this.forecastElement.querySelector(".forecast__humidity--today");
    this.windTodayElement = this.forecastElement.querySelector(".forecast__wind--today");
    this.windDirectionTodayElement = this.forecastElement.querySelector(".forecast__wind-direction--today");
    this.showMoreDaysButton = this.forecastElement.querySelector(".forecast__days-change");
    this.daysShowNumberElement = this.forecastElement.querySelector(".forecast__days-show-number");

    this.maxSecondsWaitingGeoInfo = 7;
    this.nextDaysToShow = 4;
    this.maxDaysToShow = 7;
    this.minDaysToShow = 4;
    this.latitude = null;
    this.longitude = null;
    this.API = "https://api.darksky.net/forecast/";
    this.APIkey = "137c1af9ef9b2e1406ff32a352a0f8fc";
    this.APIlang = "uk";
    this.APIexclude = "[minutely,hourly]";
    this.APIunits = "auto";
    this.proxyServerSettings = "https://cors-anywhere.herokuapp.com/";
    this.responseData = null;
    this.todayData = {
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
    this.geoOptions = {
      timeout: this.maxSecondsWaitingGeoInfo * 1000
    };
    this.showMoreDaysHandle = this.showMoreDaysHandle.bind(this);
  }

  init() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.onSuccess.bind(this),
        this.onError.bind(this),
        this.geoOptions
      );
      this.showMoreDaysButton.addEventListener("click", this.showMoreDaysHandle);
    } else {
      alert("Geolocation is not supported for this Browser/OS version yet.");
    }
  }

  onSuccess(position) {
    this.latitude = position.coords.latitude;
    this.longitude = position.coords.longitude;
    this.updateAPI();

    this.fetchWeatherData(this.API).then(response => {
      this.responseData = response;
      this.updateTodayData(response);
      this.updateTodayView(this.todayData);
      this.removeSpinner(this.forecastElement);
      this.createNextDaysWeatherElements(this.nextDaysToShow, response, this.forecastElement);
    });
  }

  onError(error) {
    alert(`Ошибка при определении положения: ${error.message}`);
  }

  fetchWeatherData(API) {
    return axios.get(API)
      .then(function(response) {
        return response;
      })
      .catch(function(error) {
        alert(error);
      });
  }

  updateTodayData(response) {
    const dateInMilliseconds = response.data.currently.time * 1000;
    const date = new Date(dateInMilliseconds);

    const weekday = this.getStringWeekday(date);
    const dayNumber = this.getDayNumber(date);
    const monthNumber = this.getMonthNumber(date);
    const yearNumber = date.getFullYear();
    const location = response.data.timezone;
    const temperature = Math.round(response.data.currently.temperature);
    const humidity = Math.round(response.data.currently.humidity * 100);
    const windSpeed = response.data.currently.windSpeed;
    const windDirection = this.convertWindDirection(response.data.currently.windBearing);
    const iconName = response.data.currently.icon;

    this.todayData = {
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

  updateTodayView(todayData) {
    this.todayData = todayData;

    this.weekdayTodayElement.textContent = todayData.weekday;
    this.dateTodayElement.textContent = `${todayData.dayNumber}-${todayData.monthNumber}-${todayData.yearNumber}`;
    this.locationElement.textContent = todayData.location;
    this.degreeTodayElement.firstChild.textContent = todayData.temperature;
    this.humidityTodayElement.lastChild.textContent = " " + todayData.humidity + "%";
    this.windTodayElement.lastChild.textContent = " " + todayData.windSpeed + "m/s";
    this.windDirectionTodayElement.lastChild.textContent = " " + todayData.windDirection;
    this.iconTodayElement.innerHTML = `<i class="wi wi-forecast-io-${todayData.iconName}"></i>`;
  }

  createNextDaysWeatherElements(numberOfDays, response, container) {
    const dailyDataArr = response.data.daily.data;
    const workingDailyDataArr = dailyDataArr.slice(1, numberOfDays + 1);

    const elementsArr = workingDailyDataArr.map(current => {
      const dateInMilliseconds = current.time * 1000;
      const date = new Date(dateInMilliseconds);

      const element = document.createElement("div");
      element.classList.add("forecast__day");
      element.classList.add("forecast__day-next");

      const elementWeekday = document.createElement("p");
      elementWeekday.classList.add("forecast__weekday");
      elementWeekday.textContent = this.getStringWeekday(date);

      const elementIcon = document.createElement("i");
      elementIcon.classList.add("forecast__icon", "wi", `wi-forecast-io-${current.icon}`);

      const elementDegree = document.createElement("p");
      elementDegree.classList.add("forecast__degree");
      elementDegree.textContent = Math.round(current.temperatureMax);
      const elementDegreeIcon = document.createElement("i");
      elementDegreeIcon.classList.add("wi", "wi-celsius");
      elementDegree.insertAdjacentElement("beforeend", elementDegreeIcon);

      element.append(elementWeekday, elementIcon, elementDegree);
      return element;
    });

    this.removeElementsByClassName(container, "forecast__day-next");
    container.append(...elementsArr);
  }

  showMoreDaysHandle() {
    this.showMoreDaysButton.classList.toggle("modeDays--active");

    if (this.showMoreDaysButton.classList.contains("modeDays--active")) {
      this.nextDaysToShow = this.maxDaysToShow;
      this.daysShowNumberElement.textContent = this.minDaysToShow;
    } else {
      this.nextDaysToShow = this.minDaysToShow;
      this.daysShowNumberElement.textContent = this.maxDaysToShow;
    }
    this.createNextDaysWeatherElements(this.nextDaysToShow, this.responseData, this.forecastElement);
  }

  removeElementsByClassName(containerElement, removeChildClassName) {
    while (containerElement.querySelectorAll(`.${removeChildClassName}`).length > 0) {
      const element = containerElement.querySelector(`.${removeChildClassName}`);
      containerElement.removeChild(element);
    }
  }

  updateAPI() {
    this.API = `${this.proxyServerSettings}https://api.darksky.net/forecast/${this.APIkey}/${this.latitude},${this.longitude}?lang=${this.APIlang}&exclude=${this.APIexclude}&units=${this.APIunits}`;
  }

  convertWindDirection(direction) {
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

  getStringWeekday(date) {
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

  getDayNumber(date) {
    let dayNumber = date.getDate();
    if (dayNumber < 10) dayNumber = "0" + dayNumber;
    return dayNumber;
  }

  getMonthNumber(date) {
    let monthNumber = date.getMonth() + 1; //January is 0!
    if (monthNumber < 10) monthNumber = "0" + monthNumber;
    return monthNumber;
  }

  removeSpinner(container) {
    container.classList.remove("spinner");
  }
}

const forecast = new Forecast();
forecast.init();
