<template>
  <header v-show="accountShow">
    <span>设备管理 > 期初设备建帐</span>
    <span>{{ title }}</span>
    <div class="back" @click="back">
      <img src="../../../../assets/images/laboratory-standard/cancel.png" />
      <span>返回</span>
    </div>
  </header>
  <main v-show="accountShow">
    <div class="titleArea">
      <div class="title1">{{ subjectName + '设备期初建帐' }}</div>
    </div>
    <div class="searchArea">
      <div class="area">
        <div class="button2" @click="endAccountCreation">结束建帐</div>
        <div class="button2" @click="addIns">新建设备</div>
      </div>
      <div class="search">
        <el-input v-model="inputValue" placeholder="请输入分类编号" class="input-with-select">
          <template #append>
            <div class="ser-icon" @click="searchList()">
              <img src="@assets/images/account-school/search.png" alt="" />
            </div>
          </template>
        </el-input>
      </div>
    </div>
    <div class="tableArea">
      <el-table
        :data="tableData"
        style="width: 100%"
        max-height="560"
        :header-cell-style="{ background: '#EFEFEF' }"
        :row-style="{ height: '80px' }"
        v-loading="tableLoading"
        element-loading-text="加载中..."
      >
        <el-table-column align="left" type="index" label="序号" fixed="left" show-overflow-tooltip></el-table-column>
        <el-table-column
          align="left"
          prop="number"
          label="分类编号"
          width="130"
          fixed="left"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          align="left"
          prop="name"
          :show-overflow-tooltip="true"
          label="名称"
          width="130"
          fixed="left"
        ></el-table-column>
        <el-table-column
          align="left"
          prop="specification"
          :show-overflow-tooltip="true"
          label="规格型号"
          width="100"
        ></el-table-column>
        <el-table-column align="left" prop="unit" label="单位" width="60"></el-table-column>
        <!-- <el-table-column align="left" prop="" label="标准分类" width="80">
          <template #default="scope">
            <select v-model="scope.row.level" class="inputArea" @change="changeInput">
              <option v-for="(item, index) in levelList" :key="index" :value="item.value" :label="item.name"></option>
            </select>
          </template>
        </el-table-column> -->
        <!-- <el-table-column align="left" prop="" label="应配数量" width="90">
          <template #default="scope">
            <span>{{ scope.row.min_total + '~' + scope.row.max_total }}</span>
          </template>
        </el-table-column> -->
        <el-table-column align="left" prop="asset_number" label="学校编号" width="180">
          <template #default="scope">
            <input class="inputArea" @blur="changeInput(scope.row)" v-model="scope.row.asset_number" />
          </template>
        </el-table-column>
        <el-table-column align="left" prop="price" label="*金额" width="90">
          <template #default="scope">
            <input class="inputArea" @blur="changeInput(scope.row)" v-model.number="scope.row.price" type="number" />
          </template>
        </el-table-column>
        <el-table-column align="left" prop="" label="期初来源" width="100">
          <template #default="scope">
            <select v-model="scope.row.source" class="inputArea" @change="changeInput(scope.row)">
              <option v-for="(item, index) in sourceList" :key="index" :value="item.value" :label="item.name"></option>
            </select>
          </template>
        </el-table-column>
        <el-table-column align="left" prop="voucher_number" label="凭证号" width="130">
          <template #default="scope">
            <input class="inputArea" v-model="scope.row.voucher_number" @blur="changeInput(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column align="left" prop="bacth" label="采购批次" width="130">
          <template #default="scope">
            <input class="inputArea" v-model="scope.row.bacth" @blur="changeInput(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column align="left" prop="factory" label="厂家" width="130">
          <template #default="scope">
            <input class="inputArea" v-model="scope.row.factory" @blur="changeInput(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column align="left" prop="num" label="期初数量" width="80"></el-table-column>
        <el-table-column align="left" prop="" label="位置" width="350">
          <template #default="scope">
            <select
              v-model="scope.row.laboratory_id"
              class="selectArea"
              @change="getData(scope.row.laboratory_id, scope.row.id, scope.$index, scope.row)"
            >
              <option
                v-for="item in optionsLaboratory"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></option>
            </select>

            <select
              v-model="scope.row.store_id"
              class="selectArea"
              @change="getStoreName(scope.row.store_id, scope.$index, scope.row)"
            >
              <option
                v-for="item in optionStore(storeListBox[scope.$index])"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></option>
            </select>

            <select v-model="scope.row.number_plies" class="selectArea" @change="changeInput(scope.row)">
              <option
                v-for="item in optionPlies(storeListBox[scope.$index], scope.row.store_id || 1)"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></option>
            </select>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="" label="操作" width="100" fixed="right">
          <template #default="scope">
            <div class="operation">
              <span @click="Add(scope.row, scope.$index)">复制</span>
              <span style="color: #ee5959" @click="Delete(scope.row.id, scope.$index)">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="paginationArea">
      <el-pagination
        v-model:currentPage="pageData.currentPage"
        v-model:page-size="pageData.pageSize"
        :background="pageData.background"
        layout="prev, pager, next, jumper"
        :total="pageData.total"
        :hide-on-single-page="true"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <el-drawer v-model="drawer" title="添加设备">
      <div class="search-box">
        <div class="searchInput">
          <el-input v-model="searchInput" placeholder="请输入编号或者名称" clearable />
          <img src="@assets/images/common/search.png" alt="搜索" @click="getSearchData(1, currentPage, searchInput)" />
        </div>
      </div>
      <el-table
        :data="searchTableData"
        style="width: 100%"
        max-height="650px"
        :header-cell-style="{ background: '#EFEFEF', color: '#000' }"
        :cell-style="{ background: '#ffffff', borderBottom: '1px solid #EFEFEF' }"
        v-loading="drawerTableLoading"
        element-loading-text="加载中..."
        @selection-change="handleSearchTableDataChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column property="number" label="设备编号：" />
        <el-table-column property="name" label="名称：" show-overflow-tooltip />
        <!-- <el-table-column property="info" label="功能描述：" show-overflow-tooltip /> -->
        <el-table-column property="specification" label="规格型号：" show-overflow-tooltip />
      </el-table>
      <el-pagination
        class="pagination"
        v-model:currentPage="currentPage"
        :page-size="15"
        pager-count="3"
        @current-change="handleDrawerCurrentChange"
        background
        layout="total, prev, pager, next, jumper"
        :total="drawerTotal"
      ></el-pagination>
      <div class="sure-btn">
        <div class="btn btn-white" @click="close">关闭</div>
        <div class="btn" @click="addSureClick">确认</div>
      </div>
    </el-drawer>
  </main>
