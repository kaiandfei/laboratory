<template>
  <div class="main">
    <p class="title">数据统计<i class="el-icon-arrow-right" />{{ $route.meta.title }}</p>
    <top-filter
      :options="[
        'time_ids',
        'semester',
        'subject_id',
        'teacher_id',
        $store.state.userMsg.role_id === 4 ? 'class_id' : '',
      ]"
      @change="getData"
    />
    <button
      v-if="[1, 4].includes($store.getters.getUserMsg.role_id)"
      class="my-btn"
      @click="exportExcel"
    >
      导出
    </button>
    <div class="chart-box">
      <chart-bar
        :seriesData="seriesData1"
        :xAxisData="requestData.week_list"
        :height="240"
        :xName="'周次'"
        :yName="'实验频次'"
      />
    </div>
    <el-table
      :data="requestData.list2"
      style="width: 100%"
      :header-cell-style="{}"
      :cell-style="{}"
    >
      <el-table-column type="index" prop="" label="序号" />
      <el-table-column prop="subject_id" label="学科">
        <template #default="scope">
          <span>{{ scope.row.subject_name || '/' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="teacher_id" label="授课教师" sortable>
        <template #default="scope">
          <span>{{ scope.row.teacher_name || '/' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="" label="周次" sortable>
        <template #default="scope">
          <span>{{ $store.state.weekTimeArr[scope.row.week_time] }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="total" label="实验频次" sortable>
        <template #default="scope">
          <span>{{ scope.row.total }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { expFrequency } from '@network/infomationStatistical'
import ChartBar from '@components/echarts/chartBar.vue'
import TopFilter from '@components/top-filter.vue'

import axios from 'axios'
import localCache from '@/utils/localCache'
export default {
  name: '',
  components: {
    ChartBar,
    TopFilter,
  },
  data() {
    return {
      weeknow: 0,
      year: '',
      requestData: {
        list: [],
        list2: [],
        week_list: [],
      },
      xAxisData21: [],
      seriesData1: [],
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
  created() {
    this.weeknow = this.$store.state.schoolDate.week
    this.year = this.$store.state.schoolDate.year
  },
  // mounted() { },
  methods: {
    getData(obj) {
      this.searchObj = obj

      expFrequency(obj).then((res) => {
        this.requestData = res.data
        this.seriesData1 = [
          {
            name: this.year,
            type: 'line',
            color: '#49A9EE',
            data: this.requestData.list,
          },
        ]
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
            '/expFrequency',
          { ...this.searchObj, token, is_explode: 1 },
          { responseType: 'blob' }
        )
        .then((res) => {
          const blob = new Blob([res.data]) // 处理文档流
          const fileName =
            this.$store.getters.getUserMsg.school.name + '-' + '实验频次.xlsx'
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
  .top-select {
    margin: 10px 0;
    padding: 20px 20px 0 20px;
    display: flex;
    flex-wrap: wrap;
    background: #ffffff;
    text-align: left;
    box-sizing: border-box;
    .select-box {
      width: 25%;
      height: 30px;
      line-height: 30px;
      margin-bottom: 20px;
      span {
        display: inline-block;
        width: 70px;
      }
      & > :nth-child(2) {
        width: calc(80% - 70px);
        line-height: 30px;
        box-sizing: border-box;
        ::v-deep .el-input {
          width: 100%;
          .el-input__inner {
            width: 100% !important;
          }
        }
      }
    }
  }
  .has-height {
    height: 70px;
    overflow: hidden;
  }
}
.chart-box {
  margin-bottom: 20px;
  padding: 10px;
  width: 100%;
  background: #ffffff;
  box-sizing: border-box;
}
</style>
