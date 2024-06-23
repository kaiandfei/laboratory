<template>
  <div class="main">
    <p class="title">数据统计<i class="el-icon-arrow-right" />{{ $route.meta.title }}</p>
    <top-filter
      :options="['time_ids', 'semester', 'subject_id', 'grade', 'teacher_id']"
      @change="getData"
    />
    <button
      v-if="[1, 2, 3, 4].includes($store.getters.getUserMsg.role_id)"
      class="my-btn"
      @click="exportExcel"
    >
      导出
    </button>
    <el-table
      :data="tableData"
      style="width: 100%"
      :header-cell-style="{}"
      :cell-style="{}"
    >
      <el-table-column type="index" prop="" label="序号" />
      <el-table-column prop="grade_name" label="年级" sortable>
        <template #default="scope">
          <span>{{
            $store.getters.getUserMsg.role_id === 4
              ? scope.row.grade_name
              : $store.state.gradeArr[scope.row.grade]
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="班级" sortable />
      <el-table-column prop="teacher_id" label="授课教师" sortable>
        <template #default="scope">
          <span>{{ scope.row.teacher_name || '/' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="subject_id" label="学科" sortable>
        <template #default="scope">
          <span>{{ scope.row.subject_name || '/' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="plan_num" label="应开数" sortable />
      <el-table-column prop="num" label="实开数" sortable />
      <el-table-column
        prop="rate"
        label="开课率"
        sortable
        :sort-method="
          (a, b) => {
            return a.rate - b.rate
          }
        "
      >
        <template #default="scope"> {{ scope.row.rate }}% </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { courseSchedule } from '@network/infomationStatistical'
import TopFilter from '@components/top-filter.vue'

import axios from 'axios'
import localCache from '@/utils/localCache'
export default {
  name: '',
  components: {
    TopFilter,
  },
  data() {
    return {
      tableData: [],
      searchObj: {},
    }
  },
  computed: {
    subjectName() {
      return (val) => {
        let name = ''
        this.$store.state.subjectArr.forEach((e) => {
          if (val === e.id) {
            name = e.name
          }
        })
        return name
      }
    },
  },
  // created() { },
  // mounted() { },
  methods: {
    getData(obj) {
      this.searchObj = obj

      courseSchedule(obj).then((result) => {
        this.tableData = result.data
      })
    },
    exportExcel() {
      const token = localCache.getCookie('swr_token')
      const roleMap = {
        1: 'statisticalAdmin',
        2: 'statisticalTester',
        3: 'StatisticalGroup',
        4: 'statistical',
        100: 'statisticalPro',
      }
      axios
        .post(
          process.env.VUE_APP_APP_BASEURL +
            '/teach/' +
            (roleMap[this.$store.getters.getUserMsg.role_id] || 'statistical') +
            '/courseSchedule',
          { ...this.searchObj, token, is_explode: 1 },
          { responseType: 'blob' }
        )
        .then((res) => {
          const blob = new Blob([res.data]) // 处理文档流
          const fileName =
            this.$store.getters.getUserMsg.school.name + '-' + '班级开课进度.xlsx'
          const elink = document.createElement('a')
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.main {
  padding: 20px 32px;
  width: 100%;
  box-sizing: border-box;
  .title {
    text-align: left;
  }
  .my-btn {
    margin: -57px 20px 0 0;
    float: right;
  }
}
</style>
