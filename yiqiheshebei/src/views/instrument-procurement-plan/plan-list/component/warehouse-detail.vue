<template>
  <div class="main">
    <div class="recommend">
      <p class="text-box">
        <span>{{ itemData.title }}</span>
        <span>{{ itemData.start_open_time ? itemData.start_open_time + '~' + itemData.end_open_time : '' }}</span>
      </p>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      stripe
      :header-cell-style="{ color: '#000', borderBottom: '1px solid #c9c7c7' }"
      max-height="600"
    >
      <el-table-column type="index" label="序号" width="60" align="left"></el-table-column>
      <el-table-column label="分类编号" prop="number" align="left"></el-table-column>
      <el-table-column label="名称" prop="name" align="left" show-overflow-tooltip></el-table-column>
      <el-table-column label="规格" prop="specification" align="left" show-overflow-tooltip></el-table-column>
      <el-table-column label="数量" prop="total" align="left"></el-table-column>
      <el-table-column label="单位" prop="unit" align="left"></el-table-column>
      <el-table-column prop="" label="类型" align="left">
        <template #default="scope">
          <span>{{ scope.row.type === 1 ? '仪器' : '设备' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单价" prop="unit_price" align="left"></el-table-column>
      <el-table-column label="采购批次" prop="bacth" align="left"></el-table-column>
      <el-table-column label="凭证号" prop="voucher_number" align="left"></el-table-column>
      <el-table-column label="厂家" prop="factory" align="left"></el-table-column>
      <el-table-column label="仪器库" prop="schoolLaboratoryName" align="left"></el-table-column>
      <el-table-column label="仪器柜" prop="storeName" align="left"></el-table-column>
      <el-table-column label="层数" prop="number_plies" align="left"></el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs } from 'vue'

import { instrumentStoreDetail } from '@service/instrument-procurement-plan/plan-list'
import { ListItem, InsStoreDetail } from '@service/instrument-procurement-plan/plan-list/types'

let props = defineProps({ itemData: { type: Object as () => ListItem, required: true } })
let { itemData } = toRefs(props)

const dataMap = reactive({
  tableData: Array<InsStoreDetail>()
})
let { tableData } = toRefs(dataMap)

const getData = () => {
  instrumentStoreDetail().then((res) => {
    tableData.value = res.data
  })
}

getData()
</script>

<style scoped lang="scss">
.main {
  .recommend {
    margin-top: 10px;
    padding: 0 30px;
    width: 100%;
    height: 60px;
    background: #dcece3;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    .text-box {
      font-size: 20px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #333333;
      span:nth-of-type(1) {
        margin-right: 30px;
        color: #05c65d;
      }
    }
    .btn_box {
      display: flex;
      .btn {
        margin-left: 20px;
        box-sizing: border-box;
      }
      .white_btn {
        background: #ffffff;
        color: #05c65d;
        border: #05c65d 1px solid;
      }
    }
  }

  :deep(.el-table) {
    margin-top: 10px;
  }
  footer {
    text-align: right;
    & > p {
      padding: 15px 20px 30px;
      font-size: 18px;
      & > span {
        color: #05c65d;
        font-weight: bold;
      }
    }
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
