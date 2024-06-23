<template>
  <div>
    <header>
      <div class="fl">
        <span>仪器管理</span>
        <el-icon><arrow-right /></el-icon>
        <span>仪器损耗、报废审核</span>
      </div>
      <div class="searchArea">
        <el-input v-model="compensateValue" placeholder="搜索" />
        <img class="search" src="@assets/images/common/search.png" alt="搜索" @click="search" />
      </div>
    </header>
    <div class="buttonArea">
      <div class="title">仪器损耗、报废审核列表</div>
    </div>
    <div class="tableArea">
      <el-table
        :data="instrumentList.data"
        style="width: 100%"
        :header-cell-style="{ background: '#EFEFEF', color: '#000' }"
        row-key="id"
        :cell-style="cellStyle"
        @expand-change="load"
        :tree-props="{ children: 'list', hasChildren: 'hasChildren' }"
        @sort-change="sortChange"
      >
        <el-table-column label="" prop="" width="30"></el-table-column>
        <el-table-column label="损耗报废单号" prop="record_number" show-overflow-tooltip width="130"></el-table-column>
        <el-table-column label="总价值" prop="price" width="80" show-overflow-tooltip></el-table-column>
        <el-table-column label="仪器信息" show-overflow-tooltip>
          <template #default="scope">
            <span v-show="scope.row.list">{{ scope.row.species + '种' }} {{ scope.row.total + '个' }}</span>
            <span v-show="!scope.row.list">
              {{ scope.row.name }} {{ '(' + scope.row.asset_number + ')' }}{{ scope.row.specification }}
              {{ scope.row.total + '个' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="报废理由" show-overflow-tooltip prop="cause">
          <template #default="scope">
            <span v-show="scope.row.cause === 1">仪器超过使用年限，性能已不能达到实验需要的最低要求，且无法修复</span>
            <span v-show="scope.row.cause === 2">损坏严重，无法修复</span>
            <span v-show="scope.row.cause === 3">主要部件无处购配，无法修复使用</span>
            <span v-show="scope.row.cause === 4">修理费昂贵，无修理价值</span>
          </template>
        </el-table-column>
        <el-table-column label="处理方式" prop="process_mode" show-overflow-tooltip>
          <template #default="scope">
            <span v-show="scope.row.process_mode === 1">实验室留用</span>
            <span v-show="scope.row.process_mode === 2">建立废旧仪器实验室</span>
          </template>
        </el-table-column>
        <el-table-column
          label="提交时间"
          prop="create_time"
          sortable="custom"
          show-overflow-tooltip
          width="160"
        ></el-table-column>
        <el-table-column label="提交人" prop="user_name" show-overflow-tooltip width="110"></el-table-column>
        <el-table-column label="状态" prop="status" sortable="custom" show-overflow-tooltip width="110">
          <template #default="scope">
            <span v-show="scope.row.status === 1">未提交</span>
            <span v-show="scope.row.status === 2">待审核</span>
            <span v-show="scope.row.status === 3">已撤回</span>
            <span v-show="scope.row.status === 4">审核通过</span>
            <span v-show="scope.row.status === 5">审核未通过</span>
          </template>
        </el-table-column>
        <el-table-column
          label="审核时间"
          prop="audit_time"
          sortable="custom"
          show-overflow-tooltip
          width="160"
        ></el-table-column>
        <el-table-column label="审核人" prop="audit_user_name" show-overflow-tooltip width="110"></el-table-column>
        <el-table-column label="操作" prop="" width="180">
          <template #default="scope">
            <div v-show="scope.row.list">
              <div
                v-show="scope.row.status === 2"
                style="color: #05c65d; float: left; cursor: pointer"
                @click="operate(scope.row.id, 1)"
              >
                通过
              </div>
              <div v-show="scope.row.status !== 2" style="color: #848484; float: left">通过</div>
              <div
                v-show="scope.row.status === 2"
                style="color: #de4747; float: left; cursor: pointer; margin-left: 15px"
                @click="operate(scope.row.id, 2)"
              >
                不通过
              </div>
              <div v-show="scope.row.status !== 2" style="color: #848484; float: left; margin-left: 15px">不通过</div>
              <div
                style="color: #05c65d; float: left; margin-left: 15px; cursor: pointer"
                @click="operate(scope.row.id, 3)"
              >
                详情
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pageSize">
      <el-pagination
        v-model:currentPage="currentPage"
        :page-size="15"
        :disabled="disabled"
        :background="background"
        layout="prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <examine
      v-if="operationStatus === 1 || operationStatus === 2"
      :examineShow="operationStatus === 1 || operationStatus === 2"
      :selectID="selectID"
      :status="examineStatus"
      @back="back()"
    ></examine>
    <detail
      v-if="operationStatus === 3"
      :detailShow="operationStatus === 3"
      :selectID="selectID"
      @back="back()"
    ></detail>
  </div>
</template>
<script lang="ts" setup>
import { ref, toRefs, reactive } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
import examine from './component/examine.vue'
import detail from './component/detail.vue'
import { getScrapRegistrationlist } from '../../../service/instrument-manage/scrapRegistration/index'
import { scrapRegistrationData } from '../../../service/instrument-manage/scrapRegistration/types'

let compensateValue = ref('')
let operationStatus = ref(0)
let selectID = ref(1)
let examineStatus = ref(1)
let currentPage = ref(1)
let total = ref(0)
const background = ref(true)
const disabled = ref(false)

const dataMap = reactive({
  instrumentList: scrapRegistrationData,
  styleList: Array<{
    id: number
    status: boolean
  }>()
})

let { instrumentList, styleList } = toRefs(dataMap)

const initData = (value: string) => {
  getScrapRegistrationlist({ keyword: value, page: currentPage.value, ...sortData }).then((res) => {
    instrumentList.value = res.data
    instrumentList.value.data.forEach((e) => {
      e.list.forEach((i) => {
        delete i.id
      })
    })
    total.value = res.data.total
    styleList.value.length = res.data.data.length
  })
}

initData('')
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
const operate = (id: number, status: number) => {
  examineStatus.value = status
  operationStatus.value = status
  selectID.value = id
  if (status === 1) {
    examineStatus.value = 4
  } else {
    if (status === 2) {
      examineStatus.value = 5
    }
  }
}

const cellStyle = (row: any) => {
  if (!row.row.list) {
    return {
      background: '#DCECE3'
    }
  } else {
    //改变展开行背景色
    for (const key in styleList.value) {
      if (row.row.id === styleList.value[key].id) {
        if (styleList.value[key].status === true) {
          return {
            background: '#C2E3D1'
          }
        }
      }
    }
  }
}

const load = (row: any, expandedRows: boolean) => {
  instrumentList.value.data.forEach((e, index) => {
    if (e.id === row.id) {
      styleList.value[index] = { id: row.id, status: expandedRows }
    }
  })
}

const search = () => {
  initData(compensateValue.value)
}

const handleSizeChange = () => {
  console.log('')
}

const handleCurrentChange = () => {
  initData('')
}

const back = () => {
  operationStatus.value = 0
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
  height: 80px;
  float: left;
  display: flex;
  align-items: center;
  background-color: #dcece3;
  box-sizing: border-box;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  .title {
    font-size: 20px;
    height: 30px;
    width: 20%;
    float: left;
    font-weight: bold;
    color: #05c65d;
    text-align: left;
  }
  .buttonStyle {
    float: right;
    width: 10%;
    border-radius: 10px;
    margin-left: 80%;
    height: 30px;
  }
}
.pageSize {
  margin-top: 20px;
  width: 30%;
  float: right;
}
</style>
