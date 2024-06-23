<template>
  <div>
    <header>
      <div class="fl">
        <span>仪器管理</span>
        <el-icon><arrow-right /></el-icon>
        <span v-show="!compensateShow">损坏、赔偿登记</span>
        <span v-show="compensateShow" @click="compensateRegistrationBack" style="cursor: pointer">损坏、赔偿登记</span>
        <el-icon v-show="compensateShow"><arrow-right /></el-icon>
        <span v-show="compensateShow">新增</span>
      </div>
      <div class="searchArea">
        <el-input v-model="compensateValue" placeholder="搜索" />
        <img class="search" src="@assets/images/common/search.png" alt="搜索" @click="search" />
      </div>
    </header>
    <div class="buttonArea" v-show="!compensateShow">
      <span class="title">仪器损坏、赔偿登记情况</span>
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
    <div class="tableArea" v-show="!compensateShow">
      <el-table
        :data="compensateRegistrationList.data"
        style="width: 100%"
        :header-cell-style="{ background: '#EFEFEF', color: '#000' }"
        :cell-style="cellStyle"
        row-key="id"
        @expand-change="load"
        :tree-props="{ children: 'list', hasChildren: 'hasChildren' }"
        @sort-change="sortChange"
      >
        <el-table-column width="30"></el-table-column>

        <el-table-column label="损坏赔偿单号" width="160" prop="record_number" show-overflow-tooltip></el-table-column>
        <el-table-column label="总价值" prop="cost" show-overflow-tooltip width="100">
          <template #default="scope">
            <span v-show="scope.row.list">{{ Number(scope.row.cost).toFixed(2) }}</span>
            <span v-show="!scope.row.list">{{ Number(scope.row.unit_price) * scope.row.total }}</span>
          </template>
        </el-table-column>
        <el-table-column label="仪器信息" show-overflow-tooltip>
          <template #default="scope">
            <span v-show="scope.row.list">{{ scope.row.species + '种' }} {{ scope.row.total + '个' }}</span>
            <span v-show="!scope.row.list">
              {{ scope.row.name }} {{ '(' + scope.row.asset_number + ')' }}{{ scope.row.specification }}
              {{ scope.row.total + '个' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="损坏情况与原因" :show-overflow-tooltip="true" prop="desc" width="120"></el-table-column>
        <el-table-column label="损坏人" prop="damage_man" show-overflow-tooltip width="130"></el-table-column>
        <el-table-column label="赔偿人" prop="repay_man" show-overflow-tooltip width="130"></el-table-column>
        <el-table-column label="赔偿金额" prop="repay_price" show-overflow-tooltip width="100"></el-table-column>
        <el-table-column label="赔偿时间" prop="repay_time" width="120" sortable="custom" show-overflow-tooltip>
          <template #default="scope">
            {{ scope.row.repay_time?.split(' ')[0] }}
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" sortable="custom" show-overflow-tooltip width="100">
          <template #default="scope">
            <span v-show="scope.row.status">{{ scope.row.status === 1 ? '未赔偿' : '已赔偿' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="登记时间"
          prop="create_time"
          width="160"
          sortable="custom"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="登记人" prop="user_name" show-overflow-tooltip width="130"></el-table-column>
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
      v-if="compensateShow === true"
      :search-value="compensateValue"
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
import { ElMessageBox } from 'element-plus'
import { getDamageRegistrationList, deleteDamageList } from '@/service/instrument-manage/damageRegistration/index'
import { damageRegistrationData } from '@/service/instrument-manage/damageRegistration/types'
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
const background = ref(true)
const disabled = ref(false)
const subjectID: any = ref(0)

subjectID.value = JSON.parse(sessionStorage.getItem('state') || '').login.userInfo.subject_id

const dataMap = reactive({
  compensateRegistrationList: damageRegistrationData,
  styleList: Array<{
    id: number
    status: boolean
  }>()
})
let { compensateRegistrationList, styleList } = toRefs(dataMap)
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
  compensateRegistrationList.value = {}
  getDamageRegistrationList({ keyword: value, page: currentPage.value, ...sortData }).then((res) => {
    compensateRegistrationList.value = res.data
    compensateRegistrationList.value.data.forEach((e) => {
      e.list.forEach((n) => {
        delete n.id
      })
    })
    total.value = res.data.total
    styleList.value.length = res.data.data.length
    console.log(compensateRegistrationList.value, '初始数据')
  })
}

initData('')

const exportExcel = () => {
  const token = localCache.getCookie('swr_token')
  axios
    .post(
      process.env.VUE_APP_BASE_URL_BASE + '/schooldvc/SchoolInstrumentsDamage/instrumentDamageList',
      { token, keyword: compensateValue.value, page: currentPage.value, ...sortData, is_explode: 1 },
      { responseType: 'blob' }
    )
    .then((res) => {
      const blob = new Blob([res.data]) // 处理文档流
      const fileName = store.state.login.userInfo.school.name + '-' + '仪器损坏赔偿登记.xlsx'
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
  console.log('')
}

const handleSizeChange = () => {
  console.log('')
}

const handleCurrentChange = () => {
  initData(compensateValue.value)
}

// 表格行展示改变颜色
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
  compensateRegistrationList.value.data.forEach((e, index) => {
    if (e.id === row.id) {
      styleList.value[index] = { id: row.id, status: expandedRows }
    }
  })
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
          initData('')
        }
      })
    })
  }
}

const addList = ref()

const search = () => {
  if (compensateShow.value === false) {
    getDamageRegistrationList({ keyword: compensateValue.value, page: currentPage.value, ...sortData }).then((res) => {
      compensateRegistrationList.value = res.data
      total.value = res.data.total
    })
  } else {
    addList.value?.search(subjectID.value)
  }
}
const add = () => {
  compensateShow.value = true
  setTimeout(() => {
    addList.value?.search(subjectID.value)
  }, 10)
}

const back = () => {
  operationStatus.value = 0
  initData('')
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
