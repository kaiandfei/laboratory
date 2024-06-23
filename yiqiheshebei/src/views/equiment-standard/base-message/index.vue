<template>
  <div>
    <header>
      <div class="fl">
        <span>仪器设备标准</span>
        <el-icon><arrow-right /></el-icon>
        <span>国标仪器库</span>
      </div>
      <!-- <div class="fr">
      <img src="@assets/images/laboratory-standard/cancel.png" alt="" />
      <span class="cancel">返回</span>
    </div> -->
    </header>
    <div class="title">
      <div class="text-box">
        <p>国标仪器信息列表</p>
      </div>
      <div class="btn-box">
        <p class="btn" @click="editItem()">+新增仪器设备</p>
        <p class="btn" @click="importTemplate()">导入</p>
        <input v-show="false" ref="uploadFile" type="file" @change="hasUpload" />
        <p class="btn" @click="exportTemplate()">下载模板</p>
      </div>
    </div>
    <el-form :model="searchForm" :inline="true" label-width="100px" class="demo-form-inline screen">
      <el-form-item label="分类编号">
        <el-input v-model="searchForm.number" placeholder="请输入分类编号" clearable />
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="searchForm.name" placeholder="请输入名称" clearable />
      </el-form-item>
      <el-form-item label="分类">
        <el-cascader
          v-model="searchForm.category"
          :options="categoryOptions"
          :props="casProps"
          collapse-tags
          clearable
          :show-all-levels="false"
          style="width: 90%"
        ></el-cascader>
        <!-- <el-select v-model="searchForm.category" placeholder="请选择分类">
          <el-option v-for="item in categoryOptions" :key="item.id" :label="item.label" :value="item.id"></el-option>
        </el-select> -->
      </el-form-item>
      <el-form-item label="执行标准代号">
        <el-input v-model="searchForm.norm" placeholder="请输入执行标准代号" clearable />
      </el-form-item>
      <el-form-item>
        <p class="btn" @click="search">搜索</p>
      </el-form-item>
    </el-form>
    <div class="total">共计：仪器种类：{{ total }} 种</div>
    <div class="content">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        :header-cell-style="{ background: '#EFEFEF', color: '#000' }"
        :cell-style="{ background: '#ffffff', borderBottom: '1px solid #EFEFEF' }"
        @sort-change="sortChange"
      >
        <el-table-column type="index" prop="" label="序号" width="60" align="left"></el-table-column>
        <!-- <el-table-column prop="type.content" label="类型" align="left"></el-table-column> -->
        <el-table-column prop="number" label="分类编号" align="left" sortable="custom"></el-table-column>
        <el-table-column prop="name" label="名称" align="left" show-overflow-tooltip></el-table-column>
        <el-table-column prop="specification" label="规格型号" align="left" show-overflow-tooltip></el-table-column>
        <el-table-column prop="unit" label="单位" align="left"></el-table-column>
        <el-table-column prop="norm" label="执行标准代号" align="left"></el-table-column>
        <el-table-column prop="cat_titles" label="分类" align="left" show-overflow-tooltip></el-table-column>
        <el-table-column prop="" label="操作" width="300" align="center">
          <template #default="scope">
            <div class="click-box">
              <span class="click-text green" @click="editItem(scope.row)">
                <img src="@assets/images/laboratory-standard/edit.png" alt="" />
                编辑
              </span>
              <!-- <span class="click-text green" @click="deleteItem(scope.row.id)">
                <img src="@assets/images/laboratory-standard/delete.png" alt="" />
                删除
              </span> -->
              <span class="click-text green" @click="getDetail(scope.row)">
                <img src="@assets/images/common/search-green.png" alt="" />
                查看详情
              </span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:currentPage="currentPage"
        :page-size="15"
        @current-change="handleCurrentChange"
        background
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <Edit v-if="editShow" :editShow="editShow" :item-data="clickItem" @back="back()" />
    <Detail v-if="detailShow" :detailShow="detailShow" :item-id="clickItem.number" @back="back()" />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, toRefs } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'

