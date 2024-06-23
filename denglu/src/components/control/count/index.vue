<template>
  <div class="count-container">
    <div class="count-item-title">{{ title }}</div>
    <div class="count-item-count" v-if="item.count">{{ count }}</div>
    <component v-if="item.type && chartData.length !== 0" :is="item.type" :customOption="chartOption"></component>
    <div v-if="chartData.length === 0 && item.type" class="empty">No Data</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { InstrumentMap, expBookNum } from '@/service/dataPage/index'
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
let school_year = ref<number | string>(Number(props.schoolyear.split(',')[0] || ''))
let semester = ref<number | string>(Number(props.schoolyear.split(',')[1] || ''))
let count = ref<any>('')
let chartData = ref<any>([])
let chartOption = ref<any>({})

const title = computed(() => {
  return props.item.title
})
let params: any = {
  city: props.city,
  area: props.area,
  school_id: props.school
}
watch(
  () => props.schoolyear,
  (newValue, oldValue) => {
    school_year.value = Number(newValue.split(',')[0])
    semester.value = Number(newValue.split(',')[1])
    loop()
  }
)
const getInstrumentMap = async () => {
  if (props.item.customOption) chartOption.value = JSON.parse(JSON.stringify(props.item.customOption))
  try {
    params['standard_level'] = props.standardLevel
    const { data, code } = await InstrumentMap(params)
    if (code === 10) {
      switch (props.item.title) {
        case '装备应配总量':
          count.value = data.all_need_total
          break
        case '装备实配总量':
          count.value = data.all_real_total
          break
        case '装备缺口总量':
          count.value = data.all_short_total
          break
      }
      switch (props.item.title) {
        case '仪器总量达标率':
          chartData.value = data.money_rate
          break
        case '仪器种类达标率':
          chartData.value = data.total_rate
          break
        case '仪器金额达标率':
          chartData.value = data.type_rate
          break
      }
      if (props.item.customOption) formatRateOption(chartOption.value, chartData.value)
    }
  } catch (error) {
    console.log(error)
  }
}
const getExpBookNum = async () => {
  try {
    params['school_year'] = school_year.value
    params['semester'] = semester.value
    const { data, code } = await expBookNum(params)
    if (code === 10) {
      count.value = data.count
    }
  } catch (error) {
    console.log('expBookNum', error)
  }
}
const loop = () => {
  switch (props.item.flagNum) {
    case 0:
      getInstrumentMap()
      break
    case 1:
      getExpBookNum()
      break
  }
}
if (!props.isDefaultValue) {
  loop()
} else {
  chartData.value = []
  setTimeout(() => {
    chartData.value = ['default']
    count.value = computed(() => {
      return props.item.count
    })
    if (props.item.customOption) chartOption.value = JSON.parse(JSON.stringify(props.item.customOption))
  }, 100)
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
</script>

<style lang="scss" scoped>
.count-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  cursor: pointer;
  .count-item-title {
    font-size: 18px;
    color: #fff;
  }
  .count-item-count {
    font-size: 40px;
    font-weight: bold;
    color: #2479c5;
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
