<template>
  <div class="instrument-box">
    <el-table class="table-box" :data="tableData" border style="width: 100%">
      <el-table-column type="index" label="序号" width="50px" />
      <el-table-column prop="material_number" label="仪器编号" />
      <el-table-column prop="materialname" label="仪器名称" />
      <el-table-column prop="info" label="仪器规格" show-overflow-tooltip />
      <el-table-column v-if="is_detail" prop="num" label="仪器数量" />
      <el-table-column v-if="!is_detail" label="仪器数量">
        <template #default="scope" class="btn">
          <div>
            <el-input-number v-model="scope.row.num" :min="0" :max="scope.row.total" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" v-if="is_del" align="center">
        <template #default="scope">
          <el-button @click="handleClick(scope.$index)" type="text">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="!is_detail" class="add" @click="add">+新增仪器</div>
    <el-dialog title="添加仪器" v-model="dialogVisible" width="36%">
      <div style="display: flex">
        <p style="width: 80px; line-height: 34px">新增仪器</p>
        <el-input v-model="input" placeholder="请输入内容" @change="add" />
      </div>
      <div class="tab-box">
        <el-table
          ref="multipleTable"
          :data="tableData1"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="number" label="仪器编号" width="150" />
          <el-table-column prop="name" label="仪器名称" width="150" />
          <el-table-column prop="specification" label="规格" show-overflow-tooltip />
        </el-table>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="determine">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ExpMaterialFind, findExpMaterialbynumber } from '@service/teaching/experimentPlan'
export default {
  name: 'Instrument',
  props: {
    expNumber: {
      type: String
    },
    is_del: {
      type: Number
    },
    is_detail: {
      type: Boolean,
      default: false
    },
    subject_id: {
      type: Number
    }
  },
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      input: '',
      tableData1: [],
      tableData2: [],
      num: 0
    }
  },
  created() {
    const data = {
      exp_number: this.expNumber
    }
    findExpMaterialbynumber(data).then((res) => {
      console.log(res)
      if (res.code === 10) {
        res.data.map((item, index) => {
          item.index = index + 1
          item.pid = 0
          item.number = item.material_number
          item.name = item.materialname
        })
        this.tableData = res.data
      }
    })
  },
  methods: {
    handleClick(index) {
      this.tableData.splice(index, 1)
    },
    add() {
      console.log(1)
      this.dialogVisible = true
      const data = {
        subject_id: this.subject_id,
        name: this.input
      }
      ExpMaterialFind(data).then((res) => {
        console.log(res)
        this.tableData1 = res.data
      })
    },

    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log(val)
      this.tableData2 = val
    },
    determine(val) {
      this.dialogVisible = false
      this.tableData2.map((item, index) => {
        item.index = index + 1
        item.material_number = item.number
        item.materialname = item.name
        item.info = item.specification
        item.num = 1
      })
      this.tableData2 = JSON.parse(JSON.stringify(this.tableData2))
      this.tableData.push(...this.tableData2)
    },
    handleAdd(index) {
      console.log(index)
      this.num++
    },
    handleReduce() {
      this.num--
    }
  }
}
</script>

<style lang="scss" scoped>
.table-box {
  ::v-deep .el-table__body-wrapper {
    .el-table__row {
      background-color: #f6f6f6;
    }
  }
}

.add {
  height: 40px;
  border: 1px solid #ebeef5;
  border-top: none;
  text-align: center;
  line-height: 40px;
  color: #05c65d;
  background-color: #f6f6f6;
}

::v-deep .el-dialog__body {
  .el-table__body-wrapper {
    height: 250px;
    overflow: hidden;
  }
}
.instrument-box {
  :deep(.el-input-number) {
    width: 100px;
    line-height: 20px;
    .el-input-number__decrease,
    .el-input-number__increase {
      top: 1px;
    }
    .el-input {
      width: 100%;
      line-height: 20px;

      & > .el-input__inner {
        width: 100%;
        height: 20px;
        line-height: 20px;
      }
    }
  }
}
.tab-box {
  margin-top: 10px;
  padding: 0 0 10px;
  width: 100%;
}
.tab-box ::v-deep .el-table__body-wrapper {
  overflow-y: auto;
}
.tab-box ::v-deep .el-table__body-wrapper::-webkit-scrollbar {
  width: 0;
}
// ::v-deep .cell {
//   display: flex;
//   align-items: center;
//   p {
//     margin: 0 5px;
//   }
// }
</style>
