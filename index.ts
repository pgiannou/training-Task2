import './style.scss';
import { apiKey } from './credentials';
import * as options from './options';

var cities: string[] = ['Thessaloniki', 'Athens'];

callAPIForInitCards();

function makeGraphsForSearchText() {
  var searchLocationInput = document.querySelector<HTMLInputElement>(
    '#searchLocationInput'
  );
  var searchLocationInputText = searchLocationInput.value;

  let url =
    'https://api.weatherapi.com/v1/forecast.json?key=' +
    apiKey +
    '&q=' +
    searchLocationInputText +
    '&days=1&aqi=yes&alerts=no';

  fetch(url, { method: 'GET' })
    .then((result) => result.json())
    .then((response) => {
      if (!cities.includes(searchLocationInputText)) {
        getWeatherInfoAndMakeHourlyTemperatureGraph(cities[cities.length - 1]);
        getWeatherInfoAndMakeMaximumTemperatureGraph(
          cities[cities.length - 1],
          1
        );
        getWeatherInfoAndMakeAirQualityGraph(cities[cities.length - 1]);

        for (let i = 0; i < navigateBetweenDaysInGaugeGraph.length; i++) {
          navigateBetweenDaysInGaugeGraph[i].addEventListener('click', () => {
            getWeatherInfoAndMakeMaximumTemperatureGraph(
              cities[cities.length - 1],
              i
            );
          });
        }
      }
    });
  getWeatherInfoAndMakeHourlyTemperatureGraph(searchLocationInputText);
  getWeatherInfoAndMakeMaximumTemperatureGraph(searchLocationInputText, 1);
  getWeatherInfoAndMakeAirQualityGraph(searchLocationInputText);

  for (let i = 0; i < navigateBetweenDaysInGaugeGraph.length; i++) {
    navigateBetweenDaysInGaugeGraph[i].addEventListener('click', () => {
      getWeatherInfoAndMakeMaximumTemperatureGraph(searchLocationInputText, i);
    });
  }
}

var navigateFromCityCardToGraphButtons = document.querySelectorAll(
  '.main-locations-city-cards-div-chevron-right'
);

var navigateBetweenDaysInGaugeGraph = document.querySelectorAll<HTMLElement>(
  '.main-dashboard-title-city-charts-item-days-line-specific'
);
for (let i = 0; i < navigateFromCityCardToGraphButtons.length; i++) {
  navigateFromCityCardToGraphButtons[i].addEventListener('click', () => {
    makeGraphs(i);
  });
}

function makeGraphs(i: number) {
  getWeatherInfoAndMakeHourlyTemperatureGraph(cities[i]);
  getWeatherInfoAndMakeMaximumTemperatureGraph(cities[i], 1);
  getWeatherInfoAndMakeAirQualityGraph(cities[i]);

  for (var j = 0; j < navigateBetweenDaysInGaugeGraph.length; j++) {
    navigateBetweenDaysInGaugeGraph[j].addEventListener('click', () => {
      getWeatherInfoAndMakeMaximumTemperatureGraph(cities[i], j);
    });
  }
}

var navigateBetweenDaysInGaugeGraphLine =
  document.querySelectorAll<HTMLElement>(
    '.main-dashboard-title-city-charts-item-days-line'
  );

navigateBetweenDaysInGaugeGraphLine[0].style.visibility = 'hidden';

function callAPIForInitCards() {
  document.querySelectorAll(
    '.main-dashboard-title-charts-top-title-content-left-temperature'
  )[0].innerHTML = '';
  document.querySelectorAll(
    '.main-dashboard-title-charts-top-title-content-left-details'
  )[0].innerHTML = '';
  document
    .querySelectorAll(
      '.main-dashboard-title-charts-top-title-content-right-img'
    )[0]
    .setAttribute('src', '');

  var searchLocationInput = document.querySelector<HTMLInputElement>(
    '#searchLocationInput'
  );

  searchLocationInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      makeGraphsForSearchText();
    }
  });

  for (let i = 0; i < cities.length; i++) {
    let url =
      'https://api.weatherapi.com/v1/forecast.json?key=' +
      apiKey +
      '&q=' +
      cities[i] +
      '&days=1&aqi=yes&alerts=no';

    fetch(url, { method: 'GET' })
      .then((result) => result.json())
      .then((response) => {
        document
          .querySelectorAll('.main-locations-city-cards-div-img-specific')
          [i].setAttribute(
            'src',
            response['forecast']['forecastday']['0']['day']['condition']['icon']
          );

        document.querySelectorAll('.main-locations-city-cards-temperature')[
          i
        ].innerHTML =
          Math.ceil(
            response['forecast']['forecastday']['0']['day']['maxtemp_c']
          ) +
          '<sup>o</sup>C - ' +
          Math.ceil(
            response['forecast']['forecastday']['0']['day']['mintemp_c']
          ) +
          '<sup>o</sup>C';

        document.querySelectorAll('.main-locations-city-cards-city')[
          i
        ].innerHTML = response['location']['name'];
      });
  }
}

