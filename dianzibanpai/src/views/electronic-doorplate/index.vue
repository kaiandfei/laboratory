<template>
  <div class="container">
    <div class="head">
      <div class="school-name">{{ shcoolName }}</div>
      <div class="course-name">
        <img class="titleImg" src="@/assets/images/laboratory/title.png" alt="" />
        {{ title }}
      </div>
      <div class="serial-number">
        <span>本机序列号：</span>
        <span class="serial-number-value">
          <el-input
            v-model="deviceNumber"
            placeholder="输入序列号"
            @change="changeTerminalSn"
          ></el-input>
          <!-- {{ deviceNumber }} -->
        </span>
      </div>
    </div>
    <template v-if="isExist && isShow">
      <template v-if="isSystem">
        <div class="main" v-if="!isReservation && isLaborId">
          <div class="main-left">
            <div class="today-course1">
              <today-course ref="todayCourseRef" />
            </div>
            <div class="frame1">
              <frame ref="frameRef" :labor_id="labor_id" />
            </div>
          </div>
          <div class="main-center">
            <laboratory-info ref="laboratoryInfoRef" />
          </div>
          <div class="main-right">
            <curriculum
              v-if="JSON.stringify(curriculumData) !== '{}'"
              ref="curriculumRef"
              :isReservation.sync="isReservation"
              :curriculumData="curriculumData"
              :subject_id="subject_id"
            />
          </div>
        </div>
      </template>
      <template v-else>
        <grid-layout
          v-if="!isReservation && isLaborId"
          :col-num="12"
          :is-draggable="false"
          :is-resizable="false"
          :is-mirrored="false"
          :margin="[15, 15]"
          :use-css-transforms="true"
          :layout="layout"
          :row-height="30"
          :vertical-compact="true"
          :style="{ backgroundColor: bgColor }"
        >
          <grid-item
            class="grid-item"
            v-for="item in layout"
            :key="item.i"
            :h="item.h"
            :i="item.i"
            :w="item.w"
            :x="item.x"
            :y="item.y"
          >
            <div
              :id="'flag' + item.i"
              class="comCss"
              v-if="
                (item.template === 'curriculum' &&
                  JSON.stringify(curriculumData) !== '{}') ||
                item.template !== 'curriculum'
              "
            >
              <component
                :style="{ backgroundColor: item.obj?.bgColor || '#fff' }"
                ref="componentRef"
                :is="item.template"
                :labor_id="labor_id"
                :isReservation.sync="isReservation"
                :curriculumData="curriculumData"
                :subject_id="subject_id"
                :option="item.obj"
              ></component>
            </div>
          </grid-item>
        </grid-layout>
      </template>
    </template>
    <div v-else class="no-device">
      <el-empty description="设备不存在" />
    </div>

    <div v-if="isReservation && isLaborId" class="main">
      <reservation
        :isReservation.sync="isReservation"
        :curriculumData="curriculumData"
        :subject_id="subject_id"
        @openSetInterval="openSetInterval"
      />
    </div>
  </div>
</template>

