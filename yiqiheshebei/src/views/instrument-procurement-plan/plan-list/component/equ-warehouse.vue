<template>
  <div class="main">
    <div class="title-box">待入库</div>

    <div
      class="room_sel"
      v-show="itemData.school_audit === 3 && itemData.subject_audit === 3 && tableData.length !== 0 && editStatus"
    >
      <span>实验室：</span>
      <el-select v-model="batchAll.laboratory_id" @change="getStoreData(batchAll.laboratory_id)" clearable>
        <el-option v-for="(e, index) in optionsLaboratory" :key="index" :label="e.title" :value="e.id"></el-option>
      </el-select>
      <span v-show="batchAll.laboratory_id !== ''">仪器柜：</span>
      <el-select v-show="batchAll.laboratory_id !== ''" v-model="batchAll.store_id" @change="setPlies" clearable>
        <el-option v-for="(e, i) in storeListBody" :key="i" :label="e.title" :value="e.id"></el-option>
      </el-select>
      <span v-show="batchAll.store_id !== ''">层数：</span>
      <el-select v-show="batchAll.store_id !== ''" v-model="batchAll.number_plies" clearable>
        <el-option v-for="(e, i) in optionPliesBody" :key="i" :label="e.name" :value="e.value"></el-option>
      </el-select>
      <p class="btn fr" @click="save">确认入库</p>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      :header-cell-style="{ background: '#EFEFEF', color: '#000' }"
      :cell-style="{ background: '#ffffff', borderBottom: '1px solid #EFEFEF' }"
    >
      <el-table-column type="index" label="序号" width="60" align="left"></el-table-column>
      <el-table-column label="*分类编号" prop="number" align="left" width="90"></el-table-column>
      <el-table-column label="资产编号" width="120" align="left">
        <template #default="scope">
          <input class="short-input" v-model="scope.row.asset_number" />
          <!-- <input v-show="editStatus" v-model="scope.row.asset_number" /> -->
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="name" align="left" show-overflow-tooltip></el-table-column>
      <el-table-column label="规格型号" prop="specification" align="left" show-overflow-tooltip></el-table-column>
      <el-table-column label="单位" prop="unit" width="50" align="left"></el-table-column>
      <!-- <el-table-column label="标准分类" align="left">
        <template #default="scope">
          <select v-model="scope.row.level">
            <option v-for="item in optionLevel" :key="item.value" :label="item.name" :value="item.value"></option>
          </select>
        </template>
      </el-table-column> -->
      <el-table-column label="入库来源" align="left">
        <template #default="scope">
          <select v-model="scope.row.source">
            <option v-for="item in optionCome" :key="item.value" :label="item.name" :value="item.value"></option>
          </select>
        </template>
      </el-table-column>
      <el-table-column label="凭证号" prop="" width="120" align="left">
        <template #default="scope">
          <input v-model="scope.row.voucher_number" />
        </template>
      </el-table-column>
      <el-table-column label="采购批次" prop="" width="120" align="left">
        <template #default="scope">
          <input v-model="scope.row.bacth" />
        </template>
      </el-table-column>
      <el-table-column label="厂家" prop="" width="120" align="left">
        <template #default="scope">
          <input v-model="scope.row.factory" />
        </template>
      </el-table-column>
      <el-table-column label="单价" prop="" width="200" align="left">
        <template #default="scope">
          <input class="short-input" v-model="scope.row.unit_price" />
        </template>
      </el-table-column>
      <!-- <el-table-column label="实验室" align="left" width="120">
        <template #default="scope">
          <select
            v-model="scope.row.school_laboratory_id"
            @change="getStoreData(scope.row.school_laboratory_id, scope.$index)"
            :disabled="!editStatus"
          >
            <option v-for="(e, index) in optionsLaboratory" :key="index" :label="e.title" :value="e.id"></option>
          </select>
        </template>
      </el-table-column>
      <el-table-column label="仪器柜" align="left" width="120">
        <template #default="scope">
          <select v-model="scope.row.store_id" @change="setPlies(scope.$index)" :disabled="!editStatus">
            <option v-for="(e, i) in storeListBody[scope.$index]" :key="i" :label="e.title" :value="e.id"></option>
          </select>
        </template>
      </el-table-column>
      <el-table-column label="层数" align="left">
        <template #default="scope">
          <select v-model="scope.row.number_plies" :disabled="!editStatus">
            <option v-for="(e, i) in optionPliesBody[scope.$index]" :key="i" :label="e.name" :value="e.value"></option>
          </select>
        </template>
      </el-table-column> -->
      <el-table-column label="数量" align="left">
        <template #default="scope">
          <!-- <input v-show="editStatus" class="short-input" v-model="scope.row.total" @input="inputAdjust" /> -->
          <span>{{ scope.row.total }}</span>
        </template>
      </el-table-column>

      <el-table-column label="负责人" align="left" width="120">
        <template #default="scope">
          <select
            v-model="scope.row.user[0].id"
            filterable
            placeholder="请选择"
            @change="usercheck(scope.row.user[0].id, scope.row.user[0])"
          >
            <option v-for="item in userList" :key="item.id" :label="item.username" :value="item.id"></option>
          </select>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120">
        <template #default="scope">
          <img src="@images/common/del-red.png" alt="" @click="tableData.splice(scope.$index, 1)" />
        </template>
      </el-table-column>
    </el-table>

    <div class="title-box">已入库</div>
    <el-table
      :data="tableData1"
      style="width: 100%"
      :header-cell-style="{ background: '#EFEFEF', color: '#000' }"
      :cell-style="{ background: '#ffffff', borderBottom: '1px solid #EFEFEF' }"
    >
      <el-table-column type="index" label="序号" width="60" align="left"></el-table-column>
      <el-table-column label="分类编号" prop="school_instrument_number" width="120" align="left"></el-table-column>
      <el-table-column label="资产编号" prop="asset_number" align="left"></el-table-column>
      <el-table-column label="名称" prop="name" show-overflow-tooltip align="left"></el-table-column>
      <el-table-column label="规格" prop="specification" show-overflow-tooltip></el-table-column>
      <el-table-column label="数量" prop="total" align="left"></el-table-column>

      <el-table-column label="单位" prop="unit" width="50" align="left"></el-table-column>
      <el-table-column label="凭证号" prop="voucher_number" width="120" align="left"></el-table-column>
      <el-table-column label="采购批次" prop="bacth" width="120" align="left"></el-table-column>
      <el-table-column label="厂家" prop="factory" width="160" align="left"></el-table-column>
      <el-table-column label="单价" prop="unit_price" width="100" align="left"></el-table-column>
      <el-table-column label="位置" align="left" prop=" " width="120">
        <template #default="scope">
          {{
            scope.row.laboratory_name +
            (scope.row.store_name !== '' ? '/' + scope.row.store_name : '') +
            (scope.row.number_plies !== 0 ? '/第' + scope.row.number_plies + '层' : '')
          }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, computed } from 'vue'