function initDashboardInfo(response) {
  var dashboardTitle = document.querySelectorAll(
    '.main-dashboard-title-text'
  )[0];
  dashboardTitle.innerHTML =
    response['location']['name'] +
    ', ' +
    response['location']['region'] +
    ', ' +
    response['location']['tz_id'];

  var dateNow = new Date();
  document.querySelectorAll(
    '.main-dashboard-title-charts-top-title-content-left-temperature'
  )[0].innerHTML =
    response['forecast']['forecastday']['0']['hour'][dateNow.getHours()][
      'temp_c'
    ];
  document.querySelectorAll(
    '.main-dashboard-title-charts-top-title-content-left-details'
  )[0].innerHTML =
    'Day ' +
    Math.ceil(response['forecast']['forecastday']['0']['day']['maxtemp_c']) +
    '<sup>o</sup>C - Night ' +
    Math.ceil(response['forecast']['forecastday']['0']['day']['mintemp_c']) +
    '<sup>o</sup>C';
  document
    .querySelectorAll(
      '.main-dashboard-title-charts-top-title-content-right-img'
    )[0]
    .setAttribute(
      'src',
      response['forecast']['forecastday']['0']['day']['condition']['icon']
    );
}

function getWeatherInfoAndMakeHourlyTemperatureGraph(selectedCity: string) {
  var date = new Date();

  date.setDate(date.getDate() - 1);

  let url =
    'https://api.weatherapi.com/v1/history.json?key=' +
    apiKey +
    '&q=' +
    selectedCity +
    '&dt=' +
    date.toLocaleDateString('en-GB').split('/').reverse().join('-');

  fetch(url, { method: 'GET' })
    .then((result) => result.json())
    .then((response) => {
      options.makeHourlyTemperatureGraph(response);
    })
    .catch((error) => {
      alert('Wrong location');
    });
}

function getWeatherInfoAndMakeMaximumTemperatureGraph(
  selectedCity: string,
  selectedDay: number
) {
  console.log(selectedDay);
  navigateBetweenDaysInGaugeGraphLine[0].style.visibility = 'visible';

  if (selectedDay == 0) {
    navigateBetweenDaysInGaugeGraph[1].style.borderBottom = '0px';
    navigateBetweenDaysInGaugeGraph[0].style.borderBottom = '2px solid blue';
    navigateBetweenDaysInGaugeGraph[2].style.borderBottom = '0px';

    var date = new Date();

    date.setDate(date.getDate() - 1);

    let url =
      'https://api.weatherapi.com/v1/history.json?key=' +
      apiKey +
      '&q=' +
      selectedCity +
      '&dt=' +
      date.toLocaleDateString('en-GB').split('/').reverse().join('-');

    fetch(url, { method: 'GET' })
      .then((result) => result.json())
      .then((response) => {
        options.makeMaxTemperatureGraph(response, selectedDay);
      });
  } else {
    if (selectedDay == 1) {
      navigateBetweenDaysInGaugeGraph[1].style.borderBottom = '2px solid blue';
      navigateBetweenDaysInGaugeGraph[0].style.borderBottom = '0px';
      navigateBetweenDaysInGaugeGraph[2].style.borderBottom = '0px';
    } else if (selectedDay == 2) {
      navigateBetweenDaysInGaugeGraph[0].style.borderBottom = '0px';
      navigateBetweenDaysInGaugeGraph[2].style.borderBottom = '2px solid blue';
      navigateBetweenDaysInGaugeGraph[1].style.borderBottom = '0px';
    }
    let url =
      'https://api.weatherapi.com/v1/forecast.json?key=' +
      apiKey +
      '&q=' +
      selectedCity +
      '&days=2&aqi=yes&alerts=no';

    fetch(url, { method: 'GET' })
      .then((result) => result.json())
      .then((response) => {
        options.makeMaxTemperatureGraph(response, selectedDay);

        initDashboardInfo(response);
      });
  }
}

function getWeatherInfoAndMakeAirQualityGraph(selectedCity: string) {
  let url: string =
    'https://api.weatherapi.com/v1/forecast.json?key=' +
    apiKey +
    '&q=' +
    selectedCity +
    '&days=1&aqi=yes&alerts=no';

  fetch(url, { method: 'GET' })
    .then((result) => result.json())
    .then((response) => {
      //console.log(response);
      options.makeAirQualityGraph(response);
    });
}
