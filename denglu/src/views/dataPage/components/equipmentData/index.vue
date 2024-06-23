<template>
  <div class="equip-container">
    <div class="col">
      <div class="row row-flex">
        <div
          class="equip-total chart-box"
          v-loading="equipLoading"
          element-loading-text="加载中..."
          element-loading-background="#010527"
        >
          <div class="title">
            <img src="../../../../assets/images/bigData/icon1.png" alt="" />
            装备总量
          </div>
          <bar-chart v-if="equipTotalData.length !== 0" :customOption="equipTotalOption" />
        </div>
        <div
          class="equip-total-rate chart-box"
          v-loading="equipLoading"
          element-loading-text="加载中..."
          element-loading-background="#010527"
        >
          <div class="title">
            <img src="../../../../assets/images/bigData/icon1.png" alt="" />
            装备总量达标率
          </div>
          <pie-chart v-if="equipTotalRateData.length !== 0" :customOption="equipTotalRateOption" />
        </div>
      </div>
      <div class="row row-flex">
        <div
          class="subject-total chart-box"
          v-loading="equipLoading"
          element-loading-text="加载中..."
          element-loading-background="#010527"
        >
          <div class="title">
            <img src="../../../../assets/images/bigData/icon1.png" alt="" />
            装备总量达标率
          </div>
          <bar-chart v-if="subjectTotalData.length !== 0" :customOption="subjectTotalOption" />
        </div>
        <div
          class="subject-total-rate chart-box"
          v-loading="equipLoading"
          element-loading-text="加载中..."
          element-loading-background="#010527"
        >
          <div class="title">
            <img src="../../../../assets/images/bigData/icon1.png" alt="" />
            装备种类达标率
          </div>
          <pie-chart v-if="subjectTotalRateData.length !== 0" :customOption="subjectTotalRateOption" />
        </div>
      </div>
      <div
        class="row row-const chart-box"
        v-loading="instrumentFlowDataLoading"
        element-loading-text="加载中..."
        element-loading-background="#010527"
      >
        <div class="title">
          <img src="../../../../assets/images/bigData/icon1.png" alt="" />
          装备总量增长趋势
        </div>
        <line-chart
          class="third-chart"
          v-if="instrumentFlowData.length !== 0 || equipmentFlowData.length !== 0"
          :customOption="instrumentFlowDataOption"
        />
      </div>
    </div>
    <div class="col">
      <div class="row row-flex row-height60">
        <div
          class="average chart-box"
          v-loading="averageLoading"
          element-loading-text="加载中..."
          element-loading-background="#010527"
        >
          <div class="title">
            <img src="../../../../assets/images/bigData/icon1.png" alt="" />
            生均教学仪器设备达标率
          </div>
          <pie-chart v-if="averageData.length !== 0" :customOption="averageOption" />
        </div>
        <div class="row-right">
          <div
            class="instrument chart-box"
            v-loading="instrumentLoading"
            element-loading-text="加载中..."
            element-loading-background="#010527"
          >
            <div class="title">
              <img src="../../../../assets/images/bigData/icon1.png" alt="" />
              仪器利用率
              <el-select v-model="comSchoolyear" class="instrument-select" @change="handleSemesterChange">
                <el-option
                  v-for="(item, index) in comSchoolyearList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <pie-chart class="chart-position" v-if="instrumentData.length !== 0" :customOption="instrumentOption" />
          </div>
          <div
            class="equip-status chart-box"
            v-loading="equipStatusLoading"
            element-loading-text="加载中..."
            element-loading-background="#010527"
          >
            <div class="title">
              <img src="../../../../assets/images/bigData/icon1.png" alt="" />
              装备状态
            </div>
            <pie-chart class="chart-position" v-if="equipStatusData.length !== 0" :customOption="equipStatusOption" />
          </div>
        </div>
      </div>
      <div
        class="row row-const chart-box"
        v-loading="categoryLoading"
        element-loading-text="加载中..."
        element-loading-background="#010527"
      >
        <div class="title">
          <img src="../../../../assets/images/bigData/icon1.png" alt="" />
          分类仪器总量达标率
        </div>
        <bar-chart v-if="categoryData.length !== 0" :customOption="categoryOption" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import {
  instrumentFlow,
  InstrumentTypeAmountSummary,
  InstrumentStatusSummary,
  StudentAvgSummary,
  InstrumentUseRate,
  instrumentAmountSummary
} from '@/service/dataPage/index'
import {
  equipTotal,
  equipTotalRate,
  subjectTotal,
  instrumentFlowAdd,
  average,
  laboratoryUseRate,
  equipStatus,
  category
} from '../chart-options/index'
const props = defineProps(['city', 'area', 'school', 'standardLevel', 'schoolyearList'])
let comSchoolyearList = ref(props.schoolyearList)

