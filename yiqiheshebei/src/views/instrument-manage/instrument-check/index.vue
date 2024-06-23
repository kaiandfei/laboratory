<template>
  <div>
    <header v-show="pageState === 0">
      <span>仪器管理 > 仪器盘点</span>
    </header>
    <main v-show="pageState === 0">
      <div class="titleArea">
        <div class="title">仪器盘点</div>
        <div v-if="[1, 2].includes(store.state.login.userInfo.role_id)" class="btn" @click="exportExcel()">导出</div>
      </div>
      <el-table
        :data="accountList"
        style="width: 100%"
        :row-style="{ height: '80px' }"
        :header-cell-style="{ background: '#EFEFEF', height: '80px' }"
      >
        <el-table-column align="left" type="index" label="序号"></el-table-column>
        <el-table-column align="left" prop="subject_name" label="学科"></el-table-column>
        <el-table-column align="left" prop="status" label="盘点状态">
          <template #default="scope">
            <span v-show="scope.row.status === 1">待开始</span>
            <span v-show="scope.row.status === 2">进行中</span>
            <span v-show="scope.row.status === 3">已结束</span>
          </template>
        </el-table-column>
        <el-table-column align="left" prop="times" label="盘点次数">
          <template #default="scope">
            <span v-show="scope.row.status === 1">/</span>
            <span v-show="scope.row.status !== 1">{{ scope.row.times }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" prop="total" label="盘点种类">
          <template #default="scope">
            <span v-show="scope.row.status === 1">/</span>
            <span v-show="scope.row.status !== 1">{{ scope.row.total }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" prop="create_time" label="上次盘点时间">
          <template #default="scope">
            <span v-show="scope.row.status === 1">/</span>
            <span v-show="scope.row.status !== 1">{{ scope.row.create_time }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="" label="操作">
          <template #default="scope">
            <span
              class="title"
              v-if="[2].includes(store.state.login.userInfo.role_id)"
              v-show="scope.row.status !== 2"
              @click="checkCreate(scope.row.id, '开始盘点', scope.row.subject_name, 1, scope.row.subject_id)"
            >
              开始盘点
            </span>
            <span
              class="title"
              v-if="[2].includes(store.state.login.userInfo.role_id)"
              v-show="scope.row.status === 2"
              @click="checkCreate(scope.row.id, '继续盘点', scope.row.subject_name, 2, scope.row.subject_id)"
            >
              继续盘点
            </span>
            <span
              class="title"
              style="color: #ee9a59"
              v-if="[2].includes(store.state.login.userInfo.role_id)"
              @click="endCheck(scope.row.id)"
              v-show="scope.row.status === 2"
            >
              结束盘点
            </span>
            <span v-show="scope.row.status !== 1" class="title" @click="showDetail(scope.row.subject_id)">查看</span>
          </template>
        </el-table-column>
      </el-table>
    </main>
    <Detail ref="detailArea" :detailShow="pageState === 2" @back="back()"></Detail>
    <Check
      ref="checkArea"
      :checkShow="pageState === 1"
      :subjectName="subjectName"
      :title="title"
      @back="back()"
    ></Check>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import Detail from './component/detail.vue'
import Check from './component/checkCreation.vue'
import { getCheckList, endCheckData, addCheckData } from '../../../service/instrument-manage/instrument-check/index'
import { useStore } from '@store/index'
import localCache from '@/utils/localCache'
import axios from 'axios'

const store = useStore()

let title = ref('开始建账')
let selectId = ref(0)
const accountList: any = ref([])
let pageState: any = ref(0)
const subjectName: any = ref('')
const subjectID: any = ref(0)

subjectID.value = JSON.parse(sessionStorage.getItem('state') || '').login.userInfo.subject_id

const detailArea = ref()
const showDetail = (ID: any) => {
  selectId.value = ID
  pageState.value = 2
  detailArea.value.initData(ID)
}

const initData = () => {
  getCheckList({ type: 1, subject_id: subjectID.value }).then((res: any) => {
    accountList.value = res.data
  })
}

initData()

const exportExcel = () => {
  const token = localCache.getCookie('swr_token')
  axios
    .post(
      process.env.VUE_APP_BASE_URL_BASE + '/schooldvc/SchoolInventory/recordTotalBySubject',
      { token, type: 1, subject_id: subjectID.value, is_explode: 1 },
      { responseType: 'blob' }
    )
    .then((res) => {
      const blob = new Blob([res.data]) // 处理文档流
      const fileName = store.state.login.userInfo.school.name + '-' + '仪器盘点.xlsx'
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

// 结束盘点
const endCheck = (ID: number) => {
  endCheckData({ inventory_total_id: ID, type: 2 })
  setTimeout(() => {
    initData()
  }, 100)
}

const checkArea = ref()
//开始或者继续盘点
const checkCreate = (ID: any, value: string, name: string, type: number, subjectID: number) => {
  title.value = value
  subjectName.value = name
  if (type === 1) {
    addCheckData({ type: 1, subject_id: subjectID }).then((res) => {
      if (res.code === 10) {
        pageState.value = 1
        selectId.value = Number(res.data.inventory_total_id)
        checkArea.value.initData(selectId.value)
      }
    })
  } else {
    pageState.value = 1
    selectId.value = ID
    checkArea.value.initData(ID)
  }
}

// 界面切换
const back = () => {
  pageState.value = 0
  initData()
}
</script>
<style lang="scss" scoped>
header {
  height: 30px;
  & > span {
    float: left;
    margin-right: 6px;
    font-size: 16px;
    color: #626572;
  }
}
main {
  width: 100%;
  .titleArea {
    padding: 0 30px;
    width: 100%;
    height: 80px;
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #dcece3;
    box-sizing: border-box;
    .title {
      font-size: 20px;
      height: 30px;
      font-weight: bold;
      color: #05c65d;
    }
  }
  .title {
    cursor: pointer;
    color: #05c65d;
    font-size: 14px;
  }
}
.btn {
  padding: 0 30px;
  height: 36px;
  line-height: 36px;
  background: #05c65d;
  color: #ffffff;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
  opacity: 1;
  border-radius: 10px;
  cursor: pointer;
}
</style>
