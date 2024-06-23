<template>
  <header>
    <span>权限管理 > 角色权限</span>
  </header>
  <main>
    <div class="sel-box">
      <div class="operation">
        <span>角色权限</span>
        <div class="button-box">
          <!-- <div class="btn green-btn">+ 添加角色</div> -->
          <!-- <div class="btn white-btn">
            <img src="@assets/images/account-school/exp.png" alt="" />
            导出教师
          </div> -->
          <!-- <div class="btn white-btn">
            <img src="@assets/images/account-school/imp.png" alt="" />
            批量导入
          </div> -->
        </div>
      </div>
      <!-- <div class="screen">
        <div class="sel-l">
          <div class="sel-item">
            <span>年纪:</span>
            <div class="sel">
              <el-select v-model="value" class="m-2" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="sel-item">
            <span>班级:</span>
            <div class="sel">
              <el-select v-model="value" class="m-2" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="sel-r">
          <div class="mt-4">
            <el-input v-model="input1" placeholder="请选择" class="input-with-select">
              <template #append>
                <el-button :icon="Search"></el-button>
                <div class="ser-icon">
                  <img src="@assets/images/account-school/search.png" alt="" />
                </div>
              </template>
            </el-input>
          </div>
        </div>
      </div> -->
    </div>
    <div class="del-res">
      <!-- <span>当前共查询到</span>
      <span class="green-t">12000</span>
      <span>名教师</span> -->
      <!-- <div class="btn green-btn">
        <img src="@assets/images/account-school/w-reload.png" alt="" />
        批量重置密码
      </div> -->
      <!-- <div class="btn green-btn">
        <img src="@assets/images/account-school/w-del.png" alt="" />
        批量删除
      </div> -->
    </div>
    <el-table
      ref="multipleTableRef"
      :data="tableData"
      stripe
      style="width: 100%"
      @current-change="handleSelectionChange"
    >
      <!-- <el-table-column align="left" type="selection" width="30" /> -->
      <el-table-column align="left" type="index" label="序号" min-width="5" />
      <el-table-column align="left" property="title" label="角色名称" min-width="15" />
      <el-table-column property="desc" label="角色描述" min-width="45" />
      <el-table-column align="center" property="address" label="操作" min-width="20">
        <template #default="props">
          <div class="operation-box">
            <div @click="rePassword(props.row)">
              <img src="@assets/images/common/edit.png" alt="" />
              <span>查看</span>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </main>
  <PopCurrency :popShow="popState" @close="popState = $event">
    <template v-slot:header>
      <p>角色详情</p>
    </template>
    <template v-slot:main>
      <div class="tab_box">
        <div class="tab_item" :class="{ sel_on: tabValue === 1 }" @click="tabchange(1)">
          <div class="tab_nor">角色权限</div>
        </div>
        <div class="tab_item" :class="{ sel_on: tabValue === 2 }" @click="tabchange(2)">
          <div class="tab_nor">用户信息</div>
        </div>
        <div class="tab_item" :class="{ sel_on: tabValue === 3 }" @click="tabchange(3)">
          <div class="tab_nor">操作日志</div>
        </div>
      </div>
      <div v-show="tabValue === 1">
        <p class="bold_p">角色信息</p>
        <p class="com_p">
          <span class="font-red">*</span>
          <span class="color-84">角色名称:</span>
          <span>{{ formdata.title }}</span>
        </p>
        <p class="com_p">
          <span class="font-red">*</span>
          <span class="color-84">角色描述:</span>
          <span>{{ formdata.desc }}</span>
        </p>
        <p class="bold_p">功能权限</p>
        <div class="tree-body">
          <div class="tree-box">
            <p class="com_p">基础平台</p>
            <el-tree
              :data="menu1"
              check-strictly
              show-checkbox
              default-expand-all
              node-key="id"
              ref="treeRef1"
              highlight-current
              :props="{ children: 'children', label: 'title' }"
            ></el-tree>
          </div>
          <div class="tree-box">
            <p class="com_p">教学平台</p>
            <el-tree
              :data="menu2"
              show-checkbox
              check-strictly
              default-expand-all
              node-key="id"
              ref="treeRef2"
              highlight-current
              :props="{ children: 'children', label: 'title' }"
            ></el-tree>
          </div>
          <div class="tree-box">
            <p class="com_p">实验室平台</p>
            <el-tree
              :data="menu3"
              show-checkbox
              check-strictly
              default-expand-all
              node-key="id"
              ref="treeRef3"
              highlight-current
              :props="{ children: 'children', label: 'title' }"
            ></el-tree>
          </div>
          <div class="tree-box">
            <p class="com_p">危化品平台</p>
            <el-tree
              :data="menu4"
              check-strictly
              show-checkbox
              default-expand-all
              node-key="id"
              ref="treeRef4"
              highlight-current
              :props="{ children: 'children', label: 'title' }"
            ></el-tree>
          </div>
          <div class="tree-box">
            <p class="com_p">小程序平台</p>
            <el-tree
              :data="menu6"
              check-strictly
              show-checkbox
              default-expand-all
              node-key="id"
              ref="treeRef6"
              highlight-current
              :props="{ children: 'children', label: 'title' }"
            ></el-tree>
          </div>
        </div>
      </div>
      <div v-show="tabValue === 2">
        <p class="bold_p">角色信息</p>
        <p class="com_p">
          <span class="font-red">*</span>
          <span class="color-84">角色名称:</span>
          <span>{{ formdata.title }}</span>
        </p>
        <p class="com_p">
          <span class="font-red">*</span>
          <span class="color-84">角色描述:</span>
          <span>{{ formdata.desc }}</span>
        </p>
        <p class="bold_p">用户信息</p>
        <!-- <p>开发中</p> -->
        <div class="tagbox">
          <div class="item" v-for="item in roleUser" :key="item.id">
            <p>{{ item.username }}</p>
            <p>{{ item.schoolName }}</p>
          </div>
          <!-- <el-tag v-for="item in roleUser" :key="item.id">{{ item.username }} {{ item.schoolName }}</el-tag> -->
        </div>
      </div>
      <div v-show="tabValue === 3">
        <p>开发中</p>
      </div>
    </template>
    <template v-slot:footer>
      <el-button v-show="tabValue === 1" @click="getCheckedKeys">保存</el-button>
    </template>
  </PopCurrency>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { ElTree } from 'element-plus'