//装备总量图表数据
let equipTotalData = ref<any>([])
let equipTotalRateData = ref<any>([])
let subjectTotalData = ref<any>([])
let subjectTotalRateData = ref<any>([])
let equipTotalOption: any = ref({})
let equipTotalRateOption: any = ref({})
let subjectTotalOption: any = ref({})
let subjectTotalRateOption: any = ref({})
let equipLoading = ref(false)
const getInstrumentAmountSummary = async () => {
  equipLoading.value = true
  equipTotalData.value = []
  equipTotalRateData.value = []
  subjectTotalData.value = []
  subjectTotalRateData.value = []
  equipTotalOption.value = JSON.parse(JSON.stringify(equipTotal))
  equipTotalRateOption.value = JSON.parse(JSON.stringify(equipTotalRate))
  subjectTotalOption.value = JSON.parse(JSON.stringify(subjectTotal))
  subjectTotalRateOption.value = JSON.parse(JSON.stringify(equipTotalRate))
  try {
    const params = {
      city: props.city,
      area: props.area,
      school_id: props.school,
      stand_level: props.standardLevel,
      year: currentYear
    }
    const { data, code } = await instrumentAmountSummary(params)
    if (code === 10) {
      equipTotalData.value = [
        data.amount_summary.short_amount,
        data.amount_summary.real_amount,
        data.amount_summary.standard_amount
      ]
      equipTotalRateData.value = [data.reach_amount_summary.reach_amount_rate]
      subjectTotalData.value = [
        (data.reach_stand_summary.must_reach_rate * 100).toFixed(0),
        (data.reach_stand_summary.no_must_reach_rate * 100).toFixed(0)
      ]
      subjectTotalRateData.value = [data.reach_type_summary.reach_type_rate]

      equipTotalOption.value.series[0].data = equipTotalData.value
      equipTotalRateOption.value.series[0].data = equipTotalRateData.value
      subjectTotalOption.value.series[0].data = subjectTotalData.value
      subjectTotalRateOption.value.series[0].data = subjectTotalRateData.value
    }
    equipLoading.value = false
  } catch (error) {
    equipLoading.value = false
    console.log(error)
  }
}

//装备总量增长趋势图表配置
let instrumentFlowData = ref<any>([])
let equipmentFlowData = ref<any>([])
const currentYear = new Date().getFullYear()
let instrumentFlowDataOption: any = ref({})
let instrumentFlowDataLoading = ref(false)
const getInstrumentFlowData = async () => {
  instrumentFlowDataLoading.value = true
  instrumentFlowData.value = []
  equipmentFlowData.value = []
  instrumentFlowDataOption.value = JSON.parse(JSON.stringify(instrumentFlowAdd))
  try {
    const params = {
      city: props.city,
      area: props.area,
      school_id: props.school,
      year: currentYear
    }
    const { data, code } = await instrumentFlow(params)
    if (code === 10) {
      if (data.month_list && Array.isArray(data.month_list)) {
        let monthArr = data.month_list.map((item: any) => {
          return Number(item.slice(-2)) + '月'
        })
        instrumentFlowDataOption.value.xAxis.data = monthArr
      }
      instrumentFlowData.value = data.instrument_month_list
      equipmentFlowData.value = data.equipment_month_list
      instrumentFlowDataOption.value.series[0].data = instrumentFlowData.value
      instrumentFlowDataOption.value.series[1].data = equipmentFlowData.value
    }
    instrumentFlowDataLoading.value = false
  } catch (error) {
    instrumentFlowDataLoading.value = false
    console.log(error)
  }
}

