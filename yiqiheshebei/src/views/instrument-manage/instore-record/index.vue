<template>
  <div v-show="page === 1">
    <header>
      <div class="fl">
        仪器管理
        <el-icon><arrow-right /></el-icon>
        <span>入库记录</span>
      </div>
    </header>
    <div class="sel-box">
      <div class="operation">
        <span>入库记录</span>
      </div>
      <div class="screen">
        <div class="sel-l">
          <div class="sel-item">
            <span>方式:</span>
            <div class="sel">
              <el-select v-model="baseObj.source" class="m-2" placeholder="请选择">
                <el-option label="全部" value=""></el-option>
                <el-option
                  v-for="item in optionCome"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="sel-item">
            <span>凭证号:</span>
            <div class="sel">
              <el-input
                v-model="baseObj.voucher_number"
                class="m-2"
                placeholder="请输入"
                type="text"
                maxlength="50"
                show-word-limit
                oninput="value=value.replace(/[\u4E00-\u9FA5]/g,'')"
              ></el-input>
            </div>
          </div>
          <div class="sel-item">
            <span>采购批次:</span>
            <div class="sel">
              <el-input
                v-model="baseObj.bacth"
                class="m-2"
                placeholder="请输入"
                type="text"
                maxlength="50"
                show-word-limit
                oninput="value=value.replace(/[\u4E00-\u9FA5]/g,'')"
              ></el-input>
            </div>
          </div>
          <div class="sel-item">
            <span>入库批次:</span>
            <div class="sel">
              <el-input
                v-model="baseObj.wholesale_purchase"
                class="m-2"
                placeholder="请输入"
                type="text"
                maxlength="50"
                show-word-limit
                oninput="value=value.replace(/[\u4E00-\u9FA5]/g,'')"
              ></el-input>
            </div>
          </div>
        </div>
      </div>
      <div class="screen">
        <div class="sel-l">
          <div class="sel-item">
            <span>厂家:</span>
            <div class="sel">
              <el-input
                v-model="baseObj.factory"
                class="m-2"
                placeholder="请输入"
                type="text"
                maxlength="30"
                show-word-limit
              ></el-input>
            </div>
          </div>
          <div class="sel-item">
            <span>联系方式:</span>
            <div class="sel">
              <el-input
                v-model="baseObj.factory_mobile"
                class="m-2"
                placeholder="请输入厂家联系方式"
                type="text"
                maxlength="11"
                oninput="value=value.replace(/[^\d]/g,'')"
              ></el-input>
            </div>
          </div>
          <div class="sel-item">
            <span>学科:</span>
            <div class="sel">
              {{ ['全部', '物理', '化学', '生物', '小学科学'][subject_id] }}
            </div>
          </div>
          <div class="sel-item">
            <span>入库时间:</span>
            <div class="sel">
              <div class="block">
                <el-date-picker
                  v-model="value2"
                  type="daterange"
                  range-separator="~"
                  start-placeholder="起始时间"
                  end-placeholder="结束时间"
                  value-format="YYYY-MM-DD"
                  @change="timeChange"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="sel-r">
          <div class="button-box">
            <div
              class="btn green-btn"
              style="width: 80px; height: 30px; line-height: 30px; display: block"
              @click="selData"
            >
              搜索
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <!-- <div class="recommend">
        <div class="filter-box">
          <BaseFilter :config-data="filterData" @change-filter="changeFilter" />
        </div>
        <div class="select-box">
          <el-input type="text" placeholder="搜索" v-model="selectObj.keyword">
            <template #append>
              <el-button type="primary" @click="getData">
                <el-icon><Search /></el-icon>
              </el-button>
            </template>
          </el-input>
        </div>
      </div>

      <div class="top-list-box">
        <div
          class="top-item"
          v-for="(item, index) in requestData.data"
          :key="index"
          :title="'点击新增'"
          @click="addTable(item)"
        >
          <p class="item-name">{{ item.name }}</p>
          <p class="item-introduction">
            <span>规格：</span>
            <span>{{ item.specification }}</span>
          </p>
          <p class="item-introduction">
            <span>编号：</span>
            <span>{{ item.number }}</span>
          </p>
        </div>
      </div>
      <div class="pagination-block">
        <el-pagination
          v-model:currentPage="selectObj.page"
          :page-size="7"
          @current-change="handleCurrentChange"
          background
          layout="total, prev, pager, next, jumper"
          :total="requestData.total"
        ></el-pagination>
      </div> -->
      <el-table
        :data="tableData"
        style="width: 100%"
        :header-cell-style="{ background: '#EFEFEF', color: '#000' }"
        :cell-style="{ background: '#ffffff', borderBottom: '1px solid #EFEFEF' }"
      >
        <el-table-column type="index" label="序号" width="60" align="left" min-width="5"></el-table-column>
        <el-table-column label="入库批次" prop="wholesale_purchase" align="left" min-width="20"></el-table-column>
        <el-table-column label-class-name="is-must" label="来源" prop="asset_number" width="120" align="left">
          <template #default="scope">
            <span>{{ ['未知', '集采', '自制', '馈赠', '自购', '调拨'][scope.row.source] }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="凭证号"
          prop="voucher_number"
          align="left"
          min-width="20"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="厂家"
          prop="factory"
          align="left"
          min-width="20"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="联系方式" prop="factory_mobile" align="left" min-width="20"></el-table-column>
        <el-table-column label="入库时间" prop="create_time" align="left" min-width="20"></el-table-column>
        <el-table-column label="操作" align="center" min-width="20">
          <template #default="scope">
            <span class="green" @click="todetail(scope.row)">详情</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <footer>
      <el-pagination
        v-model:currentPage="baseObj.page"
        :page-size="15"
        @current-change="handleCurrentChange"
        background
        layout="total, prev, pager, next, jumper"
        :total="requestData.total"
      ></el-pagination>
    </footer>
  </div>
  <Detail
    v-if="page === 2"
    :bacth="bacth"
    :source="source"
    :voucher_number="voucher_number"
    :wholesale_purchase="wholesale_purchase"
    :factory="factory"
    :factory_mobile="factory_mobile"
    :create_time="create_time"
    @back="pageRetuen"
  ></Detail>
</template>
<script lang="ts" setup>
import { reactive, toRefs, ref } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'

// import { BaseFilter } from '@/components/base-filter'
import { ConfigDataType } from '@/components/base-filter/src/types'
import Detail from '@views/instrument-manage/instore-record/detail/index.vue'

import { useStore } from '@store/index'
// import { inputAdjust } from '@/utils/common'

// import { getLaboratoryList, getLaboratory } from '@/service/laboratory-manage/overview'
// import { storeByLaboratory } from '@service/laboratory-manage/overview/index'

// import { accountStatus } from '@/service/login/login'

import { instrumentRecord } from '@service/instrument-manage/batch-instrument-warehouse'
import { BatchWarehousingList } from '@service/instrument-manage/batch-instrument-warehouse/types'
// import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
const value2 = ref('')
const timeChange = (e: any) => {
  console.log(e)
  if (e) {
    baseObj.value.start_time = e[0]
    baseObj.value.end_time = e[1]
  } else {
    baseObj.value.start_time = ''
    baseObj.value.end_time = ''
  }
}
const page = ref(1)
const bacth = ref('')
const source = ref('')
const voucher_number = ref('')
const wholesale_purchase = ref('')
const factory = ref('')
const factory_mobile = ref('')
const create_time = ref('')
const router = useRouter()
// const props1 = {
//   checkStrictly: true,
//   label: 'title'
// }
const store = useStore()
// const drawerIns = ref(false)
const dataMap = reactive({
  selectObj: { page: 1, type: 1, base: 1, keyword: '' },
  baseObj: {
    page: 1,
    source: '',
    voucher_number: '',
    wholesale_purchase: '',
    bacth: '',
    keyword: '',
    factory: '',
    factory_mobile: '',
    start_time: '',
    end_time: ''
  },
  tableData: Array<BatchWarehousingList>(),
  requestData: {
    data: Array<BatchWarehousingList>(),
    total: 0
  },
  editStatus: true,
  optionsLaboratory: Array<{ id: number; title: string }>(),
  storeListBody: [Array<{ id: number; title: string; number_plies: number }>()],
  optionPliesBody: [Array<{ value: number; name: string }>()],
  filterData: Array<ConfigDataType>()
})

let { baseObj, tableData, requestData } = toRefs(dataMap)
const subject_id = ref(0)
subject_id.value = store.state.login.userInfo.subject_id
// getLaboratoryList({ subject: store.state.login.userInfo.subject_id }).then((res: any) => {
//   optionsLaboratory.value = res.data.data
// })
const numTotal = ref(0)
const getTableData = () => {
  instrumentRecord(baseObj.value).then((res: any) => {
    console.log('入库记录', res)
    tableData.value = res.data.list
    requestData.value.total = res.data.count
    numTotal.value = res.data.all
  })
}
getTableData()
const selData = () => {
  baseObj.value.page = 1
  getTableData()
}
const todetail = (item: any) => {
  page.value = 2
  bacth.value = item.bacth
  source.value = item.source
  voucher_number.value = item.voucher_number
  wholesale_purchase.value = item.wholesale_purchase
  factory.value = item.factory
  factory_mobile.value = item.factory_mobile
  create_time.value = item.create_time
  // router.value = useRouter()
  // router.push({
  //   name: 'inStoreRecordDetail',
  //   params: {
  //     bacth: item.bacth,
  //     source: item.source,
  //     voucher_number: item.voucher_number,
  //     factory: item.factory,
  //     factory_mobile: item.factory_mobile,
  //     wholesale_purchase: item.wholesale_purchase,
  //     create_time: item.create_time
  //   }
  // })
}

const pageRetuen = () => {
  page.value = 1
}

const handleCurrentChange = () => {
  getTableData()
}
// getLaboratory({ subject_id: subject_id.value }).then((res: any) => {
//   console.log(res)
//   let arr = JSON.parse(JSON.stringify(res.data))
//   arr.forEach((e: any) => {
//     e.children = e.storeList
//     e.value = e.id
//     e.children.forEach((e1: any) => {
//       e1.children = []
//       e1.value = e1.id
//       for (let i = 0; i < e1.number_plies; i++) {
//         e1.children.push({
//           value: i + 1,
//           title: '第' + (i + 1) + '层'
//         })
//       }
//     })
//   })
//   console.log('地址', arr)
//   optionsLaboratory.value = arr
// })
// const getStoreData = (id: number | string, index: number) => {
//   storeByLaboratory({ id: Number(id) || 0 }).then((res: any) => {
//     storeListBody.value[index] = res.data
//   })
// }

// filterData.value = [
//   {
//     name: '筛选',
//     list: [
//       { id: 1, name: '学校仪器' },
//       { id: 2, name: '仪器配备标准' }
//     ],
//     keyName: 'base'
//   }
// ]

// const handleChange = (value: any) => {
//   console.log(value)
//   console.log(tableData)
// }
// const getData = () => {
//   getInstrumentOfType(selectObj.value).then((res) => {
//     requestData.value = res.data
//   })
// }
// getData()

// const changeFilter = (base: number) => {
//   console.log(base)
//   selectObj.value.base = base
//   getData()
// }
// changeFilter(1)
// const setPlies = (index: number) => {
//   optionPliesBody.value[index] = optionPlies.value(
//     storeListBody.value[index],
//     tableData.value[index].store_id as number
//   )
// }

// let optionPlies = computed(() => {
//   return (list: { id: number; number_plies: number }[], storeId: number) => {
//     let num = 1
//     list.forEach((e) => {
//       if (e.id === storeId) {
//         num = e.number_plies
//       }
//     })
//     let arr = Array<{
//       value: number
//       name: string
//     }>()
//     for (let i = 0; i < num; i++) {
//       const obj = {
//         value: i + 1,
//         name: `第${i + 1}层`
//       }
//       arr.push(obj)
//     }
//     return arr
//   }
// })

// const selOnIns: any = ref([])
// const handleSelectionChange1 = (val: any) => {
//   console.log(val)
//   selOnIns.value = val
// }
// const addTable = () => {
//   selOnIns.value.forEach((item: any) => {
//     let obj = {
//       name: item.name,
//       number: item.number,
//       asset_number: item.asset_number || item.number,
//       category: item.category,
//       specification: item.specification,
//       school_instrument_id: selectObj.value.base === 1 ? item.id || 0 : 0,
//       instrument_id: selectObj.value.base === 2 ? item.id || 0 : 0,
//       cost_type: typeof item.cost_type === 'object' ? item.cost_type.value : item.cost_type,
//       unit: item.unit,
//       info: item.info,
//       number_year: item.number_year,
//       norm: item.norm,
//       school_laboratory_id:
//         item.school_laboratory_id || tableData.value[tableData.value.length - 1]?.school_laboratory_id, //实验室id
//       store_id: item.store_id || tableData.value[tableData.value.length - 1]?.store_id, //仪器柜id
//       number_plies: item.number_plies || tableData.value[tableData.value.length - 1]?.number_plies, //层数
//       total: 0, //入库数量
//       source: item.source || 1,
//       bacth: item.bacth || tableData.value[tableData.value.length - 1]?.bacth,
//       voucher_number: item.voucher_number || tableData.value[tableData.value.length - 1]?.voucher_number,
//       factory: item.factory || tableData.value[tableData.value.length - 1]?.factory,
//       factoryPhone: '',
//       unit_price: item.unit_price,
//       position: {},
//       type: 1
//     }
//     // 默认值
//     tableData.value.push(obj)
//   })
//   // if (editStatus.value) {

//   //   // storeByLaboratory({ id: Number(obj.school_laboratory_id) || 0 }).then((res: any) => {
//   //   //   storeListBody.value[tableData.value.length - 1] = res.data
//   //   //   setPlies(tableData.value.length - 1)
//   //   // })
//   // } else {
//   //   ElMessage({
//   //     type: 'info',
//   //     message: '请点击继续入库按钮'
//   //   })
//   // }
// }
// const deleteItem = (id: number, index: number) => {
//   if (!editStatus.value) {
//     return false
//   }
//   tableData.value.splice(index, 1)
// }

// const save = async () => {
//   if (editStatus.value) {
//     // let status = await accountStatus({ type: 1 })
//     // if (status.data !== 3) {
//     //   ElMessage({
//     //     type: 'warning',
//     //     message: '期初建帐结束后可用，请检查仪器期初建帐信息'
//     //   })
//     //   return
//     // }
//     let errorCount = 0
//     console.log(baseObj)
//     tableData.value.forEach((e: any) => {
//       e.source = baseObj.value.source
//       e.voucher_number = baseObj.value.voucher_number
//       e.bacth = baseObj.value.batch
//       e.factory = baseObj.value.factory
//       e.factoryPhone = baseObj.value.factoryPhone
//       e.school_laboratory_id = e.position[0]
//       if (e.position[0]) {
//         e.school_laboratory_id = e.position[0]
//       }
//       if (e.position[1]) {
//         e.store_id = e.position[1]
//       }
//       if (e.position[2]) {
//         e.number_plies = e.position[2]
//       }
//       console.log('e', e)
//     })
//     tableData.value.forEach((e) => {
//       console.log('e', e)
//       if (!e.asset_number) {
//         errorCount = 1
//         return
//       }
//       if (!e.source) {
//         errorCount = 2
//         return
//       }
//       if (!e.unit_price) {
//         errorCount = 3
//         return
//       }
//       if (!e.school_laboratory_id) {
//         errorCount = 4
//         return
//       }
//       if (!e.total) {
//         errorCount = 5
//         return
//       }
//     })
//     console.log('err', errorCount)
//     if (errorCount !== 0) {
//       ElMessage({
//         type: 'warning',
//         message:
//           errorCount === 1
//             ? '学校编号不可为空'
//             : errorCount === 2
//             ? '请选择入库来源'
//             : errorCount === 3
//             ? '请设置单价'
//             : errorCount === 4
//             ? '请选择实验室'
//             : errorCount === 5
//             ? '请输入数量'
//             : '请检查必填项'
//       })
//       return
//     }

//     postBatchInstrument({ data: tableData.value }).then((res) => {
//       console.log('上传结果', res)
//       if (res.code === 10) {
//         ElMessage({
//           type: 'success',
//           message: res.msg
//         })
//         editStatus.value = false
//       }
//     })
//   } else {
//     tableData.value = Array<BatchWarehousingList>()
//     editStatus.value = true
//   }
// }

const optionCome = reactive([
  {
    value: 1,
    name: '集采'
  },
  {
    value: 2,
    name: '自制'
  },
  {
    value: 3,
    name: '馈赠'
  },
  {
    value: 4,
    name: '自购'
  },
  {
    value: 5,
    name: '调拨'
  }
])
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
.content {
  width: 100%;
  .recommend {
    margin: 10px 0;
    padding: 0 30px;
    width: 100%;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    .filter-box {
      padding: 15px 0;
      width: 90%;
    }
    .select-box {
      margin-right: 30px;
      width: 300px;
      :deep(.el-input) {
        line-height: normal;
        .el-input-group__append {
          padding: 0 8px;
          background: #05c65d;
          color: #ffffff;
        }
      }
      img {
        padding: 6px;
        position: absolute;
        top: 1px;
        right: 0;
        width: 28px;
        height: 28px;
        background: #05c65d;
        box-sizing: border-box;
        cursor: pointer;
      }
    }
  }
  .top-list-box {
    display: flex;
    flex-wrap: wrap;
    .top-item {
      margin: 0 2% 10px 0;
      padding: 16px 24px;
      width: 12%;
      height: 140px;
      text-align: left;
      background: #ffffff;
      box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
      border-radius: 0px 10px 10px 10px;
      box-sizing: border-box;
      p {
        height: 40px;
      }
      .item-name {
        font-size: 20px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #05c65d;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .item-introduction {
        display: flex;
        align-items: center;
        span:nth-of-type(1) {
          display: inline-block;
          width: 50px;
          color: #848484;
        }
        span:nth-of-type(2) {
          display: inline-block;
          width: 80px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
    }
    .top-item:hover {
      background: #d9d9d9;
    }
  }
  .detail_body {
    margin-bottom: 20px;
  }
  .pagination-block {
    margin: 20px 0;
    height: 40px;
    text-align: right;
  }
  .details_footer {
    div {
      margin-top: 20px;
    }
  }
  .laboratory-name {
    padding-left: 30px;
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: left;
    font-size: 20px;
    color: #05c65d;
    background: #dcece3;
    box-sizing: border-box;
  }
  :deep(.el-table) {
    select {
      width: 100%;
      height: 30px;
      line-height: 30px;
      border: 1px solid #c9c7c7;
      border-radius: 2px;
      text-align: center;
      color: #05c65d;
      option {
        text-align: left;
        color: #333333;
      }
    }
    input {
      width: 90px;
      height: 30px;
      line-height: 30px;
      border: 1px solid #c9c7c7;
      border-radius: 2px;
      text-align: center;
      color: #05c65d;
    }
    .long-input {
      width: 130px;
      text-align: left;
    }
    .short-input {
      width: 60px;
    }
    .teacher-cell {
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        margin-left: 6px;
        cursor: pointer;
      }
    }
  }
  .message-box {
    position: relative;
    width: 49%;
    background: #ffffff;
    border-radius: 0px 10px 10px 10px;
    float: left;
    .header {
      margin: 30px 0;
      span {
        display: inline-block;
        margin-right: 8px;
        width: 20px;
        height: 20px;
        line-height: 20px;
        color: #ffffff;
        background: #05c65d;
        border-radius: 50%;
      }
    }
    .header::before {
      position: absolute;
      left: 0;
      top: 0;
      content: '';
      width: 0;
      height: 0;
      border-top: 100px #05c65d solid;
      border-right: 100px transparent solid;
    }
    .rule-form {
      text-align: left;
      :deep(.el-input) {
        width: 80%;
        .el-input__inner {
          width: 100%;
        }
      }
      :deep(.el-select) {
        width: 80%;
        .el-input {
          width: 100%;
          .el-input__inner {
            width: 100%;
            height: 30px !important;
          }
        }
      }

      .use-year {
        :deep(.el-input) {
          width: 60%;
          .el-input__inner {
            width: 100%;
          }
        }
        :deep(.el-select) {
          margin-left: 2%;
          width: 18%;
          .el-input {
            width: 100%;
            .el-input__inner {
              width: 100%;
            }
          }
        }
      }
    }
  }
  .message-box:nth-of-type(1) {
    margin-right: 2%;
  }
}
footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 60px;
  p {
    margin-left: 40px;
  }
}
// .btn {
//   width: 100px;
//   height: 36px;
//   line-height: 36px;
//   background: #05c65d;
//   color: #ffffff;
//   box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
//   opacity: 1;
//   border-radius: 10px;
//   text-align: center;
//   cursor: pointer;
// }
// .btn-white {
//   color: #333333;
//   background: #f3f3f3;
// }
.green {
  color: #05c65d !important;
  cursor: pointer;
}
.red {
  color: #de4747 !important;
}
.detail_title {
  height: 40px;
  line-height: 40px;
  span {
    margin: 20px;
  }
}
.sel-box {
  margin-bottom: 12px;
  width: 100%;
  min-height: 120px;

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
        margin-top: 20px;
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
          // height: 30px;
          line-height: 30px;
          text-align: left;
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
      .button-box {
        margin-top: 15px;
        div {
          margin-right: 30px;
          float: right;
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
}
.el-input {
  line-height: 30px;
}
.el-cascader {
  width: 100%;
}
.num-span {
  float: right;
  span {
    color: #05c65d;
  }
}
</style>
