<template>
  <header>
    <span>区域管理</span>
  </header>
  <main>
    <div class="sel-box">
      <div class="operation">
        <span>区域管理</span>
        <div class="button-box">
          <div class="btn green-btn" @click="addAreaOpen">+ 新增区域</div>
        </div>
      </div>
      <div class="screen">
        <div class="sel-l">
          <div class="sel-item">
            <span>省:</span>
            <div class="sel">
              <el-select v-model="area1" class="m-2" placeholder="请选择" @change="areaChange1">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in options1" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </div>
          </div>
          <div class="sel-item">
            <span>市:</span>
            <div class="sel">
              <el-select v-model="area2" class="m-2" placeholder="请选择" @change="areaChange2">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in options2" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </div>
          </div>

          <div class="sel-item">
            <span>开启状态:</span>
            <div class="sel">
              <el-select v-model="area4" class="m-2" placeholder="请选择" @change="areaChange4">
                <el-option label="全部" value=""></el-option>
                <el-option
                  v-for="item in options4"
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
            <el-input v-model="pageData.name" placeholder="请选择" class="input-with-select">
              <template #append>
                <!-- <el-button :icon="Search"></el-button> -->
                <div class="ser-icon" @click="agetPageData()">
                  <img src="@assets/images/account-school/search.png" alt="" />
                </div>
              </template>
            </el-input>
          </div>
        </div>
      </div>
    </div>
    <div class="area-box">
      <p class="area-title">区域</p>
      <div>
        <el-tree
          :data="areaTree"
          :props="defaultProps"
          :load="loadNode"
          lazy
          node-key="id"
          :default-expanded-keys="showKey"
        >
          <template #default="{ node }">
            <div class="node-l">
              <span>{{ node.label }}</span>
              <div>
                <img @click.stop="delNodeClick(node.data)" src="@assets/images/common/del-red.png" alt="" />
                <img @click.stop="editNodeClick(node.data)" src="@assets/images/common/edit.png" alt="" />
                <span @click.stop="addNodeClick(node.data)" v-show="node.data.area_level !== 3">+</span>
              </div>
            </div>
          </template>
        </el-tree>
      </div>
    </div>
    <div class="table-box">
      <div class="del-res">
        <!-- <span>当前共查询到</span>
      <span class="green-t">12000</span>
      <span>名教师</span> -->
        <!-- <div class="btn green-btn">
        <img src="@assets/images/account-school/w-reload.png" alt="" />
        批量重置密码
      </div> -->
        <div class="btn green-btn" @click="delBatch">
          <img src="@assets/images/account-school/w-del.png" alt="" />
          批量删除
        </div>
        <div class="btn white-btn" @click="allUpdata">
          <img src="@assets/images/common/on.png" alt="" />
          一键开启
        </div>
      </div>
      <el-table
        ref="multipleTableRef"
        :data="tableData"
        stripe
        style="width: 100%"
        @current-change="handleSelectionChange"
        @select="selChange"
        @select-all="selChangeAll"
      >
        <el-table-column align="left" type="selection" width="30" />
        <el-table-column align="left" type="index" label="序号" min-width="5" />
        <el-table-column align="left" property="name" label="地区" min-width="15" />
        <el-table-column align="left" property="code" label="编码" min-width="15" />
        <el-table-column align="center" property="is_open" label="开启状态" min-width="15">
          <template #default="props">
            <el-switch
              v-model="props.row.is_open"
              :active-value="1"
              :inactive-value="2"
              class="ml-2"
              active-color="#13ce66"
              inactive-color="#8f8f8f"
              @change="changeState(props.row)"
            />
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" min-width="20">
          <template #default="props">
            <div class="operation-box">
              <div @click="rePassword(props.row)">
                <img src="@assets/images/common/edit.png" alt="" />
                <span>编辑</span>
              </div>
              <!-- <div @click="rePassword(props)">
              <img src="@assets/images/common/re-password.png" alt="" />
              <span>重置密码</span>
            </div> -->
              <div @click="delNodeClick(props.row)">
                <img src="@assets/images/common/del-red.png" alt="" />
                <span>删除</span>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </main>
  <footer>
    <el-pagination
      :currentPage="pageData.page"
      :page-size="pageData.limit"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="prev, pager, next, jumper"
      :total="pageTotal"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </footer>
  <PopCurrency :popShow="popState" @close="popState = $event">
    <template v-slot:header>
      <p>新增区域</p>
    </template>
    <template v-slot:main>
      <div class="form-box">
        <div class="mb-20" v-show="topShow">
          <span class="w-108 fl">区域从属:</span>
          <div class="w-300 fl">
            <el-input v-model="areaFrom.p_name" placeholder="请输入区域" disabled></el-input>
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">区域名称:</span>
          <div class="w-300 fl">
            <el-input v-model="areaFrom.name" placeholder="请输入自定义区域名称"></el-input>
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">区域编码:</span>
          <div class="w-300 fl">
            <el-input v-model="areaFrom.code" placeholder="请输入自定义区域编码"></el-input>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <div>
        <div class="fr btn green-btn ml-60" @click="save">保存</div>
        <div class="fr btn white-btn ml-60" @click="addAreaClose">取消</div>
      </div>
    </template>
  </PopCurrency>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import type { ElTable } from 'element-plus'
