<template>
  <header>
    <span>菜单列表</span>
  </header>
  <main>
    <div class="sel-box">
      <div class="operation">
        <span>菜单列表</span>
      </div>
      <div class="screen">
        <div class="sel-l">
          <div class="sel-item">
            <span>平台:</span>
            <div class="sel">
              <el-select v-model="roof" class="m-2" placeholder="请选择" @change="roofChange">
                <el-option
                  v-for="item in optionsRoof"
                  :key="item.roof"
                  :label="item.name"
                  :value="item.roof"
                ></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <!-- <div class="sel-r">
          <div v-show="editStatus" class="edit-btn btn green-btn" @click="save">保存</div>
          <div v-show="editStatus" class="edit-btn btn white-btn" @click="edit">取消</div>
          <div v-show="!editStatus" class="edit-btn btn green-btn" @click="edit">编辑</div>
        </div> -->
      </div>
    </div>
    <div class="table-box">
      <el-table
        ref="multipleTableRef"
        :data="tableData"
        row-key="id"
        style="width: 100%"
        :header-cell-style="{ background: '#C2E3D1', padding: '12px 0' }"
        :cell-style="cellStyle"
      >
        <el-table-column label="" prop="" width="30"></el-table-column>
        <el-table-column type="index" label="序号" min-width="5"></el-table-column>
        <el-table-column property="" label="名称" width="160">
          <template #default="scope">
            <div>
              <span>{{ scope.row.title }}</span>
              <!-- <input v-show="editStatus" type="text" v-model="scope.row.title" /> -->
            </div>
          </template>
        </el-table-column>
        <el-table-column property="" label="URL路径">
          <template #default="scope">
            <div>
              <span>{{ scope.row.path }}</span>
              <!-- <input v-show="editStatus" type="text" v-model="scope.row.path" /> -->
            </div>
          </template>
        </el-table-column>
        <el-table-column property="" label="平台" width="120">
          <template #default="scope">
            <div>{{ optionsRoof.find((e) => e.roof === scope.row.roof)?.name }}</div>
          </template>
        </el-table-column>
        <el-table-column property="" label="组件地址">
          <template #default="scope">
            <div>
              <span>{{ scope.row.component }}</span>
              <!-- <input v-show="editStatus" type="text" v-model="scope.row.component" /> -->
            </div>
          </template>
        </el-table-column>
        <el-table-column property="" label="图标命名">
          <template #default="scope">
            <div>
              <span>{{ scope.row.icon }}</span>
              <!-- <input v-show="editStatus" type="text" v-model="scope.row.icon" /> -->
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column property="type" label="类型/菜单/按钮"></el-table-column> -->
        <el-table-column property="" label="路由名称">
          <template #default="scope">
            <div>
              <span>{{ scope.row.qname }}</span>
              <!-- <input v-show="editStatus" type="text" v-model="scope.row.qname" /> -->
            </div>
          </template>
        </el-table-column>
        <el-table-column property="" label="排序值" width="100">
          <template #default="scope">
            <div>
              <span>{{ scope.row.sort }}</span>
              <!-- <input v-show="editStatus" type="text" v-model="scope.row.qname" /> -->
            </div>
          </template>
        </el-table-column>
        <el-table-column property="" label="操作" width="160" align="center">
          <template #default="scope">
            <div class="click-box">
              <span @click="editTable(scope.row, 'edit')">编辑</span>
              <span v-show="scope.row.pid === 0" @click="editTable(scope.row, 'addChild')">新增子菜单</span>
              <span class="font-red" @click="delItem(scope.row.id)">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <p class="btn green-btn bottom-add" @click="editTable(editObj, 'addBody')">新增父节点</p>
    </div>
    <PopCurrency :popShow="popState" @close="popState = $event">
      <template v-slot:header>
        <p>
          {{ editObj.id === 0 ? '新增' : '修改' }}菜单节点({{ optionsRoof.find((e) => e.roof === editObj.roof)?.name }})
        </p>
      </template>
      <template v-slot:main>
        <div class="form-box">
          <div class="mb-20">
            <span class="w-108 fl">
              <span class="font-red">*</span>
              名称:
            </span>
            <div class="w-300 fl mr-70">
              <el-input v-model.trim="editObj.title" placeholder="请输入名称"></el-input>
            </div>
            <span class="w-108 fl">父节点:</span>
            <div class="w-300 fl">
              <el-select
                v-model="editObj.pid"
                class="m-2"
                :placeholder="!editObj.pid ? '根节点不可选择父节点' : '请选择'"
                :disabled="!editObj.pid"
              >
                <el-option
                  v-for="(item, index) in tableData"
                  :key="index"
                  :label="item.title"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="mb-20">
            <span class="w-108 fl">
              <span class="font-red">*</span>
              URL路径:
            </span>
            <div class="w-300 fl mr-70">
              <el-input v-model.trim="editObj.path" placeholder=""></el-input>
            </div>
            <span class="w-108 fl">图标命名:</span>
            <div class="w-300 fl">
              <el-input v-model.trim="editObj.icon" placeholder=""></el-input>
            </div>
          </div>
          <div class="mb-20">
            <span class="w-108 fl">组件地址:</span>
            <div class="w-300 fl mr-70">
              <el-input v-model.trim="editObj.component" placeholder=""></el-input>
            </div>
            <span class="w-108 fl">
              <span class="font-red">*</span>
              路由名称:
            </span>
            <div class="w-300 fl">
              <el-input v-model.trim="editObj.qname" placeholder=""></el-input>
            </div>
          </div>
          <div class="mb-20">
            <span class="w-108 fl">meta信息:</span>
            <div class="w-300 fl mr-70">
              <el-input v-model="editObj.condition" placeholder=""></el-input>
            </div>
            <span class="w-108 fl">
              <span class="font-red">*</span>
              后端路径:
            </span>
            <div class="w-300 fl">
              <el-input v-model.trim="editObj.name" placeholder=""></el-input>
            </div>
          </div>
          <div class="mb-20">
            <span class="w-108 fl">排序值:</span>
            <div class="w-300 fl mr-70">
              <el-input v-model.trim="editObj.sort" placeholder=""></el-input>
            </div>
          </div>
          <div class="mb-20">
            <span class="w-108 fl">标注:</span>
            <div class="fl" style="width: 778px">
              URL路径:保证子节点包含父节点;
              <br />
              图标为图片名称，保证为png格式;
              <br />
              组件地址：仪器设备、危化品平台读取路径下index.vue文件，教学管理以及基础平台读取路径.vue文件;
              <br />
              路由名称在作用域内唯一;
              <br />
              后端路径可以和路由名称一致;
              <br />
            </div>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <div>
          <div class="fr btn green-btn ml-60" @click="save">保存</div>
          <div class="fr btn white-btn ml-60" @click="popState = false">取消</div>
        </div>
      </template>
    </PopCurrency>
  </main>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { PopCurrency } from '@components/pop-currency'

