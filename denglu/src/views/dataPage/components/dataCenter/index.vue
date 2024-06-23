<template>
  <div class="data-center-container">
    <div class="col">
      <div class="header">功能室统计</div>
      <div class="chart-container">
        <div
          class="chart-box"
          v-loading="laboratoryCountLoading"
          element-loading-text="加载中..."
          element-loading-background="#010527"
        >
          <div class="title">
            <img src="../../../../assets/images/bigData/icon1.png" alt="" />
            功能室数量
            <el-tooltip effect="light" content="计算说明" placement="top">
              <img src="../../../../assets/images/bigData/more.png" alt="" @click="jumpComputeIntro" />
            </el-tooltip>
          </div>
          <bar-chart v-if="laboratoryCountData.length !== 0" :customOption="laboratoryCountOption" />
        </div>
        <div
          class="chart-box"
          v-loading="laboratoryUseRateLoading"
          element-loading-text="加载中..."
          element-loading-background="#010527"
        >
          <div class="title">
            <img src="../../../../assets/images/bigData/icon1.png" alt="" />
            功能室利用率
            <el-select class="titleImg" v-model="comSchoolyear" @change="handleFunctionUseChange">
              <el-option
                v-for="(item, index) in comSchoolyearList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-tooltip effect="light" content="计算说明" placement="top">
              <img src="../../../../assets/images/bigData/more.png" alt="" @click="jumpComputeIntro" />
            </el-tooltip>
          </div>
          <pie-chart class="chart-position" v-if="laboratoryUseRateDataFlag" :customOption="laboratoryUseRateOption" />
        </div>
        <div
          class="chart-box"
          v-loading="laborComplianceRateLoading"
          element-loading-text="加载中..."
          element-loading-background="#010527"
        >
          <div class="title">
            <img src="../../../../assets/images/bigData/icon1.png" alt="" />
            功能室总量达标统计
            <el-tooltip effect="light" content="计算说明" placement="top">
              <img src="../../../../assets/images/bigData/more.png" alt="" @click="jumpComputeIntro" />
            </el-tooltip>
          </div>
          <pie-chart
            v-if="laborComplianceRateData.length !== 0"
            class="chart-position"
            :customOption="laborComplianceRateOption"
          />
        </div>
      </div>
    </div>
    <div class="col-center">
      <div class="first" v-loading="mapLoading" element-loading-text="加载中..." element-loading-background="#010527">
        <div class="left-count">
          <div class="count-item">
            <div class="total">装备应配总量</div>
            <div class="count">
              <div>{{ allNeedTotal }}</div>
              <span>个</span>
            </div>
          </div>
          <div class="count-item">
            <div class="total">装备实配总量</div>
            <div class="count">
              <div>{{ allRealTotal }}</div>
              <span>个</span>
            </div>
          </div>
          <div class="count-item">
            <div class="total">装备缺配总量</div>
            <div class="count">
              <div>{{ allShortTotal }}</div>
              <span>个</span>
            </div>
          </div>
        </div>
        <div class="right-map">
          <map-chart v-if="mapFlag" :customOption="mapOption" :mapFindAreaData="mapFindAreaData" v-bind="$attrs" />
          <el-select class="mapSelect" v-model="mapValue">
            <el-option
              v-for="(item, index) in mapOptionData"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="second" v-loading="mapLoading" element-loading-text="加载中..." element-loading-background="#010527">
        <div class="compliance-rate">
          <div class="compliance-rate-header">装备金额达标率</div>
          <div class="compliance-1" v-if="moneyRate === '/'">/</div>
          <div class="compliance" v-else>
            <pie-chart class="compliance-rate-chart" v-if="moneyRate" :customOption="moneyRateOption" />
            <span class="number">{{ (moneyRate * 100).toFixed(0) + '%' }}</span>
          </div>
        </div>
        <div class="compliance-rate">
          <div class="compliance-rate-header">装备种类达标率</div>
          <div class="compliance-1" v-if="moneyRate === '/'">/</div>
          <div class="compliance" v-else>
            <pie-chart class="compliance-rate-chart" v-if="typeRate" :customOption="typeRateOption" />
            <span class="number">{{ (typeRate * 100).toFixed(0) + '%' }}</span>
          </div>
        </div>
        <div class="compliance-rate">
          <div class="compliance-rate-header">装备总量达标率</div>
          <div class="compliance-1" v-if="moneyRate === '/'">/</div>
          <div class="compliance" v-else>
            <pie-chart class="compliance-rate-chart" v-if="totalRate" :customOption="totalRateOption" />
            <span class="number">{{ (totalRate * 100).toFixed(0) + '%' }}</span>
          </div>
        </div>
      </div>
      <div
        class="third"
        v-loading="instrumentFlowLoading"
        element-loading-text="加载中..."
        element-loading-background="#010527"
      >
        <div class="chart1-box">
          <div class="title1">
            <div>
              <img src="../../../../assets/images/bigData/icon1.png" alt="" />
              装备增长趋势
            </div>
            <el-tooltip effect="light" content="计算说明" placement="top">
              <img src="../../../../assets/images/bigData/more.png" alt="" @click="jumpComputeIntro" />
            </el-tooltip>
            <div class="lineImg">
              <div class="lineImg1"></div>
              <div class="lineImg2"></div>
              <div class="lineImg3"></div>
            </div>
            <!-- <img class="lineImg" src="../../../../assets/images/bigData/line.png" alt="" /> -->
          </div>
          <line-chart
            class="third-chart"
            v-if="instrumentFlowData.length !== 0 || equipmentFlowData.length !== 0"
            :customOption="instrumentFlowDataOption"
          />
          <div class="third-select">
            <el-select v-model="functionUse">
              <el-option
                v-for="(item, index) in functionUseList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div
        class="fourth"
        v-loading="instrumentFlowLoading"
        element-loading-text="加载中..."
        element-loading-background="#010527"
      >
        <div class="fourth-item" v-for="(item, index) in fourthItems" :key="index">
          <span class="item-label">{{ item.label }}</span>
          <span class="item-value">{{ item.value }}</span>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="header">
        <span>实验开课</span>
        <el-select class="experimentCourse" v-model="experimentCourse" @change="handleExperimentCourse">
          <el-option
            v-for="(item, index) in comSchoolyearList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="chart-container">
        <div class="chart-box1">
          <div
            class="chart-box1-first"
            v-loading="expBookNumLoading"
            element-loading-text="加载中..."
            element-loading-background="#010527"
          >
            <div class="chart-box1-header">实验开课数</div>
            <div class="chart-box1-count">{{ expBookNumData }}</div>
          </div>
          <div
            class="chart-box1-first"
            v-loading="courseRateLoading"
            element-loading-text="加载中..."
            element-loading-background="#010527"
          >
            <div class="chart-box1-header">实验开课率</div>
            <div class="chart-box1-count">
              <pie-chart v-if="courseRateData.length !== 0" :customOption="courseRateOption" />
            </div>
          </div>
        </div>
        <div
          class="chart-box"
          v-loading="expBookRateBySubjectLoading"
          element-loading-text="加载中..."
          element-loading-background="#010527"
        >
          <div class="title">
            <img src="../../../../assets/images/bigData/icon1.png" alt="" />
            实验学科开课率
            <el-tooltip effect="light" content="计算说明" placement="top">
              <img src="../../../../assets/images/bigData/more.png" alt="" @click="jumpComputeIntro" />
            </el-tooltip>
          </div>
          <bar-chart v-if="expBookRateBySubjectData.length !== 0" :customOption="expBookRateBySubjectOption" />
        </div>
        <div
          class="chart-box"
          v-loading="laboratoryUseFrequencyLoading"
          element-loading-text="加载中..."
          element-loading-background="#010527"
        >
          <div class="title">
            <img src="../../../../assets/images/bigData/icon1.png" alt="" />
            实验频次
            <el-tooltip effect="light" content="计算说明" placement="top">
              <img src="../../../../assets/images/bigData/more.png" alt="" @click="jumpComputeIntro" />
            </el-tooltip>
          </div>
          <line-chart v-if="laboratoryUseFrequencyData.length !== 0" :customOption="laboratoryUseFrequencyOption" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  instrumentFlow,
  laborComplianceRate,
  laborUseData,
  laborData,
  expBookNum,
  labExpBookRate,
  useFrequency,
  expBookRateBySubject,
  InstrumentMap,
  findAreaOption
} from '@/service/dataPage/index'
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

