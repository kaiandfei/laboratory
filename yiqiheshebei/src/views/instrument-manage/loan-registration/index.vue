<template>
  <div>
    <header>
      <div class="fl">
        <span>仪器管理</span>
        <el-icon><arrow-right /></el-icon>
        <span v-show="!loanShow">出借登记</span>
        <span v-show="loanShow" @click="loanRegistrationBack" style="cursor: pointer">出借登记</span>
        <el-icon v-show="loanShow"><arrow-right /></el-icon>
        <span v-show="loanShow">新增</span>
      </div>
      <div class="searchArea">
        <el-input v-model="loanValue" placeholder="搜索" />
        <img class="search" src="@assets/images/common/search.png" alt="搜索" @click="search" />
      </div>
    </header>
    <div class="buttonArea" v-show="!loanShow">
      <div class="title">仪器出借登记情况</div>
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
        type="primary"
        class="buttonStyle"
        @click="add()"
      >
        +新增登记记录
      </el-button>
    </div>
    <div class="tableArea" v-show="!loanShow">
      <el-table
        :data="loanRegistrationList.data"
        style="width: 100%"
        :header-cell-style="{ background: '#EFEFEF', color: '#000' }"
        :cell-style="cellStyle"
        @expand-change="load"
        row-key="id"
        :tree-props="{ children: 'list', hasChildren: 'hasChildren' }"
        @sort-change="sortChange"
      >
        <el-table-column width="30"></el-table-column>
        <el-table-column
          type=""
          label="借单号"
          prop="record_number"
          show-overflow-tooltip
          width="160"
        ></el-table-column>
        <el-table-column type="" label="出借人" prop="lender" show-overflow-tooltip width="100"></el-table-column>
        <el-table-column type="" label="出借仪器信息" width="150" prop="info" show-overflow-tooltip>
          <template #default="scope">
            <span v-show="scope.row.list">
              {{ scope.row.species + '种、' + scope.row.total + '个' }}
            </span>
            <span v-show="!scope.row.list">
              {{
                scope.row.name + '(' + scope.row.asset_number + ')' + scope.row.specification + scope.row.total + '个'
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          type=""
          label="预计归还时间"
          prop="plan_end_time"
          sortable="custom"
          width="130"
          show-overflow-tooltip
        >
          <template #default="scope">
            {{ scope.row.plan_end_time?.split(' ')[0] }}
          </template>
        </el-table-column>
        <el-table-column
          type=""
          label="实际归还时间"
          prop="end_time"
          width="160"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column type="" label="归还状态" prop="status" sortable="custom" width="100" show-overflow-tooltip>
          <template #default="scope">
            <div v-show="!scope.row.list">
              <span v-show="scope.row.status === 1">{{ '未归还' }}</span>
              <span v-show="scope.row.status === 2">
                {{ '部分归还' }}
              </span>
              <span v-show="scope.row.status === 3">
                {{ '全部归还' }}
              </span>
            </div>
            <div v-show="scope.row.list">
              <div v-show="scope.row.status === 3">
                <span>{{ '已归还' }}</span>
              </div>
              <div v-show="scope.row.status === 2">
                <span>{{ '部分归还' }}</span>
              </div>
              <div v-show="scope.row.status === 1">
                <span>{{ '未归还' }}</span>
              </div>
              <!-- <div v-show="scope.row.list && scope.row.return_total === 0">
                <span v-show="scope.row.status === 0">{{ '未归还' }}</span>
                <span v-show="scope.row.status === 1">{{ '未归还(已转维修)' }}</span>
                <span v-show="scope.row.status === 2">{{ '未归还(已转保养)' }}</span>
                <span v-show="scope.row.status === 3">{{ '未归还(已转报废)' }}</span>
                <span v-show="scope.row.status === 4">{{ '未归还(已转损坏)' }}</span>
              </div> -->
            </div>
          </template>
        </el-table-column>
        <el-table-column
          type=""
          label="登记时间"
          prop="create_time"
          sortable="custom"
          width="160"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column type="" label="登记人" prop="user_name" show-overflow-tooltip width="100"></el-table-column>
        <el-table-column type="" label="借单状态" prop="is_del" show-overflow-tooltip width="100">
          <template #default="scope">
            <div v-show="scope.row.list">
              <span v-show="scope.row.status !== 3" style="color: #de4747">
                {{ '未结束' }}
              </span>
              <span v-show="scope.row.status === 3" style="color: #333333">{{ '已结束' }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column type="" label="操作" width="160">
          <template #default="scope">
            <div v-show="scope.row.record_number">
              <div style="color: #05c65d; float: left; cursor: pointer" @click="operate(scope.row.id, 1)">查看详情</div>
              <div
                v-if="![1].includes(store.state.login.userInfo.role_id)"
                v-show="scope.row.status === 3"
                style="color: #05c65d; float: left; margin-left: 20px; cursor: pointer"
                @click="operate(scope.row.id, 2)"
              >
                删除
              </div>
              <div v-show="scope.row.status !== 3" style="color: #626572; float: left; margin-left: 20px">删除</div>
              <div
                v-if="![1].includes(store.state.login.userInfo.role_id)"
                v-show="scope.row.status !== 3"
                style="color: #05c65d; float: right; cursor: pointer"
                @click="operate(scope.row.id, 3)"
              >
                归还
              </div>
              <div
                v-if="![1].includes(store.state.login.userInfo.role_id)"
                v-show="scope.row.status === 3"
                style="color: #626572; float: right"
              >
                归还
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pageSize" v-show="!loanShow">
      <el-pagination
        v-model:currentPage="currentPage"
        :page-size="15"
        :disabled="disabled"
        :background="background"
        layout="prev, pager, next, jumper"
        :total="total"
        :hide-on-single-page="true"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <addRegistration
      ref="addList"
      v-if="loanShow === true"
      :searchValue="loanValue"
      :addShow="loanShow === true"
      @back="back()"
    ></addRegistration>
    <returnRegistration
      v-if="operationStatus === 3"
      :returnShow="operationStatus === 3"
      :selectInstrumentId="selectInstrumentId"
      @back="back()"
    ></returnRegistration>
    <registrationDetail
      v-if="operationStatus === 1"
      :detailShow="operationStatus === 1"
      :selectInstrumentId="selectInstrumentId"
      @back="back()"
    ></registrationDetail>
  </div>
</template>
<script lang="ts" setup>
import { ref, toRefs, reactive } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
import addRegistration from './component/add.vue'
import returnRegistration from './component/return.vue'
import registrationDetail from './component/detail.vue'
import { ElMessageBox } from 'element-plus'
import { getLendList, delInstrumentList } from '@/service/instrument-manage/lendRegistration/index'
import { lendData } from '@/service/instrument-manage/lendRegistration/types'
import { useStore } from '@store/index'
import localCache from '@/utils/localCache'
import axios from 'axios'

const store = useStore()

let loanShow = ref(false)
let loanValue = ref('')
let operationStatus = ref(0)
let selectInstrumentId = ref(0)
let currentPage = ref(1)
let total = ref(0)
const background = ref(true)
const disabled = ref(false)
const subjectID: any = ref(0)

subjectID.value = JSON.parse(sessionStorage.getItem('state') || '').login.userInfo.subject_id

const dataMap = reactive({
  loanRegistrationList: lendData,
  styleList: Array<{
    id: number
    status: boolean
  }>()
})
let { styleList } = toRefs(dataMap)
const loanRegistrationList: any = ref({})
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
const initLendList = (value: string) => {
  loanRegistrationList.value = {}
  getLendList({ keyword: value, page: currentPage.value, ...sortData }).then((res) => {
    res.data.data.forEach((e) => {
      e.list.forEach((i) => {
        delete i.id
      })
    })
    total.value = res.data.total
    loanRegistrationList.value = res.data
    styleList.value.length = loanRegistrationList.value.data.length
    console.log(loanRegistrationList.value)
  })
}

initLendList('')

const exportExcel = () => {
  const token = localCache.getCookie('swr_token')
  axios
    .post(
      process.env.VUE_APP_BASE_URL_BASE + '/schooldvc/SchoolInstrumentsLend/instrumentLendList',
      { token, keyword: loanValue.value, page: currentPage.value, ...sortData, is_explode: 1 },
      { responseType: 'blob' }
    )
    .then((res) => {
      const blob = new Blob([res.data]) // 处理文档流
      const fileName = store.state.login.userInfo.school.name + '-' + '仪器出借登记.xlsx'
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

const loanRegistrationBack = () => {
  loanShow.value = false
}

const cellStyle = (row: any) => {
  if (!row.row.list) {
    return {
      background: '#DCECE3',
      height: '40px'
    }
  } else {
    //改变展开行背景色
    for (const key in styleList.value) {
      if (row.row.id === styleList.value[key].id) {
        if (styleList.value[key].status === true) {
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

const load = (row: any, expandedRows: boolean) => {
  loanRegistrationList.value.data.forEach((e: any, index: any) => {
    if (e.id === row.id) {
      styleList.value[index] = { id: row.id, status: expandedRows }
    }
  })
}

const operate = (id: number, status: number) => {
  operationStatus.value = status
  selectInstrumentId.value = id
  if (status === 2) {
    ElMessageBox.confirm('确定删除此记录，删除后无法撤销', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }).then(() => {
      delInstrumentList({ id: id }).then(() => {
        initLendList(loanValue.value)
      })
    })
  }
}

const addList = ref()

const search = () => {
  if (loanShow.value === true) {
    addList.value?.search(subjectID.value)
  } else {
    initLendList(loanValue.value)
  }
}

const add = () => {
  loanShow.value = true
  setTimeout(() => {
    addList.value?.search(subjectID.value)
  }, 10)
}

const handleSizeChange = () => {
  console.log('')
}

const handleCurrentChange = () => {
  initLendList(loanValue.value)
}

const back = () => {
  operationStatus.value = 0
  loanShow.value = false
  initLendList('')
}
</script>
<style lang="scss" scoped>
header {
  width: 100%;
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
  .fl {
    float: left;
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
