<template>
  <div class="main">
    <p class="title">数据统计<i class="el-icon-arrow-right" />{{ $route.meta.title }}</p>
    <top-filter
      :options="[
        'time_ids',
        'semester',
        'subject_id',
        'grade',
        $store.state.userMsg.role_id === 4 ? 'class_id' : '',
        'teacher_id',
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
    <div class="content-box">
      <div class="content">
        <el-progress
          :show-text="false"
          :stroke-width="26"
          :percentage="(requestData.all_rate * 100).toFixed(2) || 0"
          color="#EE9A59"
        />
        <div class="text-box">
          <p>
            <span>实验总开课率</span>
            <span style="color: #ee9a59"
              >{{ (requestData.all_rate * 100).toFixed(2) }}%</span
            >
          </p>
          <p>
            <span>本学期累计/本学期应开课</span>
            <span style="color: #ee9a59">{{ requestData.has_sum }}</span>
            <span> / {{ requestData.plan_num }}</span>
          </p>
        </div>
      </div>
      <div class="content">
        <el-progress
          :show-text="false"
          :stroke-width="26"
          :percentage="(requestData.group_rate * 100).toFixed(2) || 0"
          color="#05C65D"
        />
        <div class="text-box">
          <p>
            <span>分组实验开课率</span>
            <span style="color: #05c65d"
              >{{ (requestData.group_rate * 100).toFixed(2) }}%</span
            >
          </p>
          <p>
            <span>本学期累计/本学期应开课</span>
            <span style="color: #05c65d">{{ requestData.has_sum_group }}</span>
            <span> / {{ requestData.plan_num_group }}</span>
          </p>
        </div>
      </div>
      <div class="content">
        <el-progress
          :show-text="false"
          :stroke-width="26"
          :percentage="(requestData.ungroup_rate * 100).toFixed(2) || 0"
          color="#F96E6E"
        />
        <div class="text-box">
          <p>
            <span>演示实验开课率</span>
            <span style="color: #f96e6e"
              >{{ (requestData.ungroup_rate * 100).toFixed(2) }}%</span
            >
          </p>
          <p>
            <span>本学期累计/本学期应开课</span>
            <span style="color: #f96e6e">{{ requestData.has_sum_ungroup }}</span>
            <span> / {{ requestData.plan_num_ungroup }}</span>
          </p>
        </div>
      </div>
    </div>
    <el-table
      :data="requestData.list"
      style="width: 100%"
      :header-cell-style="{}"
      :cell-style="{}"
    >
      <el-table-column type="index" prop="" label="序号" />
      <el-table-column prop="" label="学科">
        <template #default="scope">
          <span>{{ scope.row.subject_name || '/' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="![4].includes($store.state.userMsg.role_id)"
        prop=""
        label="授课教师"
      >
        <template #default="scope">
          <span>{{ scope.row.teacher_name || '/' }}</span>
        </template>
      </el-table-column>

      <el-table-column
        v-if="[4].includes($store.state.userMsg.role_id)"
        prop="class_id"
        label="班级"
        sortable
      >
        <template #default="scope">
          <span>{{ $store.state.gradeArr[scope.row.grade] + scope.row.class_name }}</span>
        </template>
      </el-table-column>
      <el-table-column v-else prop="grade" label="年级" sortable>
        <template #default="scope">
          <span>{{ $store.state.gradeArr[scope.row.grade] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="all_rate"
        label="总开课率"
        sortable
        :sort-method="
          (a, b) => {
            return a.all_rate - b.all_rate
          }
        "
      >
        <template #default="scope">
          <span>{{ (scope.row.all_rate * 100).toFixed(2) }}%</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="group_rate"
        label="分组实验开课率"
        sortable
        :sort-method="
          (a, b) => {
            return a.group_rate - b.group_rate
          }
        "
      >
        <template #default="scope">
          <span>{{ (scope.row.group_rate * 100).toFixed(2) }}%</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="ungroup_rate"
        label="演示实验开课率"
        sortable
        :sort-method="
          (a, b) => {
            return a.ungroup_rate - b.ungroup_rate
          }
        "
      >
        <template #default="scope">
          <span>{{ (scope.row.ungroup_rate * 100).toFixed(2) }}%</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { classRate } from '@network/infomationStatistical'
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
      requestData: {
        subject_id: this.$store.getters.getUserMsg.subject_id,
        grade: '',
      },
      weeknow: 0,
      year: '',
      searchObj: {},
    }
  },
  computed: {
    subjectName() {
      return (val) => {
        let name = ''
        this.$store.state.subjectArr.forEach((e) => {
          console.log(
            '🚀 ~ file: experiment-opening-rate.vue:157 ~ this.$store.state.subjectArr.forEach ~ name:',
            val,
            e.id
          )
          if (val - e.id === 0) {
            name = e.name
          }
        })
        return name || '/'
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

      classRate(obj).then((res) => {
        this.requestData = res.data
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
            '/classRate',
          { ...this.searchObj, token, is_explode: 1 },
          { responseType: 'blob' }
        )
        .then((res) => {
          const blob = new Blob([res.data]) // 处理文档流
          const fileName =
            this.$store.getters.getUserMsg.school.name + '-' + '实验开课率.xlsx'
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
  justify-content: space-between;
  margin-bottom: 20px;
  .content {
    padding: 50px;
    width: 33%;
    background: #fff;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
    box-sizing: border-box;
    .text-box {
      text-align: left;
      & > p {
        margin-top: 20px;
        line-height: 40px;
        & > span {
          font-size: 40px;
        }
        & > span:nth-of-type(1) {
          display: inline-block;
          width: 260px;
          font-size: 20px;
        }
      }
    }
  }
  .left {
    text-align: left;
  }
  .red {
    color: red !important;
  }
  .green {
    color: green !important;
  }
}
</style>
