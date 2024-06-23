<template>
  <div class="lab-container">
    <div
      class="info-title"
      :style="{ color: option.color, fontSize: option.fontSize + 'px' }"
    >
      <span>{{ option.title }}</span>
    </div>
    <div class="no-data" v-if="envMonitorInfo.length === 0">暂无数据</div>
    <template v-else>
      <div
        class="info-main"
        v-for="ele in envMonitorInfo"
        :key="ele.label"
        :style="{ color: option.contentColor, fontSize: option.contentSize + 'px' }"
      >
        <span>{{ ele.label }}</span>
        <span>{{ ele.value }}</span>
      </div>
    </template>
  </div>
</template>

<script>
import { getDeviceUseData } from '@/api/index.js'
import LocalCache from '@/utils/localCache'
export default {
  name: 'EnvMonitor',
  props: {
    option: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      envMonitorInfo: [],
    }
  },
  mounted() {
    this.getDeviceUseDataList()
  },
  methods: {
    //获取设备使用数据
    async getDeviceUseDataList() {
      let params = {
        lab_id: parseInt(LocalCache.getCookie('labor_id')),
      }
      try {
        const { code, data } = await getDeviceUseData(params)
        if (code === 10) {
          // console.log(data)
          this.format(data)
        }
      } catch (error) {
        console.log(error)
        // location.href = `https://stackoverflow.com/search?q=js+${error.message}`
      }
    },
    format(data) {
      this.envMonitorInfo = []
      data.forEach((item) => {
        if (item.payloadModel === 'propsNotify.AirSensor') {
          this.envMonitorInfo.push(
            {
              label: '温湿度：',
              value:
                item.payload.Temp +
                  (item.payload.Temp ? '℃' : null) +
                  '/' +
                  item.payload.Humidity +
                  (item.payload.Humidity ? '%rh' : null) || '19.35℃/36.20%rh',
            },
            {
              label: '有机化合物：',
              value:
                item.payload.TVOC + (item.payload.TVOC ? 'μg/m³' : null) || '0.28μg/m³',
            },
            {
              label: 'PM2.5：',
              value:
                item.payload.PM25 + (item.payload.PM25 ? 'μg/m³' : null) || '29μg/m³',
            },
            {
              label: 'PM10：',
              value:
                item.payload.PM10 + (item.payload.PM10 ? 'μg/m³' : null) || '29μg/m³',
            },
            {
              label: '二氧化碳：',
              value: item.payload.CO2 + (item.payload.CO2 ? 'ppm' : null) || '608ppm',
            }
          )
        }
      })
      //默认假数据
      if (this.envMonitorInfo.length === 0) {
        this.envMonitorInfo = [
          {
            label: '温湿度：',
            value: '19.35℃/36.20%rh',
          },
          {
            label: '有机化合物：',
            value: '0.28μg/m³',
          },
          {
            label: 'PM2.5：',
            value: '29μg/m³',
          },
          {
            label: 'PM10：',
            value: '29μg/m³',
          },
          {
            label: '二氧化碳：',
            value: '608ppm',
          },
        ]
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.lab-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  background: #fff;
  box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.16);
  border-radius: 10px;
  overflow: auto;
  .info-title {
    font-size: 14px;
    color: #61cab5;
    padding: 10px 0;
    span {
      padding-left: 20px;
    }
    &::after {
      content: '';
      display: block;
      width: 50%;
      border: 2px solid #61cab5;
      margin-top: 10px;
    }
  }

  .info-main {
    font-size: 14px;
    padding: 0 20px 20px;
    box-sizing: border-box;
  }
}
.no-data {
  width: 100%;
  font-size: 30px;
  font-weight: bold;
  text-align: center;
  margin: auto;
}
</style>
