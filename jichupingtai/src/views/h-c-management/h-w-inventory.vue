<template>
  <header>
    <span>危化品管理 > 危废物表单</span>
  </header>
  <main>
    <div class="sel-box">
      <div class="operation">
        <span>危废物表单</span>
        <div class="button-box">
          <div @click="downloadModel" class="btn white-btn">
            <img src="@assets/images/common/download.png" alt="" />
            下载模板
          </div>
          <div @click="updateClick" class="btn green-btn">
            <img src="@assets/images/common/reload.png" alt="" />
            刷新
          </div>
          <div class="btn white-btn fileClass">
            <img src="@assets/images/laboratory/laboratory-standard/save.png" alt="" />
            <input type="file" id="docInput" ref="docStore" accept=".xls, .xlsx" @change="fileImport" />
            批量导入
          </div>
        </div>
      </div>
      <div class="screen">
        <div class="sel-r">
          <div class="mt-4">
            <el-input v-model="selMsg.name" placeholder="请输入危废物名称" class="input-with-select">
              <template #append>
                <!-- <el-button :icon="Search"></el-button> -->
                <div class="ser-icon" @click="selClick">
                  <img src="@assets/images/account-school/search.png" alt="" />
                </div>
              </template>
            </el-input>
          </div>
        </div>
      </div>
    </div>
    <el-table ref="multipleTableRef" :data="tableData" stripe style="width: 100%">
      <el-table-column align="left" type="index" label="序号" min-width="5" />
      <el-table-column align="left" property="name" label="危废物类别" min-width="15" />
      <el-table-column align="left" property="unit" label="单位" min-width="15" />
      <el-table-column align="left" label="备注" min-width="15">
        <template #default="props">
          <div class="operation-box">
            <el-input v-show="props.row.state" v-model="props.row.extra"></el-input>
            <span v-show="!props.row.state">{{ props.row.extra }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" property="address" label="操作" min-width="20">
        <template #default="props">
          <div class="operation-box">
            <div v-show="props.row.state" @click="rePassword(props.row)">
              <img src="@assets/images/common/edit.png" alt="" />
              <span>确认变更</span>
            </div>
            <div v-show="!props.row.state" @click="props.row.state = true">
              <img src="@assets/images/common/edit.png" alt="" />
              <span>修改</span>
            </div>
            <div @click="delStu(props.row.id)">
              <img src="@assets/images/common/del-red.png" alt="" />
              <span>删除</span>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </main>
  <footer>
    <el-pagination
      v-model:currentPage="selMsg.page"
      v-model:page-size="selMsg.limit"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="prev, pager, next, jumper"
      :total="total"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </footer>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getHCW, updateHCW, delHCW, importHCW } from '@service/hcApi/index'
import { fileDownload } from '@/utils/file'
const docStore = ref()
const tableData: any = ref([])
const selMsg = reactive({
  page: 1,
  limit: 10,
  name: ''
})
const total = ref(1)
// 模板下载
const downloadModel = () => {
  let url = 'https://baseapi.swrtest.com/chemical/ChemicalWaste/downloadtpl'
  fileDownload(url)
}
// 文件导入
const fileImport = () => {
  let file = docStore.value.files[0]
  let from = new FormData()
  from.append('excel_file', file)
  // let from = {
  //   excel_file: file
  // }
  importHCW(from).then((res) => {
    if (res.code === 10) {
      ElMessage({
        type: 'success',
        message: '导入成功'
      })
      getStudentList()
    }
  })
}
// 刷新状态
const uploadState = ref(true)
// 刷新
const updateClick = () => {
  if (uploadState.value) {
    selMsg.page = 1
    selMsg.name = ''
    ElMessage({
      type: 'success',
      message: '更新数据'
    })
    getStudentList()
  }
}
// 获取危废物列表
const getStudentList = () => {
  uploadState.value = false

  getHCW(selMsg).then((res) => {
    uploadState.value = true
    tableData.value = res.data.list.map((e: any) => {
      e.state = false
      return e
    })
    total.value = res.data.count
  })
}
getStudentList()
// 搜索
const selClick = () => {
  selMsg.page = 1
  getStudentList()
}
// 删除
const delStu = (id: any) => {
  ElMessageBox.confirm('确认删除当前危废物!', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'error'
  }).then(() => {
    delHCW({ id: id }).then((res) => {
      getStudentList()
      if (res.code === 10) {
        ElMessage({
          type: 'success',
          message: '删除成功!'
        })
      } else {
        ElMessage({
          type: 'error',
          message: '删除失败!'
        })
      }
    })
  })
}

// 分页
const small = ref(true)
const background = ref(true)
const disabled = ref(false)
const handleCurrentChange = (val: number) => {
  selMsg.page = val
  getStudentList()
}
// 操作
const rePassword = (val: any) => {
  updateHCW(val).then((res) => {
    if (res.code === 10) {
      ElMessage({
        type: 'success',
        message: '变更成功!'
      })
      getStudentList()
    } else {
      ElMessage({
        type: 'error',
        message: '变更失败!'
      })
    }
  })
}
</script>

<style scoped lang="scss">
header {
  height: 30px;
  & > span {
    float: left;
    margin-right: 6px;
    font-size: 16px;
    color: #626572;
  }
}
main {
  width: 100%;
  .sel-box {
    margin-bottom: 30px;
    width: 100%;
    height: 120px;
    .operation {
      float: left;
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      background-color: rgb(220, 236, 227);
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      & > span {
        float: left;
        margin-left: 1.8%;
        font-size: 20px;
        color: #05c65d;
        font-weight: bold;
      }
      .button-box {
        display: flex;
        justify-content: space-between;
        div {
          margin-right: 20px;
          display: flex;
          align-items: center;
          box-sizing: border-box;
          img {
            margin-right: 4px;
            width: 20px;
            height: 20px;
          }
        }
      }
    }
    .screen {
      height: 60px;
      width: 100%;
      background-color: #fff;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      clear: both;
      .sel-l {
        float: left;
        width: 80%;
        .sel-item {
          float: left;
          margin-top: 16px;
          width: 25%;
          display: flex;
          justify-content: space-between;
          & > span {
            float: left;
            width: 20%;
            height: 30px;
            line-height: 30px;
            text-align: right;
            color: #848484;
          }
          .sel {
            float: left;
            margin-right: 10%;
            width: 60%;
          }
        }
      }
      .sel-r {
        float: right;
        width: 20%;
        .mt-4 {
          margin: 16px auto;
          width: calc(100% - 40px);
          .ser-icon {
            padding: 0 10px;
            cursor: pointer;
            img {
              width: 20px;
              height: 20px;
            }
          }
        }
      }
    }
  }
  .del-res {
    margin-top: 10px;
    height: 56px;
    span {
      float: left;
      height: 56px;
      line-height: 56px;
      font-size: 20px;
      color: #404040;
    }
    .green-t {
      padding: 0 8px;
      color: #05c65d;
    }
    & > div {
      float: right;
      margin: 10px 20px 0 0;
      display: flex;
      align-items: center;
      img {
        margin-right: 4px;
        width: 20px;
        height: 20px;
      }
    }
  }
}
footer {
  margin: 28px 0 16px;
  text-align: right;
}
.operation-box {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: space-around;
  div {
    display: flex;
    align-items: center;
    cursor: pointer;
    &:hover {
      color: #05c65d;
    }
    img {
      margin-right: 12px;
      width: 20px;
      height: 20px;
    }
  }
}
</style>
