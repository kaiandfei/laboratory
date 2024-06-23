<template>
  <div>
    <el-dialog custom-class="allot-dialog" :show-close="false" :close-on-click-modal="false" v-model="allotState"
      width="40%" title="仪器调拨">
      <el-form ref="" :rules="rules" :model="allotForm" label-width="150px" class="rule-form">
        <el-form-item label="分类编号">{{ allotForm.number }}</el-form-item>
        <el-form-item label="学校编号">{{ allotForm.asset_number }}</el-form-item>
        <el-form-item label="名称">{{ allotForm.name }}</el-form-item>
        <el-form-item label="调拨方式" prop="allot_type">
          <el-select v-model="allotForm.mode">
            <el-option v-for="item in optionsType" :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="采购批次" prop="">
          <el-input v-model="allotForm.bacth"></el-input>
        </el-form-item> -->
        <div v-for="(item, index) in allotForm.list" :key="item.type">
          <el-form-item v-show="item.type === '1'" class="is-required" label="调出位置" prop="outPosition">
            <el-select v-model="item.school_laboratory_id"
              @change="getStoreData(item.school_laboratory_id as number, index, item)" style="width: 30%">
              <el-option v-for="n in optionsLaboratory2" :key="n.value" :label="n.name" :value="n.value"></el-option>
            </el-select>
            <el-select @change="getPliesData(item.store_id as number, index, item)" v-model="item.store_id"
              style="width: 30%">
              <el-option v-for="n in storeList2" :key="n.value" :label="n.name" :value="n.value"></el-option>
            </el-select>
            <el-select @change="getNumber(item, index)" v-model="item.number_plies" style="width: 30%">
              <el-option v-for="n in pliesList2" :key="n.value" :label="n.name" :value="n.value"></el-option>
            </el-select>
            <span>{{ '(' + item.number + ')' }}</span>
          </el-form-item>
          <el-form-item v-show="item.type === '1'" class="is-required" label="调出数量" prop="outNumber">
            <el-input v-model="item.total"></el-input>
          </el-form-item>
        </div>
        <el-form-item>
          <span style="color: green; cursor: pointer" @click="addPosition('1')">增加一条调出的位置</span>
        </el-form-item>
        <el-form-item label="调拨凭证号">
          <el-input v-model="allotForm.numbers" />
        </el-form-item>
        <div v-for="item in allotForm.list" :key="item.type">
          <el-form-item v-show="item.type === '2'" class="is-required" label="调入位置" prop="outPosition">
            <el-select v-model="item.school_laboratory_id" @change="getData(item)" style="width: 30%">
              <el-option v-for="n in optionsLaboratory" :key="n.value" :label="n.name" :value="n.value"></el-option>
            </el-select>
            <el-select v-model="item.store_id" style="width: 30%" @change="handleChange(item)">
              <el-option v-for="n in optionStore(storeList)" :key="n.value" :label="n.name" :value="n.value"></el-option>
            </el-select>
            <el-select v-model="item.number_plies" style="width: 30%">
              <el-option v-for="n in optionPlies(storeList, item.store_id as number || 1)" :key="n.value" :label="n.name"
                :value="n.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-show="item.type === '2'" class="is-required" label="调入数量" prop="inNumber">
            <el-input v-model="item.total"></el-input>
          </el-form-item>
        </div>
        <el-form-item>
          <span style="color: green; cursor: pointer" @click="addPosition('2')">增加一条调入的位置</span>
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
import {
  getLaboratoryList,
  storeByLaboratory,
  postAllotList,
  getAlllotlocation
} from '@/service/instrument-manage/equ-manage/index'
import { allotList } from '@/service/instrument-manage/equ-manage/types'
import { ElMessage } from 'element-plus'
import _Row from 'element-plus/lib/components/row'

let props = defineProps({
  allotShow: Boolean,
  allotFormData: { type: Object as () => allotList, required: true }
})
let { allotShow, allotFormData } = toRefs(props)
const subjectID: any = ref(0)

subjectID.value = JSON.parse(sessionStorage.getItem('state') || '').login.userInfo.subject_id

let emit = defineEmits(['back'])
let allotState = ref(false)

allotState.value = allotShow.value
watch(allotState, (val) => {
  if (val === false) {
    back()
  }
})

const dataMap = reactive({
  allotForm: { ...allotFormData.value },
  optionsLaboratory: [
    {
      value: 0,
      name: ''
    }
  ],
  optionsType: [
    // {
    //   value: 1,
    //   label: '跨学校调拨'
    // },
    {
      value: 2,
      label: '移库'
    }
  ],
  storeList: [
    {
      id: 0,
      title: '',
      number_plies: 1
    }
  ]
})
let { optionsLaboratory, optionsType, allotForm, storeList } = toRefs(dataMap)