//生均教学仪器设备达标率图表配置
let averageData = ref<any>([])
let averageOption: any = ref({})
let averageLoading = ref(false)
const getStudentAvgSummary = async () => {
  averageLoading.value = true
  averageOption.value = JSON.parse(JSON.stringify(average))
  averageData.value = []
  try {
    const params = {
      city: props.city,
      area: props.area,
      school_id: props.school,
      stand_level: props.standardLevel,
      year: currentYear
    }
    const { data, code } = await StudentAvgSummary(params)
    if (code === 10) {
      averageData.value = [data.avg_rate]
      averageOption.value.series[0].data[0].value = averageData.value[0]
      averageOption.value.series[0].data[1].value = 1 - averageData.value[0]
    }
    averageLoading.value = false
  } catch (error) {
    averageLoading.value = false
    console.log(error)
  }
}
//仪器利用率图表数据
let comSchoolyear = ref(
  new Date().getMonth() + 1 <= 8 && new Date().getMonth() + 1 > 2
    ? new Date().getFullYear() - 1 + ',' + 2
    : new Date().getFullYear() + ',' + 1
)
let school_year = ref<string | number>(Number(comSchoolyear.value.split(',')[0]))
let semester = ref<string | number>(Number(comSchoolyear.value.split(',')[1]))
const handleSemesterChange = (val: string) => {
  school_year.value = Number(val.split(',')[0])
  semester.value = Number(val.split(',')[1])
  console.log(val)
}
let instrumentOption: any = ref({})
let instrumentData: any = ref([])
let instrumentLoading = ref(false)
const getInstrumentUseRate = async () => {
  instrumentLoading.value = true
  instrumentOption.value = JSON.parse(JSON.stringify(laboratoryUseRate))
  instrumentData.value = []
  try {
    const params = {
      city: props.city,
      area: props.area,
      school_id: props.school,
      school_year: school_year.value,
      semester: semester.value,
      stand_level: props.standardLevel
    }
    const { data, code } = await InstrumentUseRate(params)
    if (code === 10) {
      instrumentData.value = [data.use_rate]
      instrumentOption.value.title.text = (instrumentData.value[0] * 100).toFixed(2) + '%'
      instrumentOption.value.title.textStyle.fontSize = '14'
      instrumentOption.value.tooltip.formatter = '利用率  ' + (instrumentData.value[0] * 100).toFixed(2) + '%'
      instrumentOption.value.series[0].data = [(instrumentData.value[0] * 100).toFixed(2)]
    }
    instrumentLoading.value = false
  } catch (error) {
    instrumentLoading.value = false
    console.log(error)
  }
}