</template>
<script lang="ts" setup>
import { ref, defineExpose, toRefs, computed, onBeforeUnmount, onUnmounted } from 'vue'
import {
  getAccountInfo,
  saveAccountInfo,
  endAccount,
  delOne
} from '../../../../service/instrument-manage/account-establishment/index'
import { getLaboratoryList, storeByLaboratory } from '@/service/instrument-manage/account-establishment/index'
import { getBaseInstrument } from '@service/equiment-standard/base-message/index'
import { ElMessage, ElMessageBox } from 'element-plus'
let props = defineProps({ accountShow: Boolean, title: String, subjectName: String })
let { accountShow, title, subjectName } = toRefs(props)
let emit = defineEmits(['back'])
const tableData: any = ref([])
const selectId: any = ref(-1)
const inputValue: any = ref('')
const subjectID: any = ref(0)
let searchTableData: any = ref([])
let drawer = ref(false)
let drawerTableLoading = ref(false)
let currentPage = ref(1)
let drawerTotal = ref(0)
const searchInput = ref('')
const getBaseInstrumentData = (explode: number, page: number, name_or_number: string) => {
  drawerTableLoading.value = true
  getBaseInstrument({
    explode,
    page,
    name_or_number,
    type: 2
  })
    .then((res) => {
      searchTableData.value = res.data.data
      drawerTotal.value = res.data.total
    })
    .finally(() => {
      drawerTableLoading.value = false
    })
}
const getSearchData = () => {
  currentPage.value = 1
  getBaseInstrumentData(1, currentPage.value, searchInput.value)
}
const addIns = () => {
  drawer.value = true
  getSearchData()
}
const handleDrawerCurrentChange = (val: number) => {
  currentPage.value = val
  getBaseInstrumentData(1, currentPage.value, searchInput.value)
}
const close = () => {
  searchInput.value = ''
  drawer.value = false
}
const searchTableDataSelection = ref<any>([])
const handleSearchTableDataChange = (val: any) => {
  searchTableDataSelection.value = val
  // console.log('12212', searchTableDataSelection.value)
}
const addSureClick = () => {
  for (let i = 0; i < searchTableDataSelection.value.length; i++) {
    // let flag = tableData.value.some((item) => {
    //   return item.number === searchTableDataSelection.value[i].number
    // })
    // if (flag) {
    //   ElMessage({
    //     message: '所选设备已存在,不可重复添加！',
    //     type: 'error'
    //   })
    //   return
    // }
    delete searchTableDataSelection.value[i].id
    searchTableDataSelection.value[i].cost_type = searchTableDataSelection.value[i].cost_type.value
    searchTableDataSelection.value[i].type = searchTableDataSelection.value[i].type.value
    searchTableDataSelection.value[i].accounts_id = selectId.value
    tableData.value.unshift({
      ...searchTableDataSelection.value[i]
    })
    infoTable()
  }
  saveData(searchTableDataSelection.value)
  setTimeout(() => {
    searchList()
  }, 500)
  searchInput.value = ''
  drawer.value = false
}
// onBeforeUnmount(() => {
//   if (selectId.value !== -1) {
//     saveData(selectId.value, tableData.value)
//   }
// })