import { ElMessageBox, ElMessage } from 'element-plus'
import { saveArea, agetAreaPageData, delArea, updataStatus, findArea } from '@service/area/index'
import { PopCurrency } from '@components/pop-currency'

const topShow = ref(true)
const addAreaOpen = () => {
  areaFrom.p_name = ''
  popState.value = true
  topShow.value = false
}
const addAreaClose = () => {
  popState.value = false
  topShow.value = true
}

/********** <--- 筛选框 ---> **********/
const area1 = ref('')
const options1 = ref([{}])
const areaChange1 = () => {
  console.log(area1.value)
  area2.value = ''
  pageData.area_level = '2,3'
  pageData.code = area1.value
  getFindArea(2, area1.value)
  agetPageData()
}
const areaChange2 = () => {
  console.log(area1.value)
  // area.value = ''
  if (area2.value) {
    pageData.area_level = '3'
    pageData.code = area2.value
    getFindArea(3, area2.value)
    agetPageData()
  } else {
    areaChange1()
  }
}
const area2 = ref('')
const options2 = ref([])
// const area3 = ref('')
// const options3 = ref([
//   {
//     name: '北京',
//     code: 1
//   }
// ])
const area4 = ref()
const options4 = ref([
  {
    value: '1',
    label: '开启'
  },
  {
    value: '2',
    label: '关闭'
  }
])
const areaChange4 = () => {
  console.log(area1.value)
  // area.value = ''
  pageData.is_open = area4.value
  agetPageData()
}
const areaTree = ref([])

const getFindArea = (val: number, id: any) => {
  findArea({ area_level: val, p_id: id }).then((res) => {
    console.log(res)
    if (val === 1) {
      options1.value = res.data
      areaTree.value = res.data
    } else if (val === 2) {
      options2.value = res.data
    }
  })
}

getFindArea(1, 0)
/********** <--- 筛选框 ---> **********/
/********** <--- 获取区域结构树 ---> **********/

const defaultProps = {
  children: 'child',
  label: 'name'
}
const showKey = ref([])

const loadNode = (node: Node, resolve: (data: any) => void) => {
  if (node.level === 1) {
    findArea({ pro: node.data.pro, area_level: 2 }).then((res) => {
      return resolve(res.data)
    })
  } else if (node.level === 2) {
    findArea({ city: node.data.city, area_level: 3 }).then((res) => {
      return resolve(res.data)
    })
  } else {
    return resolve([])
  }
}
const delNodeClick = (data: any) => {
  console.log(data)
  let nodeData = JSON.parse(JSON.stringify(data))
  ElMessageBox.confirm('删除将删除当前区域包括下级区域的所有数据!', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'error'
  })
    .then(() => {
      delArea({ id: nodeData.id }).then((res) => {
        ElMessage({
          type: 'success',
          message: '删除成功!'
        })
        console.log(res)
        agetPageData()
        findArea({ area_level: 1 })
        getFindArea(1, 0)
      })
    })
    .catch(() => {
      console.log('取消操作')
    })
}
const delBatch = () => {
  if (Array.isArray(delIds.value) && !delIds.value.length) {
    ElMessage({
      type: 'error',
      message: '请选择要删除的数据'
    })
  } else {
    ElMessageBox.confirm('删除将删除当前区域包括下级区域的所有数据!', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    })
      .then(() => {
        delArea({ id: delIds.value }).then((res) => {
          console.log(res)
          agetPageData()
          getFindArea(1, 0)
        })
        ElMessage({
          type: 'success',
          message: '删除成功!'
        })
      })
      .catch(() => {
        console.log('取消操作')
      })
  }
}
const editNodeClick = (data: any) => {
  console.log(data)
  let nodeData = JSON.parse(JSON.stringify(data))
  popState.value = true
  topShow.value = false
  areaFrom.p_name = nodeData.pname
  areaFrom.p_id = nodeData.p_id
  areaFrom.name = nodeData.name
  areaFrom.code = nodeData.code
  areaFrom.id = nodeData.id
}
const addNodeClick = (data: any) => {
  console.log(data)
  let nodeData = JSON.parse(JSON.stringify(data))
  popState.value = true
  topShow.value = true
  areaFrom.p_name = nodeData.name
  areaFrom.p_id = nodeData.code
  areaFrom.name = null
  areaFrom.code = null
}
/********** <--- 获取区域结构树 ---> **********/

