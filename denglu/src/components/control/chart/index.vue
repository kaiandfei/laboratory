<template>
  <div class="chart-container">
    <div class="chart-title">{{ item.title }}</div>
    <component
      v-if="chartData.length !== 0"
      :is="item.type"
      :customOption="chartOption"
      :mapFindAreaData="mapFindAreaData"
    ></component>
    <div v-else class="empty">No Data</div>
    <el-select class="mapSelect" v-model="mapValue" v-if="item.type === 'map-chart'">
      <el-option
        v-for="(item, index) in mapOptionData"
        :key="index"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { testRequest } from '@/service/token/index'
import { IServerDataType } from '@/service/token/types'
import {
  laborData,
  laborUseData,
  laborComplianceRate,
  instrumentFlow,
  expBookRateBySubject,
  useFrequency,
  expBookNumByGrade,
  expBookRate,
  instrumentAmountSummary,
  StudentAvgSummary,
  InstrumentUseRate,
  InstrumentStatusSummary,
  InstrumentTypeAmountSummary,
  laborTypeRate,
  labExpBookRate,
  expBookNumBySubject,
  expFrequency,
  InstrumentMap,
  findAreaOption
} from '@/service/dataPage/index'
const props = defineProps({
  item: {
    type: Object,
    default: () => ({})
  },
  isDefaultValue: {
    type: Boolean,
    default: true
  },
  city: {
    type: [String, Number],
    default: ''
  },
  area: {
    type: [String, Number],
    default: ''
  },
  school: {
    type: String,
    default: ''
  },
  standardLevel: {
    type: [String, Number],
    default: ''
  },
  schoolyear: {
    type: [String, Number],
    default: ''
  }
})
const SUBJECTARR = ['', '物理', '化学', '生物', '小学科学']
const EXPBOOKRATETYPE = ['总开课', '分组实验', '演示实验']
let chartData = ref<any>([])
let chartOption = ref<any>({})
let params: any = {
  city: props.city,
  area: props.area,
  school_id: props.school
}
let school_year = ref<number | string>(Number(props.schoolyear.split(',')[0] || ''))
let semester = ref<number | string>(Number(props.schoolyear.split(',')[1] || ''))
const currentYear = new Date().getFullYear()
watch(
  () => props.schoolyear,
  (newValue, oldValue) => {
    school_year.value = Number(newValue.split(',')[0])
    semester.value = Number(newValue.split(',')[1])
    loop()
  }
)
const customFnc = async () => {
  chartOption.value = JSON.parse(JSON.stringify(props.item.customOption))
  try {
    const { data, code } = await testRequest.post<IServerDataType>({
      url: props.item.api_url,
      data: props.item.params
    })
    if (code === 10) {
      let objKeys: any = []
      let keys: any = []
      let values: any = []
      let obj: any = {}
      let flag = false
      if (props.item.params.menuIndex !== '1') {
        switch (props.item.flagNum) {
          case 20:
          case 50:
            if (props.item.params.need100Flag === '1') {
              chartData.value = data.value || ['defalult']
              values = data.value
              values = values.map((ele: any) => {
                return (ele * 100).toFixed(0)
              })
              chartOption.value.tooltip.formatter = '{b} {c} %'
              chartOption.value.xAxis.data = data.name
              chartOption.value.series[0].data = values
            } else {
              chartData.value = data.value || ['defalult']
              chartOption.value.xAxis.data = data.name
              chartOption.value.series[0].data = chartData.value
            }
            break
          case 30:
            if (props.item.params.need100Flag === '1') {
              chartData.value = data.value || ['defalult']
              values = data.value
              values = values.map((ele: any) => {
                return (ele * 100).toFixed(0)
              })
              chartOption.value.tooltip.formatter = '{b} {c} %'
              chartOption.value.yAxis.data = data.name
              chartOption.value.series[0].data = values
            } else {
              chartData.value = data.value || ['defalult']
              chartOption.value.yAxis.data = data.name
              chartOption.value.series[0].data = chartData.value
            }
            break
          case 40:
            if (props.item.params.need100Flag === '1') {
              chartData.value = data.value || ['defalult']
              data.value.forEach((ele: any, i: number) => {
                obj = {
                  name: data.name[i],
                  value: (ele * 100).toFixed(0)
                }
                values.push(obj)
              })
              chartOption.value.tooltip.formatter = '{b} {d}%'
              chartOption.value.series[0].data = values
            } else {
              chartData.value = data.value || ['defalult']
              data.value.forEach((ele: any, i: number) => {
                obj = {
                  name: data.name[i],
                  value: ele
                }
                values.push(obj)
              })
              chartOption.value.tooltip.formatter = null
              chartOption.value.series[0].data = values
            }
            break
        }
      } else {
        switch (props.item.flagNum) {
          case 20:
          case 50:
            data?.forEach((ele: any) => {
              objKeys = Object.keys(ele)
              flag = objKeys.includes('rate')
              keys.push(ele.name)
              if (flag) {
                values.push((ele.rate * 100).toFixed(0))
              } else {
                values.push(ele.num)
              }
            })
            chartData.value = values
            chartOption.value.tooltip.formatter = flag ? '{b} {c} %' : null
            chartOption.value.xAxis.data = keys
            chartOption.value.series[0].data = chartData.value
            break
          case 30:
            data?.forEach((ele: any) => {
              objKeys = Object.keys(ele)
              flag = objKeys.includes('rate')
              keys.push(ele.name)
              if (flag) {
                values.push((ele.rate * 100).toFixed(0))
              } else {
                values.push(ele.num)
              }
            })
            chartData.value = values
            chartOption.value.tooltip.formatter = flag ? '{b} {c} %' : null
            chartOption.value.yAxis.data = keys
            chartOption.value.series[0].data = chartData.value
            break
          case 40:
            data?.forEach((ele: any) => {
              objKeys = Object.keys(ele)
              flag = objKeys.includes('rate')
              if (flag) {
                obj = {
                  name: ele.name,
                  value: (ele.rate * 100).toFixed(0)
                }
              } else {
                obj = {
                  name: ele.name,
                  value: ele.num
                }
              }
              chartData.value.push(obj)
            })
            chartOption.value.tooltip.formatter = flag ? '{b} {d}%' : null
            chartOption.value.series[0].data = chartData.value
            break
        }
      }
    }
  } catch (error) {
    console.log(error)
  }
}
// params['school_year'] = school_year.value
// params['semester'] = semester.value
const getLaborData = async () => {
  chartOption.value = JSON.parse(JSON.stringify(props.item.customOption))
  try {
    const { data, code } = await laborData(params)
    if (code === 10) {
      switch (props.item.title) {
        case '功能室数量统计':
          data?.forEach((ele: any) => {
            let keys: any = []
            let values: any = []
            keys.push(SUBJECTARR[ele.subject_id])
            values.push(ele.value)
            chartData.value.push([...keys, ...values])
          })
          chartOption.value.series[0].data = chartData.value
          break
        case '功能室数量':
          data?.forEach((item: any) => {
            let obj: any = {}
            obj.value = item.value
            obj.name = SUBJECTARR[item.subject_id]
            chartData.value.push(obj)
          })
          chartOption.value.series[0].data = [
            ...chartData.value,
            {
              value: 0,
              itemStyle: {
                color: 'none',
                decal: {
                  symbol: 'none'
                }
              },
              label: {
                show: false
              }
            },
            {
              value: 0,
              itemStyle: {
                color: 'none',
                decal: {
                  symbol: 'none'
                }
              },
              label: {
                show: false
              }
            },
            {
              value: 0,
              itemStyle: {
                color: 'none',
                decal: {
                  symbol: 'none'
                }
              },
              label: {
                show: false
              }
            },
            {
              value: 0,
              itemStyle: {
                color: 'none',
                decal: {
                  symbol: 'none'
                }
              },
              label: {
                show: false
              }
            }
          ]
          break
      }
    }
  } catch (error) {
    console.log(error)
  }
}
const getLaborUseData = async () => {
  chartOption.value = JSON.parse(JSON.stringify(props.item.customOption))
  try {
    params['school_year'] = school_year.value
    params['semester'] = semester.value
    const { data, code } = await laborUseData(params)
    if (code === 10) {
      chartData.value = data.lab_use_percentage || 0
      chartOption.value.title.text = (chartData.value * 100).toFixed(2) + '%'
      chartOption.value.tooltip.formatter = '利用率  ' + (chartData.value * 100).toFixed(2) + '%'
      chartOption.value.series[0].data = [chartData.value * 100]
    }
  } catch (error) {
    console.log('laborUseData', error)
  }
}
const getLaborComplianceRate = async () => {
  chartOption.value = JSON.parse(JSON.stringify(props.item.customOption))
  try {
    params['standard_level'] = props.standardLevel
    const { data, code } = await laborComplianceRate(params)
    if (code === 10) {
      chartData.value = [
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
      chartOption.value.series[0].data = chartData.value
    }
  } catch (error) {
    console.log('laborComplianceRate', error)
  }
}
const getInstrumentFlow = async () => {
  chartOption.value = JSON.parse(JSON.stringify(props.item.customOption))
  try {
    params['year'] = currentYear
    const { data, code } = await instrumentFlow(params)
    if (code === 10) {
      if (data.month_list && Array.isArray(data.month_list)) {
        let monthArr = data.month_list.map((item: any) => {
          return Number(item.slice(-2)) + '月'
        })
        chartOption.value.xAxis.data = monthArr
      }
      chartData.value[0] = data.instrument_month_list
      chartData.value[1] = data.equipment_month_list
      chartOption.value.series[0].data = chartData.value[0]
      chartOption.value.series[1].data = chartData.value[1]
    }
  } catch (error) {
    console.log(error)
  }
}
const getExpBookRateBySubject = async () => {
  chartOption.value = JSON.parse(JSON.stringify(props.item.customOption))
  try {
    params['school_year'] = school_year.value
    params['semester'] = semester.value
    const { data, code } = await expBookRateBySubject(params)
    if (code === 10) {
      data?.forEach((item: any) => {
        chartOption.value.yAxis.data.push(item.name)
        chartData.value.push(item.rate * 100)
      })
      chartOption.value.series[0].data = chartData.value
    }
  } catch (error) {
    console.log('expBookRateBySubject', error)
  }
}
const getUseFrequency = async () => {
  chartOption.value = JSON.parse(JSON.stringify(props.item.customOption))
  try {
    params['school_year'] = school_year.value
    params['semester'] = semester.value
    const { data, code } = await useFrequency(params)
    if (code === 10) {
      data?.forEach((item: any) => {
        let keys: any = []
        let values: any = []
        keys.push(item.name)
        values.push(item.num)
        chartData.value.push([...keys, ...values])
      })
      chartOption.value.series[0].data = chartData.value
    }
  } catch (error) {
    console.log(error)
  }
}
const getExpBookNumByGrade = async () => {
  chartOption.value = JSON.parse(JSON.stringify(props.item.customOption))
  try {
    params['school_year'] = school_year.value
    params['semester'] = semester.value
    const { data, code } = await expBookNumByGrade(params)
    if (code === 10) {
      chartData.value = data
      chartData.value?.forEach((item: any) => {
        chartOption.value.yAxis.data.push(item.grade_name)
        chartOption.value.series[0].data.push(item.num)
      })
    }
  } catch (error) {
    console.log(error)
  }
}
const getExpBookRate = async () => {
  chartOption.value = JSON.parse(JSON.stringify(props.item.customOption))
  try {
    params['school_year'] = school_year.value
    params['semester'] = semester.value
    const { data, code } = await expBookRate(params)
    if (code === 10) {
      chartData.value = data
      chartData.value?.forEach((item: any) => {
        chartOption.value.yAxis.data.unshift(EXPBOOKRATETYPE[item.type])
        chartOption.value.series[0].data.unshift(item.rate * 100)
      })
    }
  } catch (error) {
    console.log(error)
  }
}
const getInstrumentAmountSummary = async () => {
  chartOption.value = JSON.parse(JSON.stringify(props.item.customOption))
  try {
    params['stand_level'] = props.standardLevel
    params['year'] = currentYear
    const { data, code } = await instrumentAmountSummary(params)
    if (code === 10) {
      switch (props.item.title) {
        case '装备必配选配达标率':
          chartData.value = [
            (data.reach_stand_summary.must_reach_rate * 100).toFixed(0),
            (data.reach_stand_summary.no_must_reach_rate * 100).toFixed(0)
          ]
          break
        case '装备总量':
          chartData.value = [
            data.amount_summary.short_amount,
            data.amount_summary.real_amount,
            data.amount_summary.standard_amount
          ]
          break
        case '装备总量达标率':
          chartData.value = [data.reach_amount_summary.reach_amount_rate]
          break
        case '装备种类达标率':
          chartData.value = [data.reach_type_summary.reach_type_rate]
          break
      }
      chartOption.value.series[0].data = chartData.value
    }
  } catch (error) {
    console.log(error)
  }
}
const getStudentAvgSummary = async () => {
  chartOption.value = JSON.parse(JSON.stringify(props.item.customOption))
  try {
    params['stand_level'] = props.standardLevel
    params['year'] = currentYear
    const { data, code } = await StudentAvgSummary(params)
    if (code === 10) {
      chartData.value = [data.avg_rate]
      chartOption.value.series[0].data[0].value = chartData.value[0]
      chartOption.value.series[0].data[1].value = 1 - chartData.value[0]
    }
  } catch (error) {
    console.log(error)
  }
}
const getInstrumentUseRate = async () => {
  chartOption.value = JSON.parse(JSON.stringify(props.item.customOption))
  try {
    params['school_year'] = school_year.value
    params['semester'] = semester.value
    const { data, code } = await InstrumentUseRate(params)
    if (code === 10) {
      chartData.value = [data.use_rate]
      chartOption.value.title.text = (chartData.value[0] * 100).toFixed(2) + '%'
      chartOption.value.title.textStyle.fontSize = '14'
      chartOption.value.tooltip.formatter = '利用率  ' + (chartData.value[0] * 100).toFixed(2) + '%'
      chartOption.value.series[0].data = [chartData.value[0] * 100]
    }
  } catch (error) {
    console.log(error)
  }
}
const getInstrumentStatusSummary = async () => {
  chartOption.value = JSON.parse(JSON.stringify(props.item.customOption))
  try {
    params['stand_level'] = props.standardLevel
    params['year'] = currentYear
    const { data, code } = await InstrumentStatusSummary(params)
    if (code === 10) {
      chartData.value = data.avg_rate
      chartOption.value.series[0].data = chartData.value
    }
  } catch (error) {
    console.log(error)
  }
}
const getInstrumentTypeAmountSummary = async () => {
  chartOption.value = JSON.parse(JSON.stringify(props.item.customOption))
  try {
    params['stand_level'] = props.standardLevel
    const { data, code } = await InstrumentTypeAmountSummary(params)
    if (code === 10) {
      chartOption.value.xAxis.data = Object.keys(data)
      Object.values(data).forEach((item: any) => {
        chartData.value.push((item * 100).toFixed(2))
      })
      chartOption.value.xAxis.axisLabel.interval = 0
      chartOption.value.xAxis.axisLabel.rotate = 30
      chartOption.value.xAxis.axisLabel.formatter = (params: any) => {
        const index = 6 //字数为6个超出就显示成点
        let newstr = ''
        for (let i = 0; i < params.length; i += index) {
          const tmp = params.substring(i, i + index)
          newstr += tmp + ''
        }
        if (newstr.length > 6) return newstr.substring(0, 6) + '...'
        else return '\n' + newstr
      }
      chartOption.value.series[0].data = chartData.value
    }
  } catch (error) {
    console.log(error)
  }
}
const getLaborTypeRate = async () => {
  chartOption.value = JSON.parse(JSON.stringify(props.item.customOption))
  try {
    const { data, code } = await laborTypeRate(params)
    if (code === 10) {
      for (let i = 0; i < Object.keys(data)?.length; i++) {
        chartData.value.push({
          value: Number(Object.values(data)[i]) * 100,
          name: Object.keys(data)[i]
        })
      }
      chartOption.value.series[0].data = chartData.value
    }
  } catch (error) {
    console.log('laborTypeRate', error)
  }
}
const getLabExpBookRate = async () => {
  chartOption.value = JSON.parse(JSON.stringify(props.item.customOption))
  try {
    params['school_year'] = school_year.value
    params['semester'] = semester.value
    const { data, code } = await labExpBookRate(params)
    if (code === 10) {
      chartData.value = [data.rate]
      chartOption.value.series[0].data = chartData.value
    }
  } catch (error) {
    console.log('labExpBookRate', error)
  }
}
const getExpBookNumBySubject = async () => {
  chartOption.value = JSON.parse(JSON.stringify(props.item.customOption))
  try {
    params['school_year'] = school_year.value
    params['semester'] = semester.value
    const { data, code } = await expBookNumBySubject(params)
    if (code === 10) {
      data?.forEach((item: any) => {
        let keys: any = []
        let values: any = []
        keys.push(item.name)
        values.push(item.num)
        chartData.value.push([...keys, ...values])
      })
      chartOption.value.series[0].data = chartData.value
    }
  } catch (error) {
    console.log(error)
  }
}
const getExpFrequency = async () => {
  chartOption.value = JSON.parse(JSON.stringify(props.item.customOption))
  try {
    params['school_year'] = school_year.value
    params['semester'] = semester.value
    const { data, code } = await expFrequency(params)
    if (code === 10) {
      chartData.value[0] = data.group
      chartData.value[1] = data.demonstration
      chartData.value[0]?.forEach((item: any) => {
        chartOption.value.xAxis.data.push(item.name)
        chartOption.value.series[0].data.push(item.num)
      })
      chartData.value[1]?.forEach((item: any) => {
        chartOption.value.series[1].data.push(item.num)
      })
    }
  } catch (error) {
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
//格式化地图数据
const formatMapData = (data: any, i: number) => {
  console.log('weq', data)
  chartOption.value.series[0].data = []
  data.forEach((item: any) => {
    switch (i) {
      case 1:
        chartOption.value.series[0].data.push({ name: item.area_name, value: item.real_money_total })
        break
      case 2:
        chartOption.value.series[0].data.push({ name: item.area_name, value: item.real_type_total })
        break
      case 3:
        chartOption.value.series[0].data.push({ name: item.area_name, value: item.real_total })
        break
    }
  })
  setTimeout(() => {
    chartData.value = data
  }, 100)
}
let newChartData = ref<any>([])
const getInstrumentMap = async () => {
  chartOption.value = JSON.parse(JSON.stringify(props.item.customOption))
  try {
    const params = {
      city: props.city,
      area: props.area,
      school_id: props.school,
      standard_level: props.standardLevel
    }
    const { data, code } = await InstrumentMap(params)
    if (code === 10) {
      chartData.value = data.list
      if (chartData.value?.length === 0) {
        chartData.value = ['default']
      }
      newChartData.value = JSON.parse(JSON.stringify(chartData.value))
      formatMapData(chartData.value, 1)
    }
  } catch (error) {
    console.log(error)
  }
}
let mapFindAreaData = ref<any>({})
const getFindAreaOption = async () => {
  try {
    const params = {
      code: props.city || 12877
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
const loop = () => {
  switch (props.item.flagNum) {
    case 0:
      getLaborData()
      break
    case 1:
      getLaborUseData()
      break
    case 2:
      getLaborComplianceRate()
      break
    case 3:
      getInstrumentFlow()
      break
    case 4:
      getExpBookRateBySubject()
      break
    case 5:
      getUseFrequency()
      break
    case 6:
      getExpBookNumByGrade()
      break
    case 7:
      getExpBookRate()
      break
    case 8:
      getInstrumentAmountSummary()
      break
    case 9:
      getStudentAvgSummary()
      break
    case 10:
      getInstrumentUseRate()
      break
    case 11:
      getInstrumentStatusSummary()
      break
    case 12:
      getInstrumentTypeAmountSummary()
      break
    case 13:
      getLaborTypeRate()
      break
    case 14:
      getLabExpBookRate()
      break
    case 15:
      getExpBookNumBySubject()
      break
    case 16:
      getExpFrequency()
      break
    case 17:
      getFindAreaOption()
      getInstrumentMap()
      break
    case 20:
    case 30:
    case 40:
    case 50:
      customFnc()
      break
  }
}
if (!props.isDefaultValue) {
  loop()
} else {
  chartOption.value = JSON.parse(JSON.stringify(props.item.customOption))
  let flag = false
  flag = [20, 30, 40, 50].includes(props.item.flagNum)
  if (props.item.flagNum === 17) {
    getFindAreaOption()
  }
  if (flag) {
    customFnc()
  } else {
    setTimeout(() => {
      chartData.value = ['default']
    }, 400)
  }
}
watch([() => props.city, () => props.area, () => props.school, () => props.standardLevel], (newValue, oldValue) => {
  params = {
    city: props.city,
    area: props.area,
    school_id: props.school
  }
  chartData.value = []
  loop()
})
watch(
  () => mapValue.value,
  (newValue, oldValue) => {
    if (!props.isDefaultValue) {
      chartData.value = []
      console.log('5555', mapValue.value)
      formatMapData(newChartData.value, newValue)
    }
  }
)
// chartData
// console.log('item', chartOption.value)
</script>

<style lang="scss" scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
  .chart-title {
    position: absolute;
    top: 10px;
    left: 0;
    width: 100%;
    text-align: center;
    // font-size: 18px;
    color: #fff;
  }

  .mapSelect {
    width: 30%;
    position: absolute;
    right: 0;
    top: 10px;
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
.empty {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ccc;
  font-size: 18px;
}
</style>
