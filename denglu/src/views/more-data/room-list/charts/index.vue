<template>
  <div class="flex">
    <div class="flex-content">
      <div class="tab-box">
        <div
          v-for="(item, index) in tabList"
          :class="['tab', { active: item.value === searchForm.category.value }]"
          @click="changeTab(item)"
          :key="index"
        >
          {{ item.label }}
        </div>
      </div>
      <div class="select-box">
        <p>测算标准</p>
        <el-select v-model="searchForm.stand_level" placeholder="请选择">
          <el-option v-for="item in optionsStand" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
    </div>
    <div class="flex-content">
      <el-checkbox v-for="(item, index) in checkBoxList" v-model="item.check" :key="index">
        {{ item.label }}
      </el-checkbox>
      <div class="button-box">
        <el-button class="btn" :loading="loadingMain" @click="getCharts()">生成报表</el-button>
      </div>
    </div>
    <div class="flex-content">
      <div class="tab-box-row">
        <div
          class="tab"
          :class="{ active: chartType === index }"
          v-for="(item, index) in chartTypeList"
          :key="index"
          @click="changeType(index)"
        >
          <img
            :src="
              require('@/assets/images/common/' + item.value + (index === chartType ? '-active' : '-icon') + '.png')
            "
            alt=""
          />
          {{ item.label }}
        </div>
      </div>
      <div class="chart-main">
        <div class="row" v-for="(item, index) in dataList" :key="index">
          <div class="box">
            <div class="r-box">
              <!-- <el-select
                v-model="searchForm.is_must[index]"
                placeholder="请选择"
                @change="changeIsMust($event, item, index)"
              >
                <el-option v-for="item in optionsMust" :key="item.value" :label="item.label" :value="item.value" />
              </el-select> -->
              <el-button class="btn" @click="addComponent(item, index)" :loading="loading[index]">添加到组件</el-button>
            </div>
            <div class="title">{{ item.nameL + item.nameR }}</div>
            <div class="chart-box">
              <component
                v-if="item.customOption"
                :is="chartTypeList[chartType].chartName"
                :customOption="item.customOption"
              ></component>
            </div>
          </div>
          <el-table
            :data="item.tableData"
            :header-row-style="{
              borderRadius: '8px'
            }"
            max-height="300px"
            :header-cell-style="{
              background: '#DCECE3'
            }"
            border
          >
            <el-table-column prop="name" label="类别" />
            <el-table-column prop="value" label="数据" />
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import {
  laboratoryCountBar,
  expBookRateBySubjectChart,
  laboratoryUseFrequency,
  rateOption
} from '@/views/dataPage/components/chart-options/index'

import { CreateLaborDiagram, createDiagramComponent } from '@/service/more-data'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useStore } from '@/store'
let store = useStore()

const route = useRoute()

const searchForm = ref<{
  category: any
  stand_level: number
  // is_must: number[]
  list: number[]
}>({
  category: {
    label: '按学校统计',
    value: 1
  },
  stand_level: 2,
  // is_must: [],
  list: []
})

const tabList = ref([
  {
    value: 1,
    label: '按学校统计'
  },
  {
    value: 2,
    label: '按学段统计'
  },
  {
    value: 3,
    label: '按学科统计'
  },
  {
    value: 4,
    label: '按学校星级统计'
  }
])

const optionsStand = ref([
  {
    value: 2,
    label: '市级'
  },
  {
    value: 3,
    label: '区级'
  }
])

const optionsMust = ref([
  {
    value: 1,
    label: '必配'
  },
  {
    value: 2,
    label: '选配'
  }
])

const checkBoxList = ref([
  {
    value: 1,
    label: '配置总量达标率',
    key: '',
    check: true
  },
  {
    value: 2,
    label: '配置种类达标率',
    key: '',
    check: true
  },
  {
    value: 3,
    label: '功能室总量',
    key: '',
    check: true
  },
  {
    value: 4,
    label: '配备总量达标率',
    key: '',
    check: true
  },
  {
    value: 5,
    label: '配备种类达标率',
    key: '',
    check: true
  }
])

// let i = 1
// while (i <= checkBoxList.value.length) {
//   searchForm.value.list.push(i++)
//   // searchForm.value.is_must.push(1)
// }

let chartType = ref(0)

const chartTypeList = [
  {
    label: '柱状图',
    value: 'bar',
    chartName: 'bar-chart'
  },
  {
    label: '条形图',
    value: 'bar-row',
    chartName: 'bar-chart'
  },
  {
    label: '饼图',
    value: 'pie',
    chartName: 'pie-chart'
  },
  {
    label: '折线图',
    value: 'line',
    chartName: 'line-chart'
  }
]