import type { ElTable } from 'element-plus'
import { PopCurrency } from '@components/pop-currency'
import { getRoleList, getallMenu, getrolerule, saverolerule } from '@service/role/index'
import { findRoleUser } from '@service/account/index'

interface Tree {
  id: number
  label: string
  children?: Tree[]
}

const treeRef1 = ref<InstanceType<typeof ElTree>>()
const treeRef2 = ref<InstanceType<typeof ElTree>>()
const treeRef3 = ref<InstanceType<typeof ElTree>>()
const treeRef4 = ref<InstanceType<typeof ElTree>>()
const treeRef6 = ref<InstanceType<typeof ElTree>>()
const checklist = ref([])

const setCheckedKeys = () => {
  treeRef1.value!.setCheckedKeys(checklist.value, false)
  treeRef2.value!.setCheckedKeys(checklist.value, false)
  treeRef3.value!.setCheckedKeys(checklist.value, false)
  treeRef4.value!.setCheckedKeys(checklist.value, false)
  treeRef6.value!.setCheckedKeys(checklist.value, false)
}
const getCheckedKeys = () => {
  const arr = treeRef1.value!.getCheckedKeys(false)
  arr.push(...treeRef2.value!.getCheckedKeys(false))
  arr.push(...treeRef3.value!.getCheckedKeys(false))
  arr.push(...treeRef4.value!.getCheckedKeys(false))
  arr.push(...treeRef6.value!.getCheckedKeys(false))

  arr.push(...treeRef1.value!.getHalfCheckedKeys())
  arr.push(...treeRef2.value!.getHalfCheckedKeys())
  arr.push(...treeRef3.value!.getHalfCheckedKeys())
  arr.push(...treeRef4.value!.getHalfCheckedKeys())
  arr.push(...treeRef6.value!.getHalfCheckedKeys())

  saverolerule({ id: formdata.value.id, rules: arr.join(',') }).then((res) => {
    if (res.code === 10) {
      popState.value = false
      getTableData()
    }
  })
}

