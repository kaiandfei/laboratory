<template>
  <div>
    <header>
      <div class="fl">
        <span>设备管理</span>
        <el-icon><arrow-right /></el-icon>
        <span v-show="!scrapShow">损耗、报废登记</span>
        <span v-show="scrapShow" @click="scrapRegistrationBack" style="cursor: pointer">损耗、报废登记</span>
        <el-icon v-show="scrapShow"><arrow-right /></el-icon>
        <span v-show="scrapShow">新增</span>
      </div>
      <!-- <div class="searchArea">
        <input v-model="scrapValue" placeholder="请输入关键字" style="float: left; width: 60%; height: 30px" />
        <el-button type="primary" @click="search" style="float: right; width: 20%; height: 30px">
          <img src="@/assets/images/common/search.png" />
        </el-button>
        <el-input v-model="scrapValue" placeholder="搜索" />
        <img class="search" src="@assets/images/common/search.png" alt="搜索" @click="search" />
      </div> -->
    </header>
    <div class="sel-box" v-show="!scrapShow">
      <div class="operation">
        <span>设备损耗、报废登记情况</span>
        <div class="button-box">
          <div v-if="[1, 2].includes(store.state.login.userInfo.role_id)" class="btn_z green-btn" @click="exportExcel">
            导出
          </div>
          <div
            v-if="![1].includes(store.state.login.userInfo.role_id)"
            class="btn_z green-btn"
            @click="scrapShow = true"
          >
            新增登记记录
          </div>
        </div>
      </div>
      <div class="screen">
        <div class="sel-r">
          <div class="mt-4">
            <el-input v-model="scrapValue" placeholder="请输入关键字" class="input-with-select">
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
    <!-- <div class="buttonArea" v-show="!scrapShow">
      <span class="title">设备损耗、报废登记情况</span>
      <el-button
        v-if="![1].includes(store.state.login.userInfo.role_id)"
        class="buttonStyle"
        type="primary"
        @click="scrapShow = true"
      >
        新增登记记录
      </el-button>
    </div> -->
    <div class="tableArea" v-show="!scrapShow">
      <el-table
        :data="scrapRegistrationList.data"
        style="width: 100%"
        :header-cell-style="{ background: '#EFEFEF', color: '#000' }"
        :cell-style="cellStyle"
        row-key="id"
        :tree-props="{ children: 'list', hasChildren: 'hasChildren' }"
        @sort-change="sortChange"
      >
        <el-table-column label="" width="30"></el-table-column>
        <el-table-column label="损耗报废单号" prop="record_number" width="180" show-overflow-tooltip></el-table-column>
        <el-table-column label="总价值" prop="cost" width="80" show-overflow-tooltip></el-table-column>
        <el-table-column label="设备信息" show-overflow-tooltip>
          <template #default="scope">
            <span v-show="scope.row.list">{{ scope.row.species + '件' }}</span>
            <span v-show="!scope.row.list">
              {{ scope.row.name }} {{ '(' + scope.row.asset_number + ')' }}{{ scope.row.specification }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="报废理由" show-overflow-tooltip prop="cause">
          <template #default="scope">
            <span v-show="scope.row.cause === 1">设备超过使用年限，性能已不能达到实验需要的最低要求，且无法修复</span>
            <span v-show="scope.row.cause === 2">损坏严重，无法修复</span>
            <span v-show="scope.row.cause === 3">主要部件无处购配，无法修复使用</span>
            <span v-show="scope.row.cause === 4">修理费昂贵，无修理价值</span>
          </template>
        </el-table-column>
        <el-table-column label="处理方式" prop="process_mode" show-overflow-tooltip width="100">
          <template #default="scope">
            <span v-show="scope.row.process_mode === 1">实验室留用</span>
            <span v-show="scope.row.process_mode === 2">建立废旧设备实验室</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" sortable="custom" show-overflow-tooltip width="100">
          <template #default="scope">
            <div v-show="scope.row.list">
              <span v-show="scope.row.status === 1">未提交</span>
              <span v-show="scope.row.status === 2">待审核</span>
              <span v-show="scope.row.status === 3">已撤回</span>
              <span v-show="scope.row.status === 4">审核通过</span>
              <span v-show="scope.row.status === 5">审核未通过</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="登记时间"
          show-overflow-tooltip
          prop="create_time"
          sortable="custom"
          width="160"
        ></el-table-column>
        <el-table-column label="登记人" prop="user_name" show-overflow-tooltip width="100"></el-table-column>
        <el-table-column
          label="审核时间"
          prop="audit_time"
          show-overflow-tooltip
          sortable="custom"
          width="160"
        ></el-table-column>
        <el-table-column label="审核人" prop="audit_user_name" show-overflow-tooltip width="100"></el-table-column>
        <el-table-column label="操作" width="190" prop="" align="center">
          <template #default="scope">
            <div v-show="scope.row.list" class="click-box">
              <div @click="operate(scope.row.id, 1)">详情</div>
              <div
                v-if="![1].includes(store.state.login.userInfo.role_id)"
                v-show="scope.row.status === 1"
                @click="operate(scope.row.id, 2)"
              >
                编辑
              </div>
              <!-- <div
                v-if="![1].includes(store.state.login.userInfo.role_id)"
                v-show="scope.row.status !== 1"
                style="color: #626572; float: left; margin-left: 20px"
              >
                编辑
              </div> -->
              <div
                v-if="![1].includes(store.state.login.userInfo.role_id)"
                v-show="scope.row.status > 2"
                style="color: #de4747"
                @click="operate(scope.row.id, 3)"
              >
                删除
              </div>
              <!-- <div
                v-if="![1].includes(store.state.login.userInfo.role_id)"
                v-show="scope.row.status === 2"
                style="color: #626572; float: left; margin-left: 20px"
              >
                删除
              </div> -->
              <div
                v-if="![1].includes(store.state.login.userInfo.role_id)"
                v-show="scope.row.status === 1"
                @click="operate(scope.row.id, 4)"
              >
                提交
              </div>
              <div
                v-if="![1].includes(store.state.login.userInfo.role_id)"
                v-show="scope.row.status === 2"
                style="color: #ee9a59"
                @click="operate(scope.row.id, 5)"
              >
                撤回
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pageSize" v-show="!scrapShow">
      <el-pagination
        v-model:currentPage="currentPage"
        :page-size="15"
        :small="small"
        :disabled="disabled"
        :background="background"
        :hide-on-single-page="true"
        layout="prev, pager, next, jumper"
        :total="total"
        @current-change="handleCurrentChange1"
      ></el-pagination>
    </div>
    <addRegistration
      v-if="scrapShow === true"
      ref="addList"
      :addShow="scrapShow === true"
      @back="back()"
    ></addRegistration>
    <registrationDetail
      v-if="operationStatus === 1"
      :detailShow="operationStatus === 1"
      :selectID="selectID"
      @back="back()"
    ></registrationDetail>
    <scrapEdit
      v-if="operationStatus === 2"
      :editShow="operationStatus === 2"
      :selectID="selectID"
      @back="back()"
    ></scrapEdit>
  </div>
</template>
<script lang="ts" setup>
import { ref, toRefs, reactive } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
import addRegistration from './component/add.vue'
import scrapEdit from './component/edit.vue'
// import scrapRegistration from './component/scrap.vue'
import registrationDetail from './component/detail.vue'
import { ElMessageBox } from 'element-plus'
import { scrapRegistrationData } from '../../../service/equ-manage/scrapRegistration/types'
import {
  getScrapRegistrationlist,
  deleteScrapList,
  withdrawScrapInfo,
  submitScrapInfo
} from '../../../service/equ-manage/scrapRegistration/index'
import { useStore } from '@store/index'
import localCache from '@/utils/localCache'
import axios from 'axios'
const store = useStore()

let scrapShow = ref(false)
let scrapValue = ref('')
let operationStatus = ref(0)
let selectID = ref(1)
let currentPage = ref(1)
let total = ref(0)
const small = ref(true)
const background = ref(true)
const disabled = ref(false)

const dataMap = reactive({
  scrapRegistrationList: scrapRegistrationData
})
let { scrapRegistrationList } = toRefs(dataMap)
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
  scrapRegistrationList.value = {}
  getScrapRegistrationlist({ keyword: value, page: currentPage.value, ...sortData }).then((res) => {
    scrapRegistrationList.value = res.data
    total.value = res.data.total
  })
}