// let customOption: any = ref([])

const setOption = (i: number) => {
  if (chartType.value === 0) {
    // dataList.value.forEach((e: any) => {
    //   let obj = JSON.parse(JSON.stringify(laboratoryCountBar))
    //   obj.xAxis.data = e.xAxis
    //   obj.series[0].data = e.value
    //   obj.series[0].barMaxWidth = '40'
    //   e.customOption = obj
    // })
    let e = dataList.value[i]
    let obj = JSON.parse(JSON.stringify(laboratoryCountBar))
    obj.xAxis.data = e.xAxis
    obj.series[0].data = e.value
    obj.series[0].barMaxWidth = '40'
    e.customOption = obj
  } else if (chartType.value === 1) {
    // dataList.value.forEach((e: any) => {
    //   let obj = JSON.parse(JSON.stringify(expBookRateBySubjectChart))
    //   obj.yAxis.data = e.xAxis
    //   obj.series[0].data = e.value
    //   obj.series[0].barMaxWidth = '40'
    //   e.customOption = obj
    // })
    let e = dataList.value[i]

    let obj = JSON.parse(JSON.stringify(expBookRateBySubjectChart))
    obj.yAxis.data = e.xAxis
    obj.series[0].data = e.value
    obj.series[0].barMaxWidth = '40'
    e.customOption = obj
  } else if (chartType.value === 2) {
    // dataList.value.forEach((e: any) => {
    //   let obj = JSON.parse(JSON.stringify(rateOption))
    //   obj.tooltip = {
    //     trigger: 'item'
    //   }
    //   // obj.xAxis.data = e.xAxis
    //   obj.series[0].data = e.value.map((m: any, n: number) => {
    //     return {
    //       value: m,
    //       name: e.xAxis[n]
    //     }
    //   })
    //   e.customOption = obj
    // })
    let e = dataList.value[i]
    let obj = JSON.parse(JSON.stringify(rateOption))
    obj.tooltip = {
      trigger: 'item'
    }
    // obj.xAxis.data = e.xAxis
    obj.series[0].data = e.value.map((m: any, n: number) => {
      return {
        value: m,
        name: e.xAxis[n]
      }
    })
    e.customOption = obj
  } else if (chartType.value === 3) {
    // dataList.value.forEach((e: any) => {
    //   let obj = JSON.parse(JSON.stringify(laboratoryUseFrequency))
    //   obj.xAxis.data = e.xAxis
    //   obj.series[0].data = e.value
    //   e.customOption = obj
    // })
    let e = dataList.value[i]
    let obj = JSON.parse(JSON.stringify(laboratoryUseFrequency))
    obj.xAxis.data = e.xAxis
    obj.series[0].data = e.value
    e.customOption = obj
  }
}

const changeType = (index: number) => {
  chartType.value = index
  // customOption.value = []
  dataList.value.forEach((e: any, i: number) => {
    e.customOption = null
    nextTick(() => {
      setOption(i)
    })
  })
}

const changeTab = (item: any) => {
  searchForm.value.category = item
}

let dataList = ref<any[]>([])
let searchFormSave = ref<any>([])

const dataFuc = async (type: number, i: number) => {
  searchFormSave.value[i] = {
    ...route.params,
    x_row: searchForm.value.category.value,
    y_row: type,
    stand_level: searchForm.value.stand_level
    // is_must: searchForm.value.is_must[i]
  }
  let resData = await CreateLaborDiagram(searchFormSave.value[i])

  let obj: any = checkBoxList.value.find((e) => e.value === type)
  if (obj) {
    let tableData: any[] = []
    let xAxis: any[] = []
    let value: any[] = []
    resData.data.name.forEach((e: any, ii: number) => {
      let need100Flag = [1, 2, 4, 5].includes(obj.value)
      tableData.push({
        name: e,
        value: need100Flag ? (resData.data.value[ii] * 100).toFixed(0) + '%' : resData.data.value[ii]
      })
      xAxis.push(e)
      value.push(need100Flag ? (resData.data.value[ii] * 100).toFixed(0) : resData.data.value[ii])
    })
    dataList.value.splice(i, 1, {
      nameL: searchForm.value.category.label,
      nameR: obj.label,
      type: obj.value,
      tableData,
      xAxis,
      value,
      customOption: null
    })
    nextTick(() => {
      setOption(i)
    })
  }
}
let loadingMain = ref(false)