import {
  laboratoryCountBar,
  laboratoryUseRate,
  laboratoryComplianceRate,
  instrumentFlowAdd,
  courseRate,
  laboratoryUseFrequency,
  expBookRateBySubjectChart,
  map,
  rateOption
} from '../chart-options/index'
//路由
const router = useRouter()
const props = defineProps(['city', 'area', 'school', 'standardLevel', 'schoolyearList'])
let comSchoolyear = ref(
  new Date().getMonth() + 1 <= 8 && new Date().getMonth() + 1 > 2
    ? new Date().getFullYear() - 1 + ',' + 2
    : new Date().getFullYear() + ',' + 1
)
let school_year = ref<string | number>('')
let semester = ref<string | number>('')
let comSchoolyearList = ref(props.schoolyearList)
const handleFunctionUseChange = (val: string) => {
  school_year.value = Number(val.split(',')[0])
  semester.value = Number(val.split(',')[1])
  console.log(val)
}
//功能室数量图表配置
let laboratoryCountOption: any = ref({})
let laboratoryCountData = ref<any>([])
let laboratoryCountLoading = ref(false)
const SUBJECTARR = ['', '物理', '化学', '生物', '小学科学']
const getLaborData = async () => {
  laboratoryCountLoading.value = true
  laboratoryCountData.value = []
  laboratoryCountOption.value = JSON.parse(JSON.stringify(laboratoryCountBar))
  try {
    const params = {
      city: props.city,
      area: props.area,
      school_id: props.school
      // standard_level: props.standardLevel
    }
    const { data, code } = await laborData(params)
    if (code === 10) {
      if (data && Array.isArray(data) && data.length > 0) {
        data.forEach((item: any) => {
          let keys: any = []
          let values: any = []
          keys.push(SUBJECTARR[item.subject_id])
          values.push(item.value)
          laboratoryCountData.value.push([...keys, ...values])
        })
      } else {
        laboratoryCountData.value = [
          ['物理', 0],
          ['化学', 0],
          ['生物', 0],
          ['小学科学', 0]
        ]
      }
      laboratoryCountOption.value.series[0].data = laboratoryCountData.value
    }
    laboratoryCountLoading.value = false
  } catch (error) {
    laboratoryCountLoading.value = false
    console.log(error)
  }
}
//功能室利用率图表配置
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
      laboratoryUseRateOption.value.title.text = (laboratoryUseRateData.value * 100).toFixed(2) + '%'
      laboratoryUseRateOption.value.tooltip.formatter =
        '利用率  ' + (laboratoryUseRateData.value * 100).toFixed(2) + '%'
      laboratoryUseRateOption.value.series[0].data = [(laboratoryUseRateData.value * 100).toFixed(2)]
    }
    laboratoryUseRateDataFlag.value = true
    laboratoryUseRateLoading.value = false
  } catch (error) {
    laboratoryUseRateDataFlag.value = false
    laboratoryUseRateLoading.value = false
    console.log('getLaborUseData', error)
  }
}
//功能室总量达标统计图表配置
let laborComplianceRateOption = ref<any>({})
let laborComplianceRateData = ref<any>([])
let laborComplianceRateLoading = ref(false)
const getLaborComplianceRateData = async () => {
  laborComplianceRateLoading.value = true
  laborComplianceRateOption.value = JSON.parse(JSON.stringify(laboratoryComplianceRate))
  laborComplianceRateData.value = []
  try {
    const params = {
      city: props.city,
      area: props.area,
      school_id: props.school,
      standard_level: props.standardLevel
    }
    const { data, code } = await laborComplianceRate(params)
    if (code === 10) {
      laborComplianceRateData.value = [
        {
          value: data.compliance_rate,
          name: '达标率',
          itemStyle: {
            color: '#0195ff'
          }
        },
        {
          value: data.un_compliance_rate,
          name: '不达标率',
          itemStyle: {
            color: '#ea8200'
          }
        }
      ]
      laborComplianceRateOption.value.series[0].data = laborComplianceRateData.value
    }
    laborComplianceRateLoading.value = false
  } catch (error) {
    laborComplianceRateLoading.value = false
    console.log('getLaborComplianceRateData', error)
  }
}