/**
 * 弹窗相关
 */
const getallMenulist = () => {
  menu1.value = []
  menu2.value = []
  menu3.value = []
  menu4.value = []
  menu6.value = []
  checklist.value = []
  getallMenu()
    .then((res) => {
      if (res.code === 10) {
        res.data.forEach((item) => {
          if (item.roof == 1) {
            menu1.value.push(item)
          }
          if (item.roof == 2) {
            menu2.value.push(item)
          }
          if (item.roof == 3) {
            menu3.value.push(item)
          }
          if (item.roof == 4) {
            menu4.value.push(item)
          }
          if (item.roof == 6) {
            menu6.value.push(item)
          }
        })
      }
    })
    .then(() => {
      getroleruleids()
    })
}

const getroleruleids = () => {
  getrolerule({ id: formdata.value.id }).then((res) => {
    if (res.code === 10) {
      checklist.value = res.data.rules.split(',') ?? []
      setCheckedKeys()
    }
  })
}
const menu1: any = ref([])
const menu2: any = ref([])
const menu3: any = ref([])
const menu4: any = ref([])
const menu6: any = ref([])
const popState = ref(false)
const tabValue = ref(1)

const pageData = {
  page: 1,
  limit: 10
}
const dataTotal = ref(0)
const getTableData = () => {
  getRoleList(pageData).then((res) => {
    if (res.code === 10) {
      tableData.value = res.data.data
      dataTotal.value = res.data.total
    }
  })
}
getTableData()
// 表格相关
const tableData = ref([])
const handleSelectionChange = (val: any) => {
  console.log(val)
}
const formdata = ref({
  id: '',
  title: '',
  desc: '',
  rules: '',
  pid: '',
  status: ''
})
const roleUser = ref([{ id: '', username: '', schoolName: '' }])
// 操作
const rePassword = (val: any) => {
  console.log(val)
  popState.value = true
  formdata.value = val
  getallMenulist()
  findRoleUser({ role_id: val.id }).then((res) => {
    if (res.code === 10) {
      roleUser.value = res.data
    }
  })
}
const tabchange = (value: number) => {
  if (value === 1) {
    tabValue.value = 1
  } else if (value === 2) {
    tabValue.value = 2
  } else if (value === 3) {
    tabValue.value = 3
  }
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
    width: 100%;
    height: 30px;
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
        float: left;
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
    img {
      margin-right: 12px;
      width: 20px;
      height: 20px;
    }
  }
}
.el-table td.el-table__cell div {
  height: 30px;
  line-height: 30px;
}
.tab_box {
  display: flex;
  justify-content: space-between;
  margin: 45px 78px 0;
  min-width: 800px;
  .tab_item {
    width: 212px;
    height: 52px;
  }
}
.tab_nor {
  margin: 6px auto;
  width: 200px;
  height: 40px;
  line-height: 40px;
  color: #848484;
  border: 1px solid #b5b5b5;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
  border-radius: 6px;
  box-sizing: border-box;
  cursor: pointer;
}
.sel_on {
  background-image: url('../../assets/images/common/item_pop_1.png');
  background-size: 100% 100%;
  .tab_nor {
    border: 0px;
    color: #05c65d;
    box-shadow: none;
  }
}
.bold_p {
  margin-top: 34px;
  height: 20px;
  line-height: 20px;
  text-align: left;
  font-size: 16px;
  font-weight: bold;
  :deep(.el-tag) {
    margin-right: 20px;
  }
}
.tree-body {
  display: flex;
  justify-content: space-between;
}
.com_p {
  margin-top: 30px;
  text-align: left;
}
.tagbox {
  width: 800px;
  .item {
    float: left;
    margin: 20px 1%;
    width: 18%;
    height: 60px;
    background-color: #c2ffbc96;
    border-radius: 5px;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
    :nth-child(1) {
      font-weight: 700;
    }
    p {
      width: 100%;
      height: 30px;
      line-height: 30px;
    }
  }
}
</style>
