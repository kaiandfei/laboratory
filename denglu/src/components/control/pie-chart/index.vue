<template>
  <div class="pie-container" ref="pie"></div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import 'echarts-liquidfill'
const props = defineProps(['customOption'])
// console.log(10, props.customOption)

const pie = ref()
const init = () => {
  // 基于准备好的dom，初始化echarts实例
  let chart = echarts.init(pie.value)
  // 指定图表的配置项和数据
  let option = {
    // color: props.customOption?.color,
    tooltip: props.customOption?.tooltip,
    title: props.customOption?.title,
    polar: props.customOption?.polar,
    angleAxis: props.customOption?.angleAxis,
    radiusAxis: props.customOption?.radiusAxis,
    roseType: props.customOption?.roseType,
    legend: props.customOption?.legend,
    series: props.customOption?.series
  }
  // console.log('12121', option)
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
.pie-container {
  width: 100%;
  height: 100%;
}
</style>
