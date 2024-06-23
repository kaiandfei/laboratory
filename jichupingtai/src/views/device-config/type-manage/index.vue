<template>
  <header>
    <span>
      外界设备配置中心 > 类型管理{{ status === 1 ? ` > ${JSON.stringify(editItem) === '{}' ? '新增' : '修改'}` : '' }}
    </span>
  </header>
  <main v-if="status === 0">
    <div class="sel-box">
      <div class="operation">
        <span>类型管理</span>
        <div class="button-box">
          <div class="btn green-btn" @click="add">新增</div>
        </div>
      </div>
    </div>
    <div class="table-box">
      <el-table
        ref="multipleTableRef"
        :data="tableData"
        row-key="id"
        style="width: 100%"
        :header-cell-style="{ background: '#C2E3D1', padding: '12px 0' }"
      >
        <el-table-column label="" prop="" width="30"></el-table-column>
        <el-table-column type="index" label="序号" min-width="5" align="left"></el-table-column>
        <el-table-column property="" label="类型" align="left">
          <template #default="scope">
            <div>
              <span>{{ scope.row.title }}</span>
            </div>
          </template>
        </el-table-column>

        <!-- <el-table-column property="type" label="类型/菜单/按钮"></el-table-column> -->
        <el-table-column property="" label="添加时间" align="left">
          <template #default="scope">
            <div>
              <span>{{ scope.row.create_time || '' }}</span>
              <!-- <input v-show="editStatus" type="text" v-model="scope.row.qname" /> -->
            </div>
          </template>
        </el-table-column>

        <el-table-column property="" label="操作" width="160" align="center">
          <template #default="scope">
            <div class="click-box">
              <span v-if="!scope.row.edit" @click="editTable(scope.row)">编辑</span>
              <span v-else @click="save(scope.row)">保存</span>

              <span class="font-red" @click="delItem(scope.row.id, scope.$index)">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </main>
  <edit-vue v-else :propsItem="editItem" @back="back"></edit-vue>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'

import {} from '@/service/video-equipment/index'

import type { ElTable } from 'element-plus'
import EditVue from './edit'

let tableData = ref([])

const getData = () => {
  tableData.value = [
    {
      id: 1,
      title: 'ceshi'
    }
  ]
}

getData()

let status = ref(0)
let editItem = ref({})
const add = () => {
  status.value = 1
  editItem.value = {}
}
const editTable = (item: any) => {
  status.value = 1
  editItem.value = item
  console.log('🚀 ~ file: index.vue:112 ~ editTable ~ item:', item)
}

const save = (item: any) => {
  console.log('🚀 ~ file: index.vue:90 ~ save ~ item:', item)
}

const delItem = (id: number, index: number) => {
  if (!id) {
    tableData.value.splice(index, 1)
  }
  ElMessageBox.confirm('提示:删除类型会删除所有的对应类型的信息，确认需要删除?', '删除类型', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      ElMessage({
        type: 'success',
        message: '删除成功'
      })
      getData()
    })
    .catch(() => {
      console.log('取消')
    })
  console.log('🚀 ~ file: index.vue:116 ~ delItem ~ id:', id)
}

const back = () => {
  status.value = 0
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
  overflow: hidden;

  .sel-box {
    margin-bottom: 20px;
    width: 100%;

    .operation {
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
  }

  .sel-r {
    .mt-4 {
      margin: 0 auto 15px;

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
.click-box {
  display: flex;
  justify-content: space-around;
  color: #05c65d;
  & > span {
    cursor: pointer;
  }
}

::v-deep .el-table .el-table__row .el-table__cell {
  padding: 12px 0;
}

.btn-box {
  display: flex;
  justify-content: center;

  .btn {
    margin: 0 30px;
  }
}

.remove {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.isDisabled {
  pointer-events: none;
}
.detail-labor {
  ::v-deep .el-input__inner {
    border: none;
    box-shadow: none;
    color: #606266;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    padding-left: 0;
  }
  ::v-deep .el-input__suffix {
    display: none;
  }
}
</style>
<style>
.el-message-box__header {
  border-bottom: #05c65d 1px solid;
  text-align: center;
}
.no-data-box {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: #909399;
}
</style>
