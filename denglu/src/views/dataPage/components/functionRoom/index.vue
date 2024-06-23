<template>
  <div class="fun-room-container">
    <div class="row">
      <div
        class="col course-border"
        v-loading="laboratoryCountLoading"
        element-loading-text="加载中..."
        element-loading-background="#010527"
      >
        <div class="title">
          <img src="../../../../assets/images/bigData/icon1.png" alt="" />
          功能室数量
        </div>
        <pie-chart v-if="laboratoryCountData.length !== 0" :customOption="laboratoryCountOption" />
      </div>
      <div
        class="col course-border"
        v-loading="laboratoryUseRateLoading"
        element-loading-text="加载中..."
        element-loading-background="#010527"
      >
        <div class="title">
          <el-select v-model="comSchoolyear" class="m-2" @change="handleFunctionUseChange">
            <el-option
              v-for="(item, index) in comSchoolyearList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <img src="../../../../assets/images/bigData/icon1.png" alt="" />
          实验室利用率
        </div>
        <pie-chart class="chart-position" v-if="laboratoryUseRateDataFlag" :customOption="laboratoryUseRateOption" />
      </div>
      <div
        class="col course-border"
        v-loading="laboratoryUseFrequencyLoading"
        element-loading-text="加载中..."
        element-loading-background="#010527"
      >
        <div class="title">
          <el-select v-model="laboratorySchoolyear" class="m-2" @change="handleFunctionUseChange1">
            <el-option
              v-for="(item, index) in comSchoolyearList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <img src="../../../../assets/images/bigData/icon1.png" alt="" />
          实验室使用频次统计
        </div>
        <line-chart v-if="laboratoryUseFrequencyData.length !== 0" :customOption="laboratoryUseFrequencyOption" />
      </div>
    </div>
    <div class="row">
      <div
        class="col course-border"
        v-loading="laborTypeRateLoading"
        element-loading-text="加载中..."
        element-loading-background="#010527"
      >
        <div class="title">
          <img src="../../../../assets/images/bigData/icon1.png" alt="" />
          功能室类型占比
        </div>
        <pie-chart v-if="laborTypeRateData.length !== 0" :customOption="laboratoryTypeOption" />
      </div>
      <div
        class="col course-border"
        v-loading="experimentLoading"
        element-loading-text="加载中..."
        element-loading-background="#010527"
      >
        <div class="title">
          <img src="../../../../assets/images/bigData/icon1.png" alt="" />
          实验室使用列表
        </div>
        <ul class="open-course-list">
          <!-- item.exp_name=item.exp_name.map(ele=>ele)+ -->
          <li v-for="(item, index) in experimentList" :key="index">
            {{
              `${item.school_name}/${item.laboratory_name}/${[...item.exp_name]}/${GRADEARR[item.grade]}/${
                item.teacher_name
              }/${item.start}`
            }}
          </li>
        </ul>
      </div>
      <div
        class="col course-border"
        v-loading="laborAmountReachStandBySubjectLoading"
        element-loading-text="加载中..."
        element-loading-background="#010527"
      >
        <div class="title">
          <img src="../../../../assets/images/bigData/icon1.png" alt="" />
          功能室总量达标统计
        </div>
        <bar-chart
          v-if="laborAmountReachStandBySubjectData.length !== 0"
          :customOption="laborAmountReachStandBySubjectOption"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { GRADEARR } from '@/constents/common'
import { ref, watch, onMounted } from 'vue'
import {
  laborData,
  laborUseData,
  useFrequency,
  useList,
  laborTypeRate,
  laborAmountReachStandBySubject
} from '@/service/dataPage/index'
import {
  laboratoryCountPie,
  laboratoryUseRate,
  laboratoryUseFrequency,
  laboratoryType,
  amountReachStandBySubject
} from '../chart-options/index'
const props = defineProps(['city', 'area', 'school', 'standardLevel', 'schoolyearList'])

//功能室数量
let laboratoryCountOption: any = ref({})
let laboratoryCountData = ref<any>([])
let laboratoryCountLoading = ref(false)
const SUBJECTARR = ['', '物理', '化学', '生物', '小学科学']
const getLaborData = async () => {
  laboratoryCountLoading.value = true
  laboratoryCountData.value = []
  laboratoryCountOption.value = JSON.parse(JSON.stringify(laboratoryCountPie))
  try {
    const params = {
      city: props.city,
      area: props.area,
      school_id: props.school
      // standard_level: props.standardLevel
    }
    const { data, code } = await laborData(params)
    if (code === 10) {
      data.forEach((item: any) => {
        let obj: any = {}
        obj.value = item.value
        obj.name = SUBJECTARR[item.subject_id]
        laboratoryCountData.value.push(obj)
      })
      laboratoryCountOption.value.series[0].data.unshift(...laboratoryCountData.value)
    }
    laboratoryCountLoading.value = false
  } catch (error) {
    laboratoryCountLoading.value = false
    console.log(error)
  }
}

