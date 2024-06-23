<template>
  <div class="zs-chart">
    <div ref="divRef" :style="elStyle" />
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'BaseChart',
  props: {
    elStyle: {
      type: Object,
      default: () => ({ width: '100%', height: '300px' }),
    },
    options: {
      type: Object,
      required: true,
    },
  },
  watch: {
    options: {
      handler() {
        this.draw()
      },
      deep: true,
    },
  },
  data() {
    return {
      myChart: '',
    }
  },
  mounted() {
    this.draw()
  },
  methods: {
    draw() {
      if (this.myChart !== null && this.myChart !== '' && this.myChart !== undefined) {
        this.myChart.dispose()
      }
      this.myChart = echarts.init(this.$refs.divRef)
      this.myChart.setOption(this.options)
      window.addEventListener('resize', () => {
        this.myChart.resize()
      })
    },
  },
}
</script>

<style scoped lang="scss"></style>
