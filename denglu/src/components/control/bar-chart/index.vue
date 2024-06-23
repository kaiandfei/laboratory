<template>
  <div class="bar-container" ref="bar"></div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import 'echarts-liquidfill'
const props = defineProps(['customOption'])
const bar = ref()
// console.log(11, props)

const init = () => {
  // 基于准备好的dom，初始化echarts实例
  let chart = echarts.init(bar.value)
  // 指定图表的配置项和数据
  let option = {
    xAxis: props.customOption?.xAxis,
    yAxis: props.customOption?.yAxis,
    tooltip: props.customOption?.tooltip,
    grid: props.customOption?.grid,
    series: props.customOption?.series
  }
  chart.setOption(option)
  window.addEventListener('resize', () => {
    chart.resize()
  })
}
onMounted(() => {
  init()
})
</script>

<style lang="scss" scoped>
.bar-container {
  width: 100%;
  height: 100%;
}
</style>