const getCharts = async () => {
  // 可以换成返回数据type
  dataList.value = []
  loadingMain.value = true

  // customOption.value = []
  searchForm.value.list = []
  let i = 0

  while (i < checkBoxList.value.length) {
    if (checkBoxList.value[i].check) {
      searchForm.value.list.push(checkBoxList.value[i].value)
    }
    i++
  }

  for (let i = 0; i < searchForm.value.list.length; i++) {
    try {
      let type = searchForm.value.list[i]
      await dataFuc(type, i)
    } catch (error) {
      console.log('🚀 ~ getCharts ~ error:', error)
    }
  }
  loadingMain.value = false
}
getCharts()

// const changeIsMust = (v: number, item: any, i: number) => {
//   console.log('🚀 ~ changeIsMust ~ i:', i)
//   searchForm.value.is_must.splice(i, 1, v)
//   dataFuc(item.type, i)
// }

let loading = ref<boolean[]>([])
const addComponent = (item: any, index: number) => {
  loading.value[index] = true
  console.log('🚀 ~ addComponent ~ item:', item)
  createDiagramComponent({
    name: item.nameL + item.nameR,
    type: chartType.value + 1,
    api_url: '/dateCenter/LaborDataCenter/CreateLaborDiagram',
    param: {
      ...searchFormSave.value[index],
      y_row: item.type,
      menuIndex: 3,
      need100Flag: [1, 2, 4, 5].includes(item.type) ? 1 : 2
    },
    area: store.state.login?.userInfo.area
  })
    .then((res) => {
      if (res.code === 10) {
        ElMessage({
          type: 'success',
          message: res.msg
        })
      }
    })
    .finally(() => {
      loading.value[index] = false
    })
}
</script>

<style lang="scss" scoped>
.flex {
  width: 100%;
}
.flex-content {
  display: flex;
  flex-direction: column;
  padding: 8px 18px;
  min-width: 9vw;
  background: #fff;
  box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.16);
  .tab-box {
    .tab {
      margin-bottom: 6px;
      padding: 6px 10px;
      border-radius: 10px;
      background: #ffffff;
      box-shadow: 0px 1px 4px 1px rgba(0, 0, 0, 0.16);
      border: 1px solid #05c65d;
      color: #05c65d;
      cursor: pointer;
    }
    .active {
      color: #fff;
      background: #05c65d;
    }
  }
  .el-checkbox {
    display: flex;
  }
  .button-box {
    margin-top: auto;
    margin-bottom: 30px;
    text-align: center;

    .btn {
      padding: 8px 18px;
      background: #05c65d;
      color: #fff;
      border-radius: 10px;
      border: none;
    }
    .btn + .btn {
      margin-left: 10px;
    }
  }
  .tab-box-row {
    display: flex;
    height: 80px;
    background: #f8ffff;
    box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.16);
    .tab {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 160px;
      box-sizing: border-box;
      cursor: pointer;
      img {
        margin-right: 16px;
        padding: 5px;
        border-radius: 50%;
        width: 22px;
        height: 22px;
      }
    }
    .active {
      border-top: 8px solid transparent;
      border-bottom: 8px solid #05c65d;
      img {
        color: #05c65d;
        background: #05c65d;
      }
    }
  }
  .chart-main {
    padding-right: 10px;
    max-height: calc(100% - 80px);
    flex-shrink: 0;
    overflow-y: scroll;
    .row {
      display: flex;
      margin: 10px 0;
      .box {
        margin-right: 10px;
        position: relative;
        min-height: 300px;
        background: #0a234f;
        border-radius: 8px;
        border: 1px solid #099eca;
        flex: 1;
        .r-box {
          position: absolute;
          right: 8px;
          top: 11px;
          display: flex;
          align-items: center;
          z-index: 100;

          .el-select {
            margin-right: 10px;
            width: 80px;
          }
          .btn {
            text-align: center;
            background: #05c65d;
            color: #fff;
            box-shadow: 0px 1px 4px 1px rgba(0, 0, 0, 0.16);
            border-radius: 10px;
            border: none;
          }
        }

        .title {
          position: absolute;
          left: 20px;
          top: 18px;
          font-size: 18px;
          font-weight: 400;
          color: #ffffff;
        }
        .chart-box {
          padding: 0 100px 0 20px;
          width: 100%;
          height: 100%;
          box-sizing: border-box;
        }
      }
      .el-table {
        width: 18vw;
        border-radius: 8px;
        border: none;
      }
    }
  }
}
.flex-content:nth-last-of-type(1) {
  margin-left: 10px;
  padding: 0;
  flex: 1;
  background: transparent;
  box-shadow: initial;
}
.flex-content:nth-of-type(1) {
  background: #dcece3;
}
</style>
