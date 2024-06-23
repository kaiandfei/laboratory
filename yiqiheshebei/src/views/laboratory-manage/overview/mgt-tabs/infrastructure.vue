<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%"
      :header-cell-style="{
        padding: '4px 0',
        background: '#fff',
        color: '#000'
      }"
      height="600"
      v-loading="tableLoading"
      element-loading-text="加载中..."
    >
      <el-table-column type="index" label="序号" width="60" align="left"></el-table-column>
      <el-table-column label="编号" prop="number" align="left"></el-table-column>
      <el-table-column label="名称" prop="name" align="left"></el-table-column>
      <el-table-column
        label="参考规格"
        prop="specification"
        width="200"
        align="left"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="单位" prop="unit" width="80" align="left"></el-table-column>
      <el-table-column label="库存数量" prop="total" align="left"></el-table-column>
    </el-table>
    <el-pagination
      v-model:currentPage="curryPage"
      v-model:page-size="limit"
      :small="small"
      layout="prev, pager, next, jumper"
      :total="total"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, defineProps, toRefs, useAttrs } from 'vue'

import { laboratoryEquipment } from '@service/laboratory-manage/overview/index'
import { labConfig } from '@service/laboratory-manage/overview/types'

const $attrs: any = useAttrs()

const dataMap = reactive({
  tableData: [labConfig]
})

let { tableData } = toRefs(dataMap)
let curryPage = ref(1)
let limit = ref(15)
let total = ref(0)
let tableLoading = ref(false)
const getData = () => {
  tableLoading.value = true
  laboratoryEquipment({ id: $attrs._item.id, page: curryPage.value, type: 2, group_number: 1 })
    .then((res) => {
      tableData.value = res.data.list
      total.value = res.data.total
    })
    .finally(() => {
      tableLoading.value = false
    })
}
getData()

const handleCurrentChange = (val: number) => {
  curryPage.value = val
  getData()
}
</script>

<style scoped lang="scss">
.el-pagination {
  margin: 10px;
  text-align: right;
}
</style>
