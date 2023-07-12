import './style.scss';
import * as echarts from 'echarts';

var cities: string[] = ['Thessaloniki', 'Athens'];

var searchLocationInput = document.querySelector<HTMLInputElement>(
  '#searchLocationInput'
);

searchLocationInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    var searchLocationInputText = searchLocationInput.value;
    let successRequest = getWeatherInfoAndMakeHourlyTemperatureGraph(
      searchLocationInputText
    );
    if (successRequest) {
    } else {
      alert('Wrong location');
    }
  }
});

var navigateFromCityCardToGraphButtons = document.querySelectorAll(
  '.main-locations-city-cards-div-chevron-right'
);

var navigateBetweenDaysInGaugeGraph = document.querySelectorAll<HTMLElement>(
  '.main-dashboard-title-city-charts-item-days-line-specific'
);

var chartDom1 = document.querySelectorAll<HTMLElement>(
  '.main-dashboard-title-city-charts-item-content'
)[0];

var chartDom2 = document.querySelectorAll<HTMLElement>(
  '.main-dashboard-title-city-charts-item-days-content'
)[0];

var chartDom3 = document.querySelectorAll<HTMLElement>(
  '.main-dashboard-title-city-charts-item-content'
)[1];

var myChart = echarts.init(chartDom1);
var myChart2 = echarts.init(chartDom2);
var myChart3 = echarts.init(chartDom3);

for (let i = 0; i < navigateFromCityCardToGraphButtons.length; i++) {
  navigateFromCityCardToGraphButtons[i].addEventListener('click', () => {
    var selectedCity: string;
    if (i == 0) {
      selectedCity = cities[0];
    } else if (i == 1) {
      selectedCity = cities[1];
    }

    getWeatherInfoAndMakeHourlyTemperatureGraph(selectedCity);
    getWeatherInfoAndMakeMaximumTemperatureGraph(selectedCity, 0);
    getWeatherInfoAndMakeAirQualityGraph(selectedCity);

    for (let i = 0; i < navigateBetweenDaysInGaugeGraph.length; i++) {
      navigateBetweenDaysInGaugeGraph[i].addEventListener('click', () => {
        getWeatherInfoAndMakeMaximumTemperatureGraph(selectedCity, i);
      });
    }
  });
}

var navigateBetweenDaysInGaugeGraphLine =
  document.querySelectorAll<HTMLElement>(
    '.main-dashboard-title-city-charts-item-days-line'
  );

navigateBetweenDaysInGaugeGraphLine[0].style.visibility = 'hidden';