<script>
import {
  getDevicePosition,
  findDatebyweek,
  findTypeClassCardSetting,
} from '@/api/index.js'
import {
  getTerminalSN,
  getEntryTerminalSN,
  sendEntryTerminalSNFromJS,
} from '@/utils/device-interaction'
import LocalCache from '@/utils/localCache'
// import todayCourse from './electronic-doorplate-main/today-course.vue'
// import frame from './electronic-doorplate-main/frame.vue'
// import laboratoryInfo from './electronic-doorplate-main/laboratory-info.vue'
// import curriculum from './electronic-doorplate-main/curriculum.vue'
import reservation from './electronic-doorplate-main/reservation.vue'
import { GridLayout, GridItem } from 'vue-grid-layout'
// const TEMREFS = ['frameRef', 'todayCourseRef', 'laboratoryInfoRef', 'curriculumRef']
export default {
  components: {
    // todayCourse,
    // frame,
    // laboratoryInfo,
    // curriculum,
    reservation,
    GridLayout,
    GridItem,
  },
  data() {
    return {
      isReservation: false,
      shcoolName: '',
      title: '',
      deviceNumber: LocalCache.getCookie('device_no') || '',
      labor_id: '',
      subject_id: '',
      curriculumData: {},
      isLaborId: false,
      isExist: false,
      timer: null,
      timer1: null,
      isSystem: true,
      layout: [
        { x: 0, y: 0, w: 4, h: 6, i: '0', template: '', flag: '' },
        { x: 4, y: 0, w: 4, h: 6, i: '1', template: '', flag: '' },
        { x: 8, y: 0, w: 4, h: 6, i: '2', template: '', flag: '' },
        { x: 0, y: 4, w: 4, h: 6, i: '3', template: '', flag: '' },
        { x: 4, y: 4, w: 4, h: 6, i: '4', template: '', flag: '' },
        { x: 8, y: 4, w: 4, h: 6, i: '5', template: '', flag: '' },
        { x: 0, y: 8, w: 4, h: 6, i: '6', template: '', flag: '' },
        { x: 4, y: 8, w: 4, h: 6, i: '7', template: '', flag: '' },
        { x: 8, y: 8, w: 4, h: 6, i: '8', template: '', flag: '' },
      ],
      bgColor: '',
      isShow: false,
    }
  },
  created() {},
  mounted() {
    //安卓
    window.getEntryTerminalSNFromJS = () => {
      sendEntryTerminalSNFromJS(this.deviceNumber || LocalCache.getCookie('device_no'))
    }
    getTerminalSN().then((res) => {
      //测试序列号 A0SF9PD6CR
      this.deviceNumber = res.terminalSN || ''
      if (!this.deviceNumber && LocalCache.getCookie('device_no')) {
        this.deviceNumber = LocalCache.getCookie('device_no')
        this.changeTerminalSn(this.deviceNumber)
        console.log(
          '🚀 ~ file: Login.vue:110 ~ getTerminalSN ~ this.terminalSN:',
          this.deviceNumber
        )
      }
      LocalCache.setCookie('device_no', res.terminalSN || '')
      // this.getDevicePositionData(this.deviceNumber)
      console.log(111111, res)
    })
  },
  provide() {
    return {
      updateComData: this.updateComData,
      closeSetInterval: this.closeSetInterval,
      openSetInterval: this.openSetInterval,
    }
  },
  methods: {
    format(obj) {
      this.layout = obj.templateList.map((item) => {
        item['template'] = item.list[0]?.temp || ''
        return item
      })
    },
    async getFindTypeClassCardSetting() {
      LocalCache.clearCookie('isSystem')
      try {
        const params = {
          status: 1,
          school_id: LocalCache.getCookie('schoolId'),
        }
        const { data, code } = await findTypeClassCardSetting(params)
        if (code === 10) {
          if (!data) {
            this.isShow = false
            this.$message({
              message: '您没有选择任何模版，请到班牌配置页面选择模版',
              type: 'warning',
            })
            return
          } else {
            this.isShow = true
          }
          if (data.school_id !== -1) {
            this.isSystem = false
            LocalCache.setCookie('isSystem', 0)
          } else {
            LocalCache.setCookie('isSystem', 1)
          }
          this.bgColor = data.background
          this.format(data)
          this.openSetInterval()
          // console.log('findTypeClassCardSetting', data)
        }
      } catch (error) {
        console.log('err', error)
      }
    },
    changeTerminalSn(e) {
      console.log('🚀 ~ file: Login.vue:115 ~ changeTerminalSn ~ e:', e)
      getEntryTerminalSN(e)
      LocalCache.setCookie('device_no', e)
      this.getDevicePositionData(e)
    },
    //关闭弹窗更新组件数据
    updateComData() {
      this.timer = setInterval(() => {
        if (!this.isSystem) {
          this.$refs['componentRef'].forEach((item) => {
            item.getLabBookData &&
              item.getLabBookData(Number(LocalCache.getCookie('currActive')) + 1)
            item.getDeviceUseDataList && item.getDeviceUseDataList()
            item.getTableDateLab && item.getTableDateLab()
          })
        } else {
          this.$refs['todayCourseRef'].getLabBookData(
            Number(LocalCache.getCookie('currActive')) + 1
          )
          this.$refs['laboratoryInfoRef'].getDeviceUseDataList()
          this.$refs['curriculumRef'].getTableDateLab()
        }
      }, 60000)
      if (Object.keys(this.$refs).includes('frameRef')) {
        this.timer1 = setInterval(() => {
          this.$refs['frameRef'].getCameraVideoRealTimeUrl()
        }, 300000)
      }
    },
    openSetInterval() {
      this.closeSetInterval()
      this.updateComData()
    },
    closeSetInterval() {
      clearInterval(this.timer)
      clearInterval(this.timer1)
      this.timer = null
      this.timer1 = null
    },
    //获取设备位置信息
    async getDevicePositionData(value) {
      this.closeSetInterval()
      let params = {
        device_no: value,
      }
      try {
        const { code, data, msg } = await getDevicePosition(params)
        if (code === 200) {
          this.isExist = true
          this.getFindDatebyweek(data)
          this.shcoolName = data.school_name
          this.title = data.lab_info.title
          this.subject_id = data.subject_id
          // console.log(81, data)
          this.labor_id = data.labor_id
          this.isLaborId = true
          // LocalCache.setCookie('labor_id', 0)
          LocalCache.setCookie('labor_id', data.labor_id || '')
          LocalCache.setCookie('is_order', data.lab_info.is_order)
          LocalCache.setCookie('device_no', value)
          LocalCache.setCookie('schoolId', data.school_id)
          this.getFindTypeClassCardSetting()
        } else {
          this.isExist = false
          this.closeSetInterval()
          this.$message({
            type: 'warning',
            message: msg,
          })
        }
      } catch (error) {
        this.isExist = false
        this.closeSetInterval()
        console.log('error', error)
        // location.href = `https://stackoverflow.com/search?q=js+${error.message}`
      }
    },
    //学期管理 查询
    async getFindDatebyweek(data) {
      let params = {
        // school_id: 382,
        // phase_study_id: 2,
        school_id: data.school_id,
        phase_study_id: data.phase_study_id,
      }
      try {
        const { code, data } = await findDatebyweek(params)
        if (code === 10) {
          this.curriculumData = data
          this.$store.commit('mutSchoolDate', data)
          // console.log('115', data)
        }
      } catch (error) {
        console.log('124', error)
        // location.href = `https://stackoverflow.com/search?q=js+${error.message}`
      }
    },
  },
  destroyed() {
    this.closeSetInterval()
  },
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  background-color: #dedede;
}
.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  font-size: 24px;
  box-sizing: border-box;
  background: #f8ffff;
  box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.16);
  padding: 0 20px;
  // margin-bottom: 20px;
  .school-name {
    color: #626572;
  }
  .course-name {
    display: flex;
    align-items: center;
    .titleImg {
      width: 99px;
      margin-right: 30px;
    }
  }
  .serial-number-value {
    color: #329581;
    ::v-deep .el-input {
      width: 50%;
    }
  }
}
.main {
  display: flex;
  height: calc(100vh - 80px);

  padding: 20px;
  box-sizing: border-box;
  .main-left {
    width: 740px;
    margin-right: 20px;
    .today-course1 {
      height: calc(50% - 10px);
      margin-bottom: 20px;
    }
    .frame1 {
      height: calc(50% - 10px);
    }
  }
  .main-center {
    flex: 1;
    margin-right: 20px;
  }
  .main-right {
    width: 500px;
  }
}
.no-device {
  width: 100%;
  height: calc(100% - 80px);
  display: flex;
  justify-content: center;
  align-items: center;
  // color: #05c65d;
  ::v-deep .el-empty__description > p {
    font-size: 30px;
  }
}
.vue-grid-layout {
  height: calc(100% - 80px) !important;
  overflow: auto;
}
.grid-item {
  // border: 2px dashed #aaa;
}
.comCss {
  width: 100%;
  height: 100%;
}
</style>