import { getTreeMenu, setMenu, delMenu } from '@service/role/index'

// 表格相关
const tableData = ref(Array<any>())
const getPageData = (roof: number) => {
  getTreeMenu({ roof }).then((res) => {
    tableData.value = res.data
  })
}
const roof = ref(1)
getPageData(roof.value)

const roofChange = () => {
  getPageData(roof.value)
}

// const edit = () => {
//   popState.value = true
// }

let editObj: { [key: string]: any } = ref({
  id: 0,
  pid: '',
  name: '',
  title: '',
  type: 1,
  icon: '',
  roof: 1,
  component: '',
  qname: '',
  path: '',
  condition: '',
  sort: ''
})
const popState = ref(false)
const editTable = (row: any, type: string) => {
  popState.value = true
  editObj.value = {
    ...row,
    pid: row.pid === 0 ? '' : row.pid
  }
  if (type === 'addChild') {
    // pid为父节点id
    editObj.value = {
      id: 0,
      pid: row.id,
      name: '',
      title: '',
      type: 1,
      icon: '',
      roof: roof.value,
      component: '',
      qname: '',
      path: '',
      condition: '',
      sort: ''
    }
  } else if (type === 'addBody') {
    editObj.value = {
      id: 0,
      pid: '',
      name: '',
      title: '',
      type: 1,
      icon: '',
      roof: roof.value,
      component: '',
      qname: '',
      path: '',
      condition: '',
      sort: ''
    }
  }
}

const delItem = (id: number) => {
  ElMessageBox.confirm('是否确认删除?', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      delMenu({ id }).then((res) => {
        if (res.code === 10) {
          ElMessage({
            type: 'success',
            message: '删除成功'
          })
          getPageData(roof.value)
        }
      })
    })
    .catch(() => {
      console.log()
    })
}

const save = () => {
  // if (
  //   Object.keys(editObj.value).some(
  //     (item) =>
  //       item !== 'pid' && item !== 'component' && item !== 'icon' && item !== 'condition' && editObj.value[item] === ''
  //   )
  // ) {
  //   ElMessage({ type: 'warning', message: '请检查填写必填项' })
  //   return false
  // }

  if (!editObj.value.title || !editObj.value.path || !editObj.value.name || !editObj.value.qname) {
    ElMessage({ type: 'warning', message: '请检查填写必填项' })
    return false
  }

  ElMessageBox.confirm('是否要保存修改?', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      // editObj.value.condition = `[${editObj.value.condition}]`
      setMenu(editObj.value).then((res) => {
        if (res.code === 10) {
          ElMessage({
            type: 'success',
            message: '保存成功'
          })
          popState.value = false
          editObj.value = {
            id: 0,
            pid: '',
            name: '',
            title: '',
            type: 1,
            icon: '',
            roof: 1,
            component: '',
            qname: '',
            path: '',
            condition: ''
          }
          getPageData(roof.value)
        }
      })
    })
    .catch(() => {
      console.log()
    })
}

const cellStyle = (scope: any) => {
  let obj = { padding: '12px 0' }
  // return obj
  if (scope.row.pid !== 0) {
    return {
      ...obj,
      background: '#DCECE3'
    }
  } else {
    return obj
  }
}

/********** <--- 筛选框 ---> **********/
const optionsRoof = ref([
  {
    name: '基础平台',
    roof: 1
  },
  {
    name: '教学平台',
    roof: 2
  },
  {
    name: '实验室管理平台',
    roof: 3
  },
  {
    name: '危化品平台',
    roof: 4
  },
  {
    name: '小程序',
    roof: 6
  }
])
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
        width: 200px;
        .edit-btn {
          float: right;
          width: 80px;
          margin: 13px 20px 0 0;
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
  }
  .form-box {
    width: 886px;
    & > div {
      min-height: 30px;
      line-height: 30px;
      text-align: left;
      overflow: hidden;
      & > span {
        height: 100%;
      }
    }
    .school-class {
      width: 778px;
    }
  }
  .bottom-add {
    margin: 20px auto 0;
    width: 200px;
  }
}
footer {
  margin: 28px 0 16px;
  text-align: right;
}
</style>