//实验室利用率
let comSchoolyear = ref(
  new Date().getMonth() + 1 <= 8 && new Date().getMonth() + 1 > 2
    ? new Date().getFullYear() - 1 + ',' + 2
    : new Date().getFullYear() + ',' + 1
)
let school_year = ref<string | number>(Number(comSchoolyear.value.split(',')[0]))
let semester = ref<string | number>(Number(comSchoolyear.value.split(',')[1]))
let comSchoolyearList = ref(props.schoolyearList)
const handleFunctionUseChange = (val: string) => {
  school_year.value = Number(val.split(',')[0])
  semester.value = Number(val.split(',')[1])
  getLaborUseData()
  console.log(val)
}
let laboratoryUseRateOption = ref<any>({})
let laboratoryUseRateData = ref(0)
let laboratoryUseRateDataFlag = ref(false)
let laboratoryUseRateLoading = ref(false)
const getLaborUseData = async () => {
  laboratoryUseRateLoading.value = true
  laboratoryUseRateDataFlag.value = false
  laboratoryUseRateOption.value = JSON.parse(JSON.stringify(laboratoryUseRate))
  laboratoryUseRateData.value = 0
  try {
    const params = {
      city: props.city,
      area: props.area,
      school_id: props.school,
      school_year: school_year.value,
      semester: semester.value
    }
    const { data, code } = await laborUseData(params)
    if (code === 10) {
      laboratoryUseRateData.value = data.lab_use_percentage || 0
      laboratoryUseRateDataFlag.value = true
      laboratoryUseRateOption.value.title.text =
        (laboratoryUseRateData.value * 100).toFixed(2) + '%' + '\n' + '整体利用'
      laboratoryUseRateOption.value.title.textStyle.fontSize = '18'
      laboratoryUseRateOption.value.title.top = '40%'
      laboratoryUseRateOption.value.tooltip.formatter =
        '利用率  ' + (laboratoryUseRateData.value * 100).toFixed(2) + '%'
      laboratoryUseRateOption.value.series[0].data = [(laboratoryUseRateData.value * 100).toFixed(2)]
    }
    laboratoryUseRateLoading.value = false
  } catch (error) {
    laboratoryUseRateLoading.value = false
    laboratoryUseRateDataFlag.value = false
    console.log('getLaborUseData', error)
  }
}

//实验室使用频次统计
let laboratorySchoolyear = ref(
  new Date().getMonth() + 1 <= 8 && new Date().getMonth() + 1 > 2
    ? new Date().getFullYear() - 1 + ',' + 2
    : new Date().getFullYear() + ',' + 1
)
let school_year1 = ref<string | number>(Number(laboratorySchoolyear.value.split(',')[0]))
let semester1 = ref<string | number>(Number(laboratorySchoolyear.value.split(',')[1]))
const handleFunctionUseChange1 = (val: string) => {
  school_year1.value = Number(val.split(',')[0])
  semester1.value = Number(val.split(',')[1])
  getUseFrequency()
  console.log(val)
}
let laboratoryUseFrequencyData = ref<any>([])
let laboratoryUseFrequencyOption: any = ref({})
let laboratoryUseFrequencyLoading = ref(false)
const getUseFrequency = async () => {
  laboratoryUseFrequencyLoading.value = true
  laboratoryUseFrequencyOption.value = JSON.parse(JSON.stringify(laboratoryUseFrequency))
  laboratoryUseFrequencyData.value = []
  try {
    const params = {
      city: props.city,
      area: props.area,
      school_id: props.school,
      school_year: school_year1.value,
      semester: semester1.value
    }
    const { data, code } = await useFrequency(params)
    if (code === 10) {
      data.forEach((item: any) => {
        let keys: any = []
        let values: any = []
        keys.push(item.name)
        values.push(item.num)
        laboratoryUseFrequencyData.value.push([...keys, ...values])
      })
      laboratoryUseFrequencyOption.value.series[0].data = laboratoryUseFrequencyData.value
    }
    laboratoryUseFrequencyLoading.value = false
  } catch (error) {
    laboratoryUseFrequencyLoading.value = false
    console.log(error)
  }
}

