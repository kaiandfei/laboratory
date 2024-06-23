<template>
  <div class="average-container">
    <header>
      <div>
        <span>仪器设备标准</span>
        <el-icon><arrow-right /></el-icon>
        <span>生均仪器设备管理</span>
      </div>
    </header>
    <div class="title">
      <p>生均教学仪器设备管理</p>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      max-height="650"
      v-loading="tableLoading"
      element-loading-text="加载中..."
      :header-cell-style="{ background: '#EFEFEF', color: '#000' }"
      :cell-style="{ background: '#ffffff', borderBottom: '1px solid #EFEFEF' }"
    >
      <!-- <el-table-column v-for="(item, index) in columns" :key="index" :prop="item.prop" :label="item.label" /> -->
      <el-table-column label="学校学段" prop="phase_study_id">
        <template #default="scope">
          <span>{{ phaseStudyOptions[scope.row.phase_study_id - 1] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学校类别" prop="school_level">
        <template #default="scope">
          <span>{{ schoolLevelOptions[scope.row.school_level - 1] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="生均金额" prop="amount">
        <template #default="scope">
          <div class="input-box" v-if="scope.row.isShow">
            <el-input
              type="number"
              id="autoFocusId"
              v-model.number="scope.row.amount"
              @keydown="inputLimit"
              oninput="if(value>9999.99)value=9999.99"
              max="9999.99"
              clearable
            ></el-input>
          </div>
          <span v-else>{{ scope.row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="180">
        <template #default="scope">
          <span class="click-text green" v-if="!scope.row.isShow" @click="handleEdit(scope.row)">
            <img src="@assets/images/laboratory-standard/edit.png" alt="" />
            编辑
          </span>
          <span class="green" v-if="scope.row.isShow" @click="save(scope.row)">保存</span>
          <span class="green" v-if="scope.row.isShow" @click="cancel(scope.row)">取消</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getTableData, saveTableData } from '@/service/average-birth-rate/index'

const phaseStudyOptions = ['小学', '初中', '高中']
const schoolLevelOptions = ['一类', '二类', '三类']
const tableData = ref<any>([])
const tableLoading = ref(false)
const getTableDataList = async () => {
  try {
    tableLoading.value = true
    let params = {}
    const { data, code } = await getTableData(params)
    if (code === 10) {
      tableData.value = data
      tableLoading.value = false
    } else {
      tableLoading.value = false
    }
  } catch (error) {
    console.log(error)
    tableLoading.value = false
  }
}
getTableDataList()
const handleEdit = (row: any) => {
  row.isShow = true
  nextTick(() => {
    const autoFocusId: any = document.querySelector('#autoFocusId')
    if (autoFocusId) {
      autoFocusId.focus()
    }
  })
}
const save = async (row: any) => {
  console.log('row', row)
  row.amount = String(row.amount)
  row.amount =
    row.amount.indexOf('.') != -1 ? row.amount.split('.')[0] + '.' + row.amount.split('.')[1].slice(0, 2) : row.amount
  if (row.amount === '') {
    ElMessage({ type: 'warning', message: '生均金额不能为空！！！' })
    return
  }
  row.isShow = false
  try {
    let params = {
      id: row.id,
      amount: Number(row.amount)
    }
    const { code } = await saveTableData(params)
    if (code === 10) {
      ElMessage({ type: 'success', message: '保存成功' })
      getTableDataList()
    }
  } catch (error) {
    console.log(error)
  }
}
const cancel = (row: any) => {
  row.isShow = false
}
// const blur = (e: any, row: any) => {
//   row.isShow = false
//   row.amount = String(row.amount.toFixed(2))
//   console.log('222', row)
// }
const inputLimit = (e: any) => {
  console.log('e', e)
  let key = e.key
  if (key === 'e' || key === '-' || key === '+' || key === 'Shift') {
    e.returnValue = false
    return false
  }
  return true
}
</script>

<style lang="scss" scoped>
.average-container {
  text-align: left;
  .title {
    width: 100%;
    height: 60px;
    line-height: 60px;
    color: #05c65d;
    font-size: 20px;
    background: #dcece3;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
    margin: 10px 0;
    padding: 0 30px;
    box-sizing: border-box;
  }
}
.green {
  color: #05c65d;
  margin-right: 10px;
}
.click-text {
  display: flex;
  align-items: center;
  cursor: pointer;

  img {
    margin-right: 6px;
  }
}
</style>
