<template>
  <div>
    <div class="buttonArea" v-show="!submitStatus">
      <el-button type="primary" @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit">保存</el-button>
    </div>
    <div class="buttonArea" v-show="submitStatus">
      <el-button type="primary" @click="cancel">返回</el-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      :header-cell-style="{ background: '#EFEFEF', color: '#000' }"
      :cell-style="{ background: '#ffffff', borderBottom: '1px solid #EFEFEF' }"
    >
      <el-table-column label="序号" prop="id"></el-table-column>
      <el-table-column label="仪器分类编号" prop="type_id"></el-table-column>
      <el-table-column label="仪器名称" prop="name"></el-table-column>
      <el-table-column label="仪器规格" prop="specification"></el-table-column>
      <el-table-column label="单位" prop="unit"></el-table-column>
      <el-table-column label="数量" prop="number"></el-table-column>
      <el-table-column label="类型" prop="type"></el-table-column>
      <el-table-column label="位置" prop="position"></el-table-column>
      <el-table-column label="采购批次" prop="purchase_batch"></el-table-column>
      <el-table-column label="到期时间" prop="expiration_time"></el-table-column>
      <el-table-column label="单价" prop="price"></el-table-column>
      <el-table-column label="厂家" prop="factory"></el-table-column>
      <el-table-column label="责任人" prop="responsible">
        <template #default="scope">
          <select class="table-select" v-model="scope.row.responsible" size="mini" v-show="!submitStatus">
            <option
              v-for="item in optionResponsible"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></option>
          </select>
          <div v-show="submitStatus">{{ scope.row.responsible }}</div>
        </template>
      </el-table-column>
      <el-table-column label="资产编号" prop="asset_number">
        <template #default="slot">
          <div style="color: #848484" v-if="submitStatus">{{ slot.row.asset_number }}</div>
          <div style="color: green" v-if="!submitStatus">{{ slot.row.asset_number }}</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script lang="ts" setup>
import { ref, toRefs, reactive, watch } from 'vue'
import { getAssetNumberList } from '@/service/instrument-manage/instrument-numebr-manage/index'

let submitStatus = ref(false)
let props = defineProps({ assetShow: Boolean, selectAssetNumber: { type: String, required: true } })
let { assetShow, selectAssetNumber } = toRefs(props)
let emit = defineEmits(['assetNumberBack'])
let assetState = ref(false)
assetState.value = assetShow.value

watch(assetState, (val) => {
  if (val === false) {
    cancel()
  }
})

const dataMap = reactive({
  tableData: [
    {
      id: 1,
      type_id: '50001',
      name: '小车',
      specification: '',
      unit: '个',
      number: 1,
      type: '装用仪器',
      position: '物理实验室',
      purchase_batch: '2021.01.12',
      expiration_time: '2021.4.5',
      price: '￥3000',
      factory: '江苏苏威尔',
      responsible: '张老师',
      asset_number: '02001-1'
    },
    {
      id: 2,
      type_id: '50001',
      name: '小车',
      specification: '',
      unit: '个',
      number: 1,
      type: '装用仪器',
      position: '物理实验室',
      purchase_batch: '2021.01.12',
      expiration_time: '2021.4.5',
      price: '￥3000',
      factory: '江苏苏威尔',
      responsible: '张老师',
      asset_number: '02001-1'
    },
    {
      id: 3,
      type_id: '50001',
      name: '小车',
      specification: '',
      unit: '个',
      number: 1,
      type: '装用仪器',
      position: '物理实验室',
      purchase_batch: '2021.01.12',
      expiration_time: '2021.4.5',
      price: '￥3000',
      factory: '江苏苏威尔',
      responsible: '张老师',
      asset_number: '02001-1'
    },
    {
      id: 4,
      type_id: '50001',
      name: '小车',
      specification: '',
      unit: '个',
      number: 1,
      type: '装用仪器',
      position: '物理实验室',
      purchase_batch: '2021.01.12',
      expiration_time: '2021.4.5',
      price: '￥3000',
      factory: '江苏苏威尔',
      responsible: '张老师',
      asset_number: '02001-1'
    }
  ],
  optionResponsible: [
    {
      label: '张老师',
      value: '张老师'
    },
    {
      label: '李老师',
      value: '李老师'
    },
    {
      label: '王老师',
      value: '王老师'
    }
  ]
})
let { tableData, optionResponsible } = toRefs(dataMap)

getAssetNumberList({ number: selectAssetNumber.value }).then((res) => {
  console.log(res)
})

const submit = () => {
  submitStatus.value = true
  console.log('保存数据')
}

const cancel = () => {
  emit('assetNumberBack')
  console.log('返回')
}
</script>
<style lang="scss" scoped>
.buttonArea {
  width: 160px;
  height: 60px;
  float: right;
}
.table-select {
  width: 80px;
  height: 30px;
  line-height: 30px;
  border: 1px solid #c9c7c7;
  border-radius: 2px;
  text-align: center;
  option {
    text-align: left;
  }
}
</style>
