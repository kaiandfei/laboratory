<template>
  <div class="container">
    <el-table
      :data="tableData"
      :style="{
        color: option.contentColor,
        fontSize: option.contentSize + 'px',
        width: '100%',
      }"
      :max-height="250"
      :show-header="false"
    >
      <el-table-column prop="section" align="left" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="expName" align="left" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="className" align="left" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="username" align="left" show-overflow-tooltip>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { gradeList, sectionList } from '@/contants/index.js'
export default {
  props: {
    labBookData: {
      type: Array,
      default: () => [],
    },
    option: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      tableData: [],
    }
  },
  mounted() {
    this.format(this.labBookData)
  },
  methods: {
    format(data) {
      this.tableData = []
      data.forEach((item) => {
        let obj = {}
        obj['section'] = `第${sectionList[item.section - 1]}节`
        obj['expName'] = item.expName
        obj['className'] = gradeList[parseInt(item.grade) - 1] + item.className
        obj['username'] = item.teacherInfo.username
        this.tableData.push(obj)
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  background: #ffffff;
  // box-shadow: 0px 3px 6px 1px #61cab5;
  // border-radius: 10px;
  // border: 1px solid #61cab5;
  overflow: auto;
  .el-table {
    border-radius: 10px;
  }
}
</style>