//装备总量增长趋势图表配置
let fourthItems = ref([
  {
    label: '报废总量',
    value: 0
  },
  {
    label: '维修总量',
    value: 0
  },
  {
    label: '损坏总量',
    value: 0
  },
  {
    label: '报废价值',
    value: 0
  },
  {
    label: '维修总价值',
    value: 0
  },
  {
    label: '损坏总价值',
    value: 0
  }
])
const currentYear = new Date().getFullYear()
let functionUse = ref<string | number>(currentYear)
// console.log('currentYear', currentYear)
const functionUseList = [
  {
    label: currentYear + '',
    value: currentYear
  },
  {
    label: currentYear - 1 + '',
    value: currentYear - 1
  },
  {
    label: currentYear - 2 + '',
    value: currentYear - 2
  }
]
let instrumentFlowData = ref<any>([])
let equipmentFlowData = ref<any>([])
let instrumentFlowLoading = ref(false)
let instrumentFlowDataOption: any = ref({})
const getInstrumentFlowData = async () => {
  instrumentFlowLoading.value = true
  instrumentFlowData.value = []
  equipmentFlowData.value = []
  instrumentFlowDataOption.value = JSON.parse(JSON.stringify(instrumentFlowAdd))
  try {
    const params = {
      city: props.city,
      area: props.area,
      school_id: props.school,
      year: functionUse.value
    }
    const { data, code } = await instrumentFlow(params)
    if (code === 10) {
      if (data.month_list && Array.isArray(data.month_list)) {
        let monthArr = data.month_list.map((item: any) => {
          return Number(item.slice(-2)) + '月'
        })
        instrumentFlowDataOption.value.xAxis.data = monthArr
      }
      if (data.instrument_month_list && Array.isArray(data.instrument_month_list)) {
        instrumentFlowData.value = data.instrument_month_list
      } else {
        instrumentFlowData.value = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }
      if (data.equipment_month_list && Array.isArray(data.equipment_month_list)) {
        equipmentFlowData.value = data.equipment_month_list
      } else {
        equipmentFlowData.value = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }
      fourthItems.value[0].value = data.scrap_summary.total_amount
      fourthItems.value[1].value = data.maintain_summary.total_amount
      fourthItems.value[2].value = data.damage_summary.total_amount
      fourthItems.value[3].value = data.scrap_summary.total_money
      fourthItems.value[4].value = data.maintain_summary.total_money
      fourthItems.value[5].value = data.damage_summary.total_money
      instrumentFlowDataOption.value.series[0].data = instrumentFlowData.value
      instrumentFlowDataOption.value.series[1].data = equipmentFlowData.value
    }
    instrumentFlowLoading.value = false
  } catch (error) {
    instrumentFlowLoading.value = false
    console.log(error)
  }
}
//实验开课
let experimentCourse = ref(
  new Date().getMonth() + 1 <= 8 && new Date().getMonth() + 1 > 2
    ? new Date().getFullYear() - 1 + ',' + 2
    : new Date().getFullYear() + ',' + 1
)
let school_year1 = ref<string | number>(Number(experimentCourse.value.split(',')[0]))
let semester1 = ref<string | number>(Number(experimentCourse.value.split(',')[1]))
let expBookNumData = ref(0)
let expBookNumLoading = ref(false)
const getExpBookNum = async () => {
  expBookNumLoading.value = true
  try {
    const params = {
      city: props.city,
      area: props.area,
      school_id: props.school,
      school_year: school_year1.value,
      semester: semester1.value
      // standard_level: props.standardLevel
    }
    const { data, code } = await expBookNum(params)
    if (code === 10) {
      expBookNumData.value = data.count
    }
    expBookNumLoading.value = false
  } catch (error) {
    expBookNumLoading.value = false
    console.log('getLaborComplianceRateData', error)
  }
}
//实验开课率
const handleExperimentCourse = (val: string) => {
  school_year1.value = Number(val.split(',')[0])
  semester1.value = Number(val.split(',')[1])
  getExpBookNum()
  getLabExpBookRateData()
  getUseFrequency()
  getExpBookRateBySubjectData()
  console.log(val)
}
let courseRateOption: any = ref({})
let courseRateData: any = ref([])
let courseRateLoading = ref(false)
const getLabExpBookRateData = async () => {
  courseRateLoading.value = true
  courseRateOption.value = JSON.parse(JSON.stringify(courseRate))
  courseRateData.value = []
  try {
    const params = {
      city: props.city,
      area: props.area,
      school_id: props.school,
      school_year: school_year1.value,
      semester: semester1.value
    }
    const { data, code } = await labExpBookRate(params)
    if (code === 10) {
      courseRateData.value = [data.rate]
      courseRateOption.value.series[0].data = courseRateData.value
    }
    courseRateLoading.value = false
  } catch (error) {
    courseRateLoading.value = false
    console.log('getLaborComplianceRateData', error)
  }
}
//查询各学科实验开课率
let expBookRateBySubjectOption: any = ref({})
let expBookRateBySubjectData: any = ref([])
let expBookRateBySubjectLoading = ref(false)
const getExpBookRateBySubjectData = async () => {
  expBookRateBySubjectLoading.value = true
  expBookRateBySubjectOption.value = JSON.parse(JSON.stringify(expBookRateBySubjectChart))
  expBookRateBySubjectData.value = []
  try {
    const params = {
      city: props.city,
      area: props.area,
      school_id: props.school,
      school_year: school_year1.value,
      semester: semester1.value
    }
    const { data, code } = await expBookRateBySubject(params)
    if (code === 10) {
      if (data && Array.isArray(data)) {
        data.forEach((item: any) => {
          expBookRateBySubjectOption.value.yAxis.data.push(item.name)
          expBookRateBySubjectData.value.push((item.rate * 100).toFixed(0))
        })
      } else {
        expBookRateBySubjectOption.value.yAxis.data = ['物理', '化学', '生物', '小学科学']
        expBookRateBySubjectData.value = [0, 0, 0, 0]
      }
      expBookRateBySubjectOption.value.series[0].data = expBookRateBySubjectData.value
    }
    expBookRateBySubjectLoading.value = false
  } catch (error) {
    expBookRateBySubjectLoading.value = false
    console.log('getLaborComplianceRateData', error)
  }
}

