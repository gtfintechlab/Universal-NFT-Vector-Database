<template>
  <Scatter
    :chart-data="chartData"
    :chart-options="chartOptions"
    :chart-id="chartId"
    :width="width"
    :height="height"
    :css-classes="cssClasses"
    :styles="styles"
    :plugins="plugins"
  />
</template>

<script>
import { Scatter } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement
} from 'chart.js/dist/chart.esm.js' 
import { mockScatterChartPoints } from '~~/utils/MockData'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement
)

export default {
  name: 'ScatterChart',
  components: {
    Scatter
  },
  onMounted () {

  },
  props: {
    chartId: {
      type: String,
      default: 'scatter-chart'
    },
    width: {
      type: Number,
      default: null
    },
    height: {
      type: Number,
      default: null
    },
    cssClasses: {
      default: '',
      type: String
    },
    styles: {
      type: Object,
      default: () => {}
    },
    plugins: {
      type: Array,
      default: () => []
    },
    chartTitle: {
      type: String,
      default: ''
    },
    chartData: {
      type: null,
      default: []
    },
    xAxisLabel: {
      type: String, 
      defualt: ''
    },
    yAxisLabel: {
      type: String, 
      defualt: ''
    }

  },
  data () {
    return {
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        elements: {
          point: {
            pointRadius: 5
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'T Distributed Stochastic Neighbor Embedding Visualization',
            font: {
              size: 14,
              family: 'Outfit',
              weight: 400,
              lineHeight: 0.5
            }
          },
          legend: {
            labels: {
              font: {
                family: 'Outfit'
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function (tooltipItems, data){
                const parsedToolTip = JSON.parse(JSON.stringify(tooltipItems.raw));
                return [`x: ${parsedToolTip.x.toFixed(2)}`, `y: ${parsedToolTip.y.toFixed(2)}`, `Score: ${parsedToolTip.score}`];
              }
            }
          }
        },
        scales: {
          xAxis: {
            title: {
              display: true,
              text: this.xAxisLabel,
              font: {
                family: 'Outfit'
              }
            }
          },
          yAxis: {
            title: {
              display: true,
              text: this.yAxisLabel,
              font: {
                family: 'Outfit'
              }
            }
          }
        }
      }
    }
  }
}

</script>
