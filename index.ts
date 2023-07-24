import './style.scss';
import { apiKey } from './credentials';
import * as options from './options';

var cities: string[] = ['Thessaloniki', 'Athens'];

callAPIForInitCards();

function makeGraphsForSearchText() {
  document.querySelector<HTMLInputElement>(
    '.main-locations-field-search-icon'
  ).style.visibility = 'hidden';

  document.querySelector<HTMLInputElement>(
    '.main-locations-field-search-close'
  ).style.visibility = 'hidden';

  var searchLocationInput = document.querySelector<HTMLInputElement>(
    '#searchLocationInput'
  );

  if (searchLocationInput != null) {
    var searchLocationInputText = searchLocationInput.value;
  }

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
        getWeatherInfoAndMakeHourlyTemperatureGraph(searchLocationInputText);
        getWeatherInfoAndMakeMaximumTemperatureGraph(
          searchLocationInputText,
          1
        );
        getWeatherInfoAndMakeAirQualityGraph(searchLocationInputText);

        initMakeMaximumTemperatureGraph(searchLocationInputText);
      }
    });

  searchLocationInput.value = '';
}

function callAPIForInitCards() {
  initDashboard();

  addEvenetListenersInChevronIcons();

  for (let i = 0; i < cities.length; i++) {
    initCard(apiKey, cities[i], i);
  }
}

function addEvenetListenersInChevronIcons() {
  const searchLocationInput = document.querySelector<HTMLInputElement>(
    '#searchLocationInput'
  );

  const searchLocationIcon = document.querySelector<HTMLInputElement>(
    '.main-locations-field-search-icon'
  );

  searchLocationIcon.addEventListener('click', makeGraphsForSearchText);

  if (searchLocationInput != null) {
    searchLocationInput.addEventListener('keypress', (event) => {
      document.querySelector<HTMLInputElement>(
        '.main-locations-field-search-close'
      ).style.visibility = 'visible';
      if (event.key === 'Enter') {
        document.querySelector<HTMLInputElement>(
          '.main-locations-field-search-icon'
        ).style.visibility = 'hidden';
        document.querySelector<HTMLInputElement>(
          '.main-locations-field-search-close'
        ).style.visibility = 'hidden';
        makeGraphsForSearchText();
      }
    });
  }

  var navigateFromCityCardToGraphButtons = document.querySelectorAll(
    '.main-locations-city-cards-div-chevron-right'
  );

  if (navigateFromCityCardToGraphButtons != null) {
    for (let i = 0; i < navigateFromCityCardToGraphButtons.length; i++) {
      navigateFromCityCardToGraphButtons[i].addEventListener(
        'click',
        makeGraphs
      );
    }
  }
}

function makeGraphs($event: any) {
  getWeatherInfoAndMakeHourlyTemperatureGraph($event.target.id);
  getWeatherInfoAndMakeMaximumTemperatureGraph($event.target.id, 1);
  getWeatherInfoAndMakeAirQualityGraph($event.target.id);

  initMakeMaximumTemperatureGraph($event.target.id);
}

// function addEventListenersOnDaysInGaugeGraph($event1: any) {

//   initMakeMaximumTemperatureGraph($event1.target.id)
// var navigateBetweenDaysInGaugeGraphLine =
//   document.querySelectorAll<HTMLElement>(
//     '.main-dashboard-title-city-charts-item-days-line'
//   );

// if (navigateBetweenDaysInGaugeGraphLine != null) {
//   navigateBetweenDaysInGaugeGraphLine[0].style.visibility = 'visible';
// }

// var navigateBetweenDaysInGaugeGraph = document.querySelectorAll<HTMLElement>(
//   '.main-dashboard-title-city-charts-item-days-line-specific'
// );

// if (navigateBetweenDaysInGaugeGraph != null) {
//   for (var j = 0; j < navigateBetweenDaysInGaugeGraph.length; j++) {
//     navigateBetweenDaysInGaugeGraph[j].addEventListener('click', function () {

