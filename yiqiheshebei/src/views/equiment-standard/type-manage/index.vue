<template>
  <div>
    <header>
      <div class="fl">
        <span>仪器设备配备设置</span>
        <el-icon><arrow-right /></el-icon>
        <span>仪器设备类型管理</span>
      </div>
      <div class="totle">
        共计：一级类型
        <span class="countColor">{{ countData.pCount }}</span>
        种，二级类型
        <span class="countColor">{{ countData.cCount }}</span>
        种
      </div>
    </header>
    <div class="title-r">
      <div class="countColor">仪器设备类型管理</div>
      <div class="btns">
        <p class="btn" @click="editItem(1)">+新增仪器设备类型</p>
        <p class="btn" @click="downLoadTem">下载模板</p>
        <p class="btn" @click="importType">导入类型</p>
        <input v-show="false" ref="uploadFile" type="file" @change="hasUpload" />
      </div>
    </div>
    <div class="content">
      <el-table
        :data="tableData"
        style="width: 100%"
        max-height="650px"
        :header-cell-style="{ background: '#EFEFEF', color: '#000' }"
        :cell-style="cellStyle"
        v-loading="loading"
        row-key="id"
        :tree-props="{ children: 'children' }"
        @expand-change="load"
      >
        <!-- <el-table-column type="index" prop="" label="序号" width="60" align="left"></el-table-column> -->
        <el-table-column prop="number" label="类型号" align="left" sortable>
          <template #default="scope">
            <span v-show="scope.row.children">{{ scope.row.number }}</span>
            <span v-show="!scope.row.children">{{ scope.row.number }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="类型" align="left" sortable></el-table-column>

        <el-table-column prop="type" label="所属类型" align="left">
          <template #default="scope">
            <span>{{ scope.row.type_info.value === 1 ? '仪器' : '设备' }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="user_name" label="编辑人" align="left"></el-table-column>
        <el-table-column prop="update_time" label="编辑时间" align="left" sortable></el-table-column> -->
        <el-table-column prop="" label="操作" width="400" align="center">
          <template #default="scope">
            <div class="click-box">
              <span class="click-text green" @click="editItem(0, scope.row)">
                <img src="@assets/images/laboratory-standard/edit.png" alt="" />
                编辑
              </span>
              <!-- <span class="click-text green" @click="deleteItem(scope.row.id)">
                <img src="@assets/images/laboratory-standard/delete.png" alt="" />
                删除
              </span> -->
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="mask" v-if="loading"></div>
      <div class="progressFixed" v-if="loading">
        <el-progress :text-inside="true" :stroke-width="15" :percentage="percentage" status="success" />
        <div class="desc">正在导入中，请勿操作当前页面~</div>
      </div>
    </div>

    <el-drawer custom-class="tm-edit-dialog" v-model="editShow" title="编辑&新增" width="30%">
      <el-form ref="ruleForm1" :model="ruleForm" :rules="rules" label-width="100px" class="rule-form">
        <el-form-item label="类型：" prop="type">
          <el-radio-group v-model="ruleForm.type">
            <el-radio :label="1">仪器</el-radio>
            <el-radio :label="2">设备</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="分类编号：" prop="number">
          <el-input v-model="ruleForm.number"></el-input>
        </el-form-item>
        <el-form-item label="分类：" prop="title">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="上级分类：" prop="">
          <el-cascader
            v-model="ruleForm.pid"
            :options="allType"
            :props="{ value: 'id', label: 'title', emitPath: false, checkStrictly: true }"
            :show-all-levels="false"
            style="width: 100%"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="上次编辑时间：" prop="" v-if="isEdit">
          <span>{{ ruleForm.update_time }}</span>
        </el-form-item>
        <el-form-item label="上次编辑人：" prop="" v-if="isEdit">
          <span>{{ ruleForm.last_people }}</span>
        </el-form-item>
      </el-form>
      <div class="sure-btn">
        <el-button @click="back()">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleForm1)">确认</el-button>
      </div>
      <!-- <template #footer>
        <span class="dialog-footer">
          <el-button @click="back()">取消</el-button>
          <el-button type="primary" @click="submitForm(ruleForm1)">确认</el-button>
        </span>
      </template> -->
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, ref } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'

import type { ElForm } from 'element-plus'
import { ElMessageBox, ElMessage } from 'element-plus'

import {
  getInstrumentCategoryAll,
  editInsCategory,
  delCategory,
  getAll,
  importExcel,
  getAllCount
} from '@service/equiment-standard/type-manage/index'
import { BaseList, AllTypeChildren, AddForm } from '@service/equiment-standard/type-manage/types'
import { useStore } from '@store/index'
import axios from 'axios'
import { BASE_URL } from '@service/request/config'
import localCache from '@/utils/localCache'
const store = useStore()
let options = [...store.state.common.subjectArr]