//实验室使用频次统计
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
      if (data && Array.isArray(data)) {
        data.forEach((item: any) => {
          let keys: any = []
          let values: any = []
          keys.push(item.name)
          values.push(item.num)
          laboratoryUseFrequencyData.value.push([...keys, ...values])
        })
      } else {
        laboratoryUseFrequencyData.value = [
          ['一月', 0],
          ['二月', 0],
          ['三月', 0],
          ['四月', 0],
          ['五月', 0],
          ['六月', 0]
        ]
      }
      laboratoryUseFrequencyOption.value.series[0].data = laboratoryUseFrequencyData.value
    }
    laboratoryUseFrequencyLoading.value = false
  } catch (error) {
    laboratoryUseFrequencyLoading.value = false
    console.log(error)
  }
}
//地图
let mapValue = ref(1)
const mapOptionData = ref([
  {
    label: '按照金额展示',
    value: 1
  },
  {
    label: '按照种类展示',
    value: 2
  },
  {
    label: '按照总量展示',
    value: 3
  }
])

let mapData = ref<any>([])
let mapOption: any = ref({})
let moneyRateOption: any = ref({})
let moneyRate = ref<any>(0)
let totalRateOption: any = ref({})
let totalRate = ref<any>(0)
let typeRateOption: any = ref({})
let typeRate = ref<any>(0)
let allNeedTotal = ref(0)
let allRealTotal = ref(0)
let allShortTotal = ref(0)
let mapLoading = ref(false)
const getMapData = async () => {
  mapLoading.value = true
  mapOption.value = JSON.parse(JSON.stringify(map))
  mapData.value = []
  moneyRateOption.value = JSON.parse(JSON.stringify(rateOption))
  totalRateOption.value = JSON.parse(JSON.stringify(rateOption))
  typeRateOption.value = JSON.parse(JSON.stringify(rateOption))
  moneyRate.value = 0
  totalRate.value = 0
  typeRate.value = 0
  allNeedTotal.value = 0
  allRealTotal.value = 0
  allShortTotal.value = 0
  try {
    const params = {
      city: props.city,
      area: props.area,
      school_id: props.school,
      standard_level: props.standardLevel
    }
    const { data, code } = await InstrumentMap(params)
    if (code === 10) {
      mapData.value = data
      moneyRate.value = data.money_rate
      totalRate.value = data.total_rate
      typeRate.value = data.type_rate
      allNeedTotal.value = data.all_need_total
      allRealTotal.value = data.all_real_total
      allShortTotal.value = data.all_short_total
      formatRateOption(moneyRateOption.value, moneyRate.value)
      formatRateOption(totalRateOption.value, totalRate.value)
      formatRateOption(typeRateOption.value, typeRate.value)
      formatMapData(mapData.value.list, 1)
    }
    mapLoading.value = false
  } catch (error) {
    mapLoading.value = false
    console.log(error)
  }
}
let mapFlag = ref(false)

