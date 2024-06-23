<template>
  <header>
    <div class="fl">
      实验室标准
      <el-icon><arrow-right /></el-icon>
      实验室类型管理
    </div>
  </header>
  <!-- <div v-if="false" class="recommend">
    <p>实验室类型管理</p>
  </div> -->
  <div class="content">
    <el-table
      :data="tableData"
      style="width: 100%"
      :header-cell-style="{ background: '#EFEFEF', color: '#000' }"
      :cell-style="{ background: '#ffffff', borderBottom: '1px solid #EFEFEF' }"
    >
      <el-table-column type="index" label="序号" width="100" align="left"></el-table-column>
      <el-table-column prop="name" label="类型" align="left"></el-table-column>
      <el-table-column prop="tips" label="功能说明" align="left" show-overflow-tooltip></el-table-column>
      <el-table-column prop="user_name" label="编辑人" align="left"></el-table-column>
      <el-table-column prop="update_time" label="编辑时间" align="left" sortable></el-table-column>
      <el-table-column prop="" label="操作" width="400" align="center">
        <template #default="scope">
          <div class="click-box">
            <span class="click-text" @click="addItem(scope.row)">
              <img src="@assets/images/laboratory-standard/edit.png" alt="" />
              <!-- <img
                v-show="scope.row.id === 1"
                src="@assets/images/laboratory-standard/edit-white.png"
                alt=""
              /> -->
              编辑
            </span>
            <!-- <span class="click-text" @click="sureClick">
              <img src="@assets/images/laboratory-standard/save.png" alt="" />
              保存
            </span> -->
            <span v-if="false" class="click-text" @click="delItem(scope.row.id)">
              <img src="@assets/images/laboratory-standard/delete.png" alt="" />
              <!-- <img
                v-show="scope.row.id === 1"
                src="@assets/images/laboratory-standard/delete-white.png"
                alt=""
              /> -->
              删除
            </span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="btn" @click="addItem()">+新增实验室类型</div>
  </div>
  <el-dialog
    custom-class="type-edit-dialog"
    v-model="editShow"
    :title="editFormData.id !== 0 ? '编辑实验室类型' : '新增实验室类型'"
    width="30%"
  >
    <el-form ref="editForm" :model="editFormData" label-width="120px" :key="editShow">
      <el-form-item label="类型：">
        <el-input v-model="editFormData.name"></el-input>
        <p>*请输入汉字、正整数，不能超过20字符，不能为空*</p>
      </el-form-item>

      <el-form-item label="功能说明：">
        <el-input type="textarea" v-model="editFormData.tips"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editShow = false">取消</el-button>
        <el-button type="primary" @click="sureClick">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ArrowRight } from '@element-plus/icons-vue'
import { ref, reactive, toRefs } from 'vue'

import { getTypeList, addLabType, delLabType } from '@service/laboratory-standard/type-manage/index'
import { RequestDataLab, RequestDataLabType, AddFormData } from '@service/laboratory-standard/type-manage/types'
import { ElMessageBox, ElMessage } from 'element-plus'

const dataMap = reactive({
  tableData: [RequestDataLab],
  editFormData: AddFormData
})
let { tableData, editFormData } = toRefs(dataMap)
const getData = () => {
  getTypeList().then((res) => {
    tableData.value = res.data
  })
}
getData()

const addItem = (item?: RequestDataLabType) => {
  if (item) {
    editFormData.value.name = item.name
    editFormData.value.tips = item.tips || ''
    editFormData.value.id = item.id
  } else {
    editFormData.value.name = ''
    editFormData.value.tips = ''
    editFormData.value.id = 0
  }
  editShow.value = true
}

let editShow = ref(false)
const sureClick = () => {
  if (editFormData.value.id === 0) {
    delete editFormData.value.id
  }

  if (!/^(\d|[\u4E00-\u9FA5])*$/.test(editFormData.value.name) || !/^.{1,20}$/.test(editFormData.value.name)) {
    ElMessage({
      type: 'warning',
      message: '请按规定输入类型'
    })
    return
  }
  addLabType(editFormData.value).then((res) => {
    if (res.code === 10) {
      editShow.value = false
      ElMessage({
        type: 'success',
        message: res.msg
      })
      getData()
    }
  })
}
const delItem = (id: number) => {
  ElMessageBox.confirm('确定删除此类型，删除后无法撤销', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      delLabType({
        id: id
      }).then((res) => {
        if (res.code === 10) {
          ElMessage({
            type: 'success',
            message: '已删除'
          })
          getData()
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
  }
}
.recommend {
  margin-top: 10px;
  padding: 0 30px;
  width: 100%;
  height: 60px;
  background: #dcece3;
  color: #05c65d;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  p:nth-of-type(1) {
    font-size: 20px;
    font-family: Microsoft YaHei;
    font-weight: 400;
  }
}
.content {
  margin-top: 20px;
  width: 100%;
  .click-box {
    display: flex;
    justify-content: space-evenly;
    .click-text {
      display: flex;
      align-items: center;
      margin: 0 20px;
      cursor: pointer;
      img {
        margin-right: 10px;
      }
    }
  }
  .btn {
    margin: 33px auto;
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
</style>
<style lang="scss">
.type-edit-dialog {
  .el-dialog__body {
    border-top: #05c65d 1px solid;
    box-sizing: border-box;
    div {
      margin-bottom: 10px;
    }
    .el-form {
      width: 100%;
    }
    .el-form-item__content {
      position: relative;
      text-align: left;
      .el-input {
        width: 80%;
        .el-input__inner {
          width: 100%;
        }
      }
      .el-textarea {
        width: 80%;
      }
      p {
        position: absolute;
        left: 0;
        bottom: -10px;
        height: 20px;
        line-height: 20px;
        color: #ec8c42;
      }
    }
  }
}
</style>
