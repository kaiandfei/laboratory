<template>
  <div>
    <top-filter
      ref="filterRef"
      :options="['school_name', 'level', 'labor_type', 'equipment_name', 'equipment_number', 'subject_id', 'time_ids']"
      @changes="getData"
    ></top-filter>
    <el-table :data="tableData" style="width: 100%" stripe @sort-change="sortChange">
      <el-table-column prop="" type="index" label="序号" width="60" />
      <el-table-column prop="school_id" label="学校" sortable>
        <template #default="scope">
          {{ scope.row.school_name }}
        </template>
      </el-table-column>

      <el-table-column prop="phase_study_id" label="学段" sortable>
        <template #default="scope">
          {{ scope.row.phase_name }}
        </template>
      </el-table-column>
      <el-table-column prop="level" label="星级" sortable>
        <template #default="scope">
          {{ ['五星级', '四星级', '三星级'][scope.row.level - 1] }}
        </template>
      </el-table-column>
      <el-table-column prop="subject" label="学科" sortable>
        <template #default="scope">
          {{ scope.row.subject_name }}
        </template>
      </el-table-column>
      <el-table-column prop="labor_name" label="功能室"></el-table-column>
      <el-table-column prop="labor_type_name" label="功能室类型" sortable></el-table-column>
      <el-table-column prop="number" label="设备编号" sortable></el-table-column>
      <el-table-column prop="instrument_name" label="设备名称" sortable />

      <el-table-column prop="origin_amount" label="数量" sortable></el-table-column>
    </el-table>
    <div class="pagination-block">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[15, 30, 45, 60]"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import TopFilter from '../components/top-filter.vue'

import { LaborAllAssetsList } from '@/service/more-data'
import axios from 'axios'
import localCache from '@/utils/localCache'

const router = useRouter()

const tableData = ref<any>([])

const currentPage = ref(1)

const pageSize = ref(15)
const insList = ['仪器', '设备']

const total = ref(0)
const searchForm = ref<any>({})

const getData = (obj: any, type: string) => {
  console.log('🚀 ~ getData ~ type:', obj, type)
  searchForm.value = obj
  let data = {
    page: currentPage.value,
    page_size: pageSize.value,
    ...searchForm.value,
    ...searchForm.value.order,
    phase_study_id: searchForm.value.time_ids
  }
  delete data.order
  if (!type) {
    LaborAllAssetsList(data).then((res) => {
      tableData.value = res.data.list
      total.value = res.data.page_info.count
    })
  } else if (type === 'generateStatisticalChart') {
    router.push({
      name: 'GenerateStatisticalChartRoom',
      params: searchForm.value
    })
  } else if (type === 'exportExcel') {
    const token = localCache.getCookie('swr_token')
    axios
      .post(
        process.env.VUE_APP_BASE_URL + '/dateCenter/LaborDataCenter/LaborAllAssetsList',
        { ...data, is_explode: 1, token },
        { responseType: 'blob' }
      )
      .then((res) => {
        const blob = new Blob([res.data]) //处理文档流
        const fileName = '功能室列表导出.xlsx'
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
}

const sortChange = (e: any) => {
  console.log('🚀 ~ sortChange ~ e:', e)
  searchForm.value.order = {}
  if (e.order) {
    searchForm.value.order = {
      ['order' + '_' + e.prop]: e.order.slice(0, 4) === 'desc' ? 2 : 1
    }
  }

  getData(searchForm.value, '')
}

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
  getData(searchForm.value, '')
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
  getData(searchForm.value, '')
}
</script>

<style lang="scss" scoped>
.pagination-block {
  margin-top: 10px;
  .el-pagination {
    justify-content: flex-end;
  }
}
</style>
