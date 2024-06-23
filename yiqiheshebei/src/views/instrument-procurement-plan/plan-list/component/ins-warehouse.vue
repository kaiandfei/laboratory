<template>
  <div class="main">
    <div class="title-box">待入库</div>

    <p
      v-if="itemData.school_audit === 3 && itemData.subject_audit === 3 && tableData.length !== 0 && editStatus"
      class="btn fr"
      @click="save"
    >
      确认入库
    </p>
    <el-table
      :data="tableData"
      style="width: 100%"
      :header-cell-style="{ background: '#EFEFEF', color: '#000' }"
      :cell-style="{ background: '#ffffff', borderBottom: '1px solid #EFEFEF' }"
    >
      <el-table-column type="index" label="序号" width="60" align="left"></el-table-column>
      <el-table-column label="分类编号" prop="number" align="left"></el-table-column>
      <el-table-column label="学校编号" prop="school_instrument_number" width="120" align="left"></el-table-column>
      <el-table-column label="名称" prop="name" show-overflow-tooltip></el-table-column>
      <el-table-column label="规格" prop="specification" show-overflow-tooltip></el-table-column>
      <el-table-column label="采购数量" prop="alltotal" align="left"></el-table-column>

      <el-table-column label="已入库数量" prop="putstoragecount" align="left"></el-table-column>
      <el-table-column label="入库数量" align="left">
        <template #default="scope">
          <input type="number" class="short-input" v-model="scope.row.total" @input="inputAdjust" />
        </template>
      </el-table-column>
      <el-table-column label="单位" prop="unit" width="50" align="left"></el-table-column>
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
      <el-table-column label="厂家" prop="" width="160" align="left">
        <template #default="scope">
          <input class="long-input" v-model="scope.row.factory" />
        </template>
      </el-table-column>
      <el-table-column label="单价" prop="" width="100" align="left">
        <template #default="scope">
          <input class="short-input" v-model="scope.row.unit_price" />
        </template>
      </el-table-column>
      <el-table-column label="实验室" align="left" width="120">
        <template #default="scope">
          <select
            v-model="scope.row.school_laboratory_id"
            @change="getStoreData(scope.row.school_laboratory_id, scope.$index)"
          >
            <option v-for="(e, index) in optionsLaboratory" :key="index" :label="e.title" :value="e.id"></option>
          </select>
        </template>
      </el-table-column>
      <el-table-column label="仪器柜" align="left" width="120">
        <template #default="scope">
          <select v-model="scope.row.store_id" @change="setPlies(scope.$index)">
            <option v-for="(e, i) in storeListBody[scope.$index]" :key="i" :label="e.title" :value="e.id"></option>
          </select>
        </template>
      </el-table-column>
      <el-table-column label="层数" align="left">
        <template #default="scope">
          <select v-model="scope.row.number_plies">
            <option v-for="(e, i) in optionPliesBody[scope.$index]" :key="i" :label="e.name" :value="e.value"></option>
          </select>
        </template>
      </el-table-column>

      <!-- <el-table-column label="操作" align="left">
        <template #default="scope">
          <img
            src="@assets/images/laboratory-standard/delete.png"
            alt=""
            @click="deleteItem(scope.row.id, scope.$index)"
          />
        </template>
      </el-table-column> -->
    </el-table>
    <!-- <el-table
      ref="multipleTable"
      :data="tableData"
      style="width: 100%"
      stripe
      row-key="id"
      height="540"
      default-expand-all
      :header-cell-style="{ background: '#fff', color: '#333' }"
      :cell-style="cellStyle"
    >
      <el-table-column label="序号" type="" width="60" align="left">
        <template #default="scope">
          <span v-if="'children' in scope.row">{{ scope.row.num }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分类编号" type="" prop="number" align="left"></el-table-column>
      <el-table-column label="资产编号" type="" prop="" align="left">
        <template #default="scope">
          <input v-if="!('children' in scope.row)" type="text" v-model="scope.row.number" />
        </template>
      </el-table-column>
      <el-table-column label="名称" type="" prop="name" align="left"></el-table-column>
      <el-table-column label="规格" type="" prop="specification" align="left"></el-table-column>
      <el-table-column label="数量" type="" prop="" align="left">
        <template #default="scope">
          <span v-if="'children' in scope.row">{{ scope.row.num }}</span>
          <input v-if="!('children' in scope.row)" type="text" v-model="scope.row.num" />
        </template>
      </el-table-column>
      <el-table-column label="单位" type="" prop="unit" align="left"></el-table-column>
      <el-table-column label="类型" type="" prop="" align="left">
        <template #default="scope">
          <span>{{ scope.row.type === 1 ? '仪器' : '设备' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单价" type="" prop="" align="left">
        <template #default="scope">
          <span v-if="'children' in scope.row">{{ scope.row.price }}</span>
          <input v-if="!('children' in scope.row)" type="text" v-model="scope.row.price" />
        </template>
      </el-table-column>
      <el-table-column label="采购批次" type="" prop="" width="130" align="left">
        <template #default="scope">
          <span v-if="'children' in scope.row">{{ scope.row.price }}</span>
          <input v-if="!('children' in scope.row)" type="text" v-model="scope.row.price" />
        </template>
      </el-table-column>
      <el-table-column label="凭证号" type="" prop="" width="130" align="left">
        <template #default="scope">
          <span v-if="'children' in scope.row">{{ scope.row.price }}</span>
          <input v-if="!('children' in scope.row)" type="text" v-model="scope.row.price" />
        </template>
      </el-table-column>
      <el-table-column label="厂家" type="" prop="" width="130" align="left">
        <template #default="scope">
          <span v-if="'children' in scope.row">{{ scope.row.price }}</span>
          <input v-if="!('children' in scope.row)" type="text" v-model="scope.row.price" />
        </template>
      </el-table-column>
      <el-table-column label="实验室" type="" prop="" width="130" align="left">
        <template #default="scope">
          <select v-if="!('children' in scope.row)">
            <option :value="1">化学仪器库1</option>
            <option :value="2">化学仪器库2</option>
            <option :value="3">化学仪器库3</option>
            <option :value="4">化学仪器库4</option>
          </select>
        </template>
      </el-table-column>
      <el-table-column label="仪器柜" type="" prop="" align="left">
        <template #default="scope">
          <select v-if="!('children' in scope.row)">
            <option :value="1">仪器柜1</option>
            <option :value="2">仪器柜2</option>
            <option :value="3">仪器柜3</option>
            <option :value="4">仪器柜4</option>
          </select>
        </template>
      </el-table-column>
      <el-table-column label="层数" type="" prop="" align="left">
        <template #default="scope">
          <select v-if="!('children' in scope.row)">
            <option :value="1">第一层</option>
            <option :value="2">第二层</option>
            <option :value="3">第三层</option>
            <option :value="4">第四层</option>
          </select>
        </template>
      </el-table-column>
      <el-table-column label="" prop=""></el-table-column>
    </el-table> -->
    <div class="title-box">已入库</div>
    <el-table
      :data="tableData1"
      style="width: 100%"
      :header-cell-style="{ background: '#EFEFEF', color: '#000' }"
      :cell-style="{ background: '#ffffff', borderBottom: '1px solid #EFEFEF' }"
    >
      <el-table-column type="index" label="序号" width="60" align="left"></el-table-column>
      <el-table-column label="分类编号" prop="asset_number" align="left"></el-table-column>
      <el-table-column label="学校编号" prop="school_instrument_number" width="120" align="left"></el-table-column>
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
import { inputAdjust } from '@/utils/common'
import { useStore } from '@/store'

import { getLaboratoryList } from '@/service/instrument-manage/equ-manage/index'
import { storeByLaboratory } from '@service/laboratory-manage/overview/index'

import { postBatchInstrumentCg } from '@service/instrument-procurement-plan/plan-list'
import { BatchWarehousingList } from '@service/instrument-manage/batch-instrument-warehouse/types'
import { getSchoolBuyPlanDetail, getSchoolBuyPlanSubjectDetail } from '@service/instrument-procurement-plan/plan-list'
import { ListItem } from '@service/instrument-procurement-plan/plan-list/types'

import { ElMessage } from 'element-plus'

let props = defineProps({
  itemData: { type: Object as () => ListItem, required: true },
  editStatus: { type: Boolean, default: true }
})
let { itemData } = toRefs(props)
console.log('🚀 ~ file: ins-warehouse.vue:197 ~ itemData:', itemData)

let emit = defineEmits(['back'])

const dataMap = reactive({
  tableData: Array<BatchWarehousingList>(),
  tableData1: Array<BatchWarehousingList>(),

  optionsLaboratory: Array<{ id: number; title: string }>(),
  storeListBody: [Array<{ id: number; title: string; number_plies: number }>()],
  optionPliesBody: [Array<{ value: number; name: string }>()]
})
let { tableData, tableData1, optionsLaboratory, storeListBody, optionPliesBody } = toRefs(dataMap)

let store = useStore()

getLaboratoryList({ subject: store.state.login.userInfo.subject_id || '' }).then((res) => {
  optionsLaboratory.value = res.data.data
})

const getData = (id: number) => {
  tableData1.value = []
  getSchoolBuyPlanDetail({
    buy_plan_subject_id: id,
    type: 1,
    is_check: 2
  }).then((res) => {
    let arr = Array<BatchWarehousingList>()
    res.data.forEach((e) => {
      let obj = {
        id: e.id,
        name: e.instrument_name,
        number: e.instrument_number,
        school_instrument_number: e.school_instrument_number,
        asset_number: '',
        specification: e.specification,
        school_instrument_id: 0,
        instrument_id: 0,
        cost_type: e.cost_type,
        unit: e.unit,
        info: '',
        number_year: 0,
        norm: '',
        school_laboratory_id: '',
        store_id: '',
        number_plies: '',
        alltotal: e.total,
        putstoragecount: e.putstoragecount ?? 0,
        total: e.total - e.putstoragecount,
        source: 1,
        bacth: '',
        status: e.status,
        voucher_number: '',
        factory: '',
        unit_price: e.price,
        type: 1
      }
      console.log('🚀 ~ file: ins-warehouse.vue:258 ~ res.data.forEach ~ obj:', obj)
      if (obj.total !== 0) {
        arr.push(obj)
      }
    })
    tableData.value = arr
  })
  getSchoolBuyPlanSubjectDetail({
    id,
    type: 1
  }).then((res) => {
    tableData1.value = res.data
  })
}
getData(itemData.value.id)

const getStoreData = (id: number | string, index: number) => {
  storeByLaboratory({ id: Number(id) || 0 }).then((res) => {
    storeListBody.value[index] = res.data
  })
  tableData.value[index].store_id = ''
  tableData.value[index].number_plies = ''
}

const setPlies = (index: number) => {
  tableData.value[index].number_plies = ''
  optionPliesBody.value[index] = optionPlies.value(
    storeListBody.value[index],
    tableData.value[index].store_id as number
  )
}

let optionPlies = computed(() => {
  return (list: { id: number; number_plies: number }[], storeId: number) => {
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
  postBatchInstrumentCg({
    id: itemData.value.id,
    data: tableData.value
  }).then((res) => {
    if (res.code === 10) {
      ElMessage({
        type: 'success',
        message: res.msg
      })
      getData(itemData.value.id)
    }
  })
}

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
