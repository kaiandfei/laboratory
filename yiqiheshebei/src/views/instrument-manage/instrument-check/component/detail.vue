<template>
  <header v-show="detailShow && !reportState">
    <span>仪器管理 > 仪器盘点 > 盘点报告</span>
    <span class="backPage" @click="back">
      <img src="../../../../assets/images/laboratory-standard/cancel.png" style="" />
      返回
    </span>
  </header>
  <main v-show="detailShow && !reportState">
    <div class="titleArea">
      <div class="title">盘点记录</div>
    </div>
    <el-table :data="tableData" style="width: 100%" :header-cell-style="{ background: '#EFEFEF' }">
      <el-table-column align="left" type="index" label="序号"></el-table-column>
      <el-table-column align="left" prop="status" label="盘点状态">
        <template #default="scope">
          <span v-show="scope.row.status === 1">待开始</span>
          <span v-show="scope.row.status === 2">进行中</span>
          <span v-show="scope.row.status === 3">已结束</span>
        </template>
      </el-table-column>
      <el-table-column align="left" prop="times" label="盘点种类"></el-table-column>
      <el-table-column align="left" prop="create_time" label="上次盘点时间"></el-table-column>
      <el-table-column align="center" prop="" label="操作">
        <template #default="scope">
          <span class="title" v-show="scope.row.status === 3" @click="showReport(scope.row.id)">查看盘点报告</span>
        </template>
      </el-table-column>
    </el-table>
  </main>
  <CheckReport ref="reportArea" :reportShow="reportState" @back="reportBack"></CheckReport>
</template>
<script lang="ts" setup>
import { defineExpose, ref, toRefs } from 'vue'
import CheckReport from './checkReport.vue'
import { getDetailInfo } from '../../../../service/instrument-manage/instrument-check/index'
let emit = defineEmits(['back'])
let props = defineProps({ detailShow: Boolean })
let { detailShow } = toRefs(props)
const tableData: any = ref([])
let reportState: any = ref(false)

const reportArea = ref()
const showReport = (ID: any) => {
  reportState.value = true
  reportArea.value.initData(ID)
}

const initData = (ID: number) => {
  getDetailInfo({ subject_id: ID, type: 1 }).then((res: any) => {
    tableData.value = res.data
  })
}

defineExpose({
  initData
})

const reportBack = () => {
  reportState.value = false
}

const back = () => {
  emit('back')
}
</script>
<style lang="scss" scoped>
header {
  height: 30px;
  .backPage {
    float: right;
    margin-right: 30px;
    display: flex;
    cursor: pointer;
  }
  & > span {
    float: left;
    margin-right: 6px;
    font-size: 16px;
    color: #626572;
  }
  img {
    float: right;
    margin-right: 15px;
    cursor: pointer;
  }
}
main {
  width: 100%;
  .titleArea {
    width: 100%;
    height: 80px;
    float: left;
    margin-top: 20px;
    display: flex;
    align-items: center;
    background-color: #dcece3;
    .title {
      font-size: 20px;
      height: 30px;
      width: 10%;
      float: left;
      font-weight: bold;
      color: #05c65d;
    }
    .button {
      float: right;
      margin-left: 75%;
      background: #05c65d;
      width: 10%;
      height: 50px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      color: white;
    }
  }
  .title {
    cursor: pointer;
    color: #05c65d;
    font-size: 14px;
  }
}
</style>