console.log(options)

let dataMap = reactive({
  tableData: Array<BaseList>(),
  editShow: false,
  ruleForm: {
    id: 0,
    create_time: '',
    del_time: '',
    is_del: 0,
    user_id: 0,
    user_name: '',
    number: '',
    pid: 0,
    update_time: '',
    type: 1,
    last_people: '',
    title: ''
  },
  allType: Array<AllTypeChildren>(),
  styleList: Array<{
    id: number
    status: boolean
  }>()
})

let { tableData, editShow, ruleForm, allType, styleList } = toRefs(dataMap)

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
let countData = ref<any>({})
const getAllCountData = async () => {
  try {
    const { data, code } = await getAllCount()
    if (code === 10) {
      console.log(11111, data)
      countData.value = data
    }
  } catch (error) {
    console.log('err', error)
  }
}
getAllCountData()
const getData = () => {
  getAll().then((res) => {
    allType.value = res.data
    // allType.value = getTreeData(res.data)
  })
  getInstrumentCategoryAll().then((res) => {
    tableData.value = res.data
    styleList.value.length = res.data.length
  })
}

getData()

const back = () => {
  editShow.value = false
}
const isEdit = ref(false)
const editItem = (i: number, item?: BaseList) => {
  isEdit.value = i === 0 ? true : false
  if (item) {
    ruleForm.value = { ...item }
    ruleForm.value.type = item.type_info.value
  } else {
    ruleForm.value = {
      id: 0,
      create_time: '',
      del_time: '',
      is_del: 0,
      user_id: 0,
      user_name: '',
      number: '',
      pid: 0,
      update_time: '',
      type: 1,
      last_people: '',
      title: ''
    }
  }
  editShow.value = true
}

const rules = reactive({
  type: [
    {
      required: true,
      message: '请选择类型',
      trigger: 'blur'
    }
  ],
  number: [
    {
      required: true,
      message: '请输入分类编号',
      trigger: 'blur'
    }
  ],
  title: [
    {
      required: true,
      message: '请输入分类',
      trigger: 'blur'
    }
  ],
  fa_type: [
    {
      required: true,
      message: '请选择上级分类',
      trigger: 'blur'
    }
  ]
})