function getWeatherInfoAndMakeHourlyTemperatureGraph(
  selectedCity: string
): boolean {
  var successRequest: boolean = true;

  var date = new Date();

  date.setDate(date.getDate() - 1);

  let url =
    'https://api.weatherapi.com/v1/history.json?key=c2c6271001c643d6a4390320231007&q=' +
    selectedCity +
    '&dt=' +
    date.toLocaleDateString('en-GB').split('/').reverse().join('-');

  fetch(url, { method: 'GET' })
    .then((result) => result.json())
    .then((response) => {
      console.log(response);

      if (!cities.includes(selectedCity)) {
        cities.push(response['location']['name']);
        var newDivCard = document.createElement('div');
        newDivCard.className = 'main-locations-city-cards';

        var newDivImgCard = document.createElement('div');
        newDivImgCard.className = 'main-locations-city-cards-div-img';

        var newImgCard = document.createElement('img');
        newImgCard.setAttribute(
          'src',
          response['forecast']['forecastday']['0']['day']['condition']['icon']
        );
        newImgCard.style.height = '36px';
        newImgCard.style.width = '36px';

        newDivImgCard.appendChild(newImgCard);

        var newDivTextCard = document.createElement('div');
        newDivTextCard.className = 'main-locations-city-cards-text';

        var newDivTextTemperatureCard = document.createElement('div');
        newDivTextTemperatureCard.className =
          'main-locations-city-cards-temperature';
        newDivTextTemperatureCard.innerHTML =
          Math.ceil(
            response['forecast']['forecastday']['0']['day']['maxtemp_c']
          ) +
          'oC' +
          Math.ceil(
            response['forecast']['forecastday']['0']['day']['mintemp_c']
          ) +
          'oC';
        var newDivTextDividerCard = document.createElement('div');
        newDivTextDividerCard.className = 'main-locations-city-cards-divider';
        newDivTextDividerCard.innerHTML = '|';
        var newDivTextCityCard = document.createElement('div');
        newDivTextCityCard.className = 'main-locations-city-cards-city';
        newDivTextCityCard.innerHTML = response['location']['name'];

        newDivTextCard.appendChild(newDivTextTemperatureCard);
        newDivTextCard.appendChild(newDivTextDividerCard);
        newDivTextCard.appendChild(newDivTextCityCard);

        var newDivImgChevronRight = document.createElement('div');
        newDivImgChevronRight.className =
          'main-locations-city-cards-div-chevron-right';

        var newImgChevronRight = document.createElement('img');
        newImgChevronRight.setAttribute(
          'src',
          'https://raw.githubusercontent.com/pgiannou/training-Task1/80d2a1527093cecf55fcf6deabf0aba675df2538/chevron-right.svg'
        );
        newDivImgChevronRight.appendChild(newImgChevronRight);

        newDivCard.appendChild(newDivImgCard);
        newDivCard.appendChild(newDivTextCard);
        newDivCard.appendChild(newDivImgChevronRight);

        var finalDiv = document.querySelectorAll(
          '.main-locations-city-cards-group'
        )[0];
        finalDiv.appendChild(newDivCard);
      }

      var dashboardTitle = document.querySelectorAll(
        '.main-dashboard-title-text'
      )[0];
      dashboardTitle.innerHTML =
        response['location']['name'] +
        ', ' +
        response['location']['region'] +
        ', ' +
        response['location']['tz_id'];

      // Calculating hours to put them in xAxis
      var xAxisValues: string[] = [];
      response['forecast']['forecastday']['0']['hour'].forEach((hour) => {
        var hourTemp: any = Object.values(hour)['1'];
        var specificHour = hourTemp.split(' ')[1];
        xAxisValues.push(specificHour);
      });

      // Calculating hourly temperatoures to put them in yAxis
      var yAxisValues: string[] = [];
      response['forecast']['forecastday']['0']['hour'].forEach((hour) => {
        yAxisValues.push(hour.temp_c);
      });

      var option;
      option = {
        xAxis: {
          type: 'category',
          data: xAxisValues,
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: yAxisValues,
            type: 'line',
          },
        ],
      };

      option && myChart.setOption(option, true);
      successRequest = true;
    })
    .catch((error) => {
      successRequest = false;
    });

  return successRequest;
}

