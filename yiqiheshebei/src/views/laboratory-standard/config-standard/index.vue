<template>
  <div>
    <header>
      <div class="fl">
        实验室标准
        <el-icon><arrow-right /></el-icon>
        实验室配置标准
      </div>
    </header>
    <div class="recommend">
      <div class="filter-box">
        <BaseFilter :config-data="filterData" @change-filter="changeFilter" />
      </div>
      <div v-if="![1, 2].includes(store.state.login.userInfo.role_id)" class="btn" @click="addConfig">
        +新增实验室配置要求
      </div>
    </div>
    <ConfigRequire ref="configItem" :select-form="selectForm" />
    <el-dialog custom-class="config-add-dialog" v-model="addShow" title="新增实验室配置要求" width="30%">
      <el-form ref="editForm" :model="editFormData" label-width="120px" :key="addShow" :rules="rules">
        <el-form-item label="类型：" prop="type_id">
          <el-select v-model="editFormData.type_id" placeholder="请选择类型">
            <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学科：" prop="subject_id">
          <el-select v-model="editFormData.subject_id" placeholder="请选择学科">
            <el-option v-for="item in subjectArr" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学段：" prop="phase_study_id">
          <el-select v-model="editFormData.phase_study_id" placeholder="请选择学段">
            <el-option
              v-for="item in phaseStudyOptions"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <p>
        *提示：该学科类型实验室已有配置要求，确定替换重新配置吗？ 您还可以选择
        <span>请点击此处</span>
        直接去编辑
      </p> -->
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addShow = false">取消</el-button>
          <el-button type="primary" @click="addClick(editForm)">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ArrowRight } from '@element-plus/icons-vue'
import { reactive, toRefs, ref } from 'vue'
import ConfigRequire from './component/config-require.vue'

import { BaseFilter } from '@/components/base-filter'
import { ConfigDataType } from '@/components/base-filter/src/types'

import { RequestDataLab } from '@service/laboratory-standard/type-manage/types'
import { getTypeList } from '@service/laboratory-standard/type-manage/index'

import { addLaboratorySet } from '@/service/laboratory-standard/config-standard'

import { useStore } from '@store/index'
import { ElMessage } from 'element-plus'
import type { ElForm } from 'element-plus'

import { period } from '@/constants/common'

const store = useStore()
const dataMap = reactive({
  subjectArr: [...store.state.common.subjectArr],
  filterData: Array<ConfigDataType>(),
  typeList: [RequestDataLab],
  selectForm: { subject_id: 0, type: 0 },
  addShow: false
})
let { subjectArr, filterData, typeList, selectForm, addShow } = toRefs(dataMap)

const configItem = ref()

let subject = [...store.state.common.subjectArr]
subject.unshift({
  id: 0,
  name: '全部'
})
let typeArr: {
  id: number
  name: string
}[] = reactive([
  {
    id: 0,
    name: '全部'
  }
])
//学段
const periodOption = ref<any>([])
periodOption.value = period

console.log(1111, periodOption.value)

const phaseStudyOptions = ref([
  { id: 1, title: '小学' },
  { id: 2, title: '初中' },
  { id: 3, title: '高中' }
])
getTypeList().then((res) => {
  typeList.value = res.data
  typeArr.push(...typeList.value)
})
filterData.value = [
  {
    name: '学段',
    list: periodOption,
    keyName: 'phase_study_id'
  },
  {
    name: '学科',
    list: subject,
    keyName: 'subject_id'
  },
  {
    name: '类型',
    list: typeArr,
    keyName: 'type'
  }
]

const changeFilter = (form: { subject_id: number; type: number; phase_study_id: number }) => {
  selectForm.value = form
  configItem.value.getData(selectForm.value)
}

let addConfig = () => {
  addShow.value = true
}

let editFormData = reactive({
  type_id: '',
  subject_id: '',
  area: 0,
  desc: '',
  phase_study_id: ''
})
const editForm = ref<InstanceType<typeof ElForm>>()
const rules = reactive<any>({
  type_id: [{ required: true, message: '请选择类型', trigger: 'blur' }],
  subject_id: [{ required: true, message: '请选择学科', trigger: 'blur' }],
  phase_study_id: [{ required: true, message: '请选择学段', trigger: 'blur' }]
})

const addClick = async (formEl: InstanceType<typeof ElForm> | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      addLaboratorySet(editFormData).then((res) => {
        if (res.code === 10) {
          addShow.value = false
          configItem.value.getData(selectForm.value, -1)
        }
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}
// const addClick = () => {
//   // if (editFormData.type_id === '' || editFormData.subject_id === '' || editFormData.phase_study_id === '') {
//   //   ElMessage({ type: 'warning', message: '请选择类型与学科' })
//   //   return
//   // }
//   addLaboratorySet(editFormData).then((res) => {
//     if (res.code === 10) {
//       addShow.value = false
//       configItem.value.getData(selectForm.value)
//     }
//   })
// }
</script>

<style scoped lang="scss">
header {
  height: 30px;
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  line-height: 30px;
  color: #626572;
  opacity: 1;
  & > div {
    display: flex;
    align-items: center;
  }
}
.recommend {
  margin-top: 10px;
  padding: 0 30px;
  width: 100%;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  .filter-box {
    padding: 15px 0;
    width: 90%;
    & > div {
      text-align: left;
      span {
        margin-bottom: 30px;
        display: block;
        min-width: 80px;
        text-align: left;
        color: #848484;
        float: left;
      }
      p {
        max-width: 94%;
        display: inline-block;
        span {
          display: inline-block;
          margin-right: 50px;
          min-width: 0px;
          text-align: center;
          color: #333333;
          cursor: pointer;
        }
        span:hover {
          color: #05c65d;
        }
      }
    }
  }
}

footer {
  margin: 16px;
  display: flex;
  justify-content: right;
  p {
    margin-right: 30px;
    height: 36px;
    line-height: 36px;
    span {
      font-size: 16px;
      font-weight: bold;
      line-height: 21px;
      color: #05c65d;
      opacity: 1;
    }
  }
}
:deep(.config-add-dialog) {
  .el-dialog__body {
    border-top: #05c65d 1px solid;
    box-sizing: border-box;
    span {
      color: #05c65d;
    }
    .el-form-item__content {
      text-align: left;
      .el-select {
        width: 100%;
        .el-input {
          width: 80%;
          .el-input__inner {
            width: 100%;
          }
        }
      }
    }
  }
}

.btn {
  width: 210px;
  height: 36px;
  line-height: 36px;
  background: #05c65d;
  color: #ffffff;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
  opacity: 1;
  border-radius: 10px;
  cursor: pointer;
}
.green {
  color: #05c65d !important;
}
</style>
