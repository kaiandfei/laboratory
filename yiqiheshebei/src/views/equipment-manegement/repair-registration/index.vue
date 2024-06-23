<template>
  <div>
    <header>
      <div class="fl">
        <span>设备管理</span>
        <el-icon><arrow-right /></el-icon>
        <span v-show="!repairShow">维修保养登记</span>
        <span v-show="repairShow" @click="repairRegistrationBack" style="cursor: pointer">维修保养登记</span>
        <el-icon v-show="repairShow"><arrow-right /></el-icon>
        <span v-show="repairShow">新增</span>
      </div>
      <!-- <div class="searchArea">
        <el-input v-model="repairValue" placeholder="搜索" />
        <img class="search" src="@assets/images/common/search.png" alt="搜索" @click="search" />
      </div> -->
    </header>
    <div class="sel-box" v-show="!repairShow">
      <div class="operation">
        <span>设备维修保养登记情况</span>
        <div class="button-box">
          <div v-if="[1, 2].includes(store.state.login.userInfo.role_id)" class="btn_z green-btn" @click="exportExcel">
            导出
          </div>
          <div
            v-if="![1].includes(store.state.login.userInfo.role_id)"
            class="btn_z green-btn"
            @click="repairShow = true"
          >
            新增登记记录
          </div>
        </div>
      </div>
      <div class="screen">
        <div class="sel-r">
          <div class="mt-4">
            <el-input v-model="repairValue" placeholder="请输入关键字" class="input-with-select">
              <template #append>
                <!-- <el-button :icon="Search"></el-button> -->
                <div class="ser-icon">
                  <img src="@assets/images/account-school/search.png" @click="search" alt="" />
                </div>
              </template>
            </el-input>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="buttonArea" v-show="!repairShow">
      <span class="title">设备维修保养登记情况</span>
      <el-button
        v-if="![1].includes(store.state.login.userInfo.role_id)"
        class="buttonStyle"
        type="primary"
        @click="repairShow = true"
      >
        新增登记记录
      </el-button>
    </div> -->
    <div class="tableArea" v-show="!repairShow">
      <el-table
        :data="repairRegistrationList.data"
        style="width: 100%"
        :header-cell-style="{ background: '#EFEFEF', color: '#000' }"
        :cell-style="cellStyle"
        row-key="id"
        :tree-props="{ children: 'list', hasChildren: 'hasChildren' }"
        @sort-change="sortChange"
      >
        <el-table-column label="" prop="" width="45" align="right"></el-table-column>
        <el-table-column
          label="维修保养单号"
          prop="record_number"
          align="left"
          show-overflow-tooltip
          width="160"
        ></el-table-column>
        <el-table-column label="负责企业" prop="factory" align="left" show-overflow-tooltip></el-table-column>
        <el-table-column label="设备信息" align="left" show-overflow-tooltip>
          <template #default="scope">
            <span v-show="scope.row.list">{{ scope.row.species + '件' }}</span>
            <span v-show="!scope.row.list">
              {{ scope.row.name }} {{ '(' + scope.row.asset_number + ')' }}{{ scope.row.specification }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="损坏情况" prop="desc" align="left" show-overflow-tooltip></el-table-column>
        <el-table-column
          label="预计完成时间"
          prop="plan_end_time"
          align="left"
          width="130"
          sortable="custom"
          show-overflow-tooltip
        >
          <template #default="scope">
            {{ scope.row.plan_end_time?.split(' ')[0] }}
          </template>
        </el-table-column>
        <el-table-column
          label="实际完成时间"
          prop="complete_time"
          align="left"
          show-overflow-tooltip
          width="160"
        ></el-table-column>
        <el-table-column label="状态" prop="status" align="left" sortable="custom" show-overflow-tooltip>
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
          align="left"
          sortable="custom"
          show-overflow-tooltip
          width="160"
        ></el-table-column>
        <el-table-column
          label="登记人"
          prop="user_name"
          align="left"
          show-overflow-tooltip
          width="100"
        ></el-table-column>
        <el-table-column label="维修单状态" prop="" align="left" show-overflow-tooltip width="100">
          <template #default="scope">
            <div v-if="scope.row.list">
              <span v-show="scope.row.status === 3">已结束</span>
              <span style="color: red" v-show="scope.row.status !== 3">未结束</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="210" prop="" align="left">
          <template #default="scope">
            <div v-show="scope.row.list">
              <span style="margin: 0 10px; color: #05c65d; cursor: pointer" @click="operate(scope.row.id, 1)">
                查看详情
              </span>
              <span
                v-if="![1].includes(store.state.login.userInfo.role_id)"
                v-show="scope.row.status !== 3"
                style="color: #05c65d; cursor: pointer"
                @click="operate(scope.row.id, 3)"
              >
                维修完成
              </span>
              <span
                v-if="![1].includes(store.state.login.userInfo.role_id) && scope.row.status === 3"
                style="color: #de4747; margin: 0 10px; cursor: pointer"
                @click="operate(scope.row.id, 2)"
              >
                删除
              </span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="!repairShow" class="pageSize">
      <el-pagination
        background
        layout="total, prev, pager, next, jumper"
        v-model:currentPage="currentPage"
        @current-change="handleCurrentChange1"
        :hide-on-single-page="true"
        :page-size="15"
        :total="total"
      ></el-pagination>
    </div>
    <addRegistration
      v-if="repairShow === true"
      ref="addList"
      :addShow="repairShow === true"
      @back="back()"
    ></addRegistration>
    <registrationDetail
      v-if="operationStatus === 1"
      :detailShow="operationStatus === 1"
      :selectID="selectID"
      @back="back()"
    ></registrationDetail>
    <RepairFinish
      v-if="operationStatus === 3"
      :repair-show="operationStatus === 3"
      :selectID="selectID"
      @back="back()"
    ></RepairFinish>
  </div>
</template>
<script lang="ts" setup>
import { ref, toRefs, reactive } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
import addRegistration from './component/add.vue'
import RepairFinish from './component/repair-finish.vue'
// import repairRegistration from './component/repair.vue'
import registrationDetail from './component/detail.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { repairRegistrationData } from '../../../service/equ-manage/repairRegistration/types'
import { getRepairRegistrationList, deleteRepairList } from '@service/equ-manage/repairRegistration'
import { useStore } from '@store/index'
import localCache from '@/utils/localCache'
import axios from 'axios'

const store = useStore()

let repairShow = ref(false)
let repairValue = ref('')
let operationStatus = ref(0)
let selectID = ref(0)
let currentPage = ref(1)
let total = ref(0)

const dataMap = reactive({
  repairRegistrationList: repairRegistrationData
})
let { repairRegistrationList } = toRefs(dataMap)
let sortData: any = reactive({})
const sortChange = ({ column, prop, order }) => {
  if (prop !== null) {
    sortData = {}
    if (order === 'descending') {
      sortData[`order_${prop}`] = 2
    } else {
      sortData[`order_${prop}`] = 1
    }
    initData()
    console.log(column, prop, order)
  }
}
const initData = () => {
  repairRegistrationList.value = {}
  getRepairRegistrationList({ keyword: repairValue.value, page: currentPage.value, ...sortData }).then((res) => {
    repairRegistrationList.value = res.data
    total.value = res.data.total
  })
}

initData()

const exportExcel = () => {
  const token = localCache.getCookie('swr_token')
  axios
    .post(
      process.env.VUE_APP_BASE_URL_BASE + '/schooldvc/SchoolEquipmentMaintain/equipmentMaintainList',
      { token, keyword: repairValue.value, page: currentPage.value, ...sortData, is_explode: 1 },
      { responseType: 'blob' }
    )
    .then((res) => {
      const blob = new Blob([res.data]) // 处理文档流
      const fileName = store.state.login.userInfo.school.name + '-' + '设备维修保养登记.xlsx'
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
        deleteRepairList({ id: selectID.value }).then((res) => {
          if (res.code === 10) {
            ElMessage({ type: 'success', message: '删除成功' })
            initData()
          }
        })
      })
      .catch(() => {
        console.log('')
      })
  }
}