function getWeatherInfoAndMakeMaximumTemperatureGraph(
  selectedCity: string,
  selectedDay: number
) {
  navigateBetweenDaysInGaugeGraphLine[0].style.visibility = 'visible';

  if (selectedDay == 0) {
    navigateBetweenDaysInGaugeGraph[0].style.borderBottom = '2px solid blue';
    navigateBetweenDaysInGaugeGraph[1].style.borderBottom = '0px';
    navigateBetweenDaysInGaugeGraph[2].style.borderBottom = '0px';

    var date = new Date();

    date.setDate(date.getDate() - 1);

    let url =
      'https://api.weatherapi.com/v1/history.json?key=c2c6271001c643d6a4390320231007&q=' +
      selectedCity +
      '&dt=' +
      date.toLocaleDateString('en-GB').split('/').reverse().join('-');

    fetch(url, { method: 'GET' })
      .then((result) => result.json())
      .then((response) => {
        console.log(response);

        var option2;

        option2 = {
          series: [
            {
              type: 'gauge',
              progress: {
                show: true,
                width: 18,
              },
              axisLine: {
                lineStyle: {
                  width: 18,
                },
              },
              axisTick: {
                show: false,
              },
              splitLine: {
                length: 15,
                lineStyle: {
                  width: 2,
                  color: '#999',
                },
              },
              axisLabel: {
                distance: 25,
                color: '#999',
                fontSize: 20,
              },
              anchor: {
                show: true,
                showAbove: true,
                size: 25,
                itemStyle: {
                  borderWidth: 10,
                },
              },
              title: {
                show: false,
              },
              detail: {
                valueAnimation: true,
                fontSize: 80,
                offsetCenter: [0, '70%'],
              },
              data: [
                {
                  value:
                    response['forecast']['forecastday'][selectedDay + ''][
                      'day'
                    ]['maxtemp_c'],
                },
              ],
            },
          ],
        };

        option2 && myChart2.setOption(option2, true);
      });
  } else {
    if (selectedDay == 1) {
      navigateBetweenDaysInGaugeGraph[0].style.borderBottom = '0px';
      navigateBetweenDaysInGaugeGraph[1].style.borderBottom = '2px solid blue';
      navigateBetweenDaysInGaugeGraph[2].style.borderBottom = '0px';
    } else if (selectedDay == 2) {
      navigateBetweenDaysInGaugeGraph[0].style.borderBottom = '0px';
      navigateBetweenDaysInGaugeGraph[2].style.borderBottom = '2px solid blue';
      navigateBetweenDaysInGaugeGraph[1].style.borderBottom = '0px';
    }
    let url =
      'https://api.weatherapi.com/v1/forecast.json?key=c2c6271001c643d6a4390320231007&q=' +
      selectedCity +
      '&days=2&aqi=yes&alerts=no';

    fetch(url, { method: 'GET' })
      .then((result) => result.json())
      .then((response) => {
        //console.log(response);

        var option2;

        option2 = {
          series: [
            {
              type: 'gauge',
              progress: {
                show: true,
                width: 18,
              },
              axisLine: {
                lineStyle: {
                  width: 18,
                },
              },
              axisTick: {
                show: false,
              },
              splitLine: {
                length: 15,
                lineStyle: {
                  width: 2,
                  color: '#999',
                },
              },
              axisLabel: {
                distance: 25,
                color: '#999',
                fontSize: 20,
              },
              anchor: {
                show: true,
                showAbove: true,
                size: 25,
                itemStyle: {
                  borderWidth: 10,
                },
              },
              title: {
                show: false,
              },
              detail: {
                valueAnimation: true,
                fontSize: 80,
                offsetCenter: [0, '70%'],
              },
              data: [
                {
                  value:
                    response['forecast']['forecastday'][selectedDay - 1 + ''][
                      'day'
                    ]['maxtemp_c'],
                },
              ],
            },
          ],
        };

        option2 && myChart2.setOption(option2, true);
      });
  }
}

function getWeatherInfoAndMakeAirQualityGraph(selectedCity: string) {
  let url =
    'https://api.weatherapi.com/v1/forecast.json?key=c2c6271001c643d6a4390320231007&q=' +
    selectedCity +
    '&days=1&aqi=yes&alerts=no';

  fetch(url, { method: 'GET' })
    .then((result) => result.json())
    .then((response) => {
      //console.log(response);

      var option3;

      option3 = {
        title: {
          text: 'Basic Radar Chart',
          textStyle: {
            fontSize: '12',
            padding: 20,
          },
        },
        legend: {
          data: ['Today', 'Tomorrow'],
          textStyle: {
            fontSize: '8',
          },
        },
        radar: {
          // shape: 'circle',
          indicator: [
            { name: 'co', max: 250 },
            { name: 'no2', max: 10 },
            { name: 'o3', max: 250 },
            { name: 'so2', max: 10 },
            { name: 'pm2_5', max: 30 },
            { name: 'pm10', max: 30 },
          ],
        },
        series: [
          {
            name: 'Budget vs spending',
            type: 'radar',
            data: [
              {
                value: [
                  response['current']['air_quality']['co'],
                  response['current']['air_quality']['no2'],
                  response['current']['air_quality']['o3'],
                  response['current']['air_quality']['so2'],
                  response['current']['air_quality']['pm2_5'],
                  response['current']['air_quality']['pm10'],
                ],
                name: 'Today',
              },
              {
                value: [
                  response['forecast']['forecastday']['0']['day'][
                    'air_quality'
                  ]['co'],
                  response['forecast']['forecastday']['0']['day'][
                    'air_quality'
                  ]['no2'],
                  response['forecast']['forecastday']['0']['day'][
                    'air_quality'
                  ]['o3'],
                  response['forecast']['forecastday']['0']['day'][
                    'air_quality'
                  ]['so2'],
                  response['forecast']['forecastday']['0']['day'][
                    'air_quality'
                  ]['pm2_5'],
                  response['forecast']['forecastday']['0']['day'][
                    'air_quality'
                  ]['pm10'],
                ],
                name: 'Tomorrow',
              },
            ],
          },
        ],
      };

      option3 && myChart3.setOption(option3);
    });
}
