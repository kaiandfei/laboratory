<template>
  <div class="main">
    <p class="title">数据统计<i class="el-icon-arrow-right" />{{ $route.meta.title }}</p>
    <top-filter :options="['time_ids', 'subject_id']" @change="getData" />
    <button
      v-if="[1, 2, 4].includes($store.getters.getUserMsg.role_id)"
      class="my-btn"
      @click="exportExcel"
    >
      导出
    </button>
    <div class="content">
      <div class="title">
        <div class="title-header">
          <img src="@images/dataStatistics/today-need.png" alt="" />
          <p>今日需开课</p>
        </div>
        <div class="num">
          <p>
            {{ needClass }}
          </p>
        </div>
      </div>
      <div class="chart-box">
        <p>今日需开课详情</p>
        <div class="chart">
          <chart-bar :seriesData="seriesData11" :xAxisData="xAxisData1" :type="1" />
        </div>
      </div>
    </div>
    <div class="content today-content">
      <div class="title">
        <div class="title-header">
          <img src="@images/dataStatistics/today.png" alt="" />
          <p>今日已开课</p>
        </div>
        <div class="num">
          <p>
            {{ haveClass }}
          </p>
        </div>
      </div>
      <div class="chart-box">
        <p>今日已开课详情</p>
        <div class="chart">
          <chart-bar :seriesData="seriesData12" :xAxisData="xAxisData2" :type="1" />
        </div>
      </div>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      :header-cell-style="{}"
      :cell-style="{}"
    >
      <el-table-column type="index" prop="" label="序号" />
      <el-table-column prop="exp_name" label="实验">
        <template #default="scope">
          <span v-for="(item, index) in scope.row.exp" :key="index">{{ item.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="实验类型">
        <template #default="scope">
          <span>{{ $store.state.groupTypeList[scope.row.type - 1] || '' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="class_id" label="班级" sortable>
        <template #default="scope">
          <span>{{
            ($store.state.gradeArr[scope.row.grade] || '') + scope.row.class_name
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="section" label="上课时间" sortable>
        <template #default="scope">
          <span>{{ $store.state.sectionArr[scope.row.section] }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="laboratory_name" label="上课地点" />
      <el-table-column prop="teacher_name" label="授课教师" />
    </el-table>
  </div>
</template>

<script>
import { classToday, teacherClassList } from '@network/infomationStatistical'
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
      type: this.$route.meta.type, // 1 实验室开课 2 教师开课 3 我的开课
      weeknow: 0,
      year: '',
      seriesData11: [],
      xAxisData1: [],
      xAxisData2: [],
      needClass: 0,
      haveClass: 0,
      seriesData12: [],
      tableData: [],
      searchObj: {},
    }
  },
  created() {
    this.weeknow = this.$store.state.schoolDate.week
    this.year = this.$store.state.schoolDate.year
  },
  // mounted() { },
  methods: {
    getData(obj) {
      this.searchObj = obj
      if (this.type === 1) {
        classToday(obj).then((res) => {
          this.xAxisData1 = res.data.needList.map((e) => {
            return e.laboratory_name
          })
          this.xAxisData2 = res.data.hasList.map((e) => {
            return e.laboratory_name
          })
          if (this.xAxisData1.length === 0) {
            this.xAxisData1 = this.xAxisData2
          } else if (this.xAxisData2.length === 0) {
            this.xAxisData2 = this.xAxisData1
          }
          const arr1 = res.data.needList.map((e) => {
            return e.total
          })
          this.seriesData11 = [
            {
              name: this.year,
              type: 'bar',
              data: arr1,
              barWidth: 20,
              itemStyle: {
                borderRadius: 10,
              },
            },
          ]
          this.needClass = res.data.needNum
          const arr2 = res.data.hasList.map((e) => {
            return e.total
          })
          this.seriesData12 = [
            {
              name: this.year,
              type: 'bar',
              data: arr2,
              barWidth: 20,
              itemStyle: {
                color: '#2BD478',
                borderRadius: 10,
              },
            },
          ]
          this.haveClass = res.data.hasNum
          this.tableData = res.data.needDetail
        })
      }
      if (this.type === 2) {
        teacherClassList(obj).then((res) => {
          this.xAxisData1 = res.data.needList.map((e) => {
            return e.username
          })
          this.xAxisData2 = res.data.hasList.map((e) => {
            return e.username
          })
          if (this.xAxisData1.length === 0) {
            this.xAxisData1 = this.xAxisData2
          } else if (this.xAxisData2.length === 0) {
            this.xAxisData2 = this.xAxisData1
          }
          const arr1 = res.data.needList.map((e) => {
            return e.total
          })
          this.seriesData11 = [
            {
              name: this.year,
              type: 'bar',
              data: arr1,
              barWidth: 20,
              itemStyle: {
                borderRadius: 10,
              },
            },
          ]
          this.needClass = res.data.needNum
          const arr2 = res.data.hasList.map((e) => {
            return e.total
          })
          this.seriesData12 = [
            {
              name: this.year,
              type: 'bar',
              data: arr2,
              barWidth: 20,
              itemStyle: {
                color: '#2BD478',
                borderRadius: 10,
              },
            },
          ]
          this.haveClass = res.data.hasNum
          this.tableData = res.data.needDetail.map((e) => {
            return {
              ...e,
              teacher_name: e.teacherName,
            }
          })
        })
      }
      if (this.type === 3) {
        classToday(obj).then((res) => {
          this.xAxisData1 = res.data.statistical.map((e) => {
            return e.calssname
          })
          this.xAxisData2 = res.data.statistical.map((e) => {
            return e.calssname
          })
          const arr1 = res.data.statistical.map((e) => {
            return e.will_num
          })
          this.seriesData11 = [
            {
              name: this.year,
              type: 'bar',
              data: arr1,
              barWidth: 20,
              itemStyle: {
                borderRadius: 10,
              },
            },
          ]
          this.needClass = arr1.reduce((prevalue, curValue) => {
            return prevalue + curValue
          }, 0)
          const arr2 = res.data.statistical.map((e) => {
            return e.has_num
          })
          this.seriesData12 = [
            {
              name: this.year,
              type: 'bar',
              data: arr2,
              barWidth: 20,
              itemStyle: {
                color: '#2BD478',
                borderRadius: 10,
              },
            },
          ]
          this.haveClass = arr2.reduce((prevalue, curValue) => {
            return prevalue + curValue
          }, 0)
          this.tableData = res.data.list.map((e) => {
            return {
              ...e,
              exp: e.exp_name,
            }
          })
        })
      }
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
      if (this.type === 1) {
        axios
          .post(
            process.env.VUE_APP_APP_BASEURL +
              '/teach/' +
              (roleMap[this.$store.getters.getUserMsg.role_id] || 'statistical') +
              '/classToday',
            { ...this.searchObj, token, is_explode: 1 },
            { responseType: 'blob' }
          )
          .then((res) => {
            const blob = new Blob([res.data]) // 处理文档流
            const fileName =
              this.$store.getters.getUserMsg.school.name + '-' + '今日实验室开课数.xlsx'
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
      if (this.type === 2) {
        axios
          .post(
            process.env.VUE_APP_APP_BASEURL +
              '/teach/' +
              (roleMap[this.$store.getters.getUserMsg.role_id] || 'statistical') +
              '/teacherClassList',
            { ...this.searchObj, token, is_explode: 1 },
            { responseType: 'blob' }
          )
          .then((res) => {
            const blob = new Blob([res.data]) // 处理文档流
            const fileName =
              this.$store.getters.getUserMsg.school.name + '-' + '教师开课数.xlsx'
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
      if (this.type === 3) {
        axios
          .post(
            process.env.VUE_APP_APP_BASEURL +
              '/teach/' +
              (roleMap[this.$store.getters.getUserMsg.role_id] || 'statistical') +
              '/classToday',
            { ...this.searchObj, token, is_explode: 1 },
            { responseType: 'blob' }
          )
          .then((res) => {
            const blob = new Blob([res.data]) // 处理文档流
            const fileName =
              this.$store.getters.getUserMsg.school.name + '-' + '我的开课数.xlsx'
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
.content {
  display: flex;
  margin-bottom: 10px;
  .title {
    position: relative;
    margin: 0 10px;
    width: 230px;
    height: 280px;
    border-radius: 10px;
    background: #ffffff;
    .title-header {
      position: absolute;
      top: 20px;
      left: -10px;
      display: flex;
      align-items: center;
      width: 270px;
      height: 43px;
      background: #ffe7d5;
      color: #ee9a59;
      font-size: 20px;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      border-radius: 10px;
      img {
        margin: 0 30px;
      }
    }
    .num {
      margin: 100px auto 0;
      padding: 9px;
      width: 150px;
      height: 150px;
      text-align: center;
      border-radius: 50%;
      font-size: 40px;
      color: #ffffff;
      border: #ee9a59 1px solid;
      box-sizing: border-box;
      & > p {
        width: 130px;
        height: 130px;
        line-height: 130px;
        border-radius: 50%;
        background: #ee9a59;
      }
    }
  }
  .chart-box {
    width: calc(100% - 250px);
    background: #ffffff;
    display: flex;
    align-items: center;
    p {
      margin: 0 20px 0 40px;
      display: flex;
      flex-direction: column;
      width: 20px;
    }
    .chart {
      width: calc(100% - 80px);
    }
  }
}
.today-content {
  .title {
    .title-header {
      background: #dcece3;
      color: #626572;
      img {
        margin: 0 30px;
      }
    }
    .num {
      border: #2bd478 1px solid;
      & > p {
        background: #2bd478;
      }
    }
  }
}
// .content-box {
//   display: flex;
//   margin-bottom: 20px;
//   .content {
//     border: 1px solid #C9C7C7;
//     width: 30%;
//     margin: 0 30px 0 0;
//     .title-box {
//       display: flex;
//       align-items: center;
//       background: #E6F6FE;
//       height: 80px;
//       img {
//         width: 60px;
//         height: 60px;
//         margin: 0 10px;
//       }
//       & > div {
//         margin-left: 10px;
//         line-height: 30px;
//         text-align: left;
//         font-size: 18px;
//         & > p:nth-of-type(1) {
//           color: #848484;
//           span {
//             margin-left: 10px;
//             color: #000;
//           }
//         }
//         & > p:nth-of-type(2) {
//           .margin-l {
//             margin-left: 20px;
//           }
//           span {
//             margin-right: 20px;
//           }
//         }
//       }
//     }
//     .chart-box {
//       width: 100%;
//       p {
//         color: #848484;
//       }
//       .top-text {
//         display: flex;
//         width: 100%;
//         & > div {
//           flex: 1;
//           margin: 10px;
//           .black {
//             font-size: 14px;
//             color: #000;
//           }
//         }
//       }
//       .left {
//         margin: 10px 0 0 8px;
//       }
//       .data-box {
//         text-align: left;
//         & > div {
//           display: inline-block;
//           margin: 6px 20px 10px 12px;
//           & > p:nth-of-type(2) {
//             line-height: 40px;
//             font-size: 18px;
//             color: #000;
//           }
//         }
//       }
//     }
//     .text-box {
//       padding: 0 0 0 10px;
//       text-align: left;
//       font-size: 18px;
//       line-height: 50px;
//       & > p:nth-of-type(1) {
//         color: #848484;
//         font-size: 24px;
//       }
//       & > p:nth-of-type(2) {
//         color: #848484;
//       }
//     }
//   }
// }
</style>