const formatRateOption = (data: any, rateValue: number) => {
  data.series[0].data = [
    {
      value: rateValue,
      name: '达标率',
      itemStyle: {
        color: '#4bdbc6'
      }
    },
    {
      value: 1 - rateValue,
      name: '不达标率',
      itemStyle: {
        color: '#1862a0'
      }
    }
  ]
}
//格式化地图数据
const formatMapData = (data: any, i: number) => {
  mapFlag.value = false
  mapOption.value.series[0].data = []
  data.forEach((item: any) => {
    switch (i) {
      case 1:
        mapOption.value.series[0].data.push({ name: item.area_name, value: item.real_money_total })
        break
      case 2:
        mapOption.value.series[0].data.push({ name: item.area_name, value: item.real_type_total })
        break
      case 3:
        mapOption.value.series[0].data.push({ name: item.area_name, value: item.real_total })
        break
    }
  })
  setTimeout(() => {
    mapFlag.value = true
  }, 100)
}
let mapFindAreaData = ref<any>({})
const getFindAreaOption = async () => {
  try {
    const params = {
      code: props.city
    }
    const { data, code } = await findAreaOption(params)
    if (code === 10) {
      mapFindAreaData.value = JSON.parse(data.option.option)
      // console.log('map', JSON.parse(data.option.option))
    }
  } catch (error) {
    console.log(error)
  }
}

