<template>
  <div class="main">
    <p class="title">数据统计<i class="el-icon-arrow-right" />{{ $route.meta.title }}</p>
    <top-filter
      :options="['time_ids', 'semester', 'subject_id', 'teacher_id', 'plan_id']"
      @change="getData"
    />
    <button
      v-if="[1, 4].includes($store.getters.getUserMsg.role_id)"
      class="my-btn"
      @click="exportExcel"
    >
      导出
    </button>
    <el-table
      v-if="xAxis.length !== 0"
      :data="tableData"
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
      <el-table-column prop="name" label="实验" show-overflow-tooltip />
      <el-table-column prop="is_group" label="实验类型">
        <template #default="scope">
          <span>{{ $store.state.groupTypeList[scope.row.is_group - 1] || '' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-for="(item, index) in xAxis"
        :key="index"
        :label="
          $store.getters.getUserMsg.role_id === 4
            ? (item.teacher_name ? item.teacher_name + '/' : '') + item.calssname
            : (item.teacher_name ? item.teacher_name + '/' : '') + item.name
        "
      >
        <template #default="scope">
          {{ computedStatus(scope.row.status_array[index]?.status) }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { expPlanDetail } from '@network/infomationStatistical'
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
      xAxis: [],
      searchObj: {},
    }
  },
  computed: {
    computedStatus() {
      return (status) => {
        return status < 3
          ? '未上课'
          : status === 3
          ? '开始上课'
          : status >= 4
          ? '已完成'
          : '/'
      }
    },
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

  created() {},
  mounted() {},
  methods: {
    getData(obj) {
      this.searchObj = obj

      if (obj.plan_id) {
        expPlanDetail(obj).then((result) => {
          this.tableData = result.data.data
          this.xAxis = result.data.class
        })
      } else {
        this.tableData = []
        this.$message({
          type: 'warning',
          message: '请选择计划，若计划列表为空请选择其它筛选信息',
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
      axios
        .post(
          process.env.VUE_APP_APP_BASEURL +
            '/teach/' +
            (roleMap[this.$store.getters.getUserMsg.role_id] || 'statistical') +
            '/expPlanDetail',
          { ...this.searchObj, token, is_explode: 1 },
          { responseType: 'blob' }
        )
        .then((res) => {
          const blob = new Blob([res.data]) // 处理文档流
          const fileName =
            this.$store.getters.getUserMsg.school.name + '-' + '计划完成统计.xlsx'
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
