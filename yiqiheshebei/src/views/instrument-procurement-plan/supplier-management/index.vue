<template>
  <div class="main" v-show="status === ''">
    <header>
      <div class="fl">
        仪器设备采购计划
        <el-icon><arrow-right /></el-icon>
        供应商管理
      </div>
      <!-- <div v-show="status > 0 || addShow" class="fr cancel-box" @click="cancel">
        <img class="cancel" src="@assets/images/laboratory-standard/cancel.png" alt="返回" />
        返回
      </div> -->
      <div class="fr search-box">
        <el-input v-model="inputValue" placeholder="请输入供应商的名称、联系人、联系电话" />
        <img src="@assets/images/common/search.png" alt="搜索" @click="getList" />
      </div>
    </header>
    <div class="top">
      <span class="title">供应商管理</span>
      <!-- <el-input v-model="inputValue" placeholder="请输入供应商的名称、联系人、联系电话">
        <template #append>
          <el-button @click="getList">
            <el-icon><Search /></el-icon>
          </el-button>
        </template>
      </el-input> -->
      <div class="btn" @click="addSupplier()">添加供应商</div>
      <div class="btn" @click="importSupplier">导入供应商</div>
      <input v-show="false" ref="uploadFile" type="file" @change="hasUpload" />
      <div class="btn" @click="exportSupplier">导出供应商</div>
      <div class="btn btn-white" v-show="multipleSelection.length !== 0" @click="butchDeleteSupplier">
        <el-icon color="#05c65d" :size="18">
          <Delete />
        </el-icon>
        &nbsp;批量删除
      </div>
    </div>
    <el-table
      v-loading="loading"
      ref="multipleTableRef"
      :data="tableData"
      style="width: 100%"
      stripe
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" label="序号" width="55" />
      <el-table-column label="供应商名称">
        <template #default="scope">
          <div class="click-text black-text">
            {{ scope.row.name }}&nbsp;
            <el-icon color="#05c65d" :size="18" @click="copy(scope.row.name)" title="复制">
              <DocumentCopy />
            </el-icon>
          </div>
        </template>
      </el-table-column>
      <el-table-column property="" label="联系人">
        <template #default="scope">
          <div class="ul-box">
            <ul>
              <li v-for="(e, i) in scope.row.contact_list" :key="i">
                {{ e.name }}
              </li>
            </ul>
          </div>
        </template>
      </el-table-column>
      <el-table-column property="" label="职位">
        <template #default="scope">
          <div class="ul-box">
            <ul>
              <li v-for="(e, i) in scope.row.contact_list" :key="i">
                {{ e.duty }}
              </li>
            </ul>
          </div>
        </template>
      </el-table-column>
      <el-table-column property="" label="联系电话">
        <template #default="scope">
          <div class="ul-box">
            <ul>
              <li v-for="(e, i) in scope.row.contact_list" :key="i">
                {{ e.phone }}
              </li>
            </ul>
          </div>
        </template>
      </el-table-column>
      <el-table-column property="address" label="详细地址" />
      <el-table-column label="操作" align="center" width="240px">
        <!-- <template #header>
          <div>操作</div>
        </template> -->
        <template #default="scope">
          <div class="click-text" @click="getDetail(scope.row)">
            <el-icon color="#05c65d" :size="16">
              <Search />
            </el-icon>
            &nbsp;查看
          </div>
          <div class="click-text" @click="addSupplier(scope.row)">
            <el-icon color="#05c65d" :size="16">
              <Edit />
            </el-icon>
            &nbsp;编辑
          </div>
          <div class="click-text danger" @click="deleteSupplier(scope.row)">
            <el-icon color="red" :size="16">
              <Delete />
            </el-icon>
            &nbsp;删除
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="sizes, prev, pager, next"
      v-model:current-page="currentPage"
      @current-change="currentChange"
      @size-change="sizeChange"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 50, 100, 200]"
      :total="total"
    />
  </div>
  <detail-vue v-if="status === 'detail'" :item-data="editForm" @back="back"></detail-vue>
  <edit-vue v-if="status === 'edit'" :item-data="editForm" @back="back"></edit-vue>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ArrowRight, Delete, Search, Edit, DocumentCopy } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
