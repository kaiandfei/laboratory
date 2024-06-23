<template>
  <div v-show="addState">
    <div class="leftArea">
      <div class="head-area">
        <div class="title">仪器出借登记</div>
        <div class="buttonArea">
          <el-button v-show="conserveShow === false" type="primary" @click="conserveShow = true">新增出借卡</el-button>
          <el-button v-show="conserveShow === true" type="info">新增出借卡</el-button>
          <el-button type="primary" @click="back()">返回</el-button>
          <el-button type="primary" v-show="conserveShow === true" @click="submit()">保存</el-button>
          <el-button type="info" v-show="conserveShow === false">保存</el-button>
        </div>
      </div>
      <div class="title2">出借登记卡</div>
      <div class="topArea" v-show="conserveShow === true">
        <div class="nav">
          <div class="name is-must-div">出借人:</div>
          <div>
            <el-select
              v-model="addLendRegistrationList.lender_id"
              @change="getLender(addLendRegistrationList.lender_id as number)"
            >
              <el-option v-for="item in optionUser" :key="item.id" :label="item.username" :value="item.id"></el-option>
            </el-select>
          </div>
        </div>
        <div class="nav">
          <div class="name is-must-div">出借时间:</div>
          <div>
            <el-date-picker
              type="date"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD"
              v-model="addLendRegistrationList.start_time"
            ></el-date-picker>
          </div>
        </div>
        <div class="nav">
          <div class="name is-must-div">预计归还时间:</div>
          <div>
            <el-date-picker
              type="date"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD"
              v-model="addLendRegistrationList.plan_end_time"
            ></el-date-picker>
          </div>
        </div>
        <div class="nav" style="height: 80px; width: 100%">
          <div class="name" style="width: 24%">出借备注:</div>
          <div>
            <el-input v-model="addLendRegistrationList.lend_desc" type="textarea" :rows="2"></el-input>
          </div>
        </div>
      </div>
      <div class="topArea" v-show="conserveShow === false">
        <div class="nav">
          <div class="name">出借人:</div>
          <div>
            {{ addLendRegistrationList.lender }}
          </div>
        </div>
        <div class="nav">
          <div class="name">出借时间:</div>
          <div>
            {{ addLendRegistrationList.start_time }}
          </div>
        </div>
        <div class="nav">
          <div class="name">预计归还时间:</div>
          <div>
            {{ addLendRegistrationList.plan_end_time }}
          </div>
        </div>
        <div class="nav">
          <div class="name">出借备注:</div>
          <div>
            {{ addLendRegistrationList.lend_desc }}
          </div>
        </div>
      </div>
      <div class="titleArea">出借仪器位置及数量清单</div>
      <div class="bottomArea" v-show="conserveShow === true">
        <div class="tableArea">
          <el-table
            :data="addLendRegistrationList.list"
            style="width: 100%; font-size: 14px"
            height="300"
            :header-cell-style="{ background: '#DCECE3', color: '#000' }"
            :cell-style="{ background: '#ffffff', borderBottom: '1px solid #EFEFEF' }"
          >
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column label="编号" prop="hardware_number"></el-table-column>
            <el-table-column label="学校编号" prop="asset_number"></el-table-column>
            <el-table-column label="名称" prop="name"></el-table-column>
            <!-- <el-table-column label="批次" prop="bacth">
              <template #default="scope">
                <span>{{ scope.row.bacth }}</span>
              </template>
            </el-table-column> -->
            <el-table-column label="仪器库" prop="laboratory_name">
              <template #default="scope">
                <span>{{ scope.row.laboratory_name }}</span>
              </template>
              <!-- <template #default="scope">
              <select
                style="width: 100%"
                v-model="scope.row.laboratory_id"
                @change="getData(scope.row.laboratory_id, scope.row.id, scope.$index)"
              >
                <option
                  v-for="item in optionsLaboratory"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></option>
              </select>
            </template> -->
            </el-table-column>
            <el-table-column label="仪器柜" prop="store_name">
              <template #default="scope">
                <span>{{ scope.row.store_name }}</span>
              </template>
              <!-- <template #default="scope">
              <select style="width: 100%" v-model="scope.row.store_id">
                <option
                  v-for="item in optionStore(storeListBox[scope.$index])"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></option>
              </select>
            </template> -->
            </el-table-column>
            <el-table-column label="层数" prop="number_plies">
              <!-- <template #default="scope">
              <select style="width: 100%" v-model="scope.row.number_plies">
                <option
                  v-for="item in optionPlies(storeListBox[scope.$index], scope.row.store_id || 1)"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></option>
              </select>
            </template> -->
              <template #default="scope">
                <span>{{ '第' + scope.row.number_plies + '层' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="数量" prop="total">
              <template #default="scope">
                <input style="width: 100%" v-model="scope.row.total" />
              </template>
            </el-table-column>
            <el-table-column label="操作" prop="">
              <template #default="scope">
                <div style="color: green; cursor: pointer" @click="remove(scope.$index)">删除</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- <span class="title">增加一条仪器信息</span>
        <span style="color: #333333; font-size: 10px">您可以在右侧选择，也可以直接填写编号</span> -->
      </div>
      <div class="bottomArea" v-show="conserveShow === false">
        <div class="tableArea">
          <el-table
            :data="addLendRegistrationList.list"
            style="width: 100%"
            height="300"
            :header-cell-style="{ background: '#DCECE3', color: '#000' }"
            :cell-style="{ background: '#ffffff', borderBottom: '1px solid #EFEFEF' }"
          >
            <el-table-column label="序号" type="index"></el-table-column>
            <el-table-column label="编号" prop="hardware_number"></el-table-column>
            <el-table-column label="学校编号" prop="asset_number"></el-table-column>
            <el-table-column label="名称" prop="name"></el-table-column>
            <!-- <el-table-column label="批次" prop="bacth"></el-table-column> -->
            <el-table-column label="仪器库" prop="laboratory_name"></el-table-column>
            <el-table-column label="仪器柜" prop="store_name"></el-table-column>
            <el-table-column label="层数" prop="number_plies">
              <template #default="scope">
                <span>{{ '第' + scope.row.number_plies + '层' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="数量" prop="total"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="rightArea">
      <div class="containerArea">
        <div class="infoArea" v-for="item in instrumentList" :key="item.id">
          <div class="detailList">
            <div class="part">
              <div class="name" style="font-size: 20px; font-weight: bold">{{ item.name }}</div>
            </div>
            <div class="part" style="width: 20%; height: 120px; float: right">
              <img :src="item.picture" />
            </div>
            <div class="part">
              <div class="name">规格</div>
              <div>{{ item.specification }}</div>
            </div>
            <div class="part">
              <div class="name">学校编号</div>
              <div>{{ item.asset_number }}</div>
            </div>
            <div class="part">
              <div style="color: green; width: 50%" class="name">本周各时段最大实验用量</div>
            </div>
            <div class="part" style="width: 100%">
              <div class="weekArea" v-for="(n, index) in item.weekList" :key="index">
                {{ week[index] + ':' }}
                {{ n }}
              </div>
            </div>
            <div class="stockTitle" v-show="item.stockStatus === false" @click="getSchoolInstrumentDetail(item)">
              展开库存列表
            </div>
            <div class="stockTitle" v-show="item.stockStatus === true" @click="item.stockStatus = false">
              取消展开库存列表
            </div>
          </div>
          <div class="tableArea" v-show="item.stockStatus === true">
            <el-table
              :data="item.detail"
              style="width: 96%; margin-left: 2%"
              :header-cell-style="{ background: '#F3F3F3', color: '#000' }"
              :cell-style="{ background: '#ffffff', borderBottom: '1px solid #EFEFEF' }"
            >
              <el-table-column label="序号" type="index"></el-table-column>
              <el-table-column label="编号" prop="hardware_number" show-overflow-tooltip></el-table-column>
              <el-table-column label="名称" prop="name" show-overflow-tooltip></el-table-column>
              <el-table-column label="仪器库" prop="laboratory_name" show-overflow-tooltip></el-table-column>
              <el-table-column label="仪器柜" prop="store_name" show-overflow-tooltip></el-table-column>
              <el-table-column label="层数" prop="number_plies" show-overflow-tooltip>
                <template #default="scope">
                  <span v-if="scope.row.number_plies !== 0">{{ '第' + scope.row.number_plies + '层' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="数量" prop="total">
                <template #default="scope">
                  <span style="color: #05c65d">{{ scope.row.total }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" prop="">
                <template #default="scope">
                  <span
                    v-show="conserveShow === true"
                    style="cursor: pointer; color: #05c65d"
                    @click="addLend(scope.row)"
                  >
                    出借仪器
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <el-pagination
        class="pagination"
        v-model:currentPage="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100, 300]"
        :pager-count="3"
        @current-change="handleTableCurrentPage"
        @size-change="handleSizeChange"
        layout="total, prev, pager, next,sizes"
        :total="containerTotal"
      ></el-pagination>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, toRefs, reactive, defineExpose } from 'vue'
import {
  getInstrumentInfo,
  getLaboratoryList,
  getTeacherList,
  postLendInstrumnetInfo,
  schoolInstrumentDetail
} from '@/service/instrument-manage/lendRegistration/index'
import {
  instrumnetData,
  addLendInfo,
  addLendInstrumnetInfoData,
  schoolTeacherList
} from '@/service/instrument-manage/lendRegistration/types'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useStore } from '@store/index'

const store = useStore()

let conserveShow = ref(true)
let props = defineProps({ addShow: Boolean, searchValue: { type: String, required: true } })
let { addShow, searchValue } = toRefs(props)
let emit = defineEmits(['back'])
let addState = ref(false)
let school_id = ref(1)

addState.value = addShow.value
const dataMap = reactive({
  instrumentList: [instrumnetData],
  week: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  optionUser: [schoolTeacherList],
  optionBatch: [
    {
      label: '2021.02.12',
      value: '2021.02.12'
    },
    {
      label: '2021.03.21',
      value: '2021.03.21'
    },
    {
      label: '2021.02.13',
      value: '2021.02.13'
    }
  ],
  optionsLaboratory: [
    {
      value: 0,
      name: ''
    }
  ],
  storeListBox: Array<
    {
      id: number
      title: string
      number_plies: number
    }[]
  >()
})
let { instrumentList, week, optionUser, optionsLaboratory, storeListBox } = toRefs(dataMap)

const addLendRegistrationList: any = ref({})
const remove = (pot: number) => {
  addLendRegistrationList.value.list.splice(pot, 1)
}

instrumentList.value = []
addLendRegistrationList.value.list = []
addLendRegistrationList.value.type = 1
school_id.value = JSON.parse(sessionStorage.getItem('state') || '').login.userInfo.school_id

getTeacherList({ id: school_id.value }).then((res) => {
  optionUser.value = res.data
})

getLaboratoryList().then((res) => {
  let arr = Array<{
    value: number
    name: string
  }>()

  res.data.data.forEach((e) => {
    const obj = {
      value: e.id,
      name: e.title
    }
    arr.push(obj)
  })
  optionsLaboratory.value = arr
})

// const getData = (ID: number, rowId: number, index: number) => {
//   storeByLaboratory({ id: ID }).then((res) => {
//     storeListBox.value[index] = res.data
//   })
// }

// let optionStore = computed(() => {
//   return (list: { id: number; title: string }[]) => {
//     let arr = Array<{
//       value: number
//       name: string
//     }>()
//     list?.forEach((e) => {
//       const obj = {
//         value: e.id,
//         name: e.title
//       }
//       arr.push(obj)
//     })
//     console.log(arr)
//     return arr
//   }
// })

// let optionPlies = computed(() => {
//   return (list: { id: number; number_plies: number }[], storeId: number) => {
//     let num = 1
//     list?.forEach((e) => {
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
const currentPage = ref(1)
const pageSize = ref(10)
const containerTotal = ref(100)
const search = (id: any) => {
  getInstrumentInfo({
    keyword: searchValue.value,
    subject_id: id,
    limit: pageSize.value,
    page: currentPage.value
  }).then((res) => {
    instrumentList.value = res.data.data
    containerTotal.value = res.data.count
    instrumentList.value.forEach((item) => {
      Object.assign(item, { stockStatus: false })
      // item.detail.forEach((element) => {
      //   Object.assign(element, { hardware_number: item.number, asset_number: item.asset_number, bacth: item.bacth })
      // })
    })
  })
}
const handleTableCurrentPage = (val: number) => {
  currentPage.value = val
  search(store.state.login.userInfo.subject_id)
}
const handleSizeChange = (val: number) => {
  pageSize.value = val
  search(store.state.login.userInfo.subject_id)
}
const getSchoolInstrumentDetail = async (item: any) => {
  try {
    const params = {
      id: item.id
    }
    const { data, code } = await schoolInstrumentDetail(params)
    if (code === 10) {
      item.detail = data
      item.stockStatus = true
    }
  } catch (error) {
    console.log(error)
  }
}
defineExpose({
  search
})

const getLender = (data: number) => {
  optionUser.value.forEach((item) => {
    if (item.id == data) {
      addLendRegistrationList.value.lender = item.username
    }
  })
}

const addLend = (info: any) => {
  if (addLendRegistrationList.value.list.some((e: any) => e.id === info.id)) {
    ElMessageBox.alert('当前仪器已在清单中!', '提示', {
      confirmButtonText: '确认'
    })
    return
  }
  addLendRegistrationList.value.list.push({
    id: info.id,
    hardware_number: info.hardware_number,
    asset_number: info.asset_number,
    name: info.name,
    bacth: info.bacth,
    instrument_id: info.instrument_id,
    specification: '',
    laboratory_id: info.school_laboratory_id,
    laboratory_name: info.laboratory_name,
    store_name: info.store_name,
    store_id: info.store_id,
    number_plies: info.number_plies,
    total: info.total
  })
  storeListBox.value.length = addLendRegistrationList.value.list.length
}

const submit = () => {
  if (!addLendRegistrationList.value.lender_id) {
    ElMessage({
      type: 'warning',
      message: '请选择出借人'
    })
    return
  }
  if (!addLendRegistrationList.value.start_time) {
    ElMessage({
      type: 'warning',
      message: '请选择出借时间'
    })
    return
  }
  if (!addLendRegistrationList.value.plan_end_time) {
    ElMessage({
      type: 'warning',
      message: '请选择预计归还时间'
    })
    return
  }
  if (addLendRegistrationList.value.list.length === 0) {
    ElMessage({
      type: 'warning',
      message: '请选择仪器'
    })
    return
  }
  postLendInstrumnetInfo(addLendRegistrationList.value).then((res) => {
    if (res.code === 10) {
      conserveShow.value = false
      search(store.state.login.userInfo.subject_id)
    }
  })
}

const back = () => {
  emit('back')
}
</script>
<style lang="scss" scoped>
:deep(.el-input__inner) {
  width: 220px;
}
::v-deep .el-pagination .el-input__inner {
  width: 100px;
}
:deep(.el-textarea) {
  width: 400px;
  float: left;
}
.leftArea {
  background-color: #ffffff;
  width: 50%;
  float: left;
  height: 800px;
  margin-top: 10px;
  .head-area {
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    float: left;
    background-color: #dcece3;
    .title {
      float: left;
      width: 30%;
      font-size: 20px;
      color: #05c65d;
    }
    .buttonArea {
      width: 60%;
      float: left;
      margin-left: 30%;
    }
  }
  .title2 {
    width: 100%;
    font-size: 20px;
    color: #05c65d;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 15px 0 15px 0;
  }
  .topArea {
    width: 90%;
    height: 30%;
    margin-left: 5%;
    float: left;
    border: 1px solid #05c65d;
    .nav {
      width: 60%;
      height: 50px;
      float: left;
      align-items: center;
      display: flex;
      .name {
        float: left;
        width: 40%;
        height: 40%;
        margin-left: 20px;
        align-items: center;
        display: flex;
      }
    }
  }
  .titleArea {
    width: 100%;
    font-size: 20px;
    color: #05c65d;
    margin: 10px 0 10px 0;
    float: left;
  }
  .bottomArea {
    width: 90%;
    height: 45%;
    float: left;
    margin-left: 5%;
    // padding: 10px 0 10px 0;
    border: 1px solid #05c65d;
    .tableArea {
      width: 100%;
      float: left;
    }
    .title {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: green;
      margin: 10px 0 10px 0;
      cursor: pointer;
    }
  }
}
.rightArea {
  margin-top: 10px;
  width: 48%;
  height: 800px;
  float: right;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
  opacity: 1;
  border-radius: 0px 10px 10px 10px;
  background-color: #ffffff;
  overflow-y: scroll;
  padding-bottom: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .containerArea {
    height: 750px;
    overflow: auto;
  }
  .infoArea {
    width: 90%;
    // height: 50%;
    float: left;
    margin-left: 5%;
    margin-top: 20px;
    border: 1px solid #05c65d;
    .detailList {
      width: 100%;
      .part {
        margin: 10px 0;
        display: flex;
        text-align: left;
        .name {
          min-width: 80px;
          float: left;
          margin-left: 20px;
          display: flex;
          vertical-align: top;
        }
        .weekArea {
          width: 12%;
          background: #dcece3;
          margin-left: 2%;
        }
        img {
          width: 100px;
          height: 100px;
          float: right;
        }
      }
      .stockTitle {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: green;
        margin: 10px 0 10px 0;
        cursor: pointer;
      }
    }
  }
}
</style>
