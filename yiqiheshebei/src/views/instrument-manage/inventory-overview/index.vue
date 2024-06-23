<template>
  <div>
    <header>
      <div class="fl">
        <span>仪器管理</span>
        <el-icon><arrow-right /></el-icon>
        <span>仪器库存总览</span>
      </div>
      <div class="searchArea">
        <el-input v-model="inputValue" placeholder="搜索"></el-input>
        <img class="search" src="@assets/images/common/search.png" alt="搜索" @click="search" />
      </div>
    </header>
    <div>
      <div class="recommend">
        <div class="filter-box" v-show="showMenu">
          <BaseFilter :config-data="filterData" @change-filter="changeFilter" />
        </div>
      </div>
      <div class="statistics">
        <div class="item">
          <div class="l-item">
            <div ref="echarts1"></div>
          </div>
          <div class="r-item">
            <p>总库存</p>
            <p>{{ Number(List.inventory) + Number(List.lend) + Number(List.maintenance) }}</p>
          </div>
        </div>
        <div class="item">
          <div class="l-item">
            <div ref="echarts2"></div>
          </div>
          <div class="r-item">
            <p>出借</p>
            <p>{{ List.lend }}</p>
          </div>
        </div>
        <div class="item">
          <div class="l-item">
            <div ref="echarts3"></div>
          </div>
          <div class="r-item">
            <p>维修保养</p>
            <p>{{ List.maintenance }}</p>
          </div>
        </div>
        <div class="item">
          <div class="l-item">
            <div ref="echarts4"></div>
          </div>
          <div class="r-item">
            <p>报废</p>
            <p>{{ List.scrap }}</p>
          </div>
        </div>
        <div v-if="[1, 2, 4].includes(store.state.login.userInfo.role_id)" class="btn" @click="exportExcel()">导出</div>
      </div>
      <div class="content">
        <el-table
          :data="List.data"
          style="width: 100%"
          :header-cell-style="{ background: '#EFEFEF', color: '#000' }"
          :cell-style="{ background: '#ffffff', borderBottom: '1px solid #EFEFEF' }"
          @sort-change="sortChange"
        >
          <el-table-column type="index" prop="" label="序号" width="60" align="left"></el-table-column>
          <el-table-column
            prop="asset_number"
            label="学校编号"
            align="left"
            sortable="custom"
            show-overflow-tooltip
            width="110"
          ></el-table-column>
          <el-table-column prop="name" show-overflow-tooltip label="名称" :align="'left'"></el-table-column>
          <el-table-column
            prop="specification"
            label="规格型号"
            :align="'left'"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column prop="unit" label="单位" align="left" show-overflow-tooltip></el-table-column>
          <el-table-column
            prop="all_total"
            label="总库存"
            align="left"
            sortable="custom"
            width="110"
            show-overflow-tooltip
          >
            <template #default="scope">
              {{ parseInt(scope.row.total) + parseInt(scope.row.lend_num) + parseInt(scope.row.maintenance_num) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="total"
            label="可用"
            align="left"
            sortable="custom"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="lend_num"
            label="出借"
            align="left"
            sortable="custom"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="maintenance_num"
            label="维修保养"
            align="left"
            sortable="custom"
            width="110"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="scrap_num"
            label="报废(不算在总库存中)"
            width="180"
            align="left"
            sortable="custom"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column prop="category" label="分类" :align="'left'" show-overflow-tooltip>
            <template #default="scope">
              {{ computedTitle(scope.row.category) }}
            </template>
          </el-table-column>
          <el-table-column prop="cost_type" label="价值分类" align="left" width="100" show-overflow-tooltip>
            <template #default="scope">
              <span v-show="scope.row.cost_type === 1">低值易耗</span>
              <span v-show="scope.row.cost_type === 2">非低值易耗</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="![1, 4].includes(store.state.login.userInfo.role_id)"
            prop=""
            label="操作"
            width="200"
            align="center"
          >
            <template #default="scope">
              <div class="click-box">
                <span class="click-text green" @click="operate(scope.row, 1)">
                  <!-- <img src="@assets/images/laboratory-standard/edit.png" alt="" /> -->
                  调拨
                </span>
                <span class="click-text green" @click="operate(scope.row, 2)">入库</span>
                <!-- <span class="click-text green" @click="operate(scope.row, 3)">盘点</span> -->
                <span class="click-text green" @click="operate(scope.row, 4)">详情</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-block">
          <el-pagination
            v-model:currentPage="currentPage"
            :page-size="15"
            @current-change="handleCurrentChange"
            background
            layout="total, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
      <allocation
        v-if="operateStatus === 1"
        :allotShow="operateStatus === 1"
        :allotFormData="allotFormData"
        @back="back()"
      />
      <Warehousing
        v-if="operateStatus === 2"
        :warehousingForm="warehousingForm"
        :edit-show="operateStatus === 2"
        @back="back()"
      />
      <inventory
        v-if="operateStatus === 3"
        :inventoryShow="operateStatus === 3"
        :checkFormData="checkFormData"
        @back="back()"
      />
      <detail
        v-if="operateStatus === 4"
        :detailShow="operateStatus === 4"
        :detailListId="detailListId"
        @back="back()"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, ref, inject, computed, onMounted } from 'vue'

import { BaseFilter } from '@/components/base-filter'
import Warehousing from './component/warehousing.vue'
import allocation from './component/allocation.vue'
import inventory from './component/Inventory.vue'
import detail from './component/detail.vue'
import { ConfigDataType } from '@/components/base-filter/src/types'

import { inventoryData, allotData, warehousingData, checkData } from '@/service/instrument-manage/equ-manage/types'
import { getInventoryList } from '@/service/instrument-manage/equ-manage/index'

import { ArrowRight } from '@element-plus/icons-vue'
import localCache from '@/utils/localCache'
import axios from 'axios'

import { useStore } from '@store/index'

const store = useStore()
const showMenu: any = ref(true)
const subjectID: any = ref(0)

subjectID.value = store.state.login.userInfo.subject_id

console.log(subjectID.value, '学校id')

if (subjectID.value === 0) {
  showMenu.value = true
} else {
  showMenu.value = false
}

const dataMap = reactive({
  filterData: Array<ConfigDataType>(),
  inputValue: '',
  selectForm: { subject_id: store.state.login.userInfo.subject_id },
  List: inventoryData,
  currentPage: 1,
  total: 1,
  operateStatus: 0, //1 调拨 2 入库 3 盘点 4 详情
  allotFormData: allotData,
  checkFormData: checkData,
  warehousingForm: warehousingData,
  detailListId: 0
})

let {
  filterData,
  inputValue,
  selectForm,
  currentPage,
  total,
  operateStatus,
  List,
  allotFormData,
  checkFormData,
  warehousingForm,
  detailListId
} = toRefs(dataMap)

// getInventoryList({ subject_id: subjectID.value, keyword: '', page: currentPage.value }).then((res) => {
//   List.value = res.data
//   total.value = res.data.total
// })
let echart: any = inject('echart')

const echarts1 = ref()
const echarts2 = ref()
const echarts3 = ref()
const echarts4 = ref()
const setEcharts = () => {
  let chartDom1 = echart.init(echarts1.value)
  let option1 = {
    color: ['#05C65D'],
    tooltip: {
      show: true,
      trigger: 'item',
      formatter: '{c}'
    },
    legend: {
      show: false
    },
    series: [
      {
        name: '',
        type: 'pie',
        radius: ['20%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '10',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          {
            value: Number(List.value.inventory) + Number(List.value.lend) + Number(List.value.maintenance),
            name: '总库存'
          }
        ]
      }
    ]
  }
  chartDom1.setOption(option1)
  let chartDom2 = echart.init(echarts2.value)
  let option2 = {
    color: ['#5FAFE4', '#DCE8EC', '#ffffff'],
    tooltip: {
      show: true,
      trigger: 'item',
      formatter: '{c}'
    },
    legend: {
      show: false
    },
    series: [
      {
        name: '',
        type: 'pie',
        radius: ['0%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '10',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data:
          parseInt(List.value.inventory) === 0
            ? [
                {
                  value: Number(List.value.inventory) + Number(List.value.lend) + Number(List.value.maintenance),
                  name: ''
                }
              ]
            : [
                {
                  value: parseInt(List.value.lend),
                  name: '出借'
                },
                {
                  value: Number(List.value.inventory) + Number(List.value.maintenance),
                  name: ''
                }
              ]
      }
    ]
  }
  chartDom2.setOption(option2)
  let chartDom3 = echart.init(echarts3.value)
  let option3 = {
    color: ['#EFA965', '#DCE8EC', '#ffffff'],
    tooltip: {
      show: true,
      trigger: 'item',
      formatter: '{c}'
    },
    legend: {
      show: false
    },
    series: [
      {
        name: '',
        type: 'pie',
        radius: ['0%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '10',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data:
          parseInt(List.value.inventory) === 0
            ? [
                {
                  value: Number(List.value.inventory) + Number(List.value.lend) + Number(List.value.maintenance),
                  name: ''
                }
              ]
            : [
                // { value: 0, name: '' },
                {
                  value: parseInt(List.value.maintenance),
                  name: '维修保养'
                },
                {
                  value: Number(List.value.inventory) + Number(List.value.lend),
                  name: ''
                }
                // { value: 0, name: '' }
              ]
      }
    ]
  }
  chartDom3.setOption(option3)
  let chartDom4 = echart.init(echarts4.value)
  let option4 = {
    color: ['#EE5959', '#DCE8EC', '#ffffff'],
    tooltip: {
      show: true,
      trigger: 'item',
      formatter: '{c}'
    },
    legend: {
      show: false
    },
    series: [
      {
        name: '',
        type: 'pie',
        radius: ['0%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '10',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data:
          parseInt(List.value.inventory) === 0
            ? [
                {
                  value: Number(List.value.inventory) + Number(List.value.lend) + Number(List.value.maintenance),
                  name: ''
                }
              ]
            : [
                // { value: 0, name: '' },
                {
                  value: parseInt(List.value.scrap),
                  name: '报废'
                },
                {
                  value: Number(List.value.inventory) + Number(List.value.lend) + Number(List.value.maintenance),
                  name: ''
                }
                // { value: 0, name: '' }
              ]
      }
    ]
  }
  chartDom4.setOption(option4)
  window.onresize = function () {
    chartDom1.resize
    chartDom2.resize
    chartDom3.resize
    chartDom4.resize
  }
}
let sortData: any = reactive({})
onMounted(() => {
  getInventoryList({
    subject_id: subjectID.value,
    keyword: inputValue.value,
    page: currentPage.value,
    ...sortData
  }).then((res) => {
    List.value = res.data
    total.value = res.data.total
    setEcharts()
  })
})

const exportExcel = () => {
  const token = localCache.getCookie('swr_token')
  axios
    .post(
      process.env.VUE_APP_BASE_URL_BASE + '/schooldvc/SchoolInstrument/instrumentList',
      {
        token,
        subject_id: subjectID.value,
        keyword: inputValue.value,
        page: currentPage.value,
        ...sortData,
        is_explode: 1
      },
      { responseType: 'blob' }
    )
    .then((res) => {
      const blob = new Blob([res.data]) // 处理文档流
      const fileName = store.state.login.userInfo.school.name + '-' + '仪器库存总览.xlsx'
      const elink = document.createElement('a')
      elink.download = fileName
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href) // 释放URL 对象
      document.body.removeChild(elink)
    })
}

let subject = [...store.state.common.subjectArr]
subject.unshift({
  id: 0,
  name: '全部'
})
filterData.value = [
  {
    name: '学科',
    list: subject,
    keyName: 'subject_id'
  }
]

const computedTitle = computed(() => {
  return (list: { title: string }[]) => {
    let arr = list.map((e) => {
      return e.title
    })
    return arr.join(',')
  }
})

const changeFilter = (form: { subject_id: number }) => {
  selectForm.value = form
  getInventoryList({ ...selectForm.value, keyword: inputValue.value, page: 1, ...sortData }).then((res) => {
    List.value = res.data
    total.value = res.data.total
    setEcharts()
  })
}

const search = () => {
  getInventoryList({ subject_id: subjectID.value, keyword: inputValue.value, page: 1, ...sortData }).then((res) => {
    List.value = res.data
    total.value = res.data.total
  })
}

const operate = (Data: any, status: number) => {
  operateStatus.value = status
  switch (status) {
    case 1:
      allotFormData.value.school_instrument_id = Data.instrument_id
      allotFormData.value.number = Data.number
      allotFormData.value.type = 1
      allotFormData.value.asset_number = Data.asset_number
      allotFormData.value.name = Data.name
      allotFormData.value.specification = Data.specification
      break
    case 2:
      warehousingForm.value.school_instrument_id = Data.instrument_id
      warehousingForm.value.school_instrument_name = Data.name
      warehousingForm.value.unit = Data.unit
      warehousingForm.value.number = Data.number
      warehousingForm.value.type = 1
      warehousingForm.value.asset_number = Data.asset_number
      warehousingForm.value.name = Data.name
      warehousingForm.value.specification = Data.specification
      break
    case 3:
      checkFormData.value.school_instrument_id = Data.id
      checkFormData.value.instrument_id = Data.instrument_id
      checkFormData.value.number = Data.number
      checkFormData.value.type = 1
      checkFormData.value.asset_number = Data.asset_number
      checkFormData.value.name = Data.name
      checkFormData.value.specification = Data.specification
      break
    case 4:
      detailListId.value = Data.instrument_id
      console.log(Data, '获取到的主页detailID')
      break
  }
}

const back = () => {
  operateStatus.value = 0
  allotFormData.value.list.forEach((e) => {
    e.school_laboratory_id = ''
    e.store_id = ''
    e.number_plies = ''
    e.number = 0
    e.total = ''
  })
  warehousingForm.value.location.forEach((e) => {
    e.school_laboratory_id = ''
    e.store_id = ''
    e.number_plies = ''
  })

  getInventoryList({
    subject_id: subjectID.value,
    keyword: inputValue.value,
    page: currentPage.value,
    ...sortData
  }).then((res) => {
    List.value = res.data
    total.value = res.data.total
  })
}

const handleCurrentChange = () => {
  getInventoryList({
    subject_id: subjectID.value,
    keyword: inputValue.value,
    page: currentPage.value,
    ...sortData
  }).then((res) => {
    List.value = res.data
    total.value = res.data.total
  })
}
const sortChange = ({ column, prop, order }) => {
  if (prop !== null) {
    sortData = {}
    if (order === 'descending') {
      sortData[`order_${prop}`] = 2
    } else {
      sortData[`order_${prop}`] = 1
    }
    search()
    console.log(column, prop, order)
  }
}
</script>

<style scoped lang="scss">
header {
  height: 30px;
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  line-height: 30px;
  color: #626572;
  opacity: 1;
  & > div {
    display: flex;
    align-items: center;
    .title-cancel {
      cursor: pointer;
    }
    .cancel {
      margin-left: 10px;
    }
  }
  .fr {
    cursor: pointer;
  }
  .searchArea {
    height: 40px;
    width: 24%;
    float: right;
    position: relative;
    :deep(.el-input) {
      position: absolute;
      right: 0;
      top: 0;
      width: 300px;
      line-height: 30px;
    }
    .search {
      position: absolute;
      right: 0;
      top: 0;
      width: 20px;
      height: 20px;
      padding: 5px 10px;
      background: #05c65d;
      cursor: pointer;
    }
  }
}
.recommend {
  margin-top: 10px;
  padding: 0 30px;
  width: 100%;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  .filter-box {
    padding: 15px 0;
    width: 90%;
  }
}
.statistics {
  text-align: left;
  display: flex;
  justify-content: space-between;
  .item {
    display: flex;
    align-items: center;
    margin: 10px 0;
    width: 23%;
    height: 100px;
    border-radius: 4px;
    background: #fff;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
    .l-item {
      margin-left: 10px;
      width: 50%;
      height: 80px;
      & > div {
        margin: auto;
        width: 80px;
        height: 80px;
      }
    }
    .r-item {
      margin-left: 10px;
      p:nth-of-type(1) {
        color: #848484;
      }
      p:nth-of-type(2) {
        color: #555;
        font-size: 22px;
      }
    }
  }
  & > .btn {
    margin-top: 70px;
  }
}
.content {
  margin-top: 20px;
  .click-box {
    display: flex;
    justify-content: space-evenly;
    .click-text {
      display: flex;
      align-items: center;
      margin: 0 10px;
      cursor: pointer;
      img {
        margin-right: 6px;
      }
    }
  }
  span {
    display: inline-block;
    min-width: 40px;
    height: 30px;
    line-height: 30px;
  }
  .table-input {
    width: 80px;
    height: 30px;
    line-height: 30px;
    border: 1px solid #c9c7c7;
    border-radius: 2px;
    text-align: center;
    option {
      text-align: left;
    }
  }
  .pagination-block {
    margin-top: 20px;
    text-align: right;
  }
}
.btn {
  height: 36px;
  padding: 0 20px;
  line-height: 36px;
  background: #05c65d;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
  border-radius: 10px;
  font-size: 14px;
  font-weight: 400;
  color: #ffffff;
  cursor: pointer;
}
.btn-white {
  color: #05c65d;
  border: 1px solid #05c65d;
  background: #f3f3f3;
}
.btn-gray {
  color: #fff;
  border: 1px solid #b5b5b5;
  background: #b5b5b5;
}
.green {
  color: #05c65d;
}
.yellow {
  color: #ec8c42;
}
</style>
