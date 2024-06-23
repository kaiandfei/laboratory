<template>
  <div>
    <el-drawer custom-class="bm-edit-dialog" v-model="editStatus" :title="tableData.id !== 0 ? '编辑' : '新增'">
      <div class="title-box">
        <div class="edit-title" :class="{ 'active-item': tableData.type.value === 1 }" @click="changeType(1)">仪器</div>
        <div class="edit-title" :class="{ 'active-item': tableData.type.value === 2 }" @click="changeType(2)">设备</div>
      </div>
      <el-form ref="tableData1" :model="tableData" :rules="rules" label-width="120px" class="rule-form">
        <el-form-item label="分类编号：" prop="number">
          <el-input v-model="tableData.number" placeholder="请输入分类编号"></el-input>
        </el-form-item>
        <el-form-item label="名称：" prop="name">
          <el-input v-model="tableData.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="规格型号：" prop="">
          <el-input v-model="tableData.specification" placeholder="请输入规格型号"></el-input>
        </el-form-item>
        <el-form-item label="分类：" prop="categorys">
          <el-cascader
            v-model="tableData.categorys"
            :options="allType"
            :props="casProps"
            collapse-tags
            :show-all-levels="false"
            style="width: 90%"
          ></el-cascader>
        </el-form-item>
        <!-- <el-form-item label="必配：" prop="is_must">
          <el-radio-group v-model="tableData.is_must.value">
            <el-radio :label="1">必配</el-radio>
            <el-radio :label="2">选配</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item v-show="tableData.type.value === 1" label="价值分类：" prop="cost_type">
          <el-radio-group v-model="tableData.cost_type">
            <el-radio :label="1">低值易耗</el-radio>
            <el-radio :label="2">非低值易耗</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item v-show="tableData.type.value === 1" label="实验类型：" prop="">
          <el-radio-group v-model="tableData.is_group.value">
            <el-radio :label="1">演示</el-radio>
            <el-radio :label="2">分组</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item label="单位：" prop="unit">
          <el-select v-model="tableData.unit" placeholder="请选择单位" style="width: 90%">
            <el-option v-for="item in units" :key="item.id" :label="item.title" :value="item.title" />
          </el-select>
          <!-- <el-input v-model="tableData.unit" placeholder=""></el-input> -->
        </el-form-item>
        <el-form-item label="功能描述：" prop="">
          <el-input v-model="tableData.info" placeholder="请输入功能描述"></el-input>
        </el-form-item>
        <el-form-item class="use-year" label="使用期限：" prop="">
          <el-input v-model="tableData.number_year" placeholder="请输入使用期限">
            <template #append>年</template>
          </el-input>

          <!-- <el-select v-model="tableData.number_year_unit" placeholder="">
            <el-option
              v-for="item in optionsYear"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item class="use-year" label="参考价格：" prop="">
          <el-input v-model="tableData.unit_price" placeholder="请输入参考价格"></el-input>
        </el-form-item>
        <el-form-item label="上传照片：" prop="">
          <el-upload
            ref="upload"
            :action="BASE_URL + 'swrserveadmin/OssImage/uploadImage'"
            :data="filedata"
            name="image"
            list-type="picture-card"
            :on-success="uploadSuccess"
            :on-remove="handleRemove"
            :limit="1"
            :file-list="filesList"
            accept=".jpg,.png,.jpeg"
          >
            <span>+点击上传</span>
            <template #tip>
              <div class="red-text">最多上传一个图片</div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="执行标准代号：" prop="">
          <el-input v-model="tableData.norm" placeholder="请输入执行标准代号"></el-input>
        </el-form-item>
        <el-form-item v-if="tableData.id !== 0" label="上次编辑时间：" prop="">
          <div>{{ tableData.update_time }}</div>
        </el-form-item>
        <el-form-item v-if="tableData.id !== 0" label="上次编辑人：" prop="">
          <div>{{ tableData.user_name }}</div>
        </el-form-item>
      </el-form>
      <div class="sure-btn">
        <el-button @click="back()">取消</el-button>
        <el-button type="primary" @click="submitForm(tableData1)">保存</el-button>
      </div>
      <!-- <template #footer>
        <span class="dialog-footer">
          <el-button @click="back()">取消</el-button>
          <el-button type="primary" @click="submitForm(tableData1)">确认</el-button>
        </span>
      </template> -->
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, toRefs, watch } from 'vue'

