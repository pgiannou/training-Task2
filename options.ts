import * as echarts from 'echarts';

export function makeHourlyTemperatureGraph(response) {
  var chartDom1 = document.querySelectorAll<HTMLElement>(
    '.main-dashboard-title-city-charts-item-content'
  )[0];

  var myChart = echarts.init(chartDom1);

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
}

export function makeMaxTemperatureGraph(response, selectedDay) {
  const chartDom2 = document.querySelectorAll<HTMLElement>(
    '.main-dashboard-title-city-charts-item-days-content'
  )[0];

  var myChart2 = echarts.init(chartDom2);

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
          fontSize: 30,
          offsetCenter: [0, '70%'],
        },
        textStyle: {
          fontSize: 40,
        },
        data: [
          {
            value:
              selectedDay == 0
                ? response['forecast']['forecastday'][0]['day']['maxtemp_c']
                : response['forecast']['forecastday'][selectedDay - 1]['day'][
                    'maxtemp_c'
                  ],
          },
        ],
      },
    ],
  };

  option2 && myChart2.setOption(option2, true);
}

export function makeAirQualityGraph(response) {
  var chartDom3 = document.querySelectorAll<HTMLElement>(
    '.main-dashboard-title-city-charts-item-content'
  )[1];

  var myChart3 = echarts.init(chartDom3);

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
      data: ['Today', 'Tomorrow'],
      textStyle: {
        fontSize: '8',
      },
    },
    radar: {
      // shape: 'circle',
      indicator: [
        { name: 'co', max: 290 },
        { name: 'no2', max: 30 },
        { name: 'o3', max: 250 },
        { name: 'so2', max: 40 },
        { name: 'pm2_5', max: 40 },
        { name: 'pm10', max: 50 },
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
              response['forecast']['forecastday']['0']['day']['air_quality'][
                'co'
              ],
              response['forecast']['forecastday']['0']['day']['air_quality'][
                'no2'
              ],
              response['forecast']['forecastday']['0']['day']['air_quality'][
                'o3'
              ],
              response['forecast']['forecastday']['0']['day']['air_quality'][
                'so2'
              ],
              response['forecast']['forecastday']['0']['day']['air_quality'][
                'pm2_5'
              ],
              response['forecast']['forecastday']['0']['day']['air_quality'][
                'pm10'
              ],
            ],
            name: 'Tomorrow',
          },
        ],
      },
    ],
  };

  option3 && myChart3.setOption(option3);
}
