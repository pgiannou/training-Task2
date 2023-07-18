import { CityCard } from './index';

export function initCards(city: string, index: number) {
  document
    .querySelectorAll('.main-locations-city-cards-div-img-specific')
    [index].setAttribute('src', CityCard.resultForInit1.icon);

  document.querySelectorAll('.main-locations-city-cards-temperature')[
    index
  ].innerHTML =
    Math.ceil(this.resultForInit.maxtemp_c) +
    'oC - ' +
    Math.ceil(this.resultForInit.mintemp_c) +
    'oC';

  document.querySelectorAll('.main-locations-city-cards-city')[
    index
  ].innerHTML = this.resultForInit1.locationName;
  console.log(this.resultForInit1);
  var navigateFromCityCardToGraphButtons = document.querySelectorAll(
    '.main-locations-city-cards-div-chevron-right'
  )[index];

  var navigateBetweenDaysInGaugeGraph = document.querySelectorAll<HTMLElement>(
    '.main-dashboard-title-city-charts-item-days-line-specific'
  );

  // navigateFromCityCardToGraphButtons.addEventListener('click', () => {
  //   this.getWeatherInfoAndMakeHourlyTemperatureGraph(city);
  //   this.getWeatherInfoAndMakeMaximumTemperatureGraph(city, 1);
  //   this.getWeatherInfoAndMakeAirQualityGraph(city);

  //   for (let j = 0; j < navigateBetweenDaysInGaugeGraph.length; j++) {
  //     navigateBetweenDaysInGaugeGraph[j].addEventListener('click', () => {
  //       this.getWeatherInfoAndMakeMaximumTemperatureGraph(city, j);
  //     });
  //   }

  //   var chartDom2 = document.querySelectorAll<HTMLElement>(
  //     '.main-dashboard-title-city-charts-item-days-content'
  //   )[0];

  //   var chartDom3 = document.querySelectorAll<HTMLElement>(
  //     '.main-dashboard-title-city-charts-item-content'
  //   )[1];

  //   var myChart2 = echarts.init(chartDom2);
  //   var myChart3 = echarts.init(chartDom3);
  // });
}