//     });
//   }
// }
//}

function initMakeMaximumTemperatureGraph(city: string) {
  const navigateBetweenDaysInGaugeGraphLine =
    document.querySelectorAll<HTMLElement>(
      '.main-dashboard-title-city-charts-item-days-line'
    );

  if (navigateBetweenDaysInGaugeGraphLine != null) {
    navigateBetweenDaysInGaugeGraphLine[0].style.visibility = 'visible';
  }

  const navigateBetweenDaysInGaugeGraph =
    document.querySelectorAll<HTMLElement>(
      '.main-dashboard-title-city-charts-item-days-line-specific'
    );

  if (navigateBetweenDaysInGaugeGraph != null) {
    for (let j = 0; j < navigateBetweenDaysInGaugeGraph.length; j++) {
      navigateBetweenDaysInGaugeGraph[j].addEventListener('click', function () {
        getWeatherInfoAndMakeMaximumTemperatureGraph(city, j);
      });
    }
  }
}

function initDashboard() {
  const searchLocationInput = document.querySelector<HTMLInputElement>(
    '#searchLocationInput'
  );

  if (searchLocationInput != null) {
    searchLocationInput.addEventListener('input', makeVisibleSearchIcon);
  }

  document.querySelector<HTMLInputElement>(
    '.main-locations-field-search-icon'
  ).style.visibility = 'hidden';
  document.querySelector<HTMLInputElement>(
    '.main-locations-field-search-close'
  ).style.visibility = 'hidden';

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

  var navigateBetweenDaysInGaugeGraphLine =
    document.querySelectorAll<HTMLElement>(
      '.main-dashboard-title-city-charts-item-days-line'
    );

  if (navigateBetweenDaysInGaugeGraphLine != null) {
    navigateBetweenDaysInGaugeGraphLine[0].style.visibility = 'hidden';
  }
}

function makeVisibleSearchIcon() {
  document.querySelector<HTMLInputElement>(
    '.main-locations-field-search-icon'
  ).style.visibility = 'visible';
}

function initCard(apiKey: string, city: string, index: number) {
  let url =
    'https://api.weatherapi.com/v1/forecast.json?key=' +
    apiKey +
    '&q=' +
    city +
    '&days=1&aqi=yes&alerts=no';

  fetch(url, { method: 'GET' })
    .then((result) => result.json())
    .then((response) => {
      document
        .querySelectorAll('.main-locations-city-cards-div-img-specific')
        [index].setAttribute(
          'src',
          response['forecast']['forecastday']['0']['day']['condition']['icon']
        );

      document.querySelectorAll('.main-locations-city-cards-temperature')[
        index
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
        index
      ].innerHTML = response['location']['name'];
    });
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
  const navigateBetweenDaysInGaugeGraph =
    document.querySelectorAll<HTMLElement>(
      '.main-dashboard-title-city-charts-item-days-line-specific'
    );

  if (navigateBetweenDaysInGaugeGraph != null) {
    if (selectedDay == 0) {
      navigateBetweenDaysInGaugeGraph[1].style.borderBottom = '0px';
      navigateBetweenDaysInGaugeGraph[0].style.borderBottom = '2px solid blue';
      navigateBetweenDaysInGaugeGraph[2].style.borderBottom = '0px';

      let date = new Date();

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
        navigateBetweenDaysInGaugeGraph[1].style.borderBottom =
          '2px solid blue';
        navigateBetweenDaysInGaugeGraph[0].style.borderBottom = '0px';
        navigateBetweenDaysInGaugeGraph[2].style.borderBottom = '0px';
      } else if (selectedDay == 2) {
        navigateBetweenDaysInGaugeGraph[0].style.borderBottom = '0px';
        navigateBetweenDaysInGaugeGraph[2].style.borderBottom =
          '2px solid blue';
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
      options.makeAirQualityGraph(response);
    });
}