// 表格行展示改变颜色
const cellStyle = (row: any) => {
  if (!row.row.list) {
    return { background: '#DCECE3' }
  }
}

const addList = ref()

const search = () => {
  if (repairShow.value === true) {
    addList.value?.getEquAll(repairValue.value)
  } else {
    initData()
  }
}

const handleCurrentChange1 = () => {
  initData()
}

const back = () => {
  initData()
  operationStatus.value = 0
  repairShow.value = false
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
  width: 100%;
  height: 60px;
  float: left;
  margin-top: 10px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  background-color: #dcece3;
  box-sizing: border-box;
  span {
    font-size: 20px;
    height: 20%;
    width: 20%;
    float: left;
    display: flex;
    align-items: center;
    font-weight: bold;
    color: #05c65d;
  }
  .buttonStyle {
    float: right;
    width: 10%;
    height: 100%;
    border-radius: 10px;
    height: 30px;
    margin-left: 70%;
  }
}
.pageSize {
  margin-top: 10px;
  text-align: right;
}
.sel-box {
  // margin-bottom: 30px;
  margin: 10px 0;
  width: 100%;
  height: 120px;
  .operation {
    float: left;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    background-color: rgb(220, 236, 227);
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    & > span {
      float: left;
      margin-left: 1.8%;
      font-size: 20px;
      color: #05c65d;
      font-weight: bold;
    }
    .button-box {
      display: flex;
      justify-content: space-between;
      div {
        margin-right: 20px;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        img {
          margin-right: 4px;
          width: 20px;
          height: 20px;
        }
      }
    }
  }
  .screen {
    height: 60px;
    width: 100%;
    background-color: #fff;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    clear: both;
    .sel-l {
      float: left;
      width: 80%;
      .sel-item {
        float: left;
        margin-top: 16px;
        width: 25%;
        display: flex;
        justify-content: space-between;
        & > span {
          float: left;
          width: 20%;
          height: 30px;
          line-height: 30px;
          text-align: right;
          color: #848484;
        }
        .sel {
          float: left;
          margin-right: 10%;
          width: 60%;
        }
      }
    }
    .sel-r {
      float: right;
      width: 20%;
      .mt-4 {
        margin: 16px auto;
        width: calc(100% - 40px);
        .ser-icon {
          padding: 0 10px;
          cursor: pointer;
          img {
            width: 20px;
            height: 20px;
          }
        }
      }
    }
  }
}
</style>
