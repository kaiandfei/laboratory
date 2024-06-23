<template>
  <div class="main">
    <div class="recommend">
      <p class="text-box">
        <span>计划命名:</span>
        <el-input v-model.trim="editForm.title"></el-input>
      </p>
      <div class="btn_box">
        <!-- <div class="btn" @click="addOne()">+新增一条仪器设备</div> -->
        <div class="btn" @click="save()">保存</div>
      </div>
    </div>
    <el-table
      :data="editForm.schoolbuyplandetail"
      style="width: 100%"
      stripe
      :header-cell-style="{ color: '#000', borderBottom: '1px solid #c9c7c7' }"
      max-height="600"
    >
      <el-table-column type="index" label="序号" width="60" align="left"></el-table-column>
      <el-table-column label="编号" prop="" align="left">
        <template #default="scope">
          <div>
            <span v-if="scope.row.id !== 0">{{ scope.row.instrument_number }}</span>
            <!-- <el-autocomplete
              v-if="scope.row.id === 0"
              v-model="searchInput"
              :fetch-suggestions="querySearchAsync"
              placeholder="搜索"
              value-key="number"
              @select="handleSelect"
            ></el-autocomplete> -->
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
      <!-- <el-table-column prop="" label="配备类型" align="left">
        <template #default="scope">
          <span>{{ scope.row.is_must === 1 ? '必配' : scope.row.is_must === 2 ? '选配' : '' }}</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="" label="分类" align="left">
        <template #default="scope">
          <span>{{ scope.row.cost_type === 1 ? '低值易耗' : scope.row.cost_type === 2 ? '非低值易耗' : '' }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="" label="操作" align="left">
        <template #default="scope">
          <p class="del-text" @click="deleteOne(scope.$index)">
            <img src="@assets/images/laboratory-standard/delete.png" alt="" />
            删除
          </p>
        </template>
      </el-table-column> -->
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

import {
  addSchoolBuyPlan
  // planListAddReportOfDetail,
  // saveEditPlan
} from '@service/instrument-procurement-plan/plan-list'
// import { getBaseInstrument } from '@service/equiment-standard/base-message/index'
// import { ListData } from '@service/equiment-standard/base-message/types'
import {
  SchoolBuyPlanDetailType
  // DetailBuyPlanListDataChildren
} from '@service/instrument-procurement-plan/report-manage/types'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

let router = useRouter()

let props = defineProps({ schoolbuyplandetail: { type: Array as () => Array<any>, required: true } })
let { schoolbuyplandetail } = toRefs(props)
console.log('🚀 ~ file: add-plan.vue ~ line 120 ~ schoolbuyplandetail', schoolbuyplandetail)

// let emit = defineEmits(['back'])

const dataMap = reactive({
  editForm: {
    title: '',
    submit_desc: '',
    selfbuilt: 1,
    submit_money: 0,
    schoolbuyplandetail: Array<SchoolBuyPlanDetailType>()
  }
  // searchInput: '',
  // searchTableData: Array<ListData>()
})
let { editForm } = toRefs(dataMap)

editForm.value.schoolbuyplandetail = schoolbuyplandetail.value.map((e) => {
  return {
    // buy_plan_subject_id?: number,
    cost_type: e.cost_type.value,
    id: e.id,
    instrument_name: e.name,
    instrument_number: e.number,
    is_must: e.is_must,
    price: e.priceReference,
    recommend_total: e.recommend_total,
    // school_buy_plan_id?: number,
    specification: e.specification,
    total: e.adjustCount,
    type: e.type,
    unit: e.unit
  }
})

// const addOne = () => {
//   let len = editForm.value.schoolbuyplandetail.length
//   if (len === 0 || editForm.value.schoolbuyplandetail[len - 1].id !== 0) {
//     editForm.value.schoolbuyplandetail.push(DetailBuyPlanListDataChildren)
//   } else {
//     ElMessage({
//       type: 'warning',
//       message: '有新增的数据未填写'
//     })
//   }
// }

// const deleteOne = (index: number) => {
//   editForm.value.schoolbuyplandetail.splice(index, 1)
// }

// const createFilter = (queryString: string) => {
//   return (restaurant: ListData) => {
//     return restaurant.number.toLowerCase().indexOf(queryString.toLowerCase()) === 0
//   }
// }

// const handleSelect = (item: ListData) => {
//   searchInput.value = ''
//   editForm.value.schoolbuyplandetail.pop()
//   editForm.value.schoolbuyplandetail.push({
//     id: item.id,
//     instrument_number: item.number,
//     instrument_name: item.name,
//     specification: item.specification,
//     total: 0,
//     type: item.type.value,
//     price: 0,
//     recommend_total: 0,
//     unit: item.unit,
//     is_must: item.is_must.value,
//     cost_type: item.cost_type.value
//   })
// }

const computedSum = computed(() => {
  let sum = 0
  editForm.value.schoolbuyplandetail.forEach((e) => {
    sum += e.total * e.price
  })
  return isNaN(sum) ? 0 : sum
})

const save = () => {
  if (editForm.value.title === '') {
    ElMessage({
      type: 'warning',
      message: '名称不可为空'
    })
    return
  }
  addSchoolBuyPlan(editForm.value).then((res) => {
    if (res.code === 10) {
      ElMessage({
        type: 'success',
        message: res.msg
      })
      router.push({
        name: 'InstrumentPlanList'
      })
    }
  })
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
