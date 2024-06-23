<template>
  <div class="main">
    <div class="recommend">
      <p class="text-box">
        <span>计划命名:</span>
        <el-input v-model.trim="editForm.title" :disabled="editForm.selfbuilt === 2"></el-input>
      </p>
      <div class="btn_box">
        <vue3-json-excel
          :json-data="editForm.schoolbuyplandetail.length === 0 ? [{}] : editForm.schoolbuyplandetail"
          :fields="fields"
          :name="store.state.login.userInfo.school.name + '_采购计划清单导入表'"
          header="分类编号必填，且为基础仪器列表中存在仪器"
        >
          <div class="btn">下载导入模版</div>
        </vue3-json-excel>
        <el-upload :show-file-list="false" class="upload-demo" action="" :auto-upload="false" :on-change="uploadChange">
          <div class="btn">导入数据</div>
        </el-upload>

        <div class="btn" @click="addOne()">+新增一条仪器设备</div>
        <div class="btn" @click="save()">保存</div>
      </div>
    </div>
    <el-table
      :data="editForm.schoolbuyplandetail"
      style="width: 100%"
      stripe
      v-loading="loading"
      :header-cell-style="{ color: '#000', borderBottom: '1px solid #c9c7c7' }"
      max-height="600"
    >
      <el-table-column type="index" label="序号" width="60" align="left"></el-table-column>
      <el-table-column label="编号" prop="" align="left">
        <template #default="scope">
          <div>
            <span v-if="scope.row.id !== 0">{{ scope.row.instrument_number }}</span>
            <el-autocomplete
              v-if="scope.row.id === 0"
              v-model="searchInput"
              :fetch-suggestions="querySearch"
              placeholder="搜索"
              value-key="number"
              @select="handleSelect"
            ></el-autocomplete>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="仪器名称" prop="instrument_name" align="left" show-overflow-tooltip>
        <template #default="scope">
          <div>
            <span v-if="scope.row.id !== 0">{{ scope.row.instrument_name }}</span>
            <!-- <el-autocomplete
              v-if="scope.row.id === 0"
              v-model="searchInput"
              :fetch-suggestions="querySearchAsync"
              placeholder="搜索"
              value-key="name"
              @select="handleSelect"
            ></el-autocomplete> -->
          </div>
        </template>
      </el-table-column>
      <el-table-column label="规格" prop="specification" align="left" show-overflow-tooltip></el-table-column>
      <el-table-column label="单位" prop="unit" align="left"></el-table-column>
      <el-table-column label="数量" prop="" align="left">
        <template #default="scope">
          <input v-if="scope.row.id !== 0" class="myInput" v-model="scope.row.total" @input="inputAdjust" />
        </template>
      </el-table-column>
      <el-table-column label="参考价格" prop="" align="left">
        <template #default="scope">
          <input v-if="scope.row.id !== 0" class="myInput" v-model="scope.row.price" @input="inputAdjust" />
        </template>
      </el-table-column>
      <el-table-column prop="" label="类型" align="left">
        <template #default="scope">
          <span>{{ scope.row.type === 1 ? '仪器' : scope.row.type === 2 ? '设备' : '' }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column v-if="false" prop="" label="配备类型" align="left">
        <template #default="scope">
          <span>{{ scope.row.is_must === 1 ? '必配' : scope.row.is_must === 2 ? '选配' : '' }}</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="" label="分类" align="left">
        <template #default="scope">
          <span>{{ scope.row.cost_type === 1 ? '低值易耗' : scope.row.cost_type === 2 ? '非低值易耗' : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="" label="操作" align="center">
        <template #default="scope">
          <p class="del-text" @click="deleteOne(scope.$index)">
            <img src="@assets/images/laboratory-standard/delete.png" alt="" />
            删除
          </p>
        </template>
      </el-table-column>
    </el-table>

    <footer>
      <div>
        备注：
        <el-input v-model="editForm.submit_desc" :rows="2" type="textarea" placeholder="请输入备注" />
      </div>
      <p>
        合计：
        <span>{{ computedSum }}</span>
      </p>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, computed } from 'vue'
import { inputAdjust } from '@/utils/common'
// import { TimeoutHandle } from 'element-plus/es/utils/types'

import { exportTableAsXLSX, uploadFile } from '@/utils/excel'
import {
  addSchoolBuyPlan,
  planListAddReportOfDetail,
  saveEditPlan
} from '@service/instrument-procurement-plan/plan-list'
import { getBaseInstrument } from '@service/equiment-standard/base-message/index'
import { ListData } from '@service/equiment-standard/base-message/types'
import {
  SchoolBuyPlanDetailType,
  DetailBuyPlanListDataChildren
} from '@service/instrument-procurement-plan/report-manage/types'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useStore } from '@/store'

let store = useStore()

let props = defineProps({ itemId: { type: Number, required: true } })
let { itemId } = toRefs(props)

let emit = defineEmits(['back'])

const dataMap = reactive({
  editForm: {
    title: '',
    submit_desc: '',
    selfbuilt: 1,
    submit_money: 0,
    schoolbuyplandetail: Array<SchoolBuyPlanDetailType>()
  },
  searchInput: '',
  searchTableData: Array<ListData>(),
  fields: {
    编号: 'instrument_number',
    数量: 'total',
    参考价格: 'price'
  },
  loading: false
})
let { editForm, searchInput, searchTableData, fields, loading } = toRefs(dataMap)

if (itemId.value !== 0) {
  planListAddReportOfDetail({ id: itemId.value }).then((res) => {
    editForm.value = res.data
  })
}

const addOne = () => {
  let len = editForm.value.schoolbuyplandetail.length
  if (len === 0 || editForm.value.schoolbuyplandetail[len - 1].id !== 0) {
    editForm.value.schoolbuyplandetail.push(DetailBuyPlanListDataChildren)
  } else {
    ElMessage({
      type: 'warning',
      message: '有新增的数据未填写'
    })
  }
}

const deleteOne = (index: number) => {
  editForm.value.schoolbuyplandetail.splice(index, 1)
}

// const exportExcel = () => {
//   exportTableAsXLSX('selectTable', 'feedback')
// }

const uploadChange = (file) => {
  loading.value = true
  //  const res = uploadFile()
  uploadFile(file).then((res) => {
    let resData = res.filter((e) => e.some((m) => m !== ''))
    let errorArr = Array<any>()
    for (let i = 2; i < resData.length; i++) {
      let item = searchTableData.value.find((e) => e.number === resData[i][0].toString())
      if (item) {
        editForm.value.schoolbuyplandetail.push({
          id: item.id,
          instrument_number: item.number,
          instrument_name: item.name,
          specification: item.specification,
          total: resData[i][1],
          type: item.type.value,
          price: resData[i][2],
          recommend_total: 0,
          unit: item.unit,
          is_must: item.is_must.value,
          cost_type: item.cost_type.value
        })
      } else {
        errorArr.push(resData[i][0])
      }
    }
    if (errorArr.length !== 0) {
      let arrNull = errorArr.filter((e) => !e)
      console.log('🚀 ~ file: add-plan.vue:214 ~ uploadFile ~ arrNull:', arrNull)
      let arrErr = errorArr.filter((e) => e)
      console.log('🚀 ~ file: add-plan.vue:216 ~ uploadFile ~ arrErr:', arrErr)

      ElMessageBox.alert(
        (arrNull.length !== 0 ? '导入的数据分类编号不能为空！' : '') +
          (arrErr.length !== 0 ? '以下编号导入错误，请检查编号是否正确：' + arrErr.join(',') : ''),
        '提示',
        {
          confirmButtonText: '确定',
          callback: (action) => {
            console.log('🚀 ~ file: add-plan.vue:225 ~ uploadFile ~ action:', action)
            // ElMessage({
            //   type: 'info',
            //   message: `action: ${action}`
            // })
          }
        }
      )
    }

    loading.value = false
    console.log('🚀 ~ file: add-plan.vue:192 ~ uploadFile ~ errorArr:', errorArr)
  })
}

const getList = () => {
  getBaseInstrument({
    explode: 1,
    page: 1,
    number: '',
    page_size: 10000
  }).then((res) => {
    searchTableData.value = res.data.data
  })
}

getList()

// let timeout: TimeoutHandle
const querySearch = (queryString: string, cb: (arg: any) => void) => {
  const results = queryString ? searchTableData.value.filter(createFilter(queryString)) : searchTableData.value
  console.log('🚀 ~ file: add-plan.vue:174 ~ querySearch ~ results:', results)
  cb(results)
}
const createFilter = (queryString: string) => {
  return (restaurant: ListData) => {
    return restaurant.number.toLowerCase().indexOf(queryString.toLowerCase()) >= 0
  }
}

const handleSelect = (item: ListData) => {
  searchInput.value = ''
  editForm.value.schoolbuyplandetail.pop()
  editForm.value.schoolbuyplandetail.push({
    id: item.id,
    instrument_number: item.number,
    instrument_name: item.name,
    specification: item.specification,
    total: 0,
    type: item.type.value,
    price: 0,
    recommend_total: 0,
    unit: item.unit,
    is_must: item.is_must.value,
    cost_type: item.cost_type.value
  })
}

const computedSum = computed(() => {
  let sum = 0
  editForm.value.schoolbuyplandetail.forEach((e) => {
    sum += e.total * e.price
  })
  return Math.round(sum * 100) / 100
})

const save = () => {
  if (editForm.value.title === '') {
    ElMessage({
      type: 'warning',
      message: '名称不可为空'
    })
    return
  }
  editForm.value.submit_money = computedSum.value
  if (editForm.value.schoolbuyplandetail[editForm.value.schoolbuyplandetail.length - 1]?.id === 0) {
    editForm.value.schoolbuyplandetail.pop()
  }
  if (itemId.value === 0) {
    addSchoolBuyPlan(editForm.value).then((res) => {
      if (res.code === 10) {
        ElMessage({
          type: 'success',
          message: res.msg
        })
        emit('back')
      }
    })
  } else {
    saveEditPlan({ id: itemId.value, ...editForm.value }).then((res) => {
      if (res.code === 10) {
        ElMessage({
          type: 'success',
          message: res.msg
        })
        emit('back')
      }
    })
  }
}
</script>

<style scoped lang="scss">
.main {
  .recommend {
    margin-top: 10px;
    padding: 0 30px;
    width: 100%;
    height: 60px;
    background: #dcece3;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    .text-box {
      color: #333333;
      display: flex;
      align-items: center;
      white-space: nowrap;
      & > span {
        margin-right: 10px;
        color: #848484;
      }
    }
    .btn_box {
      display: flex;
      .btn {
        margin-left: 20px;
        box-sizing: border-box;
      }
      .white_btn {
        background: #ffffff;
        color: #05c65d;
        border: #05c65d 1px solid;
      }
    }
  }
  :deep(.el-table) {
    margin-top: 10px;
    .del-text {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      img {
        margin-right: 6px;
      }
    }
    .myInput {
      width: 80px;
      height: 30px;
      border: 1px #c9c7c7 solid;
    }
    .el-autocomplete {
      width: 100px;
      height: 100%;
      .el-input {
        width: 100%;
        height: 100%;
        height: 100%;
      }
      .el-input__inner {
        width: 100%;
      }
    }
  }
  footer {
    & > div {
      margin: 10px 0;
      font-size: 16px;
      text-align: left;
    }
    & > p {
      text-align: right;

      padding: 15px 20px 30px;
      font-size: 18px;
      & > span {
        color: #05c65d;
        font-weight: bold;
      }
    }
  }
}
.btn {
  padding: 0 30px;
  height: 36px;
  line-height: 36px;
  background: #05c65d;
  color: #ffffff;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
  opacity: 1;
  border-radius: 10px;
  cursor: pointer;
}

.green-font {
  color: #05c65d;
}
.red-font {
  color: #de4747;
}
</style>
