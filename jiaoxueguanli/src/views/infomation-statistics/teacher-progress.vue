<template>
  <div class="main">
    <p class="title">数据统计<i class="el-icon-arrow-right" />{{ $route.meta.title }}</p>
    <top-filter :options="['semester', 'subject_id', 'grade']" @change="getData" />
    <button
      v-if="[1, 3, 4].includes($store.getters.getUserMsg.role_id)"
      class="my-btn"
      @click="exportExcel"
    >
      导出
    </button>
    <div class="content-box">
      <div class="content">
        <div class="chart-box">
          <p>教师实验开课情况</p>
          <div class="chart">
            <chart-bar
              :seriesData="seriesData"
              :xRotate="xAxisData.length > 10 ? 45 : 0"
              :gridBottom="xAxisData.length > 10 ? 60 : 25"
              :xAxisData="xAxisData"
            />
          </div>
        </div>
      </div>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      :header-cell-style="{}"
      :cell-style="{}"
    >
      <el-table-column type="index" prop="" label="序号" align="left" />
      <el-table-column prop="teacher" label="教师" align="left" />
      <el-table-column prop="subject_id" label="学科" align="left">
        <template #default="scope">
          {{ $store.state.subjectArr.find((e) => e.id === scope.row.subject_id).name }}
        </template>
      </el-table-column>
      <el-table-column prop="needClass" label="应开数" align="left" sortable />
      <el-table-column prop="hasClass" label="实开数" align="left" sortable />
      <el-table-column prop="ClassRate" label="开课率" align="left" sortable>
        <template #default="scope">{{
          (scope.row.ClassRate * 100).toFixed(0) + '%'
        }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { teacherComPro } from '@network/infomationStatistical'
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
      seriesData: [
        {
          name: '分组',
          type: 'bar',
          data: [],
          barWidth: 20,

          itemStyle: {
            color: '#3EC4DF',
            borderRadius: 10,
          },
        },
        {
          name: '演示',
          type: 'bar',
          data: [],
          barWidth: 20,

          itemStyle: {
            color: '#EE9A59',
            borderRadius: 10,
          },
        },
      ],
      xAxisData: [],
      tableData: [],
      searchObj: {},
    }
  },
  // created() { },
  // mounted() { },
  methods: {
    getData(obj) {
      this.searchObj = obj

      teacherComPro(obj).then((result) => {
        if (result.code === 10) {
          this.tableData = result.data.detailList
          this.xAxisData = result.data.list.map((e) => {
            return e.teacher
          })
          this.seriesData[0].data = result.data.list.map((e) => {
            return e.group
          })
          this.seriesData[1].data = result.data.list.map((e) => {
            return e.ungroup
          })
        }

        // this.xAxis = result.data.class
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
            '/teacherComPro',
          { ...this.searchObj, token, is_explode: 1 },
          { responseType: 'blob' }
        )
        .then((res) => {
          const blob = new Blob([res.data]) // 处理文档流
          const fileName =
            this.$store.getters.getUserMsg.school.name + '-' + '教师进度统计.xlsx'
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
.content-box {
  display: flex;
  margin-bottom: 20px;
  .content {
    padding: 20px;
    width: 100%;
    background: #ffffff;
    box-sizing: border-box;
    .chart-box {
      display: flex;
      align-items: center;
      p {
        margin: 0 20px;
        display: flex;
        flex-direction: column;
        width: 20px;
      }
      .chart {
        width: calc(100% - 80px);
      }
    }
  }
}
</style>
