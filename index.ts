import './style.scss';
import * as echarts from 'echarts';

var navigateFromCityCardToGraphButtons = document.querySelectorAll(
  '.main-locations-city-cards-div-chevron-right'
);
var chartDom = document.querySelectorAll<HTMLElement>(
  '.main-dashboard-title-city-charts-item-content'
)[0];
var myChart = echarts.init(chartDom);
for (let i = 0; i < navigateFromCityCardToGraphButtons.length; i++) {
  navigateFromCityCardToGraphButtons[i].addEventListener('click', () => {
    getWeatherInfoAndMakeHourlyTemperatureGraph(i);
  });

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

      var chartDom = document.getElementById('main');
      var myChart = echarts.init(chartDom);
      var option;

      option = {
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
              width: 30,
            },
            pointer: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                width: 30,
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
                value: 20,
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
                value: 20,
              },
            ],
          },
        ],
      };
      setInterval(function () {
        const random = +(Math.random() * 60).toFixed(2);
        myChart.setOption({
          series: [
            {
              data: [
                {
                  value: random,
                },
              ],
            },
            {
              data: [
                {
                  value: random,
                },
              ],
            },
          ],
        });
      }, 2000);

      option && myChart.setOption(option, true);
    });
}
