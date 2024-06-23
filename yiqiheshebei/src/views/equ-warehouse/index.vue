<template>
  <header>
    <div class="title">
      <span @click="secondTitle = ''">仪器设备库</span>
      <el-icon v-show="secondTitle !== ''"><arrow-right /></el-icon>
      <span v-show="secondTitle !== ''">{{ secondTitle }}</span>
    </div>
    <div class="select-box" v-show="secondTitle === ''">
      <span>学科:</span>
      <el-select
        v-model="selectValue"
        placeholder="搜索"
        @change="changeSub"
        :disabled="[2, 3, 4].includes(store.state.login.userInfo.role_id)"
      >
        <el-option v-for="item in optionsSub" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </div>
  </header>
  <div class="page-body" v-show="secondTitle === ''">
    <div v-for="(item, index) in RequestData.filter((e) => e.list.length > 0)" :key="index">
      <p class="category-title">{{ item.name }}</p>
      <div class="room-list">
        <LaboratoryItem v-for="(item1, index) in item.list" :item-data="item1" :key="index" @pageChange="pageChange" />
        <!-- <p v-if="item.list.length === 0">暂无数据</p> -->
      </div>
    </div>
  </div>
  <WarehouseConfig v-if="secondTitle === '仓库配置'" :item-data="clickItem" @back="secondTitle = ''" />
  <StockDetail v-if="secondTitle === '库内详情'" :item-data="clickItem" @back="secondTitle = ''" />
</template>

<script lang="ts" setup>
import { reactive, toRefs } from 'vue'

import { ArrowRight } from '@element-plus/icons-vue'

import { useStore } from '@store/index'

import WarehouseConfig from './component/warehouse-config.vue'
import StockDetail from './component/stock-detail.vue'
import LaboratoryItem from './component/laboratory-item.vue'

import { getStoreList } from '@service/equ-warehouse/index'
import { StoreListType } from '@service/equ-warehouse/types'

const store = useStore()
let optionsSub = [...store.state.common.subjectArr]
optionsSub.unshift({
  id: 0,
  name: '全部'
})

const dataMap = reactive({
  selectValue: [2, 3, 4].includes(store.state.login.userInfo.role_id) ? store.state.login.userInfo.subject_id : 0,
  RequestData: Array<StoreListType>(),
  secondTitle: '',
  clickItem: {}
})
let { selectValue, RequestData, secondTitle, clickItem } = toRefs(dataMap)

const getData = (id: number) => {
  getStoreList({ subject_id: id }).then((res) => {
    RequestData.value = res.data
  })
}
const changeSub = () => {
  getData(selectValue.value)
}

const pageChange = (value: number, item: { id: number; title: string }) => {
  console.log(value, item)
  clickItem.value = item
  if (value === 1) {
    secondTitle.value = '仓库配置'
  } else if (value === 2) {
    secondTitle.value = '库内详情'
  }
}

getData(selectValue.value)
</script>

<style scoped lang="scss">
header {
  height: 30px;
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  line-height: 30px;
  color: #626572;
  opacity: 1;
  & > .title {
    float: left;
    display: flex;
    align-items: center;
    & > :nth-child(1):hover {
      color: #05c65d;
      cursor: pointer;
    }
  }
  & > .select-box {
    float: right;
    & > span {
      padding-right: 20px;
    }
  }
}
.page-body {
  margin-top: 10px;
  .category-title {
    display: flex;
    justify-content: left;
    align-items: center;
    margin-bottom: 20px;
    padding: 0 34px;
    height: 56px;
    line-height: 60px;
    background-color: #fff;
    color: #05c65d;
    text-align: left;
    font-size: 16px;
    font-weight: bold;
    border-bottom: 4px solid #05c65d;
    img {
      cursor: pointer;
    }
  }

  .room-list {
    & > p {
      margin-bottom: 20px;
    }
    &:after {
      display: block;
      clear: both;
      content: '';
      visibility: hidden;
      height: 0;
    }
  }
}
</style>
