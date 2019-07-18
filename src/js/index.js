import "../styles/styles.scss";

const onSuccess = position => {
  const { latitude, longitude } = position.coords;

  console.log(`Широта: ${latitude}, Долгота: ${longitude}`);
};

const onError = error => console.error("Ошибка при определении положения: ", error);

navigator.geolocation.getCurrentPosition(onSuccess, onError);

// $(function() {
//     var APIKEY = '20ee60670d020bea26a4d65ae19116a1';
//     var today = new Date();

//     // Used for conversion to text weekday
//     var weekday = new Array(7);
//     weekday[0] = "Sunday";
//     weekday[1] = "Monday";
//     weekday[2] = "Tuesday";
//     weekday[3] = "Wednesday";
//     weekday[4] = "Thursday";
//     weekday[5] = "Friday";
//     weekday[6] = "Saturday";

//     var units = 'metric';
//     var dd = today.getDate();
//     var mm = today.getMonth() + 1; //January is 0!
//     var yyyy = today.getFullYear();

//     if (dd < 10) {
//       dd = '0' + dd
//     }

//     if (mm < 10) {
//       mm = '0' + mm
//     }
//     $('.today .forecast-header .day').html(weekday[today.getDay()]);
//     $('.today .forecast-header .date').html(dd + '-' + mm + '-' + yyyy);

//     var todayForParse = yyyy + '-' + mm + '-' + dd + 'T12:00:00Z'

//     var iconsMapping = {
//       "01d": ["day-sunny", "http://more-sky.com/data/out/12/IMG_542327.jpg"],
//       "02d": ["day-cloudy", "http://alliswall.com/file/1718/1920x1200/16:9/cloudy-weather-2.jpg"],
//       "03d": ["cloud", "https://wallpaperscraft.com/image/sky_clouds_bad_weather_dark_blue_gloomy_wheat_ranks_53138_1920x1080.jpg"],
//       "04d": ["cloudy", "https://wallpaperscraft.com/image/sky_clouds_bad_weather_dark_blue_gloomy_wheat_ranks_53138_1920x1080.jpg"],
//       "09d": ["day-showers", "http://more-sky.com/data/out/9/IMG_338943.jpg"],
//       "10d": ["day-rain", "https://virtualimmersion.files.wordpress.com/2015/03/rainy-night1.jpg"],
//       "11d": ["day-thunderstorm", "http://more-sky.com/data/out/12/IMG_568774.jpg"],
//       "13d": ["day-snow", "http://more-sky.com/data/out/12/IMG_509276.jpg"],
//       "50d": ["fog", "http://windows10wall.com/wp-content/uploads/2014/06/fod-hd-forest-black-and-white-in-fog-cool-widescreen-free-Wallpaper.jpg"],
//       "01n": ["night-clear", "https://virtualimmersion.files.wordpress.com/2015/03/rainy-night1.jpg"],
//       "02n": ["night-alt-cloudy", "https://virtualimmersion.files.wordpress.com/2015/03/rainy-night1.jpg"],
//       "03n": ["cloud", "https://virtualimmersion.files.wordpress.com/2015/03/rainy-night1.jpg"],
//       "04n": ["cloudy", "https://virtualimmersion.files.wordpress.com/2015/03/rainy-night1.jpg"],
//       "09n": ["night-showers", "https://virtualimmersion.files.wordpress.com/2015/03/rainy-night1.jpg"],
//       "10n": ["night-rain", "https://virtualimmersion.files.wordpress.com/2015/03/rainy-night1.jpg"],
//       "11n": ["night-thunderstorm", "https://virtualimmersion.files.wordpress.com/2015/03/rainy-night1.jpg"],
//       "13n": ["night-snow", "https://virtualimmersion.files.wordpress.com/2015/03/rainy-night1.jpg"],
//       "50n": ["fog", "https://virtualimmersion.files.wordpress.com/2015/03/rainy-night1.jpg"]
//     }

//     var windDirection = function(direction) {
//       switch (true) {
//         case (direction < 25 || direction >= 335):
//           return 'North';
//         case (direction < 65):
//           return 'North East';
//         case (direction < 115):
//           return 'East';
//         case (direction < 155):
//           return 'South East';
//         case (direction < 205):
//           return 'South';
//         case (direction < 245):
//           return 'South West';
//         case (direction < 295):
//           return 'West';
//         case (direction < 335):
//           return 'North West';
//         default:
//           return direction + '<sup>o</sup>'
//       }
//     }

//     function addDays(date, days) {
//       var result = new Date(date);
//       result.setDate(result.getDate() + days);
//       return result;
//     }

//     $('#switch-unit').click(function(){
//       if (units == 'metric') {
//         getWeather('imperial')
//         units = 'imperial'
//       } else {
//         getWeather('metric')
//         units = 'metric'
//       }
//     })

//     var getWeather = function(units) {
//       var unitsIcon = units == 'metric' ?
//           '<i class="wi wi-celsius"></i>' :
//           '<i class="wi wi-fahrenheit"></i>'
//       var speed = units == 'metric' ? 'm/s' : 'm/h'
//       if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(function(position) {
//           var url = 'https://api.openweathermap.org/data/2.5/forecast?&units='
//           url += units
//           url += '&lat='
//           url += position.coords.latitude;
//           url += '&lon=';
//           url += position.coords.longitude;
//           url += '&appid=';
//           url += APIKEY;
//           $.getJSON(url, function(data) {
//             // Update Location
//             $('.location').html(data.city.name + ' - ' + data.city.country)
//             // Update current day weather
//             var currentDayWeather = data.list[0]
//             // temperature
//             $('.degree .num').html(parseInt(currentDayWeather.main.temp) + unitsIcon)
//             // humidity
//             $('.humidity').html('<i class="wi wi-umbrella"></i>' + currentDayWeather.main.humidity + '%')
//             // wind speed
//             $('.wind').html('<i class="wi wi-strong-wind"></i>' + currentDayWeather.wind.speed + speed)
//             // wind direction
//             $('.wind-direction').html('<i class="wi wi-wind-direction"></i>' + windDirection(currentDayWeather.wind.deg))
//             // today big icon
//             $('.forecast-icon-big').html('<i class="wi wi-' + iconsMapping[currentDayWeather.weather[0].icon][0] + '"></i>')
//             $('body').css('background-image', 'url("' + iconsMapping[currentDayWeather.weather[0].icon][1] + '")')

//             // Update forecast for next 5 days
//             for (var i = 1; i < 5; i++) {
//               // get correct days
//               var searchDay = addDays(Date.parse(todayForParse), i)
//               var dayOfWeek = addDays(today, i).getDay()
//               // find particular day in json
//               var d = _.find(data.list, {
//                 dt: searchDay / 1000
//               })
//               // update UI
//               // day name
//               $('.day-' + i + ' .day').html(weekday[dayOfWeek])
//               // forecast small icon
//               $('.day-' + i + ' .forecast-icon').html('<i class="wi wi-' + iconsMapping[d.weather[0].icon][0] + '"></i>')
//               // forecast temperature
//               $('.day-' + i + ' .degree').html(parseInt(d.main.temp_max) + unitsIcon)
//             }
//           })
//         });
//       }
//     }

//     getWeather('metric');

//   });
