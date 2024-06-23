<template>
  <div>
    <el-dialog
      custom-class="ware-edit-dialog"
      :close-on-click-modal="false"
      :show-close="false"
      v-model="editStatus"
      title="入库仪器"
      width="40%"
    >
      <el-form ref="ruleForm1" :model="ruleForm" :rules="rules" label-width="150px" class="rule-form">
        <el-form-item label="分类编号：" prop="">
          <span>{{ ruleForm.number }}</span>
        </el-form-item>
        <el-form-item label="学校编号：" prop="">
          <span>{{ ruleForm.asset_number }}</span>
        </el-form-item>
        <el-form-item label="名称：" prop="">
          <span>{{ ruleForm.name }}</span>
        </el-form-item>
        <el-form-item label="规格型号：" prop="">
          <span>{{ ruleForm.specification }}</span>
        </el-form-item>
        <div v-for="(item, index) in ruleForm.location" :key="index">
          <el-form-item label="存放位置：" prop="">
            <el-select
              class="el-select-30"
              v-model="item.school_laboratory_id"
              @change="getData(item.school_laboratory_id, index)"
            >
              <el-option
                v-for="(e, index) in optionsLaboratory"
                :key="index"
                :label="e.title"
                :value="e.id"
              ></el-option>
            </el-select>
            <el-select class="el-select-30" v-model="item.store_id" @change="setPlies(index)">
              <el-option v-for="(e, i) in storeListBody[index]" :key="i" :label="e.title" :value="e.id"></el-option>
            </el-select>
            <el-select class="el-select-30" v-model="item.number_plies">
              <el-option v-for="(e, i) in optionPliesBody[index]" :key="i" :label="e.name" :value="e.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="存放数量：" prop="">
            <el-input v-model="item.total" placeholder=""></el-input>
          </el-form-item>
        </div>
        <el-form-item>
          <div style="color: green; cursor: pointer" @click="addPlace">+增加一条存放入库的位置</div>
        </el-form-item>
        <el-form-item label="入库来源：" prop="">
          <el-select v-model="ruleForm.source" placeholder="">
            <el-option v-for="item in optionCome" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="凭证号：" prop="">
          <el-input v-model="ruleForm.voucher_number"></el-input>
        </el-form-item>
        <el-form-item label="采购批次：" prop="">
          <el-input v-model="ruleForm.bacth"></el-input>
        </el-form-item>
        <el-form-item label="产地(厂家)：" prop="">
          <el-input v-model="ruleForm.factory"></el-input>
        </el-form-item>
        <el-form-item label="单价：" prop="">
          <el-input v-model="ruleForm.unit_price"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="back()">取消</el-button>
          <el-button type="primary" @click="submitForm(ruleForm1)">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, toRefs, watch, computed } from 'vue'
import { getLaboratoryList, storeByLaboratory, postWarehousingList } from '@/service/equ-manage/equ-manage/index'
import { WarehousingList } from '@/service/equ-manage/equ-manage/types'

import { ElMessage } from 'element-plus'
import type { ElForm } from 'element-plus'

import { useStore } from '@store/index'

const store = useStore()
let options = [...store.state.common.subjectArr]

let props = defineProps({
  editShow: Boolean,
  warehousingForm: { type: Object as () => WarehousingList, required: true }
})
let { editShow, warehousingForm } = toRefs(props)

let emit = defineEmits(['back'])

const back = () => {
  emit('back')
}

console.log(options)

let dataMap = reactive({
  ruleForm: JSON.parse(JSON.stringify(warehousingForm.value)),
  optionsLaboratory: Array<{ id: number; title: string }>(),
  editStatus: false,
  storeListBody: [Array<{ id: number; title: string; number_plies: number }>()],
  optionPliesBody: [Array<{ value: number; name: string }>()]
})

let { ruleForm, optionsLaboratory, editStatus, storeListBody, optionPliesBody } = toRefs(dataMap)
editStatus.value = editShow.value

watch(editStatus, (val) => {
  if (val === false) {
    back()
  }
})

getLaboratoryList().then((res) => {
  optionsLaboratory.value = res.data.data
})

const getData = (id: number, index: number) => {
  storeByLaboratory({ id }).then((res) => {
    storeListBody.value[index] = res.data
  })
}

const setPlies = (index: number) => {
  optionPliesBody.value[index] = optionPlies.value(storeListBody.value[index], ruleForm.value.location[index].store_id)
}

const obj = warehousingForm.value.location[0]
const addPlace = () => {
  ruleForm.value.location.push({ ...obj })
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

const rules = reactive({
  location: [
    {
      type: 'array',
      required: true,
      message: '请选择存放位置',
      trigger: 'blur'
    }
  ],
  count: [
    {
      required: true,
      message: '请输入数量',
      trigger: 'blur'
    }
  ]
})

const ruleForm1 = ref<InstanceType<typeof ElForm>>()
const submitForm = (formEl: InstanceType<typeof ElForm> | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      postWarehousingList(ruleForm.value).then((res) => {
        if (res.code === 10) {
          back()
        }
      })
    } else {
      ElMessage({
        type: 'warning',
        message: '请填写必填项'
      })
      return false
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
</script>

<style lang="scss" scoped>
:deep(.ware-edit-dialog) {
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
        .el-select {
          width: 90%;
          .el-input {
            width: 100%;
            .el-input__inner {
              width: 100%;
              height: 30px !important;
            }
          }
        }
        .el-select-30 {
          width: 30%;
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
