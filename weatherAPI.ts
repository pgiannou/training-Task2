import { apiKey } from './credentials';
import * as echarts from 'echarts';

export interface resultForInit {
  icon: string;
  maxtemp_c: number;
  mintemp_c: number;
  locationName: string;
}

export function callWeatherAPIForInitCards(
  city: string
): Promise<resultForInit> {
  return new Promise((resolve, reject) => {
    let url =
      'https://api.weatherapi.com/v1/forecast.json?key=' +
      apiKey +
      '&q=' +
      city +
      '&days=1&aqi=no&alerts=no';

    fetch(url, { method: 'GET' })
      .then((result) => result.json())
      .then((result) => {
        const result1: resultForInit = {
          icon: result['forecast']['forecastday']['0']['day']['condition'][
            'icon'
          ],
          maxtemp_c:
            +result['forecast']['forecastday']['0']['day']['maxtemp_c'],
          mintemp_c:
            +result['forecast']['forecastday']['0']['day']['mintemp_c'],
          locationName: result['location']['name'],
        };
        resolve(result1);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
}

export function getWeatherInfoAndMakeHourlyTemperatureGraph(city: string) {
  var date = new Date();

  var chartDom1 = document.querySelectorAll<HTMLElement>(
    '.main-dashboard-title-city-charts-item-content'
  )[0];
  var myChart = echarts.init(chartDom1);

  date.setDate(date.getDate() - 1);

  let url =
    'https://api.weatherapi.com/v1/history.json?key=' +
    apiKey +
    '&q=' +
    city +
    '&dt=' +
    date.toLocaleDateString('en-GB').split('/').reverse().join('-');

  fetch(url, { method: 'GET' })
    .then((result) => result.json())
    .then((response) => {
      //console.log(response);

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
    .catch((error) => {
      alert('Wrong location');
    });
}