import { BASE_URL } from '@/service/request/config'
import { deleteOne, getBaseInstrument, importExcel } from '@service/equiment-standard/base-message/index'
import { ListData, detailData } from '@service/equiment-standard/base-message/types'
import { getAll } from '@service/equiment-standard/type-manage/index'
import { ElMessageBox, ElMessage } from 'element-plus'

import Edit from './component/edit.vue'
import Detail from './component/detail.vue'

let dataMap = reactive({
  tableData: Array<ListData>(),
  currentPage: 1,
  total: 0,
  clickItem: detailData,
  detailShow: false,
  editShow: false,
  loading: false
})
const searchForm = ref({
  number: '',
  name: '',
  category: '',
  norm: ''
})
const categoryOptions = ref<any>([])
const casProps = {
  value: 'id',
  label: 'title',
  emitPath: false,
  multiple: true,
  checkStrictly: true
}
const getAllType = () => {
  getAll().then((res) => {
    categoryOptions.value = res.data
    // categoryOptions.value = getTreeData(res.data)
  })
}
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
getAllType()
const search = () => {
  getData(1, currentPage.value)
}
// const instrumentTotal = ref(0)
let { tableData, currentPage, total, clickItem, detailShow, editShow, loading } = toRefs(dataMap)
let sortData: any = reactive({})
const sortChange = ({ column, prop, order }) => {
  if (prop !== null) {
    sortData = {}
    if (order === 'descending') {
      sortData[`order_${prop}`] = 2
    } else {
      sortData[`order_${prop}`] = 1
    }
    getData(1, currentPage.value)
    console.log(column, prop, order)
  }
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
  getData(1, currentPage.value)
}

const getData = (explode: number, page: number) => {
  getBaseInstrument({
    explode,
    page,
    ...sortData,
    ...searchForm.value
  }).then((res) => {
    tableData.value = res.data.data
    total.value = res.data.total
  })
}

getData(1, currentPage.value)

const uploadFile: any = ref(null)
const importTemplate = () => {
  uploadFile.value.value = null
  uploadFile.value.click()
}

const hasUpload = () => {
  loading.value = true
  let file = uploadFile.value.files[0]
  let form = new FormData()
  form.append('excel_file', file)

  importExcel(form).then((res) => {
    loading.value = false
    if (res.code === 10) {
      ElMessage({ type: 'success', message: res.msg })
      getData(1, currentPage.value)
    }
  })
}

const exportTemplate = () => {
  window.location.href = BASE_URL + '/schooldvc/baseinstrument/downloadtpl'
}

const back = () => {
  editShow.value = false
  detailShow.value = false
  getData(1, currentPage.value)
}

const editItem = (item?: ListData) => {
  if (!item) {
    clickItem.value = JSON.parse(JSON.stringify(detailData))
  } else {
    clickItem.value = JSON.parse(JSON.stringify(item))
  }
  editShow.value = true
  console.log('🚀 ~ file: index.vue ~ line 214 ~ editItem ~ id', item)
}

const getDetail = (item: ListData) => {
  clickItem.value = item
  detailShow.value = true
}

const deleteItem = (id: number) => {
  ElMessageBox.confirm('是否确认删除?', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      deleteOne({ id }).then((res) => {
        if (res.code === 10) {
          ElMessage({
            type: 'success',
            message: '删除成功'
          })
          getData(1, currentPage.value)
        }
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除'
      })
    })
}
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
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
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
      // margin: 0 20px;
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
  .el-pagination {
    margin-top: 10px;
    text-align: right;
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
.screen {
  display: flex;
  align-items: center;
  width: 100%;
  height: 60px;
  background-color: #fff;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
  .el-form-item {
    margin-bottom: 0;
  }
}
.total {
  height: 30px;
  line-height: 30px;
  color: #05c65d;
  text-align: right;
  margin-top: 20px;
}
</style>
