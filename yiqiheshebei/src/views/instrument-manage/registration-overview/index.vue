<template>
  <div>
    <header>
      <div class="fl">
        <span>仪器管理</span>
        <el-icon><arrow-right /></el-icon>
        <span>仪器登记总览</span>
      </div>
      <div class="searchArea">
        <!-- <input v-model="compensateValue" placeholder="请输入关键字" style="float: left; width: 60%; height: 100%" />
        <el-button type="primary" @click="search" style="float: right">
          <img src="@/assets/images/common/search.png" />
        </el-button> -->
        <el-input v-model="compensateValue" placeholder="搜索" />
        <img class="search" src="@assets/images/common/search.png" alt="搜索" @click="search" />
      </div>
    </header>
    <div class="buttonArea">
      <span class="title">仪器登记情况</span>
      <el-button
        v-if="[1, 2].includes(store.state.login.userInfo.role_id)"
        type="primary"
        class="buttonStyle"
        @click="exportExcel()"
      >
        导出
      </el-button>
    </div>

    <div class="tableArea">
      <el-table
        :data="instrumentList.data"
        style="width: 100%"
        :header-cell-style="{ background: '#EFEFEF', color: '#000' }"
        :cell-style="{ background: '#ffffff', borderBottom: '1px solid #EFEFEF' }"
        default-expand-all
        @sort-change="sortChange"
      >
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column
          label="分类编号"
          prop="number"
          sortable="custom"
          show-overflow-tooltip
          width="110"
        ></el-table-column>
        <el-table-column
          label="学校编号"
          prop="asset_number"
          sortable="custom"
          show-overflow-tooltip
          width="110"
        ></el-table-column>
        <el-table-column label="仪器名称" show-overflow-tooltip prop="name" width="200"></el-table-column>
        <el-table-column label="规格型号" show-overflow-tooltip prop="specification"></el-table-column>
        <el-table-column label="单位" prop="unit" width="130" show-overflow-tooltip></el-table-column>
        <el-table-column
          label="出借"
          prop="lend_num"
          sortable="custom"
          width="130"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="维修保养"
          prop="maintenance_num"
          sortable="custom"
          width="130"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="损耗、报废"
          prop="scrap_num"
          sortable="custom"
          width="130"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="损坏赔偿"
          prop="damage_num"
          sortable="custom"
          width="130"
          show-overflow-tooltip
        ></el-table-column>
      </el-table>
    </div>
    <div class="pagination-block">
      <el-pagination
        v-model:currentPage="currentPage"
        :page-size="15"
        @current-change="handleCurrentChange"
        :hide-on-single-page="true"
        background
        layout="total, prev, pager, next,jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, toRefs, reactive } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
import { getInstrumentRegistrationOverview } from '@/service/instrument-manage/damageRegistration/index'
import { instrumentRegistrationData } from '@/service/instrument-manage/damageRegistration/types'
import { useStore } from '@store/index'

import localCache from '@/utils/localCache'
import axios from 'axios'

const store = useStore()
let compensateValue = ref('')
let total = ref(0)
let currentPage = ref(1)

const dataMap = reactive({
  instrumentList: instrumentRegistrationData
})
let { instrumentList } = toRefs(dataMap)
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
const initData = (keyword: string, page: number) => {
  getInstrumentRegistrationOverview({ keyword: keyword, page: page, ...sortData }).then((res) => {
    instrumentList.value = res.data
    total.value = res.data.total
  })
}

initData(compensateValue.value, currentPage.value)

const exportExcel = () => {
  const token = localCache.getCookie('swr_token')
  axios
    .post(
      process.env.VUE_APP_BASE_URL_BASE + '/schooldvc/SchoolInstrumentsDamage/instrumentRegistration',
      {
        token,
        keyword: compensateValue.value,
        page: currentPage.value,
        ...sortData,
        is_explode: 1
      },
      { responseType: 'blob' }
    )
    .then((res) => {
      const blob = new Blob([res.data]) // 处理文档流
      const fileName = store.state.login.userInfo.school.name + '-' + '仪器登记总览.xlsx'
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

const handleCurrentChange = () => {
  initData(compensateValue.value, currentPage.value)
}

const search = () => {
  initData(compensateValue.value, currentPage.value)
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

.pagination-block {
  margin-top: 20px;
  text-align: right;
}
</style>