import { getInstrumentSingle, editInstrument, getUnits } from '@service/equiment-standard/base-message/index'
import { detailData, EditData } from '@service/equiment-standard/base-message/types'
import { getAll } from '@service/equiment-standard/type-manage/index'
import { AllTypeChildren } from '@service/equiment-standard/type-manage/types'

import { ElMessage } from 'element-plus'
import type { ElForm } from 'element-plus'
import type { UploadFile } from 'element-plus/es/components/upload/src/upload.type'

import { BASE_URL } from '@service/request/config'
import { useStore } from '@store/index'

const store = useStore()
const filedata = reactive({
  token: store.state.login.userInfo.token
})

let props = defineProps({ editShow: Boolean, itemData: { type: Object, required: true } })
let { editShow, itemData } = toRefs(props)
// const basedata = { ...itemData.value }

let emit = defineEmits(['back'])

const back = () => {
  emit('back')
}

let dataMap = reactive({
  editStatus: false,
  tableData: JSON.parse(JSON.stringify(detailData)),
  filesList: Array<{ name: string; url: string }>(),
  files: Array<any>(),
  units: Array<{ id: number; title: string }>(),
  allType: Array<AllTypeChildren>(),
  casProps: {
    value: 'id',
    label: 'title',
    emitPath: false,
    multiple: true,
    checkStrictly: true
  }
})

let { editStatus, tableData, filesList, files, units, allType, casProps } = toRefs(dataMap)
editStatus.value = editShow.value

const getData = (number: string) => {
  getInstrumentSingle({
    number
  }).then((res) => {
    tableData.value = res.data
    if (res.data.url_path.length >= 1) {
      filesList.value = [
        {
          name: '',
          url: res.data.url_path[0].url_path
        }
      ]
      tableData.value.url_path = res.data.url_path[0].url_path
    }
    tableData.value.categorys = res.data.categorys.map((item) => {
      return item.id
    })
    tableData.value.cost_type = res.data.cost_type.value || 1
    getAllType()
  })
}
let typeData = ref(1)
typeData.value = itemData.value.type.value
const getAllType = () => {
  getAll({
    type: typeData.value
  }).then((res) => {
    allType.value = res.data
    // allType.value = getTreeData(res.data)
  })
}

getUnits().then((res) => {
  units.value = res.data
})

const getTreeData = (data: any[]) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].children.length < 1) {
      // children若为空数组，则将children设为undefined
      data[i].children = undefined
    } else {
      // children若不为空数组，则继续 递归调用 本方法
      getTreeData(data[i].children)
    }
  }
  return data
}

const edState = ref(false)
if (itemData.value.number !== '') {
  getData(itemData.value.number)
  edState.value = true
} else {
  edState.value = false
  filesList.value = [
    {
      name: '',
      url: 'https://swryangzhou.oss-cn-beijing.aliyuncs.com/image/20220715/163110534.png'
    }
  ]
  getAllType()
}

watch(editStatus, (val) => {
  if (val === false) {
    back()
  }
})

const changeType = (type: number) => {
  if (edState.value) {
    ElMessage({
      type: 'error',
      message: '编辑时不能切换类型！'
    })
  } else {
    typeData.value = type
    tableData.value = JSON.parse(JSON.stringify(detailData))
    tableData.value.type.value = type
    getAllType()
  }
}

const rules = reactive({
  number: [
    {
      required: true,
      message: '请输入分类编号',
      trigger: 'blur'
    }
  ],
  asset_number: [
    {
      required: true,
      message: '请输入资产编号',
      trigger: 'blur'
    }
  ],
  name: [
    {
      required: true,
      message: '请输入实验室名称',
      trigger: 'blur'
    }
  ],
  unit: [
    {
      required: true,
      message: '请输入单位',
      trigger: 'blur'
    }
  ],
  categorys: [
    {
      type: 'array',
      required: true,
      message: '请选择分类',
      trigger: 'blur'
    }
  ],
  cost_type: [
    {
      required: true,
      message: '请选择价值分类',
      trigger: 'blur'
    }
  ]
})

