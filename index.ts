import './style.scss';
import * as echarts from 'echarts';

var navigateFromCityCardToGraphButtons = document.querySelectorAll(
  '.main-locations-city-cards-div-chevron-right'
);

var navigateBetweenDaysInAirQualityGraph = document.querySelectorAll(
  '.main-dashboard-title-city-charts-item-days-line-specific'
);

var chartDom1 = document.querySelectorAll<HTMLElement>(
  '.main-dashboard-title-city-charts-item-content'
)[0];

var chartDom2 = document.querySelectorAll<HTMLElement>(
  '.main-dashboard-title-city-charts-item-content'
)[1];

var chartDom3 = document.querySelectorAll<HTMLElement>(
  '.main-dashboard-title-city-charts-item-days-content'
)[0];

var myChart = echarts.init(chartDom1);
var myChart2 = echarts.init(chartDom2);
var myChart3 = echarts.init(chartDom3);

for (let i = 0; i < navigateFromCityCardToGraphButtons.length; i++) {
  navigateFromCityCardToGraphButtons[i].addEventListener('click', () => {
    getWeatherInfoAndMakeHourlyTemperatureGraph(i);
    getWeatherInfoAndMakeMaximumTemperatureGraph(i);
    getWeatherInfoAndMakeAirQualityGraph(i);
  });
}

for (let i = 0; i < navigateBetweenDaysInAirQualityGraph.length; i++) {
  navigateBetweenDaysInAirQualityGraph[i].addEventListener('click', () => {
    getWeatherInfoAndMakeAirQualityGraph(i);
  });
}

function getWeatherInfoAndMakeHourlyTemperatureGraph(index: number) {
  var selectedCity: string;
  if (index == 0) {
    selectedCity = 'Thessaloniki';
  } else if (index == 1) {
    selectedCity = 'Athens';
  }

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
    })
    .catch((error) => console.log(error));
}

function getWeatherInfoAndMakeMaximumTemperatureGraph(index: number) {
  var selectedCity: string;
  if (index == 0) {
    selectedCity = 'Thessaloniki';
  } else if (index == 1) {
    selectedCity = 'Athens';
  }

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
            center: ['50%', '60%'],
            startAngle: 200,
            endAngle: -20,
            min: 0,
            max: 60,
            splitNumber: 12,
            itemStyle: {
              color: '#FFAB91',
            },
            progress: {
              show: true,
              width: 15,
            },
            pointer: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                width: 10,
              },
            },
            axisTick: {
              distance: -45,
              splitNumber: 5,
              lineStyle: {
                width: 2,
                color: '#999',
              },
            },
            splitLine: {
              distance: -52,
              length: 14,
              lineStyle: {
                width: 3,
                color: '#999',
              },
            },
            axisLabel: {
              distance: -20,
              color: '#999',
              fontSize: 20,
            },
            anchor: {
              show: false,
            },
            title: {
              show: false,
            },
            detail: {
              valueAnimation: true,
              width: '60%',
              lineHeight: 40,
              borderRadius: 8,
              offsetCenter: [0, '-15%'],
              fontSize: 60,
              fontWeight: 'bolder',
              formatter: '{value} °C',
              color: 'inherit',
            },
            data: [
              {
                value:
                  response['forecast']['forecastday']['0']['day']['maxtemp_c'],
              },
            ],
          },
          {
            type: 'gauge',
            center: ['50%', '60%'],
            startAngle: 200,
            endAngle: -20,
            min: 0,
            max: 60,
            itemStyle: {
              color: '#FD7347',
            },
            progress: {
              show: true,
              width: 8,
            },
            pointer: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            detail: {
              show: false,
            },
            data: [
              {
                value:
                  response['forecast']['forecastday']['0']['day']['maxtemp_c'],
              },
            ],
          },
        ],
      };

      option2 && myChart2.setOption(option2, true);
    });
}

function getWeatherInfoAndMakeAirQualityGraph(index: number) {
  var selectedCity: string;
  if (index == 0) {
    selectedCity = 'Thessaloniki';
  } else if (index == 1) {
    selectedCity = 'Athens';
  }

  var date = new Date();

  date.setDate(date.getDate() - 1);

  let url =
    'https://api.weatherapi.com/v1/forecast.json?key=c2c6271001c643d6a4390320231007&q=' +
    selectedCity +
    '&days=1&aqi=yes&alerts=no';

  fetch(url, { method: 'GET' })
    .then((result) => result.json())
    .then((response) => {
      console.log(response);

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
          data: ['Allocated Budget', 'Actual Spending'],
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
            {
              name: 'us-epa-index',
              max: 10,
            },
            {
              name: 'gb-defra-index',
              max: 10,
            },
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
                  response['current']['air_quality']['us-epa-index'],
                  response['current']['air_quality']['gb-defra-index'],
                ],
                name: 'Allocated Budget',
              },
              {
                value: [
                  response['current']['air_quality']['co'],
                  response['current']['air_quality']['no2'],
                  response['current']['air_quality']['o3'],
                  response['current']['air_quality']['so2'],
                  response['current']['air_quality']['pm2_5'],
                  response['current']['air_quality']['pm10'],
                  response['current']['air_quality']['us-epa-index'],
                  response['current']['air_quality']['gb-defra-index'],
                ],
                name: 'Actual Spending',
              },
            ],
          },
        ],
      };

      option3 && myChart3.setOption(option3);
    });
}
