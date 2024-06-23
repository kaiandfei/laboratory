<template>
  <header>
    <div class="box">
      教学管理 >
      <span @click="back()">&nbsp;公开课评价模版</span>
      <div v-show="detailShow">&nbsp; > 详情</div>
      <div v-show="editShow">
        &nbsp;>
        {{ clickItem.id ? '新增' : '编辑' }}
      </div>
    </div>
  </header>
  <main>
    <div class="sel-box" v-show="!detailShow && !editShow">
      <div class="operation">
        <span>公开课评价模版</span>
        <div class="button-box">
          <div class="btn green-btn" @click="addNewTemplate({})">+ 新建公开课评价模版</div>
        </div>
      </div>

      <div class="table-box">
        <el-table
          :data="list"
          style="width: 100%"
          :header-cell-style="{ background: '#C2E3D1', padding: '12px 0' }"
          :cell-style="{ padding: '12px 0' }"
        >
          <el-table-column type="index" label="序号" min-width="30" align="left"></el-table-column>
          <el-table-column prop="name" label="模版名称" show-overflow-tooltip align="left"></el-table-column>

          <el-table-column prop="create_time" label="创建时间" sortable show-overflow-tooltip align="left">
            <template #default="scope">
              {{ scope.row.create_time ? scope.row.create_time.split(' ')[0] : '' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="create_user_name"
            label="创建人"
            sortable
            show-overflow-tooltip
            align="left"
          ></el-table-column>
          <el-table-column prop="update_time" label="上次修改时间" sortable show-overflow-tooltip align="left">
            <template #default="scope">
              {{ scope.row.update_time ? scope.row.update_time.split(' ')[0] : '' }}
            </template>
          </el-table-column>
          <el-table-column property="" label="操作" width="120" align="center">
            <template #default="scope">
              <div class="click-box">
                <span @click="showDetail(scope.row)">详情</span>
                <span class="font-red" @click="deleteRow(scope.row)">删除</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <detail-vue v-if="detailShow" :propsData="clickItem" @back="back" />
    <edit-vue v-if="editShow" :propsData="clickItem" @back="saveBack" />
  </main>
  <footer></footer>
</template>

<script lang="ts" setup>
import { reactive, toRefs } from 'vue'
import { getPageData, deleteTemplate } from '@service/teaching/open-class'

import { ElMessage, ElMessageBox } from 'element-plus'
import DetailVue from './components/detail.vue'
import EditVue from './components/edit.vue'

import { useStore } from '@store/index'

const store = useStore()

const dataMap = reactive({
  detailShow: false,
  editShow: false,
  clickItem: Object(),
  list: Array<any>()
})
const { detailShow, editShow, clickItem, list } = toRefs(dataMap)

const getData = () => {
  getPageData({
    type: 1
  }).then((res) => {
    console.log('🚀 ~ file: index.vue:87 ~ getPageData ~ res:', res)
    list.value = res.data
  })
}
getData()
const addNewTemplate = (item) => {
  console.log(12)
  clickItem.value = item
  editShow.value = true
}
const showDetail = (item) => {
  console.log('🚀 ~ file: index.vue:72 ~ showDetail ~ item:', item)
  clickItem.value = item
  detailShow.value = true
}
const deleteRow = (item) => {
  console.log('🚀 ~ file: index.vue:68 ~ deleteRow ~ item:', item)
  ElMessageBox.confirm('是否确认删除此模版?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      deleteTemplate({
        id: item.id
      }).then((res) => {
        if (res.code === 10) {
          ElMessage({
            type: 'success',
            message: '删除成功!'
          })
          getData()
        }
      })
    })
    .catch(() => {
      console.log('🚀 ~ file: index.vue:83 ~ deleteRow ~ 已取消删除:')
    })
}
const back = (item) => {
  editShow.value = false
  detailShow.value = false
  clickItem.value = {}

  if (item) {
    clickItem.value = item
    editShow.value = true
  }
}
const saveBack = (item) => {
  console.log('🚀 ~ file: index.vue:121 ~ saveBack ~ item:', item)
  editShow.value = false
  clickItem.value = item
  if (item.id) {
    detailShow.value = true
  }

  getData()
}
</script>

<style scoped lang="scss">
header {
  height: 30px;

  .box {
    display: flex;
    font-size: 16px;
    color: #626572;
    span {
      cursor: pointer;
    }
    span:hover {
      color: #05c65d;
    }
  }
}
.form-box {
  & > div {
    min-height: 30px;
    line-height: 30px;
    text-align: left;
    overflow: hidden;
    & > span {
      height: 100%;
    }
  }
}
main {
  width: 100%;
  .sel-box {
    margin-bottom: 20px;
    width: 100%;
    .operation {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 60px;

      background-color: rgb(220, 236, 227);
      box-shadow: 1px 3px 6px rgba(0, 0, 0, 0.16);
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
          margin-left: 20px;
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
      padding: 6px 0;
      width: 100%;
      background-color: #fff;
      box-shadow: 0px 3px 4px rgba(0, 0, 0, 0.16);
      box-sizing: border-box;
      overflow: hidden;
      .sel-l {
        float: left;
        width: 80%;
        .sel-item {
          float: left;
          margin: 8px 0;
          width: 25%;
          display: flex;
          justify-content: space-between;
          & > span {
            float: left;
            width: 30%;
            height: 30px;
            line-height: 30px;
            text-align: center;
            color: #848484;
          }
          .sel {
            float: left;
            margin-right: 10%;
            width: 60%;
            ::v-deep .el-input {
              line-height: 30px;
            }
          }
        }
      }
      .sel-r {
        float: left;
        width: 20%;
        .mt-4 {
          margin: 8px auto;
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
    .table-box {
      margin-top: 20px;

      input {
        width: 90%;
        height: 30px;
        line-height: 30px;
        border: 1px solid #c9c7c7;
        border-radius: 2px;
        text-align: center;
        color: #05c65d;
      }
      .click-box {
        display: flex;
        justify-content: space-between;
        color: #05c65d;
        & > span {
          cursor: pointer;
        }
      }
      .el-pagination {
        margin-top: 10px;
        text-align: right;
      }
    }
  }
}
footer {
  margin: 28px 0 16px;
  text-align: right;
}
</style>