// import axios from 'axios'

import {
  getSupplierList,
  deleteSupplier as deleteSupplierApi,
  butchDeleteSupplier as butchDeleteSupplierApi,
  importExcel,
  exportExcel
} from '@/service/instrument-procurement-plan/supplier-management'

import DetailVue from './components/detail.vue'
import EditVue from './components/edit.vue'

import useClipboard from 'vue-clipboard3'
// import localCache from '@/utils/localCache'
const { toClipboard } = useClipboard()

// 拷贝
const copy = async (text: string) => {
  console.log('🚀 ~ file: index.vue:69 ~ copy ~ text:', text)
  try {
    await toClipboard(text)
    ElMessage({
      type: 'success',
      message: '内容已经复制到剪切板'
    })

    console.log('copy success')
  } catch (e) {
    ElMessageBox.alert(text, '该浏览器不支持自动复制，请手动复制', {
      confirmButtonText: '确定'
    })
    console.error(e)
  }
}

let inputValue = ref('')

let tableData = ref<Array<any>>([])
let currentPage = ref(1)
let pageSize = ref(10)
let total = ref(0)
const currentChange = () => {
  getList()
}
const sizeChange = () => {
  currentPage.value = 1
  getList()
}

const getList = () => {
  console.log('🚀 ~ file: index.vue:31 ~ inputValue:', inputValue.value)
  getSupplierList({
    key_word: inputValue.value,
    page: currentPage.value,
    page_size: pageSize.value
  }).then((res) => {
    tableData.value = res.data.list
    total.value = res.data.page_info.count
    console.log('🚀 ~ file: index.vue:123 ~ getSupplierList ~ res:', res)
  })
  // tableData.value = [{ o: 1 }]
}
getList()

let multipleSelection = ref<Array<any>>([])

const handleSelectionChange = (val: any[]) => {
  multipleSelection.value = val
  console.log('🚀 ~ file: index.vue:56 ~ handleSelectionChange ~ multipleSelection:', multipleSelection.value)
}

let status = ref('') // edit编辑 detail详情
const getDetail = (item: any) => {
  editForm.value = item
  status.value = 'detail'
  console.log('🚀 ~ file: index.vue:69 ~ getDetail ~ item:', item)
}

const back = (refresh?: boolean) => {
  status.value = ''
  if (refresh) {
    getList()
  }
}

let editForm = ref({})

// 新增供应商
const addSupplier = (item?: any) => {
  console.log('🚀 ~ file: index.vue:141 ~ addSupplier ~ item:', item)
  if (item) {
    editForm.value = item
  } else {
    editForm.value = {
      name: '',
      postal_code: '',
      address: '',
      legal_person: '',
      enterprise_type: '',
      registered_capital: '',
      fax: '',
      website: '',
      area: '',
      staff_count: '',
      technicians_count: '',
      summary: '',
      performance: '',
      contact_list: [
        {
          contact_name: '',
          phone: '',
          duty: ''
        }
      ]
    }
  }
  status.value = 'edit'
  console.log('🚀 ~ file: index.vue:31 ~ addSupplier:', inputValue.value)
}

const deleteSupplier = (item: any) => {
  ElMessageBox.confirm('是否确认删除?', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      deleteSupplierApi({
        id: item.id
      }).then((res: any) => {
        ElMessage({
          type: 'success',
          message: res.msg
        })
        getList()
      })
      console.log('🚀 ~ file: index.vue:146 ~ deleteSupplier ~ item:', item)
    })
    .catch()
}
const butchDeleteSupplier = (item: any) => {
  ElMessageBox.confirm('是否确认删除?', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      butchDeleteSupplierApi({
        ids: multipleSelection.value.map((e) => e.id)
      }).then((res: any) => {
        ElMessage({
          type: 'success',
          message: res.msg
        })
        getList()
      })
      console.log('🚀 ~ file: index.vue:146 ~ deleteSupplier ~ item:', item)
    })
    .catch()
}

