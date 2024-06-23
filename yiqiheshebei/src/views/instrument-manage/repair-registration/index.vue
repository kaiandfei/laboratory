<template>
  <div>
    <header>
      <div class="fl">
        <span>仪器管理</span>
        <el-icon><arrow-right /></el-icon>
        <span v-show="!repairShow">维修保养登记</span>
        <span v-show="repairShow" @click="repairRegistrationBack" style="cursor: pointer">维修保养登记</span>
        <el-icon v-show="repairShow"><arrow-right /></el-icon>
        <span v-show="repairShow">新增</span>
      </div>
      <div class="searchArea">
        <el-input v-model="repairValue" placeholder="搜索" />
        <img class="search" src="@assets/images/common/search.png" alt="搜索" @click="search" />
      </div>
    </header>
    <div class="buttonArea" v-show="!repairShow">
      <div class="title">仪器维修保养登记情况</div>
      <el-button
        v-if="[1, 2].includes(store.state.login.userInfo.role_id)"
        type="primary"
        class="buttonStyle"
        @click="exportExcel()"
      >
        导出
      </el-button>
      <el-button
        v-if="![1].includes(store.state.login.userInfo.role_id)"
        class="buttonStyle"
        type="primary"
        @click="add"
      >
        新增登记记录
      </el-button>
    </div>
    <div class="tableArea" v-show="!repairShow">
      <el-table
        :data="repairRegistrationList.data"
        style="width: 100%"
        :header-cell-style="{ background: '#EFEFEF', color: '#000' }"
        :cell-style="cellStyle"
        row-key="id"
        @expand-change="load"
        :tree-props="{ children: 'list', hasChildren: 'hasChildren' }"
        @sort-change="sortChange"
      >
        <el-table-column width="30"></el-table-column>
        <el-table-column label="维修保养单号" prop="record_number" show-overflow-tooltip width="120"></el-table-column>
        <el-table-column label="负责企业" prop="factory" align="left" show-overflow-tooltip></el-table-column>
        <el-table-column label="仪器信息" show-overflow-tooltip>
          <template #default="scope">
            <span v-show="scope.row.list">{{ scope.row.species + '种' }} {{ scope.row.total + '个' }}</span>
            <span v-show="!scope.row.list">
              {{ scope.row.name }}{{ scope.row.asset_number }} {{ scope.row.specification }}
              {{ scope.row.total + '个' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="损坏情况" prop="desc" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column
          label="预计完成时间"
          prop="plan_end_time"
          width="130"
          align="left"
          sortable="custom"
          show-overflow-tooltip
        >
          <template #default="scope">
            {{ scope.row.plan_end_time?.split(' ')[0] }}
          </template>
        </el-table-column>
        <el-table-column label="实际完成时间" prop="complete_time" width="160" show-overflow-tooltip></el-table-column>
        <el-table-column label="状态" prop="status" sortable="custom" width="160" show-overflow-tooltip>
          <template #default="scope">
            <span v-show="scope.row.mode === 1 && scope.row.status === 1">维修中</span>
            <span v-show="scope.row.mode === 1 && scope.row.status === 2">维修部分完成</span>
            <span v-show="scope.row.mode === 1 && scope.row.status === 3">维修完成</span>
            <span v-show="scope.row.mode === 1 && scope.row.status === -1">维修中（已转报废）</span>
            <span v-show="scope.row.mode === 2 && scope.row.status === 1">保养中</span>
            <span v-show="scope.row.mode === 2 && scope.row.status === 2">保养部分完成</span>
            <span v-show="scope.row.mode === 2 && scope.row.status === 3">保养完成</span>
          </template>
        </el-table-column>
        <el-table-column
          label="登记时间"
          prop="create_time"
          sortable="custom"
          show-overflow-tooltip
          width="160"
        ></el-table-column>
        <el-table-column label="登记人" prop="user_name" show-overflow-tooltip width="110"></el-table-column>
        <el-table-column label="维修单状态" prop="repair_status" width="120">
          <template #default="scope">
            <div v-show="scope.row.list">
              <span v-show="scope.row.status === 3">已结束</span>
              <span style="color: red" v-show="scope.row.status !== 3">未结束</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" prop="">
          <template #default="scope">
            <div v-show="scope.row.list">
              <div style="color: green; float: left; cursor: pointer" @click="operate(scope.row.id, 1)">查看详情</div>
              <div
                v-if="![1].includes(store.state.login.userInfo.role_id)"
                v-show="scope.row.status === 3"
                style="color: green; float: left; margin-left: 20px; cursor: pointer"
                @click="operate(scope.row.id, 2)"
              >
                删除
              </div>
              <div
                v-if="![1].includes(store.state.login.userInfo.role_id)"
                v-show="scope.row.status !== 3"
                style="color: #626572; float: left; margin-left: 20px"
              >
                删除
              </div>
              <div
                v-if="![1].includes(store.state.login.userInfo.role_id)"
                v-show="scope.row.status !== 3"
                style="color: green; float: right; cursor: pointer"
                @click="operate(scope.row.id, 3)"
              >
                维修完成
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pageSize" v-show="!repairShow">
      <el-pagination
        v-model:currentPage="currentPage"
        :page-size="15"
        :disabled="disabled"
        :background="background"
        :hide-on-single-page="true"
        layout="prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <addRegistration
      v-if="repairShow === true"
      ref="addList"
      :searchValue="repairValue"
      :addShow="repairShow === true"
      @back="back()"
    ></addRegistration>
    <repairRegistration
      v-if="operationStatus === 3"
      :repairShow="operationStatus === 3"
      :selectID="selectID"
      @back="back()"
    ></repairRegistration>
    <registrationDetail
      v-if="operationStatus === 1"
      :detailShow="operationStatus === 1"
      :selectID="selectID"
      @back="back()"
    ></registrationDetail>
  </div>
</template>
<script lang="ts" setup>
import { ref, toRefs, reactive } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
import addRegistration from './component/add.vue'
import repairRegistration from './component/repair.vue'
import registrationDetail from './component/detail.vue'
import { ElMessageBox } from 'element-plus'
import {
  getRepairRegistrationList,
  deleteRepairList
} from '../../../service/instrument-manage/repairRegistration/index'
import { repairData } from '../../../service/instrument-manage/repairRegistration/types'
import { useStore } from '@store/index'

import localCache from '@/utils/localCache'
import axios from 'axios'

const store = useStore()

let repairShow = ref(false)
let repairValue = ref('')
let operationStatus = ref(0)
let selectID = ref(1)
let currentPage = ref(1)
let total = ref(0)
const background = ref(true)
const disabled = ref(false)
const subjectID: any = ref(0)

subjectID.value = JSON.parse(sessionStorage.getItem('state') || '').login.userInfo.subject_id

const dataMap = reactive({
  repairRegistrationList: repairData,
  styleList: Array<{
    id: number
    status: boolean
  }>()
})
let { repairRegistrationList, styleList } = toRefs(dataMap)
let sortData: any = reactive({})
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
const initData = (value: string) => {
  repairRegistrationList.value = {}
  getRepairRegistrationList({ keyword: value, page: currentPage.value, ...sortData }).then((res) => {
    repairRegistrationList.value = res.data
    total.value = res.data.total
    styleList.value.length = res.data.data.length
  })
}

initData('')

const exportExcel = () => {
  const token = localCache.getCookie('swr_token')
  axios
    .post(
      process.env.VUE_APP_BASE_URL_BASE + '/schooldvc/SchoolInstrumentsMaintain/instrumentMaintainList',
      { token, keyword: repairValue.value, page: currentPage.value, ...sortData, is_explode: 1 },
      { responseType: 'blob' }
    )
    .then((res) => {
      const blob = new Blob([res.data]) // 处理文档流
      const fileName = store.state.login.userInfo.school.name + '-' + '仪器维修登记.xlsx'
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

const repairRegistrationBack = () => {
  repairShow.value = false
  console.log('')
}

// 表格行展示改变颜色
const cellStyle = (row: any) => {
  if (!row.row.list) {
    return {
      background: '#DCECE3',
      hieght: '40px'
    }
  } else {
    //改变展开行背景色
    for (const key in styleList.value) {
      if (row.row.id === styleList.value[key].id) {
        if (styleList.value[key].status === true) {
          console.log(row.rowIndex + '选中行')
          return {
            background: '#C2E3D1',
            height: '60px'
          }
        }
      }
    }
    return {
      height: '60px'
    }
  }
}

const operate = (id: number, status: number) => {
  selectID.value = id
  operationStatus.value = status
  if (status === 2) {
    ElMessageBox.confirm('确定删除此记录，删除后无法撤销', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
      .then(() => {
        deleteRepairList({ id: id })
        initData(repairValue.value)
      })
      .catch(() => {
        console.log('')
      })
  }
}

const addList = ref()

const search = () => {
  if (repairShow.value === true) {
    addList.value?.search(subjectID.value)
  } else {
    initData(repairValue.value)
  }
}

const load = (row: any, expandedRows: boolean) => {
  repairRegistrationList.value.data.forEach((e, index) => {
    if (e.id === row.id) {
      console.log(index)
      styleList.value[index] = { id: row.id, status: expandedRows }
    }
  })
}

const handleSizeChange = () => {
  console.log('')
}

const handleCurrentChange = () => {
  initData('')
}

const add = () => {
  repairShow.value = true
  setTimeout(() => {
    addList.value?.search(subjectID.value)
  }, 10)
}

const back = () => {
  operationStatus.value = 0
  repairShow.value = false
  initData('')
}
</script>
<style lang="scss" scoped>
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
    // height: 40px;
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
.buttonArea {
  margin: 10px 0;
  padding: 0 20px;
  width: 100%;
  height: 60px;
  float: left;
  display: flex;
  align-items: center;
  background-color: #dcece3;
  box-sizing: border-box;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
  .title {
    margin-right: auto;
    font-size: 20px;
    height: 30px;
    font-weight: bold;
    color: #05c65d;
  }
  .buttonStyle {
    border-radius: 10px;
    height: 30px;
  }
}
.pageSize {
  margin-top: 20px;
  width: 30%;
  float: right;
}
</style>
