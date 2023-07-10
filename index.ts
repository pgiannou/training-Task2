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
    getWeatherInfoAndMakeTemperatureGraph(i);
  });

  function getWeatherInfoAndMakeTemperatureGraph(index: number) {
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
