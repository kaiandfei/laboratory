<template>
  <div class="container">
    <div class="info">
      <div class="control-electricity-info" v-for="(item, index) in coms" :key="index">
        <div class="info-title">
          <span>{{ item.title }}</span>
        </div>
        <div class="no-data" v-if="item.showNoData">
          {{ item.noData }}
        </div>
        <template v-else>
          <div
            class="info-main"
            v-for="ele in index === 0 ? controlElectricityInfo : envMonitorInfo"
            :key="ele.label"
          >
            <span>{{ ele.label }}</span>
            <span>{{ ele.value }}</span>
          </div>
        </template>
      </div>
    </div>
    <div class="note">
      <div class="note-title">实验室注意事项</div>
      <div class="note-mian">
        <div class="no-data" v-if="noticeData.length <= 0">暂无数据</div>
        <div class="context" v-else>
          <el-input type="textarea" v-model="currNoteData.content" readonly> </el-input>
        </div>
        <div class="not-footer">
          <img
            class="pag"
            :src="currPage === 0 ? pre : preActive"
            alt=""
            @click="handlePre"
          />
          <span>{{ currPage + 1 + '/' + noticeData.length }}</span>
          <img
            class="pag"
            :src="currPage === noticeData.length - 1 ? next : nextActive"
            alt=""
            @click="handleNext"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getDeviceUseData, noticeList } from '@/api/index.js'
import LocalCache from '@/utils/localCache'
export default {
  name: 'LaboratoryInfo',
  data() {
    return {
      coms: [
        {
          title: '实验室控电信息',
          noData: '暂无数据',
        },
        {
          title: '实验室环境监测信息',
          noData: '暂无数据',
        },
      ],
      controlElectricityInfo: [
        // {
        //   label: '电流：',
        //   value: '正常',
        // },
        // {
        //   label: '电压：',
        //   value: '正常',
        // },
      ],
      envMonitorInfo: [
        // {
        //   label: '温湿度：',
        //   value: '32/90',
        // },
        // {
        //   label: '有机化合物：',
        //   value: '30μg/m³',
        // },
        // {
        //   label: 'PM2.5：',
        //   value: '908μg/m³',
        // },
        // {
        //   label: 'PM10：',
        //   value: '90μg/m³',
        // },
        // {
        //   label: '二氧化碳：',
        //   value: '900ppm',
        // },
      ],
      noticeData: [],
      currNoteData: {},
      currPage: 0,
      pre: require('@/assets/images/laboratory/pre.png'),
      preActive: require('@/assets/images/laboratory/pre-active.png'),
      next: require('@/assets/images/laboratory/next.png'),
      nextActive: require('@/assets/images/laboratory/next-active.png'),
    }
  },
  mounted() {
    this.getDeviceUseDataList()
    this.getNoticeList()
  },
  methods: {
    //标红
    markRed(value) {
      let res = ['过热', '过高', '异常', '过压', '欠压', 90]
      let isRed = res.some((item) => item === value)
      if (isRed) {
        return { color: 'red' }
      }
    },
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
      this.controlElectricityInfo = []
      this.envMonitorInfo = []
      // this.coms.forEach((item) => {
      //   if (data.length === 0) {
      //     item['showNoData'] = true
      //   } else {
      //     item['showNoData'] = false
      //   }
      // })
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
        } else if (item.payloadModel === 'propsNotify.AirSwitch') {
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
    //获取注意事项
    async getNoticeList() {
      this.noticeData = []
      try {
        let params = {
          // labor_id: 1,
          labor_id: parseInt(LocalCache.getCookie('labor_id')),
        }
        const { code, data } = await noticeList(params)
        if (code === 10) {
          this.noticeData = data
          this.currNoteData = this.noticeData[this.currPage]
        }
      } catch (error) {
        console.log(error)
        // location.href = `https://stackoverflow.com/search?q=js+${error.message}`
      }
    },
    //上一页
    handlePre() {
      if (this.currPage === 0) return
      this.currPage--
      this.currNoteData = this.noticeData[this.currPage]
    },
    //下一页
    handleNext() {
      if (this.currPage >= this.noticeData.length - 1) return
      this.currPage++
      this.currNoteData = this.noticeData[this.currPage]
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}
.info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  height: 35%;
  .control-electricity-info {
    display: flex;
    flex-direction: column;
    width: 48%;
    height: 100%;
    background: #ffffff;
    box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.16);
    border-radius: 10px;
    overflow: auto;
  }
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
.note {
  // position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.16);
  border-radius: 10px;
  .note-title {
    height: 80px;
    line-height: 70px;
    font-size: 20px;
    color: #fff;
    background: #61cab5;
    border-radius: 10px;
    padding-left: 20px;
    box-sizing: border-box;
  }
  .note-mian {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 10px;
    background-color: #fff;
    margin-top: -20px;
    padding: 20px;
    box-sizing: border-box;
    .context {
      flex: 1;
      ::v-deep .el-textarea {
        height: 100%;
        .el-textarea__inner {
          height: 100%;
          border: none !important;
          resize: none;
        }
      }
    }
    .not-footer {
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      .pag {
        width: 30px;
        height: 30px;
        margin: 0 20px;
        cursor: pointer;
      }
    }
  }
}
.high {
  color: red;
}
.no-data {
  width: 100%;
  font-size: 30px;
  font-weight: bold;
  text-align: center;
  margin: auto;
}
</style>
