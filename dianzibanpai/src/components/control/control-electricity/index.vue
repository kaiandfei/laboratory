<template>
  <div class="lab-container">
    <div
      class="info-title"
      :style="{ color: option.color, fontSize: option.fontSize + 'px' }"
    >
      <span>{{ option.title }}</span>
    </div>
    <div class="no-data" v-if="controlElectricityInfo.length === 0">暂无数据</div>
    <template v-else>
      <div
        class="info-main"
        v-for="ele in controlElectricityInfo"
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
  name: 'ControlElectricityInfo',
  props: {
    option: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      controlElectricityInfo: [],
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
          this.format(data)
        }
      } catch (error) {
        console.log(error)
      }
    },
    format(data) {
      this.controlElectricityInfo = []
      data.forEach((item) => {
        if (item.payloadModel === 'propsNotify.AirSwitch') {
          this.controlElectricityInfo.push(
            {
              label: '电流：',
              value: item.payload.Current + 'A' || '0.58A',
            },
            {
              label: '漏电流：',
              value: item.payload.Leakage + 'mA' || '0mA',
            },
            {
              label: '功率：',
              value: item.payload.Power + 'W' || '57W',
            },
            {
              label: '设备温度：',
              value: item.payload.Temp + '℃' || '26℃',
            },
            {
              label: '电压：',
              value: item.payload.Voltage + 'V' || '225V',
            }
          )
        }
      })
      //默认假数据
      if (this.controlElectricityInfo.length === 0) {
        this.controlElectricityInfo = [
          {
            label: '电流：',
            value: '0.58A',
          },
          {
            label: '漏电流：',
            value: '0mA',
          },
          {
            label: '功率：',
            value: '57W',
          },
          {
            label: '设备温度：',
            value: '26℃',
          },
          {
            label: '电压：',
            value: '225V',
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
