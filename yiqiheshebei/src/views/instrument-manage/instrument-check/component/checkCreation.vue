<template>
  <header v-show="checkShow">
    <span>仪器管理 > 仪器盘点 ></span>
    <span>{{ title }}</span>
    <span class="backPage" @click="back">
      <img src="../../../../assets/images/laboratory-standard/cancel.png" style="" />
      返回
    </span>
  </header>
  <main v-show="checkShow">
    <div class="titleArea">
      <div class="title1">{{ subjectName + '仪器盘点' }}</div>
      <div class="endButton" @click="endCheck">结束盘点</div>
    </div>
    <div class="solutionArea">
      <!-- <div class="titleArea">全部</div> -->
      <div class="area">
        <el-tree
          :data="solutionData"
          :props="defaultProps"
          :highlight-current="true"
          :accordion="true"
          @node-click="handleNodeClick"
        ></el-tree>
      </div>
    </div>
    <div class="tableArea">
      <el-table
        :data="tableData"
        style="width: 100%"
        :header-cell-style="{ background: '#EFEFEF' }"
        :row-style="{ height: '80px' }"
      >
        <el-table-column align="left" type="index" label="序号"></el-table-column>
        <el-table-column align="left" prop="number" label="分类编号" width="120"></el-table-column>
        <el-table-column
          align="left"
          prop="name"
          :show-overflow-tooltip="true"
          label="名称"
          width="100"
        ></el-table-column>
        <el-table-column
          align="left"
          prop="specification"
          :show-overflow-tooltip="true"
          label="规格型号"
          width="100"
        ></el-table-column>
        <el-table-column align="left" prop="unit" label="单位" width="80"></el-table-column>
        <el-table-column align="left" prop="total_price" label="*总金额" width="100">
          <template #default="scope">
            <span>{{ Number(Number(scope.row.unit_price) * scope.row.total).toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" prop="total" label="库存数"></el-table-column>
        <el-table-column align="left" prop="inventory_num" label="盘点数">
          <template #default="scope">
            <input
              class="inputArea"
              v-model.number="scope.row.inventory_num"
              type="number"
              @blur="saveData(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column align="left" prop="" label="盈亏数">
          <template #default="scope">
            <span v-show="scope.row.inventory_num !== ''">{{ scope.row.inventory_num - scope.row.total }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" prop="yk_price" label="盈亏金额">
          <template #default="scope">
            <span v-show="scope.row.inventory_num !== ''">
              {{ Number((scope.row.inventory_num - scope.row.total) * Number(scope.row.unit_price)).toFixed(2) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="left" prop="position" label="位置" width="300"></el-table-column>
      </el-table>
    </div>
    <div class="paginationArea">
      <el-pagination
        v-model:currentPage="pageData.currentPage"
        :page-size="pageData.pageSize"
        :disabled="pageData.disabled"
        :background="pageData.background"
        layout="prev, pager, next,jumper"
        :total="pageData.total"
        :hide-on-single-page="true"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </main>
</template>
<script lang="ts" setup>
import { ref, defineExpose, toRefs } from 'vue'
import {
  saveCheckData,
  getLocationInfo,
  getInfoList,
  endCheckData
} from '../../../../service/instrument-manage/instrument-check/index'

let props = defineProps({ checkShow: Boolean, title: String, subjectName: String })
let { checkShow, title, subjectName } = toRefs(props)
let emit = defineEmits(['back'])
const tableData: any = ref([])
const selectId: any = ref(1)
const solutionData: any = ref([
  {
    laboratory_id: '',
    label: '全部',
    children: []
  }
])
const locationData: any = ref({})

// onBeforeUnmount(() => {
//   saveData(tableData.value)
// })

// onUnmounted(() => {
//   window.removeEventListener(
//     'beforunload',
//     (e) => {
//       saveData(tableData.value)
//     },
//     true
//   )
// })

// window.addEventListener('beforunload', (e) => {
//   saveData(tableData.value)
// })

const pageData: any = ref({
  currentPage: 1,
  pageSize: 15,
  disabled: false,
  background: true,
  total: 0
})

const initData = (ID: number) => {
  selectId.value = ID
  solutionData.value = []
  let Data: any = []
  getLocationInfo().then((res) => {
    Data = res.data.labors
    for (const key in Data) {
      solutionData.value.push({
        laboratory_id: Data[key].id,
        label: Data[key].title,
        children: []
      })
      if (Data[key].stores.length > 0) {
        for (const n in Data[key].stores) {
          solutionData.value[key].children.push({
            store_id: Data[key].stores[n].id,
            label: Data[key].stores[n].title,
            children: []
          })
          if (Data[key].stores[n].plies.length > 0) {
            for (const m in Data[key].stores[n].plies) {
              solutionData.value[key].children[n].children.push({
                number_plies: Data[key].stores[n].plies[m].number_plies,
                label: '第' + Data[key].stores[n].plies[m].number_plies + '层'
              })
            }
          }
        }
      }
    }
    solutionData.value.unshift({
      laboratory_id: '',
      label: '全部'
    })
  })

  getInfoList({
    inventory_total_id: selectId.value,
    labor_id: locationData.value.laboratory_id,
    store_id: locationData.value.store_id,
    number_plies: locationData.value.number_plies,
    page: pageData.value.currentPage,
    type: 1
  }).then((res) => {
    tableData.value = res.data.list
    pageData.value.total = res.data.count
    pageData.value.currentPage = Number(res.data.page_info.page)
    pageData.value.pageSize = res.data.page_info.page_size
  })
}

defineExpose({
  initData
})

// 左侧筛选实验室条件树形结构
const defaultProps = ref({
  children: 'children',
  label: 'label'
})

const handleNodeClick = (data: any, data2: any) => {
  if (data2.level === 1) {
    locationData.value.laboratory_id = data2.data.laboratory_id
    locationData.value.store_id = ''
    locationData.value.number_plies = ''
  }
  if (data2.level === 2) {
    locationData.value.laboratory_id = data2.parent.data.laboratory_id
    locationData.value.store_id = data2.data.store_id
    locationData.value.number_plies = ''
  }
  if (data2.level === 3) {
    console.log(data2.parent.parent.data.laboratory_id)
    console.log(data2.parent.data.store_id)
    console.log(data2.data.number_plies)
    locationData.value.laboratory_id = data2.parent.parent.data.laboratory_id
    locationData.value.store_id = data2.parent.data.store_id
    locationData.value.number_plies = data2.data.number_plies
  }
  console.log(locationData.value)
  // if (data.laboratory_id === '') {
  //   locationData.value.laboratory_id = ''
  //   locationData.value.store_id = ''
  //   locationData.value.number_plies = ''
  // } else {
  //   if (data.laboratory_id) {
  //     locationData.value.laboratory_id = data.laboratory_id
  //     locationData.value.store_id = ''
  //     locationData.value.number_plies = ''
  //   }
  //   if (data.store_id) {
  //     locationData.value.store_id = data.store_id
  //   }
  //   if (data.number_plies) {
  //     locationData.value.number_plies = data.number_plies
  //   }
  // }

  getInfoList({
    inventory_total_id: selectId.value,
    labor_id: locationData.value.laboratory_id,
    store_id: locationData.value.store_id,
    number_plies: locationData.value.number_plies,
    type: 1
  }).then((res) => {
    tableData.value = res.data.list
    pageData.value.total = res.data.count
    pageData.value.currentPage = Number(res.data.page_info.page)
    pageData.value.pageSize = res.data.page_info.page_size
  })
}

const handleSizeChange = () => {
  console.log('')
}

const handleCurrentChange = () => {
  initData(selectId.value)
}

// 保存建帐信息
const saveData = (data: any) => {
  saveCheckData({
    inventory_total_id: selectId.value,
    school_instrument_id: data.instrument_id,
    laboratory_id: data.school_laboratory_id,
    store_id: data.store_id,
    number_plies: data.number_plies,
    yk: data.inventory_num - data.total > 0 ? 1 : 2,
    inventory_num: data.inventory_num,
    num: data.inventory_num - data.total,
    type: 1
  }).then((res) => {
    if (res.code !== 10) {
      console.log('保存失败')
    }
  })
}

// 结束盘点
const endCheck = () => {
  endCheckData({ inventory_total_id: selectId.value, type: 1 }).then((res) => {
    if (res.code === 10) {
      emit('back')
    }
  })
}

const back = () => {
  emit('back')
}
</script>
<style lang="scss" scoped>
header {
  height: 30px;
  .backPage {
    float: right;
    margin-right: 30px;
    display: flex;
    cursor: pointer;
  }
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
    .endButton {
      float: left;
      margin-left: 70%;
      width: 10%;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      border-radius: 10px;
      color: #05c65d;
      cursor: pointer;
      border: 1px solid #05c65d;
      box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
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
      .el-input-group__append {
        background-color: #05c65d;
      }
    }
  }
  .solutionArea {
    width: 15%;
    float: left;
    margin-top: 20px;
    .titleArea {
      width: calc(100% - 20px);
      height: 80px;
      float: left;
      background: white;
      font-size: 20px;
      padding-left: 20px;
    }
    .area {
      width: 100%;
      height: 85%;
      float: left;
      text-align: left;
      :deep(.el-tree-node__content) {
        // background: #dcece3;
        /* 隐藏溢出元素 */
        overflow: hidden;
        /* 单行显示 */
        white-space: nowrap;
        /* 溢出显示省略号 */
        text-overflow: ellipsis;
        .el-tree-node .is-current .is-focusable {
          background: #05c65d;
        }
      }
      :deep(.el-tree-node__label) {
        display: inline-block;
        max-width: 200px;
        width: 200px;
        /* 隐藏溢出元素 */
        overflow: hidden;
        /* 单行显示 */
        white-space: nowrap;
        /* 溢出显示省略号 */
        text-overflow: ellipsis;
      }
    }
  }
  .tableArea {
    width: 84%;
    margin-left: 1%;
    float: left;
    margin-top: 20px;
    .inputArea {
      width: 100%;
      height: 30px;
    }
    .selectArea {
      min-width: 80px;
      width: 30%;
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
  }
  .paginationArea {
    float: right;
    margin-right: 30%;
    margin-top: 20px;
  }
}
</style>