// onUnmounted(() => {
//   window.removeEventListener(
//     'beforunload',
//     (e) => {
//       if (selectId.value !== -1) {
//         saveData(selectId.value, tableData.value)
//       }
//     },
//     true
//   )
// })

// window.addEventListener('beforunload', (e) => {
//   if (selectId.value !== -1) {
//     saveData(selectId.value, tableData.value)
//   }
// })

const pageData: any = ref({
  currentPage: 1,
  pageSize: 15,
  // disabled: false,
  background: true,
  total: 0
})

const storeListBox: any = ref(
  Array<
    {
      id: number
      title: string
      number_plies: number
    }[]
  >()
)

const levelList: any = ref([
  {
    value: 1,
    name: 'Ⅰ类'
  },
  {
    value: 2,
    name: 'Ⅱ类'
  },
  {
    value: 3,
    name: 'Ⅲ类'
  }
])

const optionsLaboratory: any = ref([])

const sourceList: any = ref([
  {
    name: '',
    value: 0
  },
  {
    name: '集采',
    value: 1
  },
  {
    name: '自制',
    value: 2
  },
  {
    name: '馈赠',
    value: 3
  },
  {
    name: '自购',
    value: 4
  },
  {
    name: '调拨',
    value: 5
  }
])

let optionStore = computed(() => {
  return (list: { id: number; title: string }[]) => {
    let arr = Array<{
      value: number
      name: string
    }>()
    list?.forEach((e) => {
      const obj = {
        value: e.id,
        name: e.title
      }
      arr.push(obj)
    })
    return arr
  }
})