const storeList2: any = ref([])
const optionsLaboratory2: any = ref([])
const pliesList2: any = ref([])

const rules = reactive({
  allot_type: [
    {
      required: true,
      message: '请选择调拨方式',
      trigger: 'blur'
    }
  ]
  // outPosition: [
  //   {
  //     required: true,
  //     message: '请选择调出位置',
  //     trigger: 'blur'
  //   }
  // ]
  // inNumber: [
  //   {
  //     type: 'number',
  //     required: true,
  //     message: '输入数量不能为空',
  //     trigger: 'blur'
  //   }
  // ],
  // outNumber: [
  //   {
  //     type: 'number',
  //     required: true,
  //     message: '输入数量不能为空',
  //     trigger: 'blur'
  //   }
  // ]
})

getLaboratoryList({ subject: subjectID.value }).then((res) => {
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

getAlllotlocation({ instrument_id: allotFormData.value.school_instrument_id, type: 1 }).then((res) => {
  let arr = Array<{
    value: number
    name: string
  }>()

  res.data.list.forEach((e: any) => {
    const obj = {
      value: e.laboratory_id,
      name: e.laboratory_name
    }
    arr.push(obj)
  })
  optionsLaboratory2.value = arr
})

const getData = (row: any) => {
  row.store_id = ''
  row.number_plies = ''
  storeByLaboratory({ id: row.school_laboratory_id }).then((res) => {
    storeList.value = res.data
  })
}
const handleChange = (row: any) => {
  row.number_plies = ''
}

// 调出位置实验室切换
const getStoreData = (ID: number, index: any, row: any) => {
  row.store_id = ''
  row.number_plies = ''
  getAlllotlocation({ instrument_id: allotFormData.value.school_instrument_id, laboratory_id: ID, type: 2 }).then(
    (res) => {
      let arr = Array<{
        value: number
        name: string
      }>()
      allotFormData.value.list[index].number = res.data.totals
      res.data.list.forEach((e: any) => {
        const obj = {
          value: e.store_id,
          name: e.store_name
        }
        arr.push(obj)
      })
      storeList2.value = arr
    }
  )
  // allotFormData.value.list[index].store_id = ''
  // allotFormData.value.list[index].number_plies = ''
  // allotFormData.value.list[index].number = ''
}

// 调出位置柜子切换
const getPliesData = (ID: number, index: any, row: any) => {
  row.number_plies = ''
  getAlllotlocation({ instrument_id: allotFormData.value.school_instrument_id, store_id: ID, type: 3 }).then((res) => {
    allotFormData.value.list[index].number = res.data.totals
    let arr = Array<{
      value: number
      name: string
    }>()

    res.data.list.forEach((e: any) => {
      const obj = {
        value: e.number_plies,
        name: '第' + e.number_plies + '层'
      }
      arr.push(obj)
    })
    pliesList2.value = arr
  })
  // allotFormData.value.list[index].number_plies = ''
  // allotFormData.value.list[index].number = ''
}

// 调出位置层数切换
const getNumber = (item: any, index: any) => {
  getAlllotlocation({
    instrument_id: allotFormData.value.school_instrument_id,
    laboratory_id: item.schol_laboratory_id,
    store_id: item.store_id,
    number_plies: item.number_plies,
    type: 4
  }).then((res) => {
    allotFormData.value.list[index].number = res.data.totals
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

const addPosition = (status: string) => {
  if (status === '1') {
    allotForm.value.list.push({
      type: '1',
      school_laboratory_id: '',
      store_id: '',
      number_plies: '',
      number: '',
      total: ''
    })
  } else {
    allotForm.value.list.push({
      type: '2',
      school_laboratory_id: '',
      store_id: '',
      number_plies: '',
      number: '',
      total: ''
    })
  }
}

const back = () => {
  allotForm.value.list = []
  emit('back')
}

const submitForm = () => {
  let errorCount = 0
  allotForm.value.list.forEach((e) => {
    if (e.type === '1' && e.school_laboratory_id === '') {
      errorCount = 1
    }
    if (e.type === '2' && e.school_laboratory_id === '') {
      errorCount = 2
    }
    if (!e.total) {
      errorCount = 3
    }
  })
  if (errorCount !== 0) {
    ElMessage({
      type: 'warning',
      message:
        errorCount === 1
          ? '请检查并选择调出实验室'
          : errorCount === 2
            ? '请检查并选择调入实验室'
            : errorCount === 3
              ? '请检查并输入调入、调出数量'
              : '请检查必填项'
    })
    return
  }
  postAllotList(allotForm.value).then((res) => {
    if (res.code === 10) {
      allotForm.value.list = []
      emit('back')
    }
  })
}
</script>
<style lang="scss" scoped>
:deep(.allot-dialog) {
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
      color: black;

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