initData('')

const exportExcel = () => {
  const token = localCache.getCookie('swr_token')
  axios
    .post(
      process.env.VUE_APP_BASE_URL_BASE + '/schooldvc/SchoolEquipmentScrap/equipmentScrapList',
      { token, keyword: scrapValue.value, page: currentPage.value, ...sortData, is_explode: 1 },
      { responseType: 'blob' }
    )
    .then((res) => {
      const blob = new Blob([res.data]) // 处理文档流
      const fileName = store.state.login.userInfo.school.name + '-' + '设备损耗报废登记.xlsx'
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

const scrapRegistrationBack = () => {
  scrapShow.value = false
}

const operate = (id: number, status: number) => {
  selectID.value = id
  operationStatus.value = status
  if (status === 3) {
    ElMessageBox.confirm('确定删除此记录，删除后无法撤销', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }).then(() => {
      deleteScrapList({ id: selectID.value }).then((res) => {
        if (res.code === 10) {
          initData('')
        }
      })
    })
  }
  if (status === 5) {
    ElMessageBox.confirm('确定撤回这条信息，撤回后可重新提交', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }).then(() => {
      withdrawScrapInfo({ id: selectID.value }).then((res) => {
        if (res.code === 10) {
          initData('')
        }
      })
    })
  }
  if (status === 4) {
    ElMessageBox.confirm('确定提交这条信息，提交后可撤回', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }).then(() => {
      submitScrapInfo({ id: selectID.value }).then((res) => {
        if (res.code === 10) {
          initData('')
        }
      })
    })
  }
}

// 表格行展示改变颜色
const cellStyle = (row: any) => {
  if (!row.row.list) {
    return {
      background: '#DCECE3'
    }
  }
}

const addList = ref()

const search = () => {
  if (scrapShow.value === true) {
    addList.value?.getEquAll(scrapValue.value)
  } else {
    // getScrapRegistrationlist({ keyword: scrapValue.value, page: currentPage.value }).then((res) => {
    //   scrapRegistrationList.value = res.data
    // })
    initData(scrapValue.value)
  }
}

const handleCurrentChange1 = () => {
  initData('')
}

const back = () => {
  initData('')
  operationStatus.value = 0
  scrapShow.value = false
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
  width: 100%;
  height: 60px;
  float: left;
  margin-top: 20px;
  display: flex;
  align-items: center;
  background-color: #dcece3;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
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
  margin: 28px 0 16px;
  text-align: right;
}
.sel-box {
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
.tableArea {
  .click-box {
    display: flex;
    & > div {
      margin: 0 10px;
      color: #05c65d;
      cursor: pointer;
    }
  }
}
</style>