const uploadFile: any = ref(null)
const importSupplier = () => {
  uploadFile.value.value = null
  uploadFile.value.click()
}

const loading = ref(false)

const hasUpload = () => {
  loading.value = true
  let file = uploadFile.value.files[0]
  let form = new FormData()
  form.append('excel_file', file)

  importExcel(form).then((res) => {
    loading.value = false
    if (res.code === 10) {
      ElMessage({ type: 'success', message: res.msg })
      getList()
    }
  })
}

const exportSupplier = () => {
  // const token = localCache.getCookie('swr_token')

  // axios
  //   .post(
  //     process.env.VUE_APP_BASE_URL_BASE + '/swrserveadmin/Supplies/exportExcel',
  //     { token },
  //     { responseType: 'blob' }
  //   )
  //   .then((res) => {
  //     const blob = new Blob([res.data]) // 处理文档流
  //     const fileName = '供应商导出表.xlsx'
  //     const elink = document.createElement('a')
  //     elink.download = fileName
  //     elink.style.display = 'none'
  //     elink.href = URL.createObjectURL(blob)
  //     document.body.appendChild(elink)
  //     elink.click()
  //     URL.revokeObjectURL(elink.href) // 释放URL 对象
  //     document.body.removeChild(elink)
  //   })
  exportExcel().then((res) => {
    const blob = res.data // 处理文档流
    const fileName = '供应商导出表.xlsx'
    const elink = document.createElement('a')
    elink.download = fileName
    elink.style.display = 'none'
    elink.href = blob
    document.body.appendChild(elink)
    elink.click()
    // URL.revokeObjectURL(elink.href) // 释放URL 对象
    document.body.removeChild(elink)
  })
}
</script>

<style scoped lang="scss">
.main {
  text-align: left;
}
header {
  height: 30px;
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  line-height: 30px;
  color: #626572;
  opacity: 1;

  .cancel-box {
    padding-right: 20px;
    display: flex;
    align-items: center;
    cursor: pointer;
    .cancel {
      margin-right: 8px;
      width: 20px;
      height: 20px;
    }
  }
  .search-box {
    position: relative;
    :deep(.el-input) {
      position: absolute;
      right: 0;
      top: 0;
      width: 360px;
      line-height: 30px;
    }
    img {
      position: absolute;
      right: 0;
      top: 0;
      width: 20px;
      height: 20px;
      padding: 5px 10px;
      background: #05c65d;
      cursor: pointer;
    }
  }
}
.top {
  display: flex;
  align-items: center;
  margin: 10px 0 16px;
  padding: 20px;
  background: #fff;
  text-align: right;
  :deep(.el-input) {
    width: 400px;
  }
  .title {
    margin-right: auto;
    font-weight: bold;
    font-size: 22px;
    color: #05c65d;
  }
  .btn {
    margin-left: 32px;
  }
  // .ser-icon {
  //   padding: 0 10px;
  //   cursor: pointer;
  //   img {
  //     width: 20px;
  //     height: 20px;
  //   }
  // }
}
.el-pagination {
  margin-top: 16px;
  text-align: end;
}
.click-text {
  display: inline-flex;
  align-items: center;
  // vertical-align: middle;
  margin: 0 10px;
  color: #05c65d;
  cursor: pointer;
}
.danger {
  color: rgb(240, 16, 16);
}
.black-text {
  color: #333;
  margin: 0;
}

.ul-box {
  ul {
    li + li {
      margin-top: 10px;
    }
  }
}

.btn {
  display: inline-flex;
  align-items: center;
  margin: 0 6px;
  padding: 0 16px;
  height: 36px;
  line-height: 36px;
  background: #05c65d;
  color: #ffffff;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
  text-align: center;
  border-radius: 10px;
  cursor: pointer;
}
.btn-white {
  border: #05c65d 1px solid;
  background: #fff;
  color: #05c65d;
}
</style>