// import { inputAdjust } from '@/utils/common'
import { useStore } from '@/store'

import { getLaboratoryList } from '@/service/instrument-manage/equ-manage/index'
import { storeByLaboratory } from '@service/laboratory-manage/overview/index'

// import { postBatchInstrumentCg } from '@service/instrument-procurement-plan/plan-list'
import { BatchWarehousingList } from '@service/instrument-manage/batch-instrument-warehouse/types'
import {
  getSchoolBuyPlanDetail,
  equipmentAddcg,
  getSchoolBuyPlanSubjectDetail
} from '@service/instrument-procurement-plan/plan-list'
import { ListItem } from '@service/instrument-procurement-plan/plan-list/types'
import { findSchoolUser } from '@/service/equ-manage/add-equ-warehouse/index'

import { ElMessage } from 'element-plus'

let props = defineProps({
  itemData: { type: Object as () => ListItem, required: true },
  editStatus: { type: Boolean, default: true }
})
let { itemData } = toRefs(props)

// let emit = defineEmits(['back'])

const dataMap = reactive({
  batchAll: { laboratory_id: '', store_id: '', number_plies: '', data: Array<any>() },
  tableData: Array<BatchWarehousingList>(),
  tableData1: Array<BatchWarehousingList>(),
  userList: Array<any>(),
  optionsLaboratory: Array<{ id: number; title: string }>(),
  storeListBody: Array<{ id: number; title: string; number_plies: number }>(),
  optionPliesBody: Array<{ value: number; name: string }>()
})
let { batchAll, tableData, tableData1, userList, optionsLaboratory, storeListBody, optionPliesBody } = toRefs(dataMap)

let store = useStore()

const getData = (id: number) => {
  getSchoolBuyPlanDetail({
    buy_plan_subject_id: id,
    type: 2,
    is_check: 2
  }).then((res) => {
    let arr = Array<BatchWarehousingList>()
    res.data.forEach((e) => {
      let obj: any = {
        id: e.id,
        name: e.instrument_name,
        number: e.instrument_number,
        asset_number: '',
        // asset_number: store.state.login.userInfo.school_code || e.number,
        // category: e.category,
        specification: e.specification,
        school_instrument_number: e.school_instrument_number,
        school_instrument_id: 0,
        instrument_id: 0,
        cost_type: e.cost_type,
        unit: e.unit,
        // info: e.info,
        // number_year: e.number_year,
        // norm: e.norm,
        // school_laboratory_id: e.laboratory_id || tableData.value[tableData.value.length - 1]?.school_laboratory_id, //实验室id
        // store_id: e.store_id || tableData.value[tableData.value.length - 1]?.store_id, //仪器柜id
        // number_plies: e.number_plies || tableData.value[tableData.value.length - 1]?.number_plies, //层数
        total: e.total - e.putstoragecount, //入库数量
        source: 1,
        // level: 1,
        bacth: '',
        voucher_number: '',
        factory: '',
        unit_price: e.price,
        user: [{ name: store.state.login.userInfo.username, id: store.state.login.userInfo.id }],
        type: 2
      }
      if (obj.total !== 0) {
        for (let i = 0; i < obj.total; i++) {
          let obj1 = JSON.parse(JSON.stringify(obj))
          arr.push({
            ...obj1,
            total: 1
          })
        }
      }
    })
    tableData.value = arr
  })
  getSchoolBuyPlanSubjectDetail({
    id,
    type: 2
  }).then((res) => {
    tableData1.value = res.data
  })
}
getData(itemData.value.id)