const ruleForm1 = ref<InstanceType<typeof ElForm>>()
const submitForm = (formEl: InstanceType<typeof ElForm> | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      let obj: AddForm
      if (ruleForm.value.id === 0) {
        obj = {
          number: ruleForm.value.number,
          title: ruleForm.value.title,
          pid: ruleForm.value.pid,
          type: ruleForm.value.type
        }
      } else {
        obj = {
          id: ruleForm.value.id,
          number: ruleForm.value.number,
          title: ruleForm.value.title,
          pid: ruleForm.value.pid,
          type: ruleForm.value.type
        }
      }
      editInsCategory(obj).then((res) => {
        if (res.code === 10) {
          editShow.value = false
          getData()
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

const deleteItem = (id: number) => {
  ElMessageBox.confirm('是否确认删除?', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      delCategory({ id }).then((res) => {
        if (res.code === 10) {
          ElMessage({
            type: 'success',
            message: '删除成功'
          })
        }
        getData()
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除'
      })
    })
}
const downLoadTem = () => {
  const token = localCache.getCookie('swr_token')
  axios
    .post(BASE_URL + '/schooldvc/Instrumentcategory/downloadtpl', { token }, { responseType: 'blob' })
    .then((res) => {
      const blob = new Blob([res.data]) //处理文档流
      const fileName = '仪器设备类型模板.xlsx'
      const elink = document.createElement('a')
      elink.download = fileName
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href) // 释放URL 对象
      document.body.removeChild(elink)
    })
}
const uploadFile: any = ref(null)
const importType = () => {
  uploadFile.value.value = null
  uploadFile.value.click()
}
const loading = ref(false)
const percentage = ref(0)
const time = ref<any>(null)
const hasUpload = () => {
  const token = localCache.getCookie('swr_token')
  percentage.value = 0
  loading.value = true
  time.value = setInterval(() => {
    if (percentage.value < 99) {
      percentage.value += 1
    }
  }, 20)
  let file = uploadFile.value.files[0]
  let form = new FormData()
  form.append('file', file)
  importExcel(form)
    .then((res: any) => {
      loading.value = false
      clearInterval(time.value)
      console.log('1111111111', res)
      if (res.type === 'application/json') {
        let reader = new FileReader()
        console.log('222')
        reader.readAsText(res, 'utf-8')
        console.log('333')
        reader.onload = (e) => {
          let readerres: any = JSON.parse(reader.result)
          console.log('wwwwww', readerres)
          if (readerres.code !== 10) {
            ElMessage({ type: 'error', message: readerres.msg })
            getData()
          } else {
            ElMessage({ type: 'success', message: '导入成功' })
            getData()
          }
          // console.log(readerres === '{"code":10,"msg":"导入成功","data":[]}')
          // if (readerres === '{"code":10,"msg":"导入成功","data":[]}') {
          //   ElMessage({ type: 'success', message: '导入成功' })
          //   getData()
          // } else if (readerres === '{"code":20,"msg":"编号必须是数字","data":[]}') {
          //   ElMessage({ type: 'error', message: '编号必须是数字' })
          //   getData()
          // } else if (readerres === '{"code":20,"msg":"编号不能为空","data":[]}') {
          //   ElMessage({ type: 'error', message: '编号不能为空' })
          //   getData()
          // } else if (readerres === '{"code":20,"msg":"分类不能为空","data":[]}') {
          //   ElMessage({ type: 'error', message: '分类不能为空' })
          //   getData()
          // }
          // parseObj = JSON.parse(readerres)
          // console.log('1111')
          // console.log(parseObj)
        }
      } else {
        ElMessage({ type: 'error', message: '部分数据导入失败！' })
        const blob = new Blob([res]) //处理文档流
        const fileName = '导入错误数据.xlsx'
        const elink = document.createElement('a')
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href) // 释放URL 对象
        document.body.removeChild(elink)
        // ElMessage({ type: 'success', message: res.msg })
        getData()
      }
    })
    .catch((error) => {
      clearInterval(time.value)
      console.log('err', error)
      loading.value = false
    })
}
const cellStyle = (row: any) => {
  if (!row.row.children) {
    return {
      background: '#DCECE3',
      height: '40px'
    }
  } else {
    //改变展开行背景色
    for (const key in styleList.value) {
      if (row.row.id === styleList.value[key].id) {
        if (styleList.value[key].status === true) {
          return {
            background: '#C2E3D1',
            height: '60px'
          }
        }
      }
    }
    return {
      height: '60px'
    }
  }
}
const load = (row: any, expandedRows: boolean) => {
  tableData.value.forEach((e, index) => {
    if (e.id === row.id) {
      styleList.value[index] = { id: row.id, status: expandedRows }
    }
  })
}
</script>

<style scoped lang="scss">
header {
  display: flex;
  justify-content: space-between;
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
    .title-cancel {
      cursor: pointer;
    }
    .cancel {
      margin-left: 10px;
    }
  }
  .fr {
    cursor: pointer;
  }
}
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  padding: 0 30px;
  width: 100%;
  height: 60px;
  line-height: 60px;
  font-size: 20px;
  font-family: Microsoft YaHei;
  box-sizing: border-box;
  background: #dcece3;
  .text-box {
    display: flex;
    color: #05c65d;
    p {
      margin-right: 80px;
    }
  }
  .btn-box {
    width: 330px;
    display: flex;
    justify-content: space-between;
  }
}
.content {
  margin-top: 20px;
  .click-box {
    display: flex;
    justify-content: space-evenly;
    .click-text {
      display: flex;
      align-items: center;
      margin: 0 20px;
      cursor: pointer;
      img {
        margin-right: 6px;
      }
    }
  }
  span {
    display: inline-block;
    min-width: 40px;
    height: 30px;
    line-height: 30px;
  }
  .table-input {
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
}
footer {
  width: 100%;
  margin: 30px auto 0;
}
:deep(.tm-edit-dialog) {
  text-align: left;
  // margin-top: 50px;
  .el-drawer__header {
    > span {
      text-align: center;
    }
  }
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
.btn {
  height: 36px;
  padding: 0 20px;
  line-height: 36px;
  background: #05c65d;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
  border-radius: 10px;
  font-size: 14px;
  font-weight: 400;
  color: #ffffff;
  cursor: pointer;
}
.btn-white {
  color: #05c65d;
  border: 1px solid #05c65d;
  background: #f3f3f3;
}
.btn-gray {
  color: #fff;
  border: 1px solid #b5b5b5;
  background: #b5b5b5;
}
.green {
  color: #05c65d;
}
.yellow {
  color: #ec8c42;
}
.title-r {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 60px;
  line-height: 60px;
  font-size: 20px;
  background: #dcece3;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
  margin: 10px 0;
  padding: 0 30px;
  box-sizing: border-box;
}
.countColor {
  color: #05c65d;
}
.sure-btn {
  text-align: center;
}
.btns {
  display: flex;
  justify-content: center;
  > p {
    margin-right: 10px;
  }
}
.desc {
  width: 100%;
  text-align: center;
  font-size: 28px;
  color: #fff;
  margin-top: 10px;
}
.mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999999;
}
.progressFixed {
  position: fixed;
  z-index: 1000000;
  top: 45%;
  width: 80%;
}
</style>