let optionPlies = computed(() => {
  return (list: { id: number; number_plies: number }[], storeId: number) => {
    let num = 1
    list?.forEach((e) => {
      if (e.id === storeId) {
        num = e.number_plies
      }
    })
    let arr = Array<{
      value: number
      name: string
    }>()
    for (let i = 0; i < num; i++) {
      const obj = {
        value: i + 1,
        name: `第${i + 1}层`
      }
      arr.push(obj)
    }
    return arr
  }
})
const tableLoading = ref(false)
const infoTable = () => {
  for (const key in tableData.value) {
    if (!tableData.value[key].asset_number) {
      tableData.value[key].asset_number = tableData.value[key].number
    }

    if (!tableData.value[key].price) {
      tableData.value[key].price = null
    }

    if (!tableData.value[key].source) {
      tableData.value[key].source = 1
    }

    if (!tableData.value[key].voucher_number) {
      tableData.value[key].voucher_number = ''
    }

    if (!tableData.value[key].bacth) {
      tableData.value[key].bacth = ''
    }

    if (!tableData.value[key].factory) {
      tableData.value[key].factory = ''
    }

    if (!tableData.value[key].num) {
      tableData.value[key].num = 1
    }

    if (!tableData.value[key].laboratory_name) {
      tableData.value[key].laboratory_name = ''
    }

    if (!tableData.value[key].laboratory_id) {
      tableData.value[key].laboratory_id = ''
    } else {
      storeByLaboratory({ id: tableData.value[key].laboratory_id }).then((res) => {
        storeListBox.value[key] = res.data
      })
    }

    if (!tableData.value[key].store_name) {
      tableData.value[key].store_name = ''
    }

    if (!tableData.value[key].store_id) {
      tableData.value[key].store_id = ''
    }

    if (!tableData.value[key].number_plies) {
      tableData.value[key].number_plies = ''
    }
  }
}
const initData = (ID: number, subject_id: any) => {
  tableData.value = []
  subjectID.value = subject_id
  getLaboratoryList({ subject: subjectID.value }).then((res) => {
    let arr = Array<{
      value: number
      name: string
    }>()

    res.data.data.forEach((e: any) => {
      const obj = {
        value: e.id,
        name: e.title
      }
      arr.push(obj)
    })
    optionsLaboratory.value = arr
  })
  selectId.value = ID
  getAccountInfo({
    id: ID,
    keyword: '',
    page: pageData.value.currentPage,
    type: 2,
    limit: pageData.value.pageSize
  })
    .then((res: any) => {
      tableData.value = res.data.data
      pageData.value.total = res.data.total
      infoTable()
    })
    .finally(() => {
      tableLoading.value = false
    })
}

defineExpose({
  initData
})

const getTableList = () => {
  tableData.value = []
  tableLoading.value = true
  getAccountInfo({
    id: selectId.value,
    keyword: inputValue.value,
    page: pageData.value.currentPage,
    type: 2,
    limit: pageData.value.pageSize
  })
    .then((res: any) => {
      tableData.value = res.data.data
      pageData.value.total = res.data.total
      infoTable()
    })
    .finally(() => {
      tableLoading.value = false
    })
}
const searchList = () => {
  pageData.value.currentPage = 1
  getTableList()
}

const changeValue = (value: string, index: number) => {
  let row: any = value
  row = row.replace(/[^\d^.]+/g, '')
  tableData.value[index].asset_number = row
}

// 选择的实验室改变时的事件
const getData = (ID: number, rowId: number, index: number, row: any) => {
  row.store_id = ''
  row.number_plies = ''
  storeByLaboratory({ id: ID }).then((res) => {
    if (res.code === 10) {
      storeListBox.value[index] = res.data
      changeInput(row)
    }
  })
  optionsLaboratory.value.forEach((e: any) => {
    if (e.value === ID) {
      tableData.value[index].laboratory_name = e.name
    }
  })
}

// 选择的设备柜改变时的事件
const getStoreName = (ID: number, index: number, row: any) => {
  row.number_plies = ''
  storeListBox.value[index].forEach((e: any) => {
    if (e.id === ID) {
      tableData.value[index].store_name = e.title
      changeInput(row)
    }
  })
}

//新增功能
const Add = (row: any, ID: any) => {
  delete row.id
  // tableData.value.splice(ID + 1, 0, {
  //   ...row
  // })
  row.laboratory_id = ''
  row.laboratory_name = ''
  row.store_id = ''
  row.store_name = ''
  row.number_plies = ''
  saveData([row])
  setTimeout(() => {
    searchList()
  }, 500)
}

// 删除功能
const Delete = async (ID: any, i: number) => {
  if (ID) {
    try {
      let params = {
        id: ID
      }
      const { code, msg } = await delOne(params)
      if (code === 10) {
        getTableList()
        ElMessage.success(msg)
      }
    } catch (error) {
      console.log(error)
    }
  } else {
    tableData.value.splice(i, 1)
  }
}

const handleSizeChange = (val: number) => {
  pageData.value.pageSize = val
  getTableList()
}

const handleCurrentChange = (val: number) => {
  pageData.value.currentPage = val
  getTableList()
}

