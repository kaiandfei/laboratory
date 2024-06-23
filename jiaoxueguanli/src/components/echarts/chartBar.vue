<template>
  <div class="double-bar-chart">
    <BaseChart
      v-if="xAxisData.length !== 0 && seriesData.length !== 0"
      :options="
        type === 1
          ? options1
          : type === 2
          ? options2
          : type === 3
          ? options3
          : type === 4
          ? options4
          : options5
      "
      :elStyle="{ width: width === 0 ? '100%' : width + 'px', height: height + 'px' }"
    />
  </div>
</template>

<script>
import BaseChart from './baseEcharts/baseChart.vue'
export default {
  name: 'ChartBar',
  components: {
    BaseChart,
  },
  props: {
    type: {
      type: Number,
      default: 1, // 1:竖柱形图和折线图 2:横柱形图 3:波浪图 4:无x轴饼图 5:反馈页面的环形图
    },
    seriesData: {
      type: Array,
      required: true,
    },
    xAxisData: {
      type: Array,
      required: true,
    },
    width: {
      type: Number,
      default: 0,
    },
    height: {
      type: Number,
      default: 240,
    },
    gridX: {
      type: Number,
      default: 30,
    },
    gridBottom: {
      type: Number,
      default: 25,
    },
    xRotate: {
      type: Number,
      default: 0,
    },
    xName: {
      type: String,
      default: '',
    },
    yName: {
      type: String,
      default: '',
    },
  },
  computed: {
    options1: function () {
      const foo = {
        color: ['#EE9A59', '#96D3A1', '#D3C1E1', '#FFEAB2', '#96CED3'],
        tooltip: {
          trigger: this.seriesData[0].type !== 'line' ? 'item' : 'axis',
        },
        grid: {
          x: this.gridX,
          y: this.yName ? 40 : 20,
          x2: this.xName ? 50 : 30,
          y2: 20,
          bottom: this.gridBottom,
        },
        legend: {
          // show: false,
          top: 'top',
          right: '2%',
          orient: 'vertical',
        },
        xAxis: {
          name: this.xName,
          type: 'category',
          data: this.xAxisData,
          boundaryGap: this.seriesData[0].type !== 'line',
          axisTick: {
            alignWithLabel: true,
            lineStyle: {
              color: '#333',
            },
          },
          axisLine: {
            show: true,
            lineStyle: {
              width: '1',
              color: '#05C65D',
              type: 'dashed',
            },
          },
          axisLabel: {
            interval: 0,
            rotate: this.xRotate,
            color: '#333',
          },
        },
        yAxis: {
          name: this.yName,
          type: 'value',
          axisLine: {
            show: true,
            lineStyle: {
              width: '1',
              color: '#05C65D',
              type: 'dashed',
            },
          },
          axisLabel: {
            color: '#333',
          },
        },
        series: this.seriesData,
      }
      return foo
    },
    options2: function () {
      const foo = {
        color: ['#EBBA8B', '#96D3A1', '#D3C1E1', '#FFEAB2', '#96CED3'],
        tooltip: {
          trigger: 'item',
        },
        grid: {
          x: 100,
          y: this.yName ? 40 : 20,
          x2: this.xName ? 50 : 30,
          y2: 20,
        },
        legend: {
          right: '3%',
        },
        xAxis: {
          name: this.yName,
          type: 'value',
        },
        yAxis: {
          name: this.xName,
          type: 'category',
          data: this.xAxisData,
          axisTick: {
            alignWithLabel: true,
          },
        },
        series: this.seriesData,
      }
      return foo
    },
    options3: function () {
      const foo = {
        color: ['#B3E4FB', '#D5F0FD'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            },
          },
        },
        grid: {
          top: '5%',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            show: false,
            type: 'category',
            boundaryGap: false,
            data: this.xAxisData,
          },
        ],
        yAxis: [
          {
            show: false,
            type: 'value',
          },
        ],
        series: this.seriesData,
      }
      return foo
    },
    options4: function () {
      const foo = {
        // title: {
        //   text: 'Referer of a Website',
        //   subtext: 'Fake Data',
        //   left: 'center'
        // },
        tooltip: {
          trigger: 'item',
        },
        // legend: {
        //   orient: 'vertical',
        //   left: 'left'
        // },
        color: ['#EBBA8B', '#96D3A1', '#D3C1E1', '#FFEAB2', '#96CED3'],
        grid: {
          x: 30,
          y: this.yName ? 40 : 20,
          x2: this.xName ? 50 : 30,
          y2: 20,
        },
        legend: {
          right: '3%',
        },
        xAxis: {
          show: false,
          name: this.xName,
          type: 'category',
          data: this.xAxisData,
          axisTick: {
            alignWithLabel: true,
          },
        },
        yAxis: {
          name: this.yName,
          type: 'value',
        },
        series: this.seriesData,
      }
      return foo
    },
    options5: function () {
      const foo = {
        tooltip: {
          trigger: 'item',
        },
        color: ['#DCECE3', '#FFFFFF', '#05C65D', '#FFFFFF'],
        grid: {
          show: false,
          x: 30,
          y: this.yName ? 40 : 20,
          x2: this.xName ? 50 : 30,
          y2: 20,
        },
        legend: {
          show: false,
          right: '3%',
        },
        xAxis: {
          show: false,
          name: this.xName,
          type: 'category',
          data: this.xAxisData,
          axisTick: {
            alignWithLabel: true,
          },
        },
        yAxis: {
          show: false,
          name: this.yName,
          type: 'value',
        },
        series: [
          {
            name: '总体百分比',
            type: 'pie',
            radius: ['20%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center',
            },
            data: this.seriesData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
            labelLine: {
              show: false,
            },
          },
        ],
      }
      return foo
    },
  },
  created() {
    // console.log('吊椅')
  },
}
</script>

<style scoped></style>