findSchoolUser().then((res) => {
  userList.value = res.data
})
const usercheck = (id: number, item: any) => {
  let obj = userList.value.find((e) => e.id === id)
  item.name = obj.username
  item.id = obj.id
}

getLaboratoryList({ subject: store.state.login.userInfo.subject_id || '' }).then((res) => {
  optionsLaboratory.value = res.data.data
})

const getStoreData = (id: number | string) => {
  storeByLaboratory({ id: Number(id) || 0 }).then((res) => {
    storeListBody.value = res.data
    batchAll.value.store_id = ''
    batchAll.value.number_plies = ''
  })
}

const setPlies = () => {
  optionPliesBody.value = optionPlies.value(storeListBody.value, batchAll.value.store_id)
  batchAll.value.number_plies = ''
}

let optionPlies = computed(() => {
  return (list: { id: number; number_plies: number }[], storeId: number | string) => {
    let num = 1
    list.forEach((e) => {
      if (e.id === storeId) {
        num = e.number_plies
      }
    })
    let arr = Array<{
      value: number
      name: string
    }>()
    for (let i = 0; i < num; i++) {
      const obj = {
        value: i + 1,
        name: `第${i + 1}层`
      }
      arr.push(obj)
    }
    return arr
  }
})

const save = () => {
  if (batchAll.value.laboratory_id === '') {
    ElMessage({
      type: 'error',
      message: '请选择入库位置！'
    })
    return
  }
  batchAll.value.data = tableData.value
  equipmentAddcg({ id: itemData.value.id, ...batchAll.value }).then((res) => {
    if (res.code === 10) {
      ElMessage({
        type: 'success',
        message: res.msg
      })
      getData(itemData.value.id)
    }
  })
}

const optionCome = reactive([
  {
    value: 1,
    name: '集采'
  },
  {
    value: 2,
    name: '自制'
  },
  {
    value: 3,
    name: '馈赠'
  },
  {
    value: 4,
    name: '自购'
  },
  {
    value: 5,
    name: '调拨'
  }
])
const optionLevel = reactive([
  {
    value: 1,
    name: 'Ⅰ类'
  },
  {
    value: 2,
    name: 'Ⅱ类'
  },
  {
    value: 3,
    name: 'Ⅲ类'
  }
])
// const cellStyle = (scope: any) => {
//   if ('children' in scope.row) {
//     return 'background: rgba(194, 227, 209, 0.39)'
//   }
// }
</script>

<style scoped lang="scss">
.main {
  .title-box {
    margin-top: 10px;
    padding-left: 34px;
    height: 46px;
    line-height: 48px;
    background: #fff;
    font-size: 16px;
    font-weight: bold;
    color: #05c65d;
    text-align: left;
    border-bottom: #05c65d 2px solid;
  }
  .recommend {
    margin-top: 10px;
    padding: 0 30px;
    width: 100%;
    height: 60px;
    background: #dcece3;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);

    .text-box {
      font-size: 20px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #333333;
      span:nth-of-type(1) {
        margin-right: 30px;
        color: #05c65d;
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
  .room_sel {
    height: 50px;
    line-height: 50px;
    text-align: left;
    span {
      margin-left: 12px;
    }
  }
  .status_box {
    padding: 0 30px;
    display: flex;
    justify-content: space-around;
    width: 100%;
    height: 80px;
    background: #ffffff;
    box-sizing: border-box;
    & > div {
      width: 18%;
    }
    .step-one {
      display: flex;
      align-items: center;
      & > :nth-child(1) {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 18px;
        line-height: 18px;
        text-align: center;
        cursor: default;
        .img-div {
          margin: 0 8%;
          width: 18px;
          height: 18px;
          line-height: 18px;
          text-align: center;
        }
      }
    }
    .img-box {
      position: relative;
      img {
        position: absolute;
        top: 40%;
        left: 18%;
        width: 64%;
        height: 20%;
      }
    }
  }
  :deep(.el-table) {
    margin-top: 10px;
    input {
      width: 90%;
      height: 24px;
      color: #05c65d;
      border: 1px solid #c9c7c7;
    }
    select {
      width: 100%;
      height: 24px;
      color: #05c65d;
      border: 1px solid #c9c7c7;
    }
  }
  :deep(.el-checkbox__input.is-disabled .el-checkbox__inner) {
    display: none;
  }
  footer {
    text-align: right;
    & > p {
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
  display: inline-block;
  margin: 6px 0;
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
</style>
