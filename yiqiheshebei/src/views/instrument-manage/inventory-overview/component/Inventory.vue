<template>
  <div>
    <el-dialog
      custom-class="inventory-dialog"
      :show-close="false"
      :close-on-click-modal="false"
      v-model="inventoryState"
      width="40%"
      title="库存盘点"
    >
      <el-form :rules="rules" :model="inventoryForm" label-width="150px" class="rule-form">
        <el-form-item label="分类编号">{{ inventoryForm.number }}</el-form-item>
        <el-form-item label="学校编号">{{ inventoryForm.asset_number }}</el-form-item>
        <el-form-item label="名称">{{ inventoryForm.name }}</el-form-item>
        <el-form-item label="规格型号">{{ inventoryForm.specification }}</el-form-item>
        <el-form-item label="盘点" prop="inventory">
          <el-select v-model="inventoryForm.yk">
            <el-option
              v-for="item in optionsInventory"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="采购批次" prop="purchaseBatch">
          <el-input v-model="inventoryForm.bacth"></el-input>
        </el-form-item>
        <el-form-item label="位置" prop="outPosition">
          <el-select v-model="inventoryForm.school_laboratory_id" @change="getData" style="width: 30%">
            <el-option v-for="n in optionsLaboratory" :key="n.value" :label="n.name" :value="n.value"></el-option>
          </el-select>
          <el-select v-model="inventoryForm.store_id" style="width: 30%">
            <el-option v-for="n in optionStore(storeList)" :key="n.value" :label="n.name" :value="n.value"></el-option>
          </el-select>
          <el-select v-model="inventoryForm.number_plies" style="width: 30%">
            <el-option
              v-for="n in optionPlies(storeList, inventoryForm.store_id as number || 1)"
              :key="n.value"
              :label="n.name"
              :value="n.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数量">
          <el-input v-model="inventoryForm.num"></el-input>
        </el-form-item>
        <el-form-item label="说明">
          <el-input v-model="inventoryForm.pd_desc"></el-input>
        </el-form-item>
        <el-form-item label="盘点时间">
          <el-date-picker
            v-model="inventoryForm.pd_time"
            type="date"
            placeholder="选择日期"
            value-format="YYYY-MM-DD"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="back()">取消</el-button>
          <el-button type="primary" @click="submitForm()">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref, toRefs, reactive, watch, computed } from 'vue'
import { getLaboratoryList, storeByLaboratory, postCheckList } from '@/service/instrument-manage/equ-manage/index'
import { checkList } from '@/service/instrument-manage/equ-manage/types'

let props = defineProps({ inventoryShow: Boolean, checkFormData: { type: Object as () => checkList, required: true } })
let { inventoryShow, checkFormData } = toRefs(props)
let emit = defineEmits(['back'])
let inventoryState = ref(false)

const dataMap = reactive({
  inventoryForm: { ...checkFormData.value },
  storeList: [
    {
      id: 0,
      title: '',
      number_plies: 1
    }
  ],
  optionsLaboratory: [
    {
      value: 0,
      name: ''
    }
  ]
})
let { inventoryForm, storeList, optionsLaboratory } = toRefs(dataMap)

inventoryState.value = inventoryShow.value
watch(inventoryState, (val) => {
  if (val === false) {
    back()
  }
})

getLaboratoryList().then((res) => {
  let arr = Array<{
    value: number
    name: string
  }>()

  res.data.data.forEach((e) => {
    const obj = {
      value: e.id,
      name: e.title
    }
    arr.push(obj)
  })
  optionsLaboratory.value = arr
})

const getData = (ID: number) => {
  storeByLaboratory({ id: ID }).then((res) => {
    storeList.value = res.data
  })
}

let optionStore = computed(() => {
  return (list: { id: number; title: string }[]) => {
    let arr = Array<{
      value: number
      name: string
    }>()
    list.forEach((e) => {
      const obj = {
        value: e.id,
        name: e.title
      }
      arr.push(obj)
    })
    return arr
  }
})

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

const rules = reactive({
  // inventory: {
  //   required: true,
  //   message: '请选择盘点类型',
  //   trigger: 'blur'
  // },
  // purchaseBatch: {
  //   required: true,
  //   message: '请输入采购批次',
  //   trigger: 'blur'
  // },
  // position: {
  //   required: true,
  //   message: '请选择存放位置',
  //   trigger: 'blur'
  // },
  // number: {
  //   required: true,
  //   message: '请输入数量',
  //   trigger: 'blur'
  // }
})

const optionsInventory = reactive([
  {
    label: '盘盈',
    value: 1
  },
  {
    label: '盘亏',
    value: 2
  }
])

const submitForm = () => {
  postCheckList(inventoryForm.value)
  emit('back')
}

const back = () => {
  emit('back')
}
</script>
<style lang="scss" scoped>
:deep(.inventory-dialog) {
  margin-top: 50px;
  .el-dialog__body {
    border-top: #05c65d 1px solid;
    box-sizing: border-box;
    .title-box {
      display: flex;
      justify-content: space-evenly;
      height: 60px;
      .edit-title {
        width: 24%;
        height: 40px;
        line-height: 40px;
        color: #848484;
        border: #b5b5b5 1px solid;
        box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
        border-radius: 5px;
        cursor: pointer;
      }
      .active-item {
        color: #05c65d;
      }
    }
    .rule-form {
      text-align: left;
      .el-form-item {
        overflow: hidden;
        margin-bottom: 6px;
        .el-input {
          width: 90%;
          .el-input__inner {
            width: 100%;
          }
        }
        .el-select,
        .el-cascader {
          width: 90%;
          .el-input {
            width: 100%;
            .el-input__inner {
              width: 100%;
              height: 30px !important;
            }
          }
        }
      }
      .use-year {
        .el-input {
          width: 70%;
          .el-input__inner {
            width: 100%;
          }
        }
        .el-select {
          margin-left: 2%;
          width: 18%;
          .el-input {
            width: 100%;
            .el-input__inner {
              width: 100%;
            }
          }
        }
      }
    }
  }
}
</style>
