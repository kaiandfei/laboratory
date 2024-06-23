<template>
  <div>
    <header>
      <div class="fl">
        <span>设备管理</span>
        <el-icon><arrow-right /></el-icon>
        <span>设备登记总览</span>
      </div>
      <div class="searchArea">
        <!-- <input v-model="compensateValue" placeholder="请输入关键字" style="float: left; width: 60%; height: 100%" />
        <el-button type="primary" @click="search" style="float: right">
          <img src="@/assets/images/common/search.png" />
        </el-button> -->
        <el-select v-model="status" placeholder="" @change="cateChange">
          <el-option label="全部" value=""></el-option>
          <el-option label="正常" value="1"></el-option>
          <el-option label="出借" value="2"></el-option>
          <el-option label="维修保养" value="3"></el-option>
          <el-option label="报废" value="4"></el-option>
          <el-option label="损坏" value="5"></el-option>
          <el-option label="闲置" value="6"></el-option>
        </el-select>
        <el-input v-model="compensateValue" placeholder="请输入类别编号、资产编号" />
        <img class="search" src="@assets/images/common/search.png" alt="搜索" @click="search" />
      </div>
    </header>
    <div class="buttonArea">
      <span class="title">设备登记情况</span>
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
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="类别编号" prop="number" show-overflow-tooltip sortable="custom"></el-table-column>
        <el-table-column label="资产编号" prop="asset_number" show-overflow-tooltip sortable="custom"></el-table-column>
        <el-table-column label="名称" prop="name" show-overflow-tooltip></el-table-column>
        <el-table-column label="规格" prop="specification" show-overflow-tooltip></el-table-column>
        <el-table-column label="单位" prop="unit" show-overflow-tooltip width="80"></el-table-column>
        <el-table-column label="登记情况" prop="status" show-overflow-tooltip width="130">
          <template #default="scope">
            <span v-show="scope.row.status === 1">正常</span>
            <span v-show="scope.row.status === 2">借出</span>
            <span v-show="scope.row.status === 3">维修保养</span>
            <span v-show="scope.row.status === 4">损耗、报废</span>
            <span v-show="scope.row.status === 5">损坏</span>
            <span v-show="scope.row.status === 6">闲置</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="maintenance_num" show-overflow-tooltip width="130">
          <template #default="scope">
            <span v-show="scope.row.status === 2">未归还</span>
            <span v-show="scope.row.status === 3">维修保养中</span>
            <span v-show="scope.row.ScrapStatus === 1">未提交</span>
            <span v-show="scope.row.ScrapStatus === 2">待审核</span>
            <span v-show="scope.row.ScrapStatus === 3">已撤回</span>
            <span v-show="scope.row.ScrapStatus === 4">已报废</span>
            <span v-show="scope.row.ScrapStatus === 5">审核报废失败</span>
            <span v-show="scope.row.DamageStatus === 1">未赔偿</span>
            <span v-show="scope.row.DamageStatus === 2">已赔偿</span>
          </template>
        </el-table-column>
        <el-table-column
          label="登记时间"
          prop="create_time"
          show-overflow-tooltip
          sortable="custom"
          width="160"
        ></el-table-column>
        <el-table-column label="登记人" prop="user_name" width="100"></el-table-column>
      </el-table>
    </div>
    <div class="pagination-block">
      <el-pagination
        v-model:currentPage="currentPage"
        :page-size="15"
        @current-change="handleCurrentChange"
        background
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, toRefs, reactive } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
import { getInstrumentRegistrationOverview } from '@/service/equ-manage/damageRegistration/index'
import { instrumentRegistrationData } from '@/service/equ-manage/damageRegistration/types'
import { useStore } from '@store/index'

import localCache from '@/utils/localCache'
import axios from 'axios'

const store = useStore()
let compensateValue = ref('')
let status = ref('')
let total = ref(0)
let currentPage = ref(1)
let sortData: any = reactive({})

const dataMap = reactive({
  instrumentList: instrumentRegistrationData
})
let { instrumentList } = toRefs(dataMap)

const initData = (keyword: string, page: number, status: any) => {
  getInstrumentRegistrationOverview({ keyword: keyword, page: page, status: status, ...sortData }).then((res) => {
    instrumentList.value = res.data
    total.value = res.data.total
  })
}

initData(compensateValue.value, currentPage.value, status.value)
const exportExcel = () => {
  const token = localCache.getCookie('swr_token')
  axios
    .post(
      process.env.VUE_APP_BASE_URL_BASE + '/schooldvc/SchoolEquipmentDamage/equipmentRegistration',
      {
        token,
        keyword: compensateValue.value,
        page: currentPage.value,
        status: status.value,
        ...sortData,
        is_explode: 1
      },
      { responseType: 'blob' }
    )
    .then((res) => {
      const blob = new Blob([res.data]) // 处理文档流
      const fileName = store.state.login.userInfo.school.name + '-' + '设备登记总览.xlsx'
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
  initData(compensateValue.value, currentPage.value, status.value)
}

const search = () => {
  initData(compensateValue.value, currentPage.value, status.value)
}
const cateChange = () => {
  initData(compensateValue.value, currentPage.value, status.value)
}

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
    :deep(.el-select) {
      position: absolute;
      right: 340px;
      top: 0;
      width: 300px;
      height: 30px;
      line-height: 30px;
      .select-trigger {
        height: 30px;
      }
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
.tableArea {
  & ::v-deep .el-table .el-table__header .el-table__cell {
    padding: 12px 0;
  }
  & ::v-deep .el-table .el-table__row .el-table__cell {
    padding: 8px 0;
  }
}
</style>
