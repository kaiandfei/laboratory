<template>
  <div class="map-container" ref="map"></div>
</template>

<script lang="ts" setup>
import { ref, onMounted, useAttrs } from 'vue'
import * as echarts from 'echarts'
import 'echarts-liquidfill'
import localCache from '@/utils/localCache'
import { getAreaCode } from '@/service/dataPage/index'
const props = defineProps(['customOption', 'mapFindAreaData'])
const map = ref()
const attrs: any = useAttrs()
// console.log(11, props)
// console.log(12122121212, props.customOption)

const init = () => {
  // 基于准备好的dom，初始化echarts实例
  let chart = echarts.init(map.value)
  // const appData = require('@/utils/geoYangzhou.json')
  echarts.registerMap('jiangsu', props.mapFindAreaData)
  // 指定图表的配置项和数据
  let option = {
    tooltip: props.customOption?.tooltip,
    visualMap: props.customOption?.visualMap,
    series: props.customOption?.series
  }
  chart.setOption(option)
  window.addEventListener('resize', () => {
    chart.resize()
  })
  chart.on('click', function (params) {
    //点击事件
    const areaLevel = localCache.getCache('areaLevel')
    if (areaLevel === '市级') {
      props.mapFindAreaData.features.forEach(async (item: any) => {
        if (item.properties.name === params.name) {
          try {
            const params = {
              adcode: item.properties.adcode
            }
            const { data, code } = await getAreaCode(params)
            if (code === 10) {
              attrs.onGetArea(Number(data.code))
            }
          } catch (error) {
            console.log('error', error)
          }
        }
      })
    }
  })
}
onMounted(() => {
  init()
})
</script>

<style lang="scss" scoped>
.map-container {
  width: 100%;
  height: 100%;
}
</style>