//装备状态图表数据
const equipStatusData = ref([])
let equipStatusOption: any = ref({})
let equipStatusLoading = ref(false)
const getInstrumentStatusSummary = async () => {
  equipStatusLoading.value = true
  equipStatusOption.value = JSON.parse(JSON.stringify(equipStatus))
  equipStatusData.value = []
  try {
    const params = {
      city: props.city,
      area: props.area,
      school_id: props.school,
      stand_level: props.standardLevel,
      year: currentYear
    }
    const { data, code } = await InstrumentStatusSummary(params)
    if (code === 10) {
      equipStatusData.value = data.avg_rate
      equipStatusOption.value.series[0].data = equipStatusData.value
    }
    equipStatusLoading.value = false
  } catch (error) {
    equipStatusLoading.value = false
    console.log(error)
  }
}
//分类仪器总量达标率图表配置
const categoryData = ref([90, 20, 30, 40, 100])
let categoryOption: any = ref({})
let categoryLoading = ref(false)
const getInstrumentTypeAmountSummary = async () => {
  categoryLoading.value = true
  categoryOption.value = JSON.parse(JSON.stringify(category))
  categoryData.value = []
  try {
    const params = {
      city: props.city,
      area: props.area,
      school_id: props.school,
      stand_level: props.standardLevel
    }
    const { data, code } = await InstrumentTypeAmountSummary(params)
    if (code === 10) {
      categoryOption.value.xAxis.data = Object.keys(data)
      Object.values(data).forEach((item: any) => {
        categoryData.value.push((item * 100).toFixed(2))
      })
      categoryOption.value.xAxis.axisLabel.formatter = (params: any) => {
        const index = 6 //字数为6个超出就显示成点
        let newstr = ''
        for (let i = 0; i < params.length; i += index) {
          const tmp = params.substring(i, i + index)
          newstr += tmp + ''
        }
        if (newstr.length > 6) return newstr.substring(0, 6) + '...'
        else return '\n' + newstr
      }
      categoryOption.value.series[0].data = categoryData.value
      // initCategoryOption()
    }
    categoryLoading.value = false
  } catch (error) {
    categoryLoading.value = false
    console.log(error)
  }
}
watch([() => props.city, () => props.area, () => props.school], (newValue, oldValue) => {
  getInstrumentAmountSummary()
  getInstrumentFlowData()
  getStudentAvgSummary()
  getInstrumentUseRate()
  getInstrumentStatusSummary()
  getInstrumentTypeAmountSummary()
})
watch(
  () => comSchoolyear.value,
  (newValue, oldValue) => {
    getInstrumentUseRate()
  }
)
watch(
  () => props.standardLevel,
  (newValue, oldValue) => {
    getInstrumentAmountSummary()
    getInstrumentTypeAmountSummary()
    getStudentAvgSummary()
    getInstrumentStatusSummary()
    getInstrumentUseRate()
  }
)
onMounted(() => {
  getInstrumentAmountSummary()
  getInstrumentFlowData()
  getStudentAvgSummary()
  getInstrumentUseRate()
  getInstrumentStatusSummary()
  getInstrumentTypeAmountSummary()
})
</script>

<style lang="scss" scoped>
@mixin borderBottomRightRadius {
  border: 1px solid #0e3153;
  border-bottom-right-radius: 10px;
}
.chart-position {
  position: relative;
  // top: 30px;
}
.chart-box {
  padding: 10px;
  box-sizing: border-box;
  @include borderBottomRightRadius();
}
.row-const {
  height: 40%;
}
.row-flex {
  height: 30%;
  display: flex;
  // justify-content: space-between;
  .average {
    width: 50%;
    margin-right: 10px;
    position: relative;
  }
  .row-right {
    width: 50%;
    display: flex;
    flex-direction: column;
    .instrument {
      margin-bottom: 10px;
    }
  }
}
.row-height60 {
  height: 60%;
}
.title {
  width: 100%;
  height: 25px;
  position: absolute;
  left: 0;
  top: 5px;
  font-size: 16px;
  display: flex;
  align-items: center;
  background-image: url('../../../../assets/images/bigData/line.png');
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: center bottom;
  padding: 0 20px 5px;
  box-sizing: border-box;
  img {
    margin-right: 10px;
  }
  .instrument-select {
    position: absolute;
    right: 10px;
  }
}
.equip-container {
  display: flex;
  justify-content: space-between;
  height: 100%;
  // padding: 20px 0 0;
  // box-sizing: border-box;
  .col {
    width: 50%;
    display: flex;
    flex-direction: column;
    height: 100%;
    // background-color: pink;
    .row {
      margin: 5px;
      position: relative;
    }
  }
  .col:not(:last-child) {
    margin-right: 10px;
  }
}
.equip-total,
.subject-total {
  flex: 1;
  position: relative;
  margin-right: 10px;
}
.equip-total-rate,
.subject-total-rate,
.instrument,
.equip-status {
  flex: 1;
  position: relative;
}
::v-deep .el-select {
  width: 120px;
  z-index: 1000;
  margin-left: 10px;
  .el-select__wrapper {
    background-color: #001e3d;
    box-shadow: unset !important;
    // border: 1px solid #12cbf1;
    .el-select__icon {
      color: #00adff;
    }
  }
  .el-select__placeholder {
    color: #fff !important;
  }
}
</style>