//去计算说明
const jumpComputeIntro = () => {
  console.log('123')
  router.push('/computeIntro')
}
watch([() => props.city, () => props.area, () => props.school], (newValue, oldValue) => {
  mapFlag.value = false
  getLaborData()
  getLaborUseData()
  getLaborComplianceRateData()
  getInstrumentFlowData()
  getExpBookNum()
  getLabExpBookRateData()
  getUseFrequency()
  getExpBookRateBySubjectData()
  getFindAreaOption()
  getMapData()
})
watch(
  () => props.standardLevel,
  (newValue, oldValue) => {
    getMapData()
    getLaborComplianceRateData()
  }
)
watch(
  () => comSchoolyear.value,
  (newValue, oldValue) => {
    getLaborUseData()
  }
)
watch(
  () => functionUse.value,
  (newValue, oldValue) => {
    getInstrumentFlowData()
  }
)
watch(
  () => mapValue.value,
  (newValue, oldValue) => {
    mapFlag.value = false
    formatMapData(mapData.value.list, newValue)
  }
)
onMounted(() => {
  getLaborData()
  getLaborUseData()
  getLaborComplianceRateData()
  getInstrumentFlowData()
  getExpBookNum()
  getLabExpBookRateData()
  getUseFrequency()
  getExpBookRateBySubjectData()
  getFindAreaOption()
  getMapData()
})
</script>