const tableData1 = ref<InstanceType<typeof ElForm>>()
const submitForm = (formEl: InstanceType<typeof ElForm> | undefined) => {
  if (!formEl) return

  formEl.validate((valid) => {
    if (valid) {
      let obj: EditData
      if (files.value.length === 0) {
        console.log('🚀 ~ file: edit.vue:291 ~ formEl.validate ~ files:', files)
        tableData.value.url_path = filesList.value[0] ? filesList.value[0].url : ''
      } else {
        let string = ''
        files.value.forEach((e) => {
          let str = (
            e as {
              response: {
                data: {
                  file_url: string
                }
              }
            }
          ).response
            ? (
                e as {
                  response: {
                    data: {
                      file_url: string
                    }
                  }
                }
              ).response.data.file_url
            : (e as { url: string }).url
          if (string === '') {
            string = string + str
          } else {
            string = string + ',' + str
          }
        })
        tableData.value.url_path = string
      }

      if (itemData.value.id === 0) {
        obj = {
          categorys: tableData.value.categorys,
          cost_type: tableData.value.cost_type,
          info: tableData.value.info,
          is_group: tableData.value.is_group.value,
          is_must: tableData.value.is_must.value,
          name: tableData.value.name,
          norm: tableData.value.norm,
          number: tableData.value.number,
          number_year: tableData.value.number_year,
          specification: tableData.value.specification,
          type: tableData.value.type.value,
          unit: tableData.value.unit,
          unit_price: tableData.value.unit_price,
          url_path: (tableData.value.url_path as string) || ''
        }
      } else {
        obj = {
          categorys: tableData.value.categorys,
          cost_type: tableData.value.cost_type,
          id: tableData.value.id,
          info: tableData.value.info,
          is_group: tableData.value.is_group.value,
          is_must: tableData.value.is_must.value || 1,
          name: tableData.value.name,
          norm: tableData.value.norm,
          number: tableData.value.number,
          number_year: tableData.value.number_year,
          specification: tableData.value.specification,
          type: tableData.value.type.value,
          unit: tableData.value.unit,
          unit_price: tableData.value.unit_price,
          url_path: (tableData.value.url_path as string) || ''
        }
      }

      editInstrument(obj).then((res) => {
        if (res.code === 10) {
          ElMessage({
            type: 'success',
            message: '保存成功'
          })
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

const uploadSuccess = (response: unknown, file: UploadFile, fileList: UploadFile[]) => {
  console.log('🚀 ~ file: index.vue ~ line 444 ~ uploadSuccess ~ fileList', fileList)
  files.value = fileList
}

const handleRemove = (file: UploadFile, fileList: UploadFile[]) => {
  console.log(file, fileList)
  files.value = fileList
}

// const optionsYear = reactive([
//   {
//     value: '年',
//     label: '年'
//   },
//   {
//     value: '月',
//     label: '月'
//   },
//   {
//     value: '日',
//     label: '日'
//   }
// ])
</script>

<style lang="scss" scoped>
:deep(.bm-edit-dialog) {
  width: 50% !important;
  text-align: left;
  // margin-top: 50px;
  .el-drawer__header {
    > span {
      text-align: center;
    }
  }
  .el-drawer__body {
    overflow: auto;
    border-top: #05c65d 1px solid;
    box-sizing: border-box;
    .title-box {
      display: flex;
      justify-content: center;
      height: 60px;
      .edit-title {
        width: 24%;
        height: 40px;
        line-height: 40px;
        text-align: center;
        color: #848484;
        cursor: pointer;
        background-color: #ccc;
        // color: #05c65d;
      }
      .active-item {
        color: #fff;
        background-color: #05c65d;
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
          width: 90%;
          .el-input__inner {
            width: 100%;
          }
        }
      }
    }
    .red-text {
      color: red !important;
    }
  }
}
.sure-btn {
  text-align: center;
}
</style>