/********** <--- 获取区域列表 ---> **********/

// const multipleTableRef = ref<InstanceType<typeof ElTable>>()
// const tableData: User[] = [
//   {
//     date: '2016-05-03',
//     name: 'Tom',
//     address: 'No. 189, Grove St, Los Angeles'
//   }
// ]
const handleSelectionChange = (val: any) => {
  console.log(val)
}
const delIds = ref([])
const selChange = (selection: any, row: any) => {
  console.log(JSON.parse(JSON.stringify(selection)))
  console.log(row)
  let ids = ''
  JSON.parse(JSON.stringify(selection)).forEach((e: { id: any }) => {
    ids = ids + JSON.stringify(e.id) + ','
  })
  delIds.value = ids
}
const selChangeAll = (selection: any) => {
  console.log(JSON.parse(JSON.stringify(selection)))
  let ids = ''
  JSON.parse(JSON.stringify(selection)).forEach((e: { id: any }) => {
    ids = ids + JSON.stringify(e.id) + ','
  })
  delIds.value = ids
}
// 分页
const pageTotal = ref(1)
const small = ref(true)
const background = ref(true)
const disabled = ref(false)

const pageData = reactive({
  limit: 10,
  page: 1,
  area_level: '1,2,3',
  code: '',
  name: '',
  is_open: null
})

// 表格相关
const tableData = ref([])
const agetPageData = () => {
  agetAreaPageData(pageData).then((res) => {
    console.log(res)
    pageTotal.value = res.data.total
    tableData.value = res.data.data
    console.log(tableData.value)
  })
}
agetPageData()
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  pageData.page = val
  agetPageData()
}
const changeState = (val: any) => {
  console.log(1111)
  let item = JSON.parse(JSON.stringify(val))
  console.log(item)
  updataStatus({ ids: item.id, is_open: item.is_open }).then((res) => {
    if (res.code === 10) {
      ElMessage({
        type: 'success',
        message: '修改成功!'
      })
      agetPageData()
      findArea({ area_level: 1 })
    } else {
      agetPageData()
      ElMessage({
        type: 'error',
        message: '修改失败!'
      })
    }
  })
}
const allUpdata = () => {
  updataStatus({ ids: delIds.value, is_open: 1 }).then((res) => {
    if (res.code === 10) {
      agetPageData()
      ElMessage({
        type: 'success',
        message: '修改成功!'
      })
    } else {
      agetPageData()
      ElMessage({
        type: 'error',
        message: '修改失败!'
      })
    }
  })
}
/********** <--- 获取区域列表 ---> **********/

/*  <--  弹窗相关事件  -->  */

const popState = ref(false)

let areaFrom = reactive({
  id: null,
  name: null,
  code: null,
  p_id: 0,
  p_name: '省级区域',
  is_open: 1,
  lab_standard: 1,
  instrument_standard: 1
})
// 新建，编辑保存
const save = () => {
  popState.value = false
  if (areaFrom.name !== null || areaFrom.code !== null) {
    saveArea(areaFrom).then((res) => {
      if (res.code === 10) {
        console.log(res)
        getFindArea(1, 0)
        agetPageData()
        areaFrom.id = null
        areaFrom.name = null
        areaFrom.name = null
        areaFrom.p_name = '省级区域'
        ElMessage({
          type: 'success',
          message: '操作成功!'
        })
      } else {
        ElMessage({
          message: '添加失败!',
          type: 'error'
        })
      }
    })
  } else {
    ElMessage({
      message: '地区信息填写不完整!',
      type: 'warning'
    })
  }
}

/*---  <------------>  ---*/

// 操作
const rePassword = (val: any) => {
  console.log(val)
  let nodeData = JSON.parse(JSON.stringify(val))
  popState.value = true
  areaFrom.p_name = nodeData.pname
  areaFrom.p_id = nodeData.p_id
  areaFrom.name = nodeData.name
  areaFrom.code = nodeData.code
  areaFrom.id = nodeData.id
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
.area-box {
  float: left;
  width: 440px;
  margin-right: 38px;
  .area-title {
    float: left;
    margin-top: 28px;
    width: 150px;
    height: 40px;
    line-height: 40px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
  }
  & > div {
    margin-top: 68px;
    width: 440px;
    max-height: 558px;
    background-color: #fff;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    overflow-y: auto;
  }
}
.table-box {
  float: left;
  width: calc(100% - 478px);
}
.node-l {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  div {
    span {
      margin-right: 20px;
      float: right;
      font-size: 20px;
      width: 18px;
      height: 18px;
      line-height: 18px;
      border: 1px solid #05c65d;
      color: #05c65d;
      border-radius: 100%;
      cursor: pointer;
    }
  }
  img {
    float: right;
    margin-right: 20px;
    z-index: 100;
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
.sch-box {
  display: flex;
  justify-content: space-between;
}
</style>