<style lang="scss" scoped>
@mixin insetShadow {
  font-size: 16px;
  text-align: center;
  box-shadow: inset 0 0 20px #12cbf1;
  // border-radius: 10px;
  padding: 20px;
  box-sizing: border-box;
}
@mixin borderBottomRightRadius {
  border: 1px solid #0e3153;
  border-bottom-right-radius: 10px;
}
@mixin borderRadius {
  border: 1px solid #0695be;
  border-radius: 10px;
}
.chart-position {
  position: relative;
  top: 30px;
}
.title {
  width: 100%;
  height: 25px;
  position: absolute;
  top: 5px;
  left: 0;
  display: flex;
  align-items: center;
  background-image: url('../../../../assets/images/bigData/line.png');
  background-repeat: no-repeat;
  background-size: 96%;
  background-position: center bottom;
  padding: 0 5px 5px;
  box-sizing: border-box;
  img {
    margin-right: 10px;
  }
  .el-tooltip__trigger {
    width: 20px;
    height: 20px;
    position: absolute;
    right: 0;
    cursor: pointer;
    z-index: 1;
  }
}
.titleImg {
  position: absolute;
  right: 30px;
}
.data-center-container {
  display: flex;
  justify-content: space-between;
  height: 100%;
  // padding: 20px 0;
  // box-sizing: border-box;
  .col {
    width: 25%;
    overflow: hidden;
    background: url('../../../../assets/images/bigData/home-border.png') no-repeat;
    background-size: 100% 100%;
    // border-style: solid;
    // border-width: 2px;
    // border-image: linear-gradient(to bottom, #008aff, transparent) 1;
    .header {
      height: 6%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      position: relative;
      > span {
        font-weight: bold;
        font-style: italic;
      }
      .experimentCourse {
        position: absolute;
        right: 10px;
        top: 10px;
        left: unset;
      }
    }
    .chart-container {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 94%;
      padding: 10px 20px;
      box-sizing: border-box;
    }
  }
  .col-center {
    width: 48%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 10px 0;
    box-sizing: border-box;
    .first {
      flex: 1;
      display: flex;
      padding: 10px;
      box-sizing: border-box;
      .left-count {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        max-width: 35%;
        margin-right: 10px;
        padding: 10px;
        box-sizing: border-box;
        .count {
          display: flex;
          align-items: center;
          > div {
            font-size: 24px;
            color: white;
            background-color: #013a66;
            padding: 5px 10px;
            box-sizing: border-box;
            margin-top: 10px;
          }
          > span {
            margin-left: 5px;
            position: relative;
            top: 15px;
          }
        }
      }
      .right-map {
        flex: 1;
        position: relative;
        .mapSelect {
          position: absolute;
          right: 10px;
          top: 10px;
        }
        // background-color: blue;
      }
    }
    .second {
      display: flex;
      justify-content: space-between;
      height: 18%;
      // background-color: purple;
      padding: 10px;
      box-sizing: border-box;
      .compliance-rate {
        position: relative;
        width: 30%;
        height: 100%;
        @include borderRadius();
        background-color: rgba(0, 48, 121, 0.5);
        .compliance-rate-header {
          width: 100%;
          position: absolute;
          top: 5px;
          left: 0;
          text-align: center;
        }
        .compliance {
          width: 100%;
          height: 100%;
        }
        .compliance-1 {
          width: 100%;
          height: 100%;
          font-size: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .compliance-rate-chart {
          position: relative;
          top: 10px;
          right: 40px;
        }
        .number {
          font-size: 20px;
          position: absolute;
          bottom: 35%;
          right: 40px;
        }
      }
    }
    .third {
      display: flex;
      height: 28%;
      // background-color: yellow;
      margin: 0 0 10px;
      .chart1-box {
        display: flex;
        width: 100%;
        height: 100%;
        @include borderBottomRightRadius();
        padding: 10px;
        box-sizing: border-box;
        position: relative;
        .title1 {
          display: flex;
          width: 20px;
          text-align: center;
          margin-right: 20px;
          position: relative;
          .lineImg {
            position: absolute;
            right: -10px;
            top: 0;
            width: 1px;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .lineImg1,
            .lineImg3 {
              width: 1px;
              height: 4%;
              background-color: #16aee0;
            }
            .lineImg2 {
              width: 1px;
              height: 90%;
              background-color: #093f6a;
            }
          }
          .el-tooltip__trigger {
            width: 20px;
            height: 20px;
            position: absolute;
            bottom: 10px;
            cursor: pointer;
            z-index: 1;
          }
        }
        .third-chart {
          flex: 1;
        }
        .third-select {
          position: absolute;
          right: 10px;
          top: 10px;
        }
      }
    }
    .fourth {
      height: 10%;
      // background-color: pink;
      @include borderRadius();
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      background-color: rgba(0, 48, 121, 0.5);
      .fourth-item {
        width: 30%;
        padding: 0 10px;
        .item-value {
          font-size: 20px;
          margin-left: 20px;
          color: #f9383a;
        }
      }
    }
  }
}
.chart-box {
  height: 32%;
  // width: 100%;
  position: relative;
  // @include insetShadow();
  @include borderBottomRightRadius();
  padding: 0 10px;
}
.chart-box1 {
  height: 24%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  .chart-box1-first {
    width: 48%;
    @include borderRadius();
    text-align: center;
    position: relative;
    .chart-box1-header {
      width: 100%;
      position: absolute;
      top: 20px;
      text-align: center;
    }
    .chart-box1-count {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      font-size: 40px;
      font-style: italic;
      color: #2579c6;
    }
  }
}
::v-deep .el-select {
  width: 120px;
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
</style>
