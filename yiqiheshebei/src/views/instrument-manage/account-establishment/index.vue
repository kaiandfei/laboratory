<template>
  <div>
    <header v-show="pageState === 0">
      <span>仪器管理 > 期初仪器建帐</span>
    </header>
    <main v-show="pageState === 0">
      <div class="titleArea">
        <div class="title">期初仪器建帐</div>
        <div v-if="[2].includes(store.state.login.userInfo.role_id)" class="btn" @click="exportExcel()">导出</div>
      </div>
      <el-table
        :data="accountList"
        style="width: 100%"
        :row-style="{ height: '80px' }"
        :header-cell-style="{ background: '#EFEFEF', height: '80px' }"
      >
        <el-table-column align="left" type="index" label="序号"></el-table-column>
        <el-table-column align="left" prop="subject_name" label="学科"></el-table-column>
        <el-table-column align="left" prop="status" label="建帐状态">
          <template #default="scope">
            <span v-show="scope.row.status === 1">待开始</span>
            <span v-show="scope.row.status === 2">进行中</span>
            <span v-show="scope.row.status === 3">已结束</span>
          </template>
        </el-table-column>
        <el-table-column align="left" prop="species_num" label="建帐种类">
          <template #default="scope">
            <span v-show="scope.row.status === 1">/</span>
            <span v-show="scope.row.status !== 1">{{ scope.row.species_num }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" prop="accounts_num" label="建帐数量">
          <template #default="scope">
            <span v-show="scope.row.status === 1">/</span>
            <span v-show="scope.row.status !== 1">{{ scope.row.accounts_num }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" prop="accounts_price" label="建帐金额">
          <template #default="scope">
            <span v-show="scope.row.status === 1">/</span>
            <span v-show="scope.row.status !== 1">{{ scope.row.accounts_price }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="" label="操作">
          <template #default="scope">
            <span
              class="title"
              v-if="[2].includes(store.state.login.userInfo.role_id)"
              v-show="scope.row.status === 1"
              @click="accountCreate(scope.row.id, '开始建帐', scope.row.subject_name, scope.row.subject_id)"
            >
              开始建帐
            </span>
            <span
              class="title"
              v-if="[2].includes(store.state.login.userInfo.role_id)"
              v-show="scope.row.status === 2"
              @click="accountCreate(scope.row.id, '继续建帐', scope.row.subject_name, scope.row.subject_id)"
            >
              继续建帐
            </span>
            <span
              class="title"
              style="color: #ee9a59"
              v-if="[2].includes(store.state.login.userInfo.role_id)"
              v-show="scope.row.status === 2"
              @click="finishAccount(scope.row.id)"
            >
              结束建帐
            </span>
            <span
              v-show="scope.row.status === 3"
              class="title"
              @click="showDetail(scope.row.id, scope.row.subject_name)"
            >
              查看
            </span>
          </template>
        </el-table-column>
      </el-table>
    </main>
    <detail ref="detailArea" :detailShow="pageState === 2" :subjectName="subjectName" @back="back(0)"></detail>
    <Account
      ref="accountArea"
      :accountShow="pageState === 1"
      :subjectName="subjectName"
      :title="title"
      @back="back(0)"
    ></Account>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import Detail from './component/detail.vue'
import Account from './component/account_creation.vue'
import { getAccountList, endAccount } from '../../../service/instrument-manage/account-establishment/index'
import { useStore } from '@store/index'

import localCache from '@/utils/localCache'
import axios from 'axios'

const store = useStore()

const accountList: any = ref([])
let pageState = ref(0)
let selectId = ref(0)
const title: any = ref('开始建帐')
const subjectName: any = ref('')
const detailArea = ref()
const subjectID: any = ref(0)

subjectID.value = JSON.parse(sessionStorage.getItem('state') || '').login.userInfo.subject_id

// 查看详情
const showDetail = (ID: any, name: string) => {
  subjectName.value = name
  selectId.value = ID
  pageState.value = 2
  detailArea.value.initData(ID)
}

const accountArea = ref()
// 开始建帐或继续建帐
const accountCreate = (ID: any, value: string, name: string, subject_id: number) => {
  subjectName.value = name
  title.value = value
  pageState.value = 1
  selectId.value = ID
  accountArea.value.initData(ID, subject_id)
}

// 结束建帐
const finishAccount = (ID: number) => {
  endAccount({ id: ID, type: 1 }).then((res) => {
    if (res.code === 10) {
      initData()
    }
  })
}

const initData = () => {
  getAccountList({ type: 1, subject_id: subjectID.value }).then((res: any) => {
    accountList.value = res.data
  })
}

initData()

const exportExcel = () => {
  const token = localCache.getCookie('swr_token')
  axios
    .post(
      process.env.VUE_APP_BASE_URL_BASE + '/schooldvc/SchoolAccounts/accountsList',
      { token, type: 1, subject_id: subjectID.value, is_explode: 1 },
      { responseType: 'blob' }
    )
    .then((res) => {
      const blob = new Blob([res.data]) // 处理文档流
      const fileName = store.state.login.userInfo.school.name + '-' + '期初仪器建帐.xlsx'
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

const back = (type: any) => {
  pageState.value = type
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
    margin-left: 15px;
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
