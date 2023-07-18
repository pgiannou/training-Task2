import * as echarts from 'echarts';

export function makeHourlyGraph(data, chartDom) {
  var myChart = echarts.init(chartDom);

  var xAxisValues: string[] = [];
  data.forEach((hour) => {
    var hourTemp: any = Object.values(hour)['1'];
    var specificHour = hourTemp.split(' ')[1];
    xAxisValues.push(specificHour);
  });

  // Calculating hourly temperatoures to put them in yAxis
  var yAxisValues: string[] = [];
  data.forEach((hour) => {
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
