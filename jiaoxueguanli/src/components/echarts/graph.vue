<template>
  <div class="double-bar-chart">
    <base-chart :options="options" :elStyle="{ width: '100%', height: height + 'px' }" />
  </div>
</template>

<script>
import baseChart from './baseEcharts/baseChart.vue'
export default {
  components: {
    baseChart,
  },
  props: {
    seriesData: {
      type: Array,
      required: true,
    },
    height: {
      type: Number,
      default: 240,
    },
    // xAxisData: {
    //   type: Array,
    //   required: true
    // }
  },
  computed: {
    options: function () {
      const foo = {
        // title: {
        //   text: 'Basic Graph'
        // },
        tooltip: {},
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
          {
            type: 'graph',
            layout: 'none',
            symbolSize: 100,
            roam: true,
            label: {
              show: true,
            },
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [8, 10],
            edgeLabel: {
              fontSize: 20,
            },
            data: this.seriesData,
            // links: [],
          },
        ],
      }
      return foo
    },
  },
}
</script>

<style scoped></style>