// 保存建帐信息
const saveData = (data: any) => {
  // let pulData: any = []
  // data.forEach((e: any, index: any) => {
  //   if (e.laboratory_id !== '') {
  //     pulData.push(data[index])
  //   }
  // })
  // if (pulData.length !== 0) {
  //   saveAccountInfo({ accounts_id: ID, detail: pulData, type: 2 })
  // }
  saveAccountInfo(data).then((res) => {
    if (res.code === 10) {
      ElMessage({
        message: '保存成功',
        type: 'success'
      })
    }
  })
}

// 结束建帐
const endAccountCreation = () => {
  ElMessageBox.confirm('如未填写入库位置，则该数据不会入库！是否确认继续', '确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      endAccount({ id: selectId.value, type: 2 }).then((res) => {
        if (res.code === 10) {
          emit('back')
        }
      })
    })
    .catch((error) => {
      console.log('error', error)
    })
}

// 改变数据
const changeInput = (row: any) => {
  saveData([row])
}

const back = () => {
  inputValue.value = ''
  pageData.value.currentPage = 1
  emit('back')
}
</script>
<style lang="scss" scoped>
header {
  height: 30px;
  & > span {
    float: left;
    margin-right: 6px;
    font-size: 16px;
    color: #626572;
  }
  img {
    float: right;
    margin-right: 15px;
    cursor: pointer;
  }
}
.back {
  float: right;
  display: flex;
  align-items: center;
  cursor: pointer;

  img {
    margin-right: 8px;
  }
}
main {
  width: 100%;
  .titleArea {
    width: 100%;
    height: 60px;
    float: left;
    margin-top: 20px;
    display: flex;
    align-items: center;
    background-color: #dcece3;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    .title1 {
      font-size: 20px;
      height: 30px;
      width: 15%;
      float: left;
      font-weight: bold;
      color: #05c65d;
    }
  }
  .searchArea {
    height: 80px;
    width: 100%;
    background-color: #fff;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    clear: both;
    display: flex;
    align-items: center;
    .area {
      width: 20%;
      height: 50%;
      float: left;
      display: flex;
      margin-left: 3%;
      justify-content: space-between;
      .button1 {
        width: 40%;
        height: 100%;
        cursor: pointer;
        background-color: #05c65d;
        border-radius: 10px;
        box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
        font-size: 14px;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .button2 {
        width: 40%;
        height: 100%;
        cursor: pointer;
        background-color: white;
        border-radius: 10px;
        border: 1px solid #05c65d;
        box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
        font-size: 14px;
        color: #05c65d;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .search {
      float: left;
      margin-left: 55%;
      width: 20%;
      .ser-icon {
        padding: 0 0.1rem;
        cursor: pointer;
        img {
          width: 20px;
          height: 20px;
        }
      }
      :deep(.el-input-group__append) {
        padding: 0 10px;
        border: none;
        background-color: #05c65d;
      }
    }
  }
  .tableArea {
    width: 100%;
    margin-top: 20px;
    .inputArea {
      width: 100%;
      height: 30px;
    }
    .selectArea {
      min-width: 80px;
      width: 30%;
      height: 30px;
    }
    .operation {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      span {
        cursor: pointer;
        font-size: 14px;
        color: #05c65d;
      }
    }
    :deep(.el-table) {
      input {
        width: 90%;
      }
    }
  }
}
.paginationArea {
  text-align: right;
  margin: 20px 0;
}
.search-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 0 10px;

  .searchInput {
    display: flex;
    align-items: center;
    width: 100%;

    img {
      width: 20px;
      height: 20px;
      padding: 5px 10px;
      background: #05c65d;
      cursor: pointer;
    }
  }
}
.pagination {
  margin: 20px 0;
}
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 36px;
  line-height: 36px;
  background: #05c65d;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
  border-radius: 10px;
  font-size: 14px;
  font-weight: 400;
  color: #ffffff;
  cursor: pointer;
  img {
    margin-right: 5px;
  }
}
.sure-btn {
  display: flex;
  justify-content: space-evenly;
  .btn {
    width: 100px;
    height: 35px;
    line-height: 35px;
  }
}
</style>
