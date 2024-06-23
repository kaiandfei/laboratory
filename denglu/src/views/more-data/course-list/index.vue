<template>
  <div>
    <top-filter
      ref="filterRef"
      :options="['school_name', 'level', 'semester', 'type', 'exp_name', 'grade', 'subject_id', 'time_ids']"
      @changes="getData"
    ></top-filter>
    <el-table :data="tableData" style="width: 100%" stripe @sort-change="sortChange">
      <el-table-column prop="" type="index" label="序号" width="60" />
      <el-table-column prop="school_id" label="学校" sortable width="200">
        <template #default="scope">
          {{ scope.row.school_name }}
        </template>
      </el-table-column>
      <el-table-column prop="level" label="星级" sortable width="80">
        <template #default="scope">
          {{ scope.row.level_name }}
        </template>
      </el-table-column>
      <el-table-column prop="time_ids" label="学段" sortable width="80">
        <template #default="scope">
          {{ scope.row.time_ids_name }}
        </template>
      </el-table-column>
      <el-table-column prop="subject" label="学科" sortable width="80">
        <template #default="scope">
          {{ scope.row.subject_name }}
        </template>
      </el-table-column>
      <el-table-column prop="grade" label="年级" sortable width="80">
        <template #default="scope">
          {{ scope.row.grade_name }}
        </template>
      </el-table-column>
      <el-table-column prop="class_name" label="班级" width="70" />
      <el-table-column prop="school_year" label="学年学期" sortable width="180">
        <template #default="scope">
          {{ scope.row.school_year_name }}
        </template>
      </el-table-column>
      <el-table-column prop="exp" label="开课实验" sortable>
        <template #default="scope">
          {{ scope.row.exp_name }}
        </template>
      </el-table-column>
      <el-table-column prop="type" label="实验类型" sortable width="120">
        <template #default="scope">
          {{ groupTypeList[scope.row.type - 1] }}
        </template>
      </el-table-column>
      <el-table-column prop="teacher_id" label="开课教师" sortable width="120">
        <template #default="scope">
          {{ scope.row.teacher_name }}
        </template>
      </el-table-column>
      <el-table-column prop="start" label="开课时间" sortable width="180" />
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

import { expBookList } from '@/service/more-data'
import axios from 'axios'
import localCache from '@/utils/localCache'

const router = useRouter()

const tableData = ref<any>([])

const currentPage = ref(1)

const pageSize = ref(15)
const groupTypeList = ['分组', '演示', '其他']

const total = ref(0)
const searchForm = ref<any>({})

const getData = (obj: any, type: string) => {
  console.log('🚀 ~ getData ~ type:', obj, type)
  searchForm.value = obj
  let data = {
    page: currentPage.value,
    limit: pageSize.value,
    ...searchForm.value,
    ...searchForm.value.order
  }
  delete data.order

  if (!type) {
    expBookList(data).then((res) => {
      tableData.value = res.data.data
      total.value = res.data.total
    })
  } else if (type === 'generateStatisticalChart') {
    router.push({
      name: 'GenerateStatisticalChartCourse',
      params: searchForm.value
    })
  } else if (type === 'exportExcel') {
    const token = localCache.getCookie('swr_token')
    axios
      .post(
        process.env.VUE_APP_BASE_URL + '/dateCenter/GoClass/expBookList',
        { ...data, is_explode: 1, token },
        { responseType: 'blob' }
      )
      .then((res) => {
        const blob = new Blob([res.data]) //处理文档流
        const fileName = '实验开课记录导出.xlsx'
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
      order: e.prop,
      desc: e.order.slice(0, 4) === 'desc' ? 2 : 1
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
