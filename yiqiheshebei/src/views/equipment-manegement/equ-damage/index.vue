<template>
  <div>
    <header>
      <div class="fl">
        <span>设备管理</span>
        <el-icon><arrow-right /></el-icon>
        <span v-show="!compensateShow">损坏、赔偿登记</span>
        <span v-show="compensateShow" @click="compensateRegistrationBack" style="cursor: pointer">损坏、赔偿登记</span>
        <el-icon v-show="compensateShow"><arrow-right /></el-icon>
        <span v-show="compensateShow">新增</span>
      </div>
      <!-- <div class="searchArea">
        <el-input v-model="compensateValue" placeholder="搜索" />
        <img class="search" src="@assets/images/common/search.png" alt="搜索" @click="search" />
      </div> -->
    </header>
    <div class="sel-box" v-show="!compensateShow">
      <div class="operation">
        <span>设备损坏、赔偿登记情况</span>
        <div class="button-box">
          <div v-if="[1, 2].includes(store.state.login.userInfo.role_id)" class="btn_z green-btn" @click="exportExcel">
            导出
          </div>
          <div
            v-if="![1].includes(store.state.login.userInfo.role_id)"
            class="btn_z green-btn"
            @click="compensateShow = true"
          >
            新增登记记录
          </div>
        </div>
      </div>
      <div class="screen">
        <div class="sel-r">
          <div class="mt-4">
            <el-input v-model="compensateValue" placeholder="请输入关键字" class="input-with-select">
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
    <!-- <div class="buttonArea" v-show="!compensateShow">
      <span class="title">设备损坏、赔偿登记情况</span>
      <el-button
        v-if="![1].includes(store.state.login.userInfo.role_id)"
        class="buttonStyle"
        type="primary"
        @click="compensateShow = true"
      >
        新增登记记录
      </el-button>
    </div> -->
    <div class="tableArea" v-show="!compensateShow">
      <el-table
        :data="compensateRegistrationList.data"
        style="width: 100%"
        :header-cell-style="{ background: '#EFEFEF', color: '#000' }"
        :cell-style="cellStyle"
        row-key="id"
        :tree-props="{ children: 'list', hasChildren: 'hasChildren' }"
        @sort-change="sortChange"
      >
        <el-table-column label="" prop="" width="30"></el-table-column>
        <el-table-column label="损坏赔偿单号" prop="record_number" width="180" show-overflow-tooltip></el-table-column>
        <el-table-column label="总价值" prop="cost" width="80" show-overflow-tooltip></el-table-column>
        <el-table-column label="设备信息" show-overflow-tooltip>
          <template #default="scope">
            <span v-show="scope.row.list">{{ scope.row.num + '件' }}</span>
            <span v-show="!scope.row.list">
              {{ scope.row.name }} {{ '(' + scope.row.asset_number + ')' }}{{ scope.row.specification }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="损坏情况与原因" show-overflow-tooltip prop="desc" width="130"></el-table-column>
        <el-table-column label="损坏人" prop="damage_man" show-overflow-tooltip width="100"></el-table-column>
        <el-table-column label="赔偿人" prop="repay_man" show-overflow-tooltip width="100"></el-table-column>
        <el-table-column label="赔偿金额" prop="repay_price" width="80" show-overflow-tooltip></el-table-column>
        <el-table-column label="赔偿时间" prop="repay_time" sortable="custom" show-overflow-tooltip width="100">
          <template #default="scope">
            {{ scope.row.repay_time?.split(' ')[0] }}
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" width="80" sortable="custom" show-overflow-tooltip>
          <template #default="scope">
            <span v-show="scope.row.list">{{ scope.row.status === 1 ? '未赔偿' : '已赔偿' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="登记时间"
          prop="create_time"
          sortable="custom"
          show-overflow-tooltip
          width="160"
        ></el-table-column>
        <el-table-column label="登记人" prop="user_name" show-overflow-tooltip width="100"></el-table-column>
        <el-table-column label="操作" width="160" prop="">
          <template #default="scope">
            <div v-show="scope.row.list">
              <div style="color: green; float: left; cursor: pointer" @click="operate(scope.row.id, 1)">查看详情</div>
              <div
                v-if="![1].includes(store.state.login.userInfo.role_id)"
                v-show="scope.row.status === 2"
                style="color: green; float: left; margin-left: 10px; cursor: pointer"
                @click="operate(scope.row.id, 2)"
              >
                删除
              </div>
              <div
                v-if="![1].includes(store.state.login.userInfo.role_id)"
                v-show="scope.row.status === 1"
                style="color: green; float: right; cursor: pointer"
                @click="operate(scope.row.id, 3)"
              >
                赔偿
              </div>
              <div
                v-if="![1].includes(store.state.login.userInfo.role_id)"
                v-show="scope.row.status === 2"
                style="color: #848484; float: right; cursor: pointer"
              >
                赔偿
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pageSize" v-show="!compensateShow">
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
      ref="addList"
      v-if="compensateShow === true"
      :addShow="compensateShow === true"
      @back="back()"
    ></addRegistration>
    <compensateRegistration
      v-if="operationStatus === 3"
      :compensateShow="operationStatus === 3"
      :selectID="selectID"
      @back="back()"
    ></compensateRegistration>
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
import compensateRegistration from './component/compensate.vue'
import registrationDetail from './component/detail.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getDamageRegistrationList, deleteDamageList } from '@/service/equ-manage/damageRegistration/index'
import { damageRegistrationData } from '@/service/equ-manage/damageRegistration/types'
import { useStore } from '@store/index'

import localCache from '@/utils/localCache'
import axios from 'axios'

const store = useStore()

let compensateShow = ref(false)
let compensateValue = ref('')
let operationStatus = ref(0)
let selectID = ref(0)
let currentPage = ref(1)
let total = ref(0)
const small = ref(true)
const background = ref(true)
const disabled = ref(false)

const dataMap = reactive({
  compensateRegistrationList: damageRegistrationData
})
let { compensateRegistrationList } = toRefs(dataMap)
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
  compensateRegistrationList.value = {}
  getDamageRegistrationList({ keyword: '', page: currentPage.value, ...sortData }).then((res) => {
    compensateRegistrationList.value = res.data
    total.value = res.data.total
  })
}

initData()

const exportExcel = () => {
  const token = localCache.getCookie('swr_token')
  axios
    .post(
      process.env.VUE_APP_BASE_URL_BASE + '/schooldvc/SchoolEquipmentDamage/equipmentDamageList',
      { token, keyword: '', page: currentPage.value, ...sortData, is_explode: 1 },
      { responseType: 'blob' }
    )
    .then((res) => {
      const blob = new Blob([res.data]) // 处理文档流
      const fileName = store.state.login.userInfo.school.name + '-' + '设备损坏赔偿登记.xlsx'
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

const compensateRegistrationBack = () => {
  compensateShow.value = false
}

const operate = (id: number, status: number) => {
  operationStatus.value = status
  selectID.value = id
  if (status === 2) {
    ElMessageBox.confirm('确定删除此记录，删除后无法撤销', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }).then(() => {
      deleteDamageList({ id: selectID.value }).then((res) => {
        if (res.code === 10) {
          ElMessage({
            type: 'success',
            message: '删除成功'
          })
          initData()
        }
      })
    })
  }
}

const addList = ref()

// 表格行展示改变颜色
const cellStyle = (row: any) => {
  if (!row.row.list) {
    return {
      background: '#DCECE3'
    }
  }
}

const handleCurrentChange1 = () => {
  compensateRegistrationList.value = {}
  getDamageRegistrationList({ keyword: compensateValue.value, page: currentPage.value, ...sortData }).then((res) => {
    compensateRegistrationList.value = res.data
    total.value = res.data.total
  })
}

const search = () => {
  compensateRegistrationList.value = {}
  if (compensateShow.value === false) {
    getDamageRegistrationList({ keyword: compensateValue.value, page: currentPage.value, ...sortData }).then((res) => {
      compensateRegistrationList.value = res.data
      total.value = res.data.total
    })
  } else {
    addList.value?.getEquAll(compensateValue.value)
  }
}

const back = () => {
  initData()
  operationStatus.value = 0
  compensateShow.value = false
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
.buttonArea {
  width: 100%;
  height: 60px;
  float: left;
  margin: 20px 0px 20px 0px;
  display: flex;
  align-items: center;
  background-color: #dcece3;
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
</style>
