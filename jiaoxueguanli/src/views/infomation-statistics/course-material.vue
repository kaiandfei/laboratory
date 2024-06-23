<template>
  <div class="main">
    <p class="title">数据统计<i class="el-icon-arrow-right" />{{ $route.meta.title }}</p>
    <top-filter
      :options="['semester', 'subject_id', 'grade', 'week', 'teacher_id']"
      @change="getData"
    />
    <el-table
      :data="tableData"
      style="width: 100%"
      :header-cell-style="{}"
      :cell-style="{}"
    >
      <el-table-column type="index" prop="" label="序号" />
      <el-table-column prop="username" label="教师" />
      <el-table-column prop="classesRate" label="开课率">
        <template #default="scope"> {{ scope.row.rate }}% </template>
      </el-table-column>
      <el-table-column prop="beforeRate" label="课前资料完成比率" />
      <el-table-column prop="reportRate" label="课中资料完成比率" />
      <el-table-column prop="picture" label="课中步骤图" />
      <el-table-column prop="afterRate" label="课后资料完成比率" />
      <el-table-column prop="evaluationRate" label="评价情况" />
      <el-table-column prop="allRate" label="总体完成度" />
      <el-table-column type="index" prop="ranking" label="排名" />
    </el-table>
  </div>
</template>

<script>
import { teacherCourse } from '@network/infomationStatistical'
import TopFilter from '@components/top-filter.vue'
export default {
  name: '',
  components: {
    TopFilter,
  },
  data() {
    return {
      tableData: [],
    }
  },
  created() {},
  mounted() {},
  methods: {
    getData(obj) {
      teacherCourse(obj).then((result) => {
        this.tableData = result.data
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
}
</style>
