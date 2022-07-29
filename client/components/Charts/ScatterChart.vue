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
// import {
//   Chart as ChartJS,
//   Title,
//   Tooltip,
//   Legend,
//   LineElement,
//   LinearScale,
//   PointElement
// } from 'chart.js'
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
    }
  },
  data () {
    return {
      chartData: mockScatterChartPoints,
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
            text: 'Multidimensional Scaling Visualization',
            font: {
              size: 15,
              family: 'Outfit',
              weight: 400,
              lineHeight: 0.5
            }
          }
        }
      }
    }
  }
}

</script>