//功能室类型占比
let laboratoryTypeOption: any = ref({})
let laborTypeRateData: any = ref([])
let laborTypeRateLoading = ref(false)
const getLaborTypeRate = async () => {
  laborTypeRateLoading.value = true
  laboratoryTypeOption.value = JSON.parse(JSON.stringify(laboratoryType))
  laborTypeRateData.value = []
  try {
    const params = {
      city: props.city,
      area: props.area,
      school_id: props.school
    }
    const { data, code } = await laborTypeRate(params)
    if (code === 10) {
      for (let i = 0; i < Object.keys(data).length; i++) {
        laborTypeRateData.value.push({
          value: (Number(Object.values(data)[i]) * 100).toFixed(0),
          name: Object.keys(data)[i]
        })
      }
      laboratoryTypeOption.value.series[0].data = laborTypeRateData.value
    }
    laborTypeRateLoading.value = false
  } catch (error) {
    laborTypeRateLoading.value = false
    // console.log('getLaborTypeRate', error)
  }
}
//实验室使用列表数据
const experimentList = ref<any>([])
let experimentLoading = ref(false)
const getUseList = async () => {
  experimentLoading.value = true
  try {
    const params = {
      city: props.city,
      area: props.area,
      school_id: props.school
    }
    const { data, code } = await useList(params)
    if (code === 10) {
      // console.log(222, data)
      experimentList.value = data
    }
    experimentLoading.value = false
  } catch (error) {
    experimentLoading.value = false
    console.log(error)
  }
}

//功能室总量达标统计图表配置
let laborAmountReachStandBySubjectOption: any = ref({})
let laborAmountReachStandBySubjectData: any = ref([])
let yAxisData: any = ref([])
let laborAmountReachStandBySubjectLoading = ref(false)
const getLaborAmountReachStandBySubject = async () => {
  laborAmountReachStandBySubjectLoading.value = true
  laborAmountReachStandBySubjectOption.value = JSON.parse(JSON.stringify(amountReachStandBySubject))
  laborAmountReachStandBySubjectData.value = []
  yAxisData.value = []
  try {
    const params = {
      city: props.city,
      area: props.area,
      school_id: props.school,
      standard_level: props.standardLevel
    }
    const { data, code } = await laborAmountReachStandBySubject(params)
    if (code === 10) {
      if (data && data.length > 0) {
        data.forEach((item: any) => {
          let keys: any = []
          let values: any = []
          keys.push(SUBJECTARR[item.subject_id])
          values.push((item.rate * 100).toFixed(0))
          laborAmountReachStandBySubjectOption.value.yAxis.data.push(...keys)
          laborAmountReachStandBySubjectData.value.push(...values)
        })
      } else {
        laborAmountReachStandBySubjectOption.value.yAxis.data = ['物理', '化学', '生物', '小学科学']
        laborAmountReachStandBySubjectData.value = [0, 0, 0, 0]
      }
      console.log('1wwwqeq', laborAmountReachStandBySubjectData.value)
      laborAmountReachStandBySubjectOption.value.series[0].data = laborAmountReachStandBySubjectData.value
      // console.log(1212121, laborAmountReachStandBySubjectOption.value)
    }
    laborAmountReachStandBySubjectLoading.value = false
  } catch (error) {
    laborAmountReachStandBySubjectLoading.value = false
    console.log(error)
  }
}

watch([() => props.city, () => props.area, () => props.school, () => props.standardLevel], (newValue, oldValue) => {
  getLaborData()
  getLaborUseData()
  getUseFrequency()
  getLaborTypeRate()
  getUseList()
  getLaborAmountReachStandBySubject()
})
watch(
  () => props.standardLevel,
  (newValue, oldValue) => {
    getLaborAmountReachStandBySubject()
  }
)
onMounted(() => {
  getLaborData()
  getLaborUseData()
  getUseFrequency()
  getLaborTypeRate()
  getUseList()
  getLaborAmountReachStandBySubject()
})
</script>

<style lang="scss" scoped>
// @mixin insetShadow {
//   font-size: 16px;
//   font-weight: bold;
//   font-style: italic;
//   text-align: center;
//   box-shadow: inset 0 0 20px #12cbf1;
//   // border-radius: 10px;
//   padding: 20px;
//   box-sizing: border-box;
// }
// @mixin borderLinearGradient {
//   border-style: solid;
//   border-width: 2px;
//   border-image: linear-gradient(to bottom, #008aff, #09daff) 1;
// }
::v-deep .el-select {
  position: absolute;
  right: 10px;
  top: 25px;
  font-style: normal;
  font-weight: normal;
  width: 120px;
  z-index: 1000;
  margin-right: 10px;
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
.title {
  position: absolute;
  left: 0;
  top: 10px;
  width: 100%;
  // font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-style: italic;
  img {
    margin-right: 10px;
  }
}
.open-course-list {
  height: 95%;
  text-align: left;
  // border: 1px solid #6e6e6e;
  border-radius: 16px;
  margin: 20px 0;
  overflow: auto;

  li {
    font-size: 14px;
    font-style: normal;
    line-height: 35px;
    color: #fff;
    border-bottom: 1px solid #317cab;
    padding: 0 5px;
    box-sizing: border-box;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}
.fun-room-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px 0;
  box-sizing: border-box;
  .row {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 50%;
    margin-bottom: 20px;
    .col {
      position: relative;
      width: 32%;
      text-align: center;
    }
  }
}
.course-border {
  background: url('../../../../assets/images/bigData/com-border.png') no-repeat;
  background-size: 100% 100%;
  padding: 10px;
  box-sizing: border-box;
}
</style>
