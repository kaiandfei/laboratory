<template>
  <div v-show="page === 1" v-loading.fullscreen.lock="fullscreenLoading">
    <header>
      <div class="fl">
        仪器管理
        <el-icon><arrow-right /></el-icon>
        <span>批量仪器入库</span>
      </div>
    </header>
    <div class="content">
      <div class="body_top" style="display: flex; padding-bottom: 10px">
        <div style="flex: 1">
          <div style="display: flex">
            <div class="title">
              <span style="color: #ff3e3e">*</span>
              来源：
            </div>
            <div :class="check === 1 ? 'check_source' : 'source'" @click="checkSource(1)">集采</div>
            <div :class="check === 2 ? 'check_source' : 'source'" @click="checkSource(2)">自购</div>
            <div :class="check === 3 ? 'check_source' : 'source'" @click="checkSource(3)">馈赠</div>
            <div :class="check === 4 ? 'check_source' : 'source'" @click="checkSource(4)">调拨</div>
          </div>
          <div style="display: flex">
            <div class="title">
              <span style="color: #ff3e3e">*</span>
              凭证号：
            </div>
            <el-input v-model="voucher_number" placeholder="请输入凭证号" :maxlength="50" show-word-limit></el-input>
          </div>
          <div style="display: flex">
            <div class="title">厂家：</div>
            <el-input
              v-model="factory"
              placeholder="请输入厂家"
              :maxlength="30"
              show-word-limit
              @input="check_factory"
            ></el-input>
          </div>
        </div>
        <div style="flex: 1">
          <div class="subjects" style="display: flex">
            <div class="title2">学科：</div>
            <el-input v-model="subjectName"></el-input>
          </div>
          <div style="display: flex">
            <div class="title2">
              <span style="color: #ff3e3e">*</span>
              采购批次：
            </div>
            <el-input v-model="bacth" placeholder="请输入采购批次" :maxlength="50" show-word-limit></el-input>
          </div>
          <div style="display: flex">
            <div class="title2">厂家联系方式：</div>
            <el-input
              type="number"
              v-model="factory_mobile"
              placeholder="请输入厂家联系方式"
              @blur="is_mobile"
              :maxlength="11"
            ></el-input>
          </div>
        </div>
      </div>
      <div class="body_title">
        <p>仪器信息列表</p>
      </div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        style="width: 100%; height: 580px; overflow-y: scroll"
        @selection-change="handleSelectionChange"
        row-key="id"
        :header-cell-style="{ background: '#EFEFEF', color: '#000' }"
        :cell-style="{ background: '#ffffff', borderBottom: '1px solid #EFEFEF' }"
        id="tables"
      >
        <el-table-column type="selection" width="45" />
        <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
        <el-table-column class="myStyle" label="分类编号" prop="number" align="center" width="140">
          <template #default="scope">
            <el-select
              v-model="scope.row.number"
              filterable
              remote
              default-first-option
              class="numberSelect"
              placeholder="请输入编号搜索"
              :remote-method="(e: any) => getData1(e, scope.$index)"
              @input="inputChange"
              v-show="editStatus"
              type="text"
              maxlength="25"
              lazy
            >
              <el-option
                @click="selOne(item, scope.$index)"
                v-for="(item, index) in option1"
                :key="index"
                :value="item.number"
              >
                {{ item.number + '/' + item.name + '/' + item.specification }}
              </el-option>
            </el-select>
            <!-- <input v-show="editStatus" v-model="scope.row.asset_number" /> -->
            <span v-show="!editStatus">{{ scope.row.number }}</span>
          </template>
        </el-table-column>
        <el-table-column label-class-name="is-must" label="学校编号" prop="asset_number" width="140" align="center">
          <template #default="scope">
            <input
              style="width: 110px; padding-right: 0; padding-left: 0"
              v-show="editStatus"
              v-model="scope.row.asset_number"
              maxlength="25"
              oninput="value=value.replace(/[^\w_]/g,'');"
            />
            <span v-show="!editStatus">{{ scope.row.asset_number }}</span>
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="name" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="规格" prop="specification" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="单位" prop="unit" width="50" align="center"></el-table-column>
        <el-table-column label-class-name="is-must" label="单价" prop="" width="100" align="center">
          <template #default="scope">
            <input v-show="editStatus" class="short-input" v-model="scope.row.unit_price" />
            <span v-show="!editStatus">{{ scope.row.unit_price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="保质期" prop="" width="100" align="center">
          <template #default="scope">
            <input
              v-show="editStatus"
              type="number"
              @blur="minNumber(scope.row.number_year)"
              class="short-input"
              v-model="scope.row.number_year"
            />
            <span v-show="!editStatus">{{ scope.row.number_year }}</span>
          </template>
        </el-table-column>
        <el-table-column label-class-name="is-must" label="实验室" align="center" width="200">
          <template #default="scope">
            <!-- <select
              v-model="scope.row.school_laboratory_id"
              @change="getStoreData(scope.row.school_laboratory_id, scope.$index)"
              :disabled="!editStatus"
            >
              <option v-for="(e, index) in optionsLaboratory" :key="index" :label="e.title" :value="e.id"></option>
            </select> -->
            <span v-if='scope.row.school_laboratory_id>0' @click="checkPostionOne(scope.row, scope.$index)">{{ scope.row.school_laboratory_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="仪器柜" align="center" width="120">
          <template #default="scope">
            <!-- <select v-model="scope.row.store_id" @change="setPlies(scope.$index)" :disabled="!editStatus">
              <option v-for="(e, i) in scope.row.storeList" :key="i" :label="e.title" :value="e.id"></option>
            </select> -->
            <span v-if='scope.row.school_laboratory_id>0' @click="checkPostionOne(scope.row, scope.$index)">{{ scope.row.store_name }}</span>
            <span v-else @click="checkPostionOne(scope.row, scope.$index)" style="cursor: pointer;">请选择位置</span>
          </template>
        </el-table-column>
        <el-table-column label="层数" align="center" width="120">
          <template #default="scope">
            <span v-if='scope.row.school_laboratory_id>0 && scope.row.number_plies>0' @click="checkPostionOne(scope.row, scope.$index)">第{{ scope.row.number_plies }}层</span>
            <!-- <select v-model="scope.row.number_plies" :disabled="!editStatus">
              <option v-for="(e, i) in scope.row.pliesList" :key="i" :label="e.name" :value="e.value"></option>
            </select> -->
          </template>
        </el-table-column>
        <el-table-column label-class-name="is-must" label="数量" align="center" width="80">
          <template #default="scope">
            <input v-show="editStatus" class="short-input" v-model="scope.row.total" @input="inputAdjust" />
            <span v-show="!editStatus">{{ scope.row.total }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <img
              src="@assets/images/laboratory-standard/copy.png"
              alt=""
              @click="copyItem(scope.row, scope.$index)"
              style="width: 20px"
            />
            &nbsp;&nbsp;&nbsp;
            <img
              src="@assets/images/laboratory-standard/delete.png"
              alt=""
              @click="deleteItem(scope.row.id, scope.$index)"
            />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="padding-top: 10px"
        class="pagination"
        v-model:currentPage="tableCurrentPage"
        v-model:page-size="pageSize"
        :page-sizes="[50, 100, 200, 300, 400]"
        :pager-count="3"
        @current-change="handleTableCurrentPage"
        @size-change="handleSizeChange"
        background
        layout="total, prev, pager, next, jumper,sizes"
        :total="tableTotal"
      ></el-pagination>
      <!--      <footer style="justify-content: flex-start"></footer>-->
      <footer style="justify-content: flex-start">
        <div class="btn" @click="uploadTemp">下载模板</div>
        <input type="file" name="file" id="uploadExcel" @change="changeExcel()" style="display: none" />
        <div class="btn" @click="uploadExcel">导入入库表</div>
        <div v-if="tableData.length !== 0" class="btn" @click="saveLocal">暂存草稿</div>
        <div class="btn" v-show="editStatus" @click="checkPostion">批量位置选择</div>
        <div class="btn" v-show="editStatus" @click="addItem">增加</div>
        <div v-if="tableData.length !== 0" class="btn" @click="save">{{ editStatus ? '确认入库' : '继续入库' }}</div>
      </footer>
      <div class="recommend">
        <div class="filter-box">
          <div class="base-box">
            <div>
              <span>筛选:</span>
              <p>
                <span :class="{ activeItem: selectObj.base === 1 }" @click="changeFilter(1)">学校仪器</span>
              </p>
              <p>
                <span :class="{ activeItem: selectObj.base === 2 }" @click="changeFilter(2)">国标仪器</span>
              </p>
            </div>
          </div>
          <!--          <BaseFilter :config-data="filterData" @change-filter="changeFilter" />-->
        </div>
        <div class="select-box">
          <div style="color: #67c23a" @click="readMore">查看更多</div>
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
      <el-dialog custom-class="dialogCss2" v-model="dialogVisible2" title="选择位置" width="680px">
        <div class="block display-flex background-img">
          <div style="width: 80%; margin-left: 10%; display: flex">
            <div style="flex: 1; width: 33%">
              <div style="text-align: center; font-weight: bold; font-size: 16px; border-right: 1px dashed #05c65d">
                实验室
              </div>
              <div class="content_box_f hide-scrollbar">
                <!-- <div :class="select_laboratory_id === 0 ? 'content_box_check' : 'content_box'" @click="clearLab()">
                  请选择
                </div> -->
                <div
                  :class="item.id === select_laboratory_id ? 'content_box_check' : 'content_box'"
                  v-for="(item, index) in laboratory_list"
                  :key="index"
                  @click="selLab(item, index)"
                >
                  {{ item.title }}
                </div>
              </div>
            </div>
            <div style="flex: 1; width: 33%">
              <div style="text-align: center; font-weight: bold; font-size: 16px; border-right: 1px dashed #05c65d">
                仪器柜
              </div>
              <div class="content_box_f hide-scrollbar">
                <!-- <div :class="select_store_id === 0 ? 'content_box_check' : 'content_box'" @click="clearStore()">
                  请选择
                </div> -->
                <div
                  :class="item.store_number === select_store_number ? 'content_box_check' : 'content_box'"
                  v-for="(item, index) in store_list"
                  :key="index"
                  @click="selStore(item)"
                >
                  {{ item.title }}
                </div>
              </div>
            </div>
            <div style="flex: 1; width: 33%">
              <div style="text-align: center; font-weight: bold; font-size: 16px">层数</div>
              <div class="content_box_f hide-scrollbar">
                <!-- <div :class="select_plies_number === '' ? 'content_box_check' : 'content_box'">请选择</div> -->
                <div
                  :class="item.plies_number === select_plies_number ? 'content_box_check' : 'content_box'"
                  v-for="(item, index) in plies_list"
                  :key="index"
                  @click="selPlies(item)"
                >
                  {{ item.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible2 = false">退出</el-button>
            <el-button type="primary" @click="submitLocation">确认</el-button>
          </span>
        </template>
      </el-dialog>
      <el-dialog custom-class="dialogCss" v-model="dialogVisible" title="更多仪器数据" width="40%" :show-close="false">
        <div class="filter-box">
          <div class="base-box">
            <div>
              <span>筛选:</span>
              <p>
                <span :class="{ activeItem: selectObj.base === 1 }" @click="changeFilter(1)">学校仪器</span>
              </p>
              <p>
                <span :class="{ activeItem: selectObj.base === 2 }" @click="changeFilter(2)">国标仪器</span>
              </p>
            </div>
          </div>
          <!--          <BaseFilter :config-data="filterData" @change-filter="changeFilter" />-->
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
        <div style="height: 10px"></div>
        <div class="top-list-box">
          <div
            :class="item.check === 1 ? 'top-item checked' : 'top-item'"
            v-for="(item, index) in requestData2.data"
            :key="index"
            :title="'点击新增'"
            @click="addInsList(item)"
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
            :page-size="30"
            @current-change="handleCurrentChange"
            background
            layout="total, prev, pager, next, jumper"
            :total="requestData2.total"
          ></el-pagination>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="canncels(2)">退出</el-button>
            <el-button type="primary" @click="canncels(1)">确认</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
  <Detail
    v-if="page === 2"
    :bacth="bacth"
    :source="check"
    :voucher_number="voucher_number"
    :wholesale_purchase="wholesale_purchase"
    :factory="factory"
    :factory_mobile="factory_mobile"
    :create_time="create_time"
    @back="pageRetuen"
  ></Detail>
</template>
<script lang="ts" setup>
import { reactive, toRefs, computed, ref } from 'vue'
import { ElMessageBox, ElLoading } from 'element-plus'
import { ArrowRight, Search } from '@element-plus/icons-vue'
import Detail from '@views/instrument-manage/instore-record/detail/index.vue'
import { BaseFilter } from '@/components/base-filter'
import { ConfigDataType } from '@/components/base-filter/src/types'

import { useStore } from '@store/index'
import { inputAdjust } from '@/utils/common'

import { getLaboratoryList } from '@/service/laboratory-manage/overview'
import { storeByLaboratory, getAllStore } from '@service/laboratory-manage/overview/index'

import { accountStatus } from '@/service/login/login'

import {
  getInstrumentOfType,
  postBatchInstrument,
  addInstrumentDraft,
  clearInstrumentDraft,
  getInstrumentDraft
} from '@service/instrument-manage/batch-instrument-warehouse'
import {
  BatchWarehousingList,
  batchWarehousing,
  PliesList,
  StoreList
} from '@service/instrument-manage/batch-instrument-warehouse/types'
import { ElMessage } from 'element-plus'
import { getInsExcelList } from '@service/instrument-manage/instrument-check/index'
import { BASE_URL } from '@service/request/config'
import { getSession } from '@/utils/sessions'
import { useRouter } from 'vue-router'
import router from '@/router'
import { num } from 'video.js'
import { BaseListType } from '@service/instrument-procurement-plan/recommended-purchase/types'
const page = ref(1)
const batchPage = ref(1)
const wholesale_purchase = ref('')
// const source = ref('')
// const voucher_number = ref('')
// const wholesale_purchase = ref('')
// const factory = ref('')
// const factory_mobile = ref('')
const create_time = ref('')
const subjectName = ref('')
const store = useStore()
store.state.common.subjectArr.forEach((e) => {
  if (e.id === store.state.login.userInfo.subject_id) {
    subjectName.value = e.name
  }
})
let tableCurrentPage = ref(1)
let pageSize = ref(50)
let tableTotal = ref(0)
let allTableData = ref<any>([])
const dataMap = reactive({
  selectObj: { page: 1, type: 1, base: 1, keyword: '', limit: 5, is_school: 0 },
  tableData: Array<BatchWarehousingList>(),
  allData: Array<BatchWarehousingList>(),
  pliesLists: Array<PliesList>(),
  storeLists: Array<StoreList>(),
  checkedList: Array<BatchWarehousingList>(),
  checkedId: -1,
  requestData: {
    data: Array<BatchWarehousingList>(),
    total: 0
  },
  requestData2: {
    data: Array<BatchWarehousingList>(),
    total: 0
  },
  editStatus: true,
  optionsLaboratory: Array<{ id: number; title: string }>(),
  laboratory_list: [Array<{ id: number; title: string }>()],
  select_laboratory_id: 0,
  select_laboratory_name: '',
  store_list: [],
  select_store_id: 0,
  select_store_name: '',
  select_store_number: '',
  select_store_number_plice: 0,
  plies_list: [] as any,
  select_number_plies: 0,
  select_plies_number: '',
  storeListBody: [Array<{ id: number; title: string; number_plies: number }>()],
  optionPliesBody: [Array<{ value: number; name: string }>()],
  filterData: Array<ConfigDataType>(),
  voucher_number: '',
  bacth: '',
  factory: '',
  factory_mobile: '',
  check: 1,
  limit: 5
})
const fullscreenLoading = ref(false)
let {
  selectObj,
  tableData,
  allData,
  storeLists,
  pliesLists,
  checkedList,
  checkedId,
  requestData,
  requestData2,
  editStatus,
  optionsLaboratory,
  laboratory_list,
  select_laboratory_id,
  select_laboratory_name,
  store_list,
  select_store_id,
  select_store_name,
  select_store_number,
  select_store_number_plice,
  plies_list,
  select_number_plies,
  select_plies_number,
  storeListBody,
  optionPliesBody,
  filterData,
  voucher_number,
  bacth,
  factory,
  factory_mobile,
  check,
  limit
} = toRefs(dataMap)
getInstrumentDraft({}).then((res: any) => {
  if (res.code === 10) {
    if (res.data.json_array !== '' && res.data.json_array !== 'null') {
      let addInfo = JSON.parse(res.data.json_array)
      storeLists.value = addInfo.storeListBody
      pliesLists.value = addInfo.optionPliesBody
      // tableData.value = addInfo.list
      voucher_number.value = addInfo.voucher_number
      bacth.value = addInfo.bacth
      factory.value = addInfo.factory
      factory_mobile.value = addInfo.factory_mobile
      check.value = addInfo.source
      tableCurrentPage.value = 1
      allData.value = addInfo.list
      allTableData.value = addInfo.list
      allTableData.value.forEach((e, index) => {
        e.storeList = []
        e.pliesList = []
        if (addInfo.storeListBody[index]) {
          e.storeList = addInfo.storeListBody[index]
        }
        if (addInfo.optionPliesBody[index]) {
          e.pliesList = addInfo.optionPliesBody[index]
        }
        e.show = true
        e.position = []
        if (e.school_laboratory_id) {
          e.position[0] = e.school_laboratory_id
        }
        if (e.store_id) {
          e.position[1] = e.store_id
        }
        if (e.number_plies) {
          e.position[2] = parseInt(e.number_plies)
        }
      })
      tableTotal.value = allTableData.value.length
      getTableData(tableCurrentPage.value, pageSize.value)
    } else {
      addItem()
    }
  }
})
const checkList = ref<any>([])
const checkPostion = () => {
  console.log(checkList.value)
  if(checkList.value.length < 1 ){
    ElMessage({
      type: 'error',
      message: '请选择仪器'
    })
    return
  }
  dialogVisible2.value = true
}

const checkPostionOne = (item: any, index: number) => {
  console.log(index)
  checkedId.value = index
  dialogVisible2.value = true
}

getAllStore({ subject: store.state.login.userInfo.subject_id }).then((res) => {
  laboratory_list.value = res.data
  optionsLaboratory.value = res.data
})

const selLab = (item: any, index: any) => {
  select_laboratory_id.value = item.id
  select_laboratory_name.value = item.title
  select_store_id.value = 0
  select_store_name.value = ''
  select_store_number.value = ''
  select_plies_number.value = ''
  select_number_plies.value = 0
  plies_list.value = []
  store_list.value = laboratory_list.value[index].store
  store_list.value.forEach((item2) => {
    item2.store_number = item.id + '.' + item2.id
  })
}
const clearLab = () => {
  select_laboratory_id.value = 0
  select_laboratory_name.value = ''
  select_store_id.value = 0
  select_store_name.value = ''
  select_store_number.value = ''
  select_plies_number.value = ''
  select_number_plies.value = 0
  plies_list.value = []
  store_list.value = []
}
const selStore = (item: any) => {
  if (select_store_number.value === select_laboratory_id.value + '.' + item.id) {
    select_store_id.value = 0
    select_store_name.value = ''
    select_store_number_plice.value = 0
    select_store_number.value = ''
    select_plies_number.value = ''
    select_number_plies.value = 0
    plies_list.value = []
  } else {
    select_store_id.value = item.id
    select_store_name.value = item.title
    select_store_number_plice.value = item.number_plies
    select_store_number.value = select_laboratory_id.value + '.' + item.id
    select_plies_number.value = ''
    select_number_plies.value = 0
    let arr = []
    for (let i = 1; i <= item.number_plies; i++) {
      arr.push({
        value: i,
        name: '第' + i + '层',
        plies_number: select_laboratory_id.value + '.' + item.id + '.' + i
      })
    }
    plies_list.value = arr
  }
}
const clearStore = () => {
  select_store_id.value = 0
  select_store_number.value = ''
  select_plies_number.value = ''
  plies_list.value = []
}
const selPlies = (item: any) => {
  if (select_plies_number.value === select_laboratory_id.value + '.' + select_store_id.value + '.' + item.id) {
    select_number_plies.value = 0
    select_plies_number.value = ''
  } else {
    select_number_plies.value = item.value
    select_plies_number.value = select_laboratory_id.value + '.' + select_store_id.value + '.' + item.value
  }
}

const handleTableCurrentPage = (val: number) => {
  tableCurrentPage.value = val
  getTableData(tableCurrentPage.value, pageSize.value)
}
let date = new Date()
// getLaboratoryList({ subject: store.state.login.userInfo.subject_id }).then((res) => {
//   optionsLaboratory.value = res.data.data
// })

const dialogVisible = ref(false)
const dialogVisible2 = ref(false)

const getStoreData = (id: number | string, index: number) => {
  storeByLaboratory({ id: Number(id) || 0 }).then((res) => {
    tableData.value[index].storeList = res.data
    tableData.value[index].pliesList = []
  })
}


const handleSelectionChange = (val: BaseListType[]) => {
  checkList.value = val
  console.log(checkList.value)
}
// const checkSelectable = (row: BaseListType) => {
//   //通过id来禁止不能选择的项
//   // return row.id !== 1
//   //通过索引index来禁止不能选择的项
//   if ('children' in row) {
//     return true
//   } else {
//     return false
//   }
// }

const minNumber = (item: number) => {
  if (item < 0) {
    ElMessage({
      type: 'error',
      message: '保质期不能小于0'
    })
  }
}

const readMore = () => {
  dialogVisible.value = true
  limit.value = 30
  // selectObj.value.base = 1
  selectObj.value.limit = limit.value
  getData()
}

const canncels = (type: number) => {
  dialogVisible.value = false
  limit.value = 5
  if (type === 1) {
    for (let i = 0; i < checkedList.value.length; i++) {
      tableData.value.push(checkedList.value[i])
      allTableData.value.push(checkedList.value[i])
    }
    tableTotal.value = allTableData.value.length
    getTableData(tableCurrentPage.value, pageSize.value)
    checkedList.value = []
  } else {
    checkedList.value.splice(0)
  }
}

filterData.value = [
  {
    name: '筛选',
    list: [
      { id: 1, name: '学校仪器' },
      { id: 2, name: '国标仪器' }
    ],
    keyName: 'base'
  }
]

const addItem = () => {
  tableData.value.splice(pageSize.value, 0, {
    ...batchWarehousing,
    number: '',
    position: [optionsLaboratory.value[0] ? optionsLaboratory.value[0].id : 0],
    school_instrument_id: 0,
    instrument_id: 0,
    number_year: 12
  })
  let allIndex = tableCurrentPage.value * pageSize.value
  allTableData.value.splice(allIndex, 0, {
    number: '',
    asset_number: '',
    name: '',
    specification: '',
    school_instrument_id: 0,
    instrument_id: 0,
    cost_type: '',
    position: [optionsLaboratory.value[0] ? optionsLaboratory.value[0].id : 0],
    number_year: 12,
    category: '',
    unit: '',
    info: '',
    norm: '',
    school_laboratory_id: 0,
    store_id: 0,
    number_plies: 0,
    total: 0,
    unit_price: 0,
    type: 1
  })
  tableTotal.value = allTableData.value.length
}

const getData = () => {
  if (selectObj.value.base === 1) {
    selectObj.value.is_school = 1
  } else {
    selectObj.value.is_school = 0
  }
  getInstrumentOfType(selectObj.value).then((res) => {
    if (limit.value === 5) {
      requestData.value = res.data
    }
    if (limit.value === 30) {
      for (let i = 0; i < res.data.data.length; i++) {
        res.data.data[i].check = 0
      }
      requestData2.value = res.data
    }
  })
}

getData()
const option1: any = ref([])
const getData1 = (val: any, index: any) => {
  // val = val.replace(/[^\d]+/g, '')
  if (val !== '') {
    let data = { page: 1, type: 1, base: 2, number: val, is_school: 0 }
    let data1 = { page: 1, type: 1, base: 1, number: val, is_school: 1 }
    getInstrumentOfType(data).then((res) => {
      option1.value = res.data.data
      // if (option1.value.length === 0 && !tableData.value[index].show) {
      if (option1.value.length === 0) {
        getInstrumentOfType(data1).then((res1) => {
          if (res1.data.data.length !== 1 || res1.data.data[0].number !== val) {
            let obj = {
              show: true,
              name: '',
              number: val,
              asset_number: '',
              category: '',
              specification: '',
              school_instrument_id: 0,
              instrument_id: 0,
              unit: '',
              info: '',
              number_year: 12,
              norm: '',
              school_laboratory_id: '', //实验室id
              store_id: '', //仪器柜id
              number_plies: '', //层数
              total: '', //入库数量
              unit_price: '',
              position: [optionsLaboratory.value[0].id],
              type: 1
            }
            tableData.value[index] = JSON.parse(JSON.stringify(obj))
          } else {
            let obj = {
              show: true,
              name: res1.data.data[0].name,
              number: res1.data.data[0].number,
              asset_number: res1.data.data[0].asset_number || JSON.parse(JSON.stringify(res1.data.data[0].number)),
              category: res1.data.data[0].category,
              specification: res1.data.data[0].specification,
              school_instrument_id: 0,
              instrument_id: res1.data.data[0].id,
              cost_type:
                typeof res1.data.data[0].cost_type === 'object'
                  ? res1.data.data[0].cost_type.value
                  : res1.data.data[0].cost_type,
              unit: res1.data.data[0].unit,
              info: res1.data.data[0].info,
              number_year: 12,
              norm: res1.data.data[0].norm,
              school_laboratory_id:
                res1.data.data[0].school_laboratory_id ||
                tableData.value[tableData.value.length - 1]?.school_laboratory_id, //实验室id
              store_id: res1.data.data[0].store_id || tableData.value[tableData.value.length - 1]?.store_id, //仪器柜id
              number_plies: res1.data.data[0].number_plies || tableData.value[tableData.value.length - 1]?.number_plies, //层数
              total: '', //入库数量
              unit_price: res1.data.data[0].unit_price,
              position: [optionsLaboratory.value[0].id],
              type: 1
            }
            tableData.value[index] = JSON.parse(JSON.stringify(obj))
          }
        })
      } 
    })
  }
}
const changeFilter = (base: number) => {
  console.log(base)
  selectObj.value.base = base
  selectObj.value.limit = 5
  if (selectObj.value.base === 1) {
    selectObj.value.is_school = 1
  } else {
    selectObj.value.is_school = 0
  }
  getInstrumentOfType(selectObj.value).then((res) => {
    requestData.value = res.data
  })
  selectObj.value.limit = 30
  getInstrumentOfType(selectObj.value).then((res) => {
    for (let i = 0; i < res.data.data.length; i++) {
      res.data.data[i].check = 0
    }
    requestData2.value = res.data
  })
}

const setPlies = (index: number) => {
  let sum = 0
  for (let i = 0; i < tableData.value[index].storeList.length; i++) {
    if (tableData.value[index].storeList[i].id === tableData.value[index].store_id) {
      sum = tableData.value[index].storeList[i].number_plies
    }
  }
  tableData.value[index].pliesList = []
  for (let x = 1; x <= sum; x++) {
    tableData.value[index].pliesList.push({
      value: x,
      name: '第' + x + '层'
    })
  }
}

let optionPlies = computed(() => {
  return (list: { id: number; number_plies: number }[], storeId: number) => {
    let num = 1
    list.forEach((e) => {
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

const handleCurrentChange = () => {
  selectObj.value.limit = 30
  getData()
}

const addInsList = (item: BatchWarehousingList) => {
  let errorTip = 1
  allTableData.value.forEach((e) => {
    if (e.number === item.number) {
      errorTip = 2
      return
    }
  })
  if (errorTip === 2) {
    ElMessage({
      type: 'info',
      message: '该仪器已添加'
    })
    return
  }
  if (item.check === 1) {
    item.check = 0
    for (let i = 0; i < checkedList.value.length; i++) {
      if (checkedList.value[i].id === item.id) {
        checkedList.value.splice(i, 1)
        break
      }
    }
  } else {
    item.check = 1
    let obj = {
      id: item.id,
      name: item.name,
      number: item.number,
      asset_number: item.asset_number || item.number,
      category: item.category,
      specification: item.specification,
      school_instrument_id: selectObj.value.base === 1 ? item.id || 0 : 0,
      instrument_id: selectObj.value.base === 2 ? item.id || 0 : 0,
      cost_type: typeof item.cost_type === 'object' ? item.cost_type.value : item.cost_type,
      unit: item.unit,
      info: item.info,
      number_year: item.number_year,
      norm: item.norm,
      school_laboratory_id: '', //实验室id
      store_id: '', //仪器柜id
      number_plies: '', //层数
      total: 0, //入库数量
      unit_price: item.unit_price,
      type: 1,
      check: item.check
    }
    checkedList.value.push(obj)
  }
}

const addTable = (item: BatchWarehousingList) => {
  if (editStatus.value) {
    let errorTip = 1
    tableData.value.forEach((e) => {
      if (e.number === item.number) {
        errorTip = 2
        return
      }
    })
    if (errorTip === 2) {
      ElMessage({
        type: 'info',
        message: '该仪器已添加'
      })
      return
    }
    let obj = {
      name: item.name,
      number: item.number,
      asset_number: item.asset_number || item.number,
      category: item.category,
      specification: item.specification,
      school_instrument_id: selectObj.value.base === 1 ? item.id || 0 : 0,
      instrument_id: selectObj.value.base === 2 ? item.id || 0 : 0,
      cost_type: typeof item.cost_type === 'object' ? item.cost_type.value : item.cost_type,
      unit: item.unit,
      info: item.info,
      number_year: item.number_year,
      norm: item.norm,
      school_laboratory_id: '', //实验室id
      store_id: '', //仪器柜id
      number_plies: '', //层数
      total: 0, //入库数量
      // source: item.source || 1,
      // bacth: item.bacth || tableData.value[tableData.value.length - 1]?.bacth,
      // voucher_number: item.voucher_number || tableData.value[tableData.value.length - 1]?.voucher_number,
      // factory: item.factory || tableData.value[tableData.value.length - 1]?.factory,
      unit_price: item.unit_price,
      type: 1
    }
    // 默认值
    allTableData.value.push(obj)
    tableTotal.value = allTableData.value.length
    getTableData(tableCurrentPage.value, pageSize.value)
  } else {
    ElMessage({
      type: 'info',
      message: '请点击继续入库按钮'
    })
  }
}
const deleteItem = (id: number, index: number) => {
  if (!editStatus.value) {
    return false
  }
  let allIndex = (tableCurrentPage.value - 1) * pageSize.value + index
  tableData.value.splice(index, 1)
  allTableData.value.splice(allIndex, 1)
  tableTotal.value = allTableData.value.length
  getTableData(tableCurrentPage.value, pageSize.value)
}

const copyItem = (data: any, index: number) => {
  let allIndex = (tableCurrentPage.value - 1) * pageSize.value + index
  allTableData.value.splice(allIndex + 1, 0, {
    number: data.number,
    asset_number: data.asset_number,
    name: data.name,
    specification: data.specification,
    school_instrument_id: data.school_instrument_id,
    instrument_id: data.instrument_id,
    cost_type: data.cost_type,
    position: data.position,
    number_year: data.number_year,
    category: data.category,
    unit: data.unit,
    info: data.info,
    norm: data.norm,
    school_laboratory_id: 0,
    store_id: 0,
    number_plies: 0,
    total: data.total,
    unit_price: data.unit_price,
    type: data.type
  })
  tableData.value.splice(index + 1, 0, {
    number: data.number,
    asset_number: data.asset_number,
    name: data.name,
    specification: data.specification,
    school_instrument_id: data.school_instrument_id,
    instrument_id: data.instrument_id,
    cost_type: data.cost_type,
    position: data.position,
    number_year: data.number_year,
    category: data.category,
    unit: data.unit,
    info: data.info,
    norm: data.norm,
    school_laboratory_id: 0,
    store_id: 0,
    number_plies: 0,
    total: data.total,
    unit_price: data.unit_price,
    type: data.type
  })
  tableTotal.value = allTableData.value.length
  getTableData(tableCurrentPage.value, pageSize.value)
  // tableData.value.push({
  //   number: data.number,
  //   asset_number: data.asset_number,
  //   name: data.name,
  //   specification: data.specification,
  //   school_instrument_id: data.school_instrument_id,
  //   instrument_id: data.instrument_id,
  //   cost_type: data.cost_type,
  //   position: data.position,
  //   number_year: data.number_year,
  //   category: data.category,
  //   unit: data.unit,
  //   info: data.info,
  //   norm: data.norm,
  //   school_laboratory_id: 0,
  //   store_id: 0,
  //   number_plies: 0,
  //   total: data.total,
  //   unit_price: data.unit_price,
  //   type: data.type
  // })
}

const uploadExcel = () => {
  let filedom: any = document.getElementById('uploadExcel')
  filedom.value = ''
  filedom.click()
}

const saveLocal = () => {
  let data = {
    storeListBody: storeLists.value,
    optionPliesBody: pliesLists.value,
    list: allTableData.value,
    voucher_number: voucher_number.value,
    bacth: bacth.value,
    factory: factory.value,
    factory_mobile: factory_mobile.value,
    source: check.value
  }
  addInstrumentDraft({ json_array: JSON.stringify(data) }).then((res: any) => {
    if (res.code === 10) {
      ElMessage({
        type: 'success',
        message: '保存成功'
      })
    } else {
      ElMessage({
        type: 'success',
        message: '保存失败'
      })
    }
  })
}

const changeExcel = () => {
  let fileObj: any = (document.getElementById('uploadExcel') as any).files[0]
  let formdata = new FormData()
  formdata.append('file', fileObj)
  formdata.append('role_id', '4')
  getInsExcelList(formdata).then((res: any) => {
    if (res.code === 10) {
      tableCurrentPage.value = 1
      allTableData.value = res.data.list
      allTableData.value.forEach((e, index) => {
        e.storeList = []
        e.pliesList = []
        if (res.data.storeList[index]) {
          e.storeList = res.data.storeList[index]
        }
        if (res.data.pliesList[index]) {
          e.pliesList = res.data.pliesList[index]
        }
        e.show = true
        e.position = []
        if (e.school_laboratory_id) {
          e.position[0] = e.school_laboratory_id
        }
        if (e.store_id) {
          e.position[1] = e.store_id
        }
        if (e.number_plies) {
          e.position[2] = parseInt(e.number_plies)
        }
      })
      tableTotal.value = allTableData.value.length
      getTableData(tableCurrentPage.value, pageSize.value)
    }
  })
}
const getTableData = (currentPage: number, pageSize: number) => {
  let begin = (currentPage - 1) * pageSize
  let end = currentPage * pageSize
  tableData.value = allTableData.value.slice(begin, end)
}
const handleSizeChange = (val: number) => {
  pageSize.value = val
  getTableData(tableCurrentPage.value, pageSize.value)
}

const nextPage = () => {
  if (Math.ceil(allData.value.length / 100) > batchPage.value) {
    let arr = allData.value.slice(batchPage.value * 100, batchPage.value * 100 + 100)
    arr.forEach((e, index) => {
      e.storeList = []
      e.pliesList = []
      if (storeLists.value[index]) {
        e.storeList = storeLists.value[index]
      }
      if (pliesLists.value[index]) {
        e.pliesList = pliesLists.value[index]
      }
      e.show = true
      e.position = []
      if (e.school_laboratory_id) {
        e.position[0] = e.school_laboratory_id
      }
      if (e.store_id) {
        e.position[1] = e.store_id
      }
      if (e.number_plies) {
        e.position[2] = parseInt(e.number_plies)
      }
      // e.school_instrument_id = 0
      // e.instrument_id = 0
    })
    tableData.value.push(...arr)
    batchPage.value = batchPage.value + 1
  }
}

const inputChange = (e: any) => {
  e.target.value = JSON.parse(JSON.stringify(e.target.value.replace(/[\u4e00-\u9fa5]/g, '')))
  if (e.target.value.length >= 15) {
    e.target.value = JSON.parse(JSON.stringify(e.target.value.substring(0, 14)))
  }
}

const selOne = (item: any, index: any) => {
  if (item.number !== '') {
    let allIndex = (tableCurrentPage.value - 1) * pageSize.value + index
    if (item.name) {
      let obj = {
        show: true,
        name: item.name,
        number: item.number,
        asset_number: item.asset_number || JSON.parse(JSON.stringify(item.number)),
        category: item.category,
        specification: item.specification,
        school_instrument_id: 0,
        instrument_id: item.id,
        cost_type: typeof item.cost_type === 'object' ? item.cost_type.value : item.cost_type,
        unit: item.unit,
        info: item.info,
        number_year: 12,
        norm: item.norm,
        school_laboratory_id: '', //实验室id
        store_id: '', //仪器柜id
        number_plies: '', //层数
        total: '', //入库数量
        unit_price: item.unit_price,
        position: [optionsLaboratory.value[0].id],
        type: 1
      }
      tableData.value[index] = JSON.parse(JSON.stringify(obj))
      allTableData.value[allIndex] = JSON.parse(JSON.stringify(obj))
    } else {
      let obj = {
        show: true,
        name: '',
        number: item.number,
        asset_number: '',
        category: '',
        specification: '',
        school_instrument_id: 0,
        instrument_id: 0,
        cost_type: typeof item.cost_type === 'object' ? item.cost_type.value : item.cost_type,
        unit: '',
        info: '',
        number_year: 12,
        norm: '',
        school_laboratory_id: '', //实验室id
        store_id: '', //仪器柜id
        number_plies: '', //层数
        total: '', //入库数量
        unit_price: '',
        position: [optionsLaboratory.value[0].id],
        type: 1
      }
      tableData.value[index] = JSON.parse(JSON.stringify(obj))
      allTableData.value[allIndex] = JSON.parse(JSON.stringify(obj))
    }
    tableTotal.value = allTableData.value.length
    getTableData(tableCurrentPage.value, pageSize.value)
  } else {
    ElMessage({
      type: 'warning',
      message: '分类编号必须为数字！'
    })
  }
}

function findSameNameAndGender(arr: string | any[]) {
  for (let i = 0; i < arr.length; i++) {
    for (let a = 0; a < arr.length; a++) {
      if (arr[i].number === arr[a].number && arr[i].asset_number !== arr[a].asset_number && i !== a) {
        return arr[a].number
      }
    }
  }
  return true
}

const submitLocation = () => {
  console.log(select_laboratory_id.value)
  console.log(select_store_id.value)
  console.log(select_number_plies.value)
  if(checkedId.value >= 0 ){
    let allIndex = (tableCurrentPage.value - 1) * pageSize.value + checkedId.value
    // tableData.value[checkedId.value].
    // allTableData.value.splice(allIndex, 1)
    // tableTotal.value = allTableData.value.length
    // getTableData(tableCurrentPage.value, pageSize.value)
    tableData.value[checkedId.value].school_laboratory_id = select_laboratory_id.value
    tableData.value[checkedId.value].school_laboratory_name = select_laboratory_name.value
    tableData.value[checkedId.value].store_id = select_store_id.value
    tableData.value[checkedId.value].store_name = select_store_name.value
    tableData.value[checkedId.value].number_plies = select_number_plies.value
    allTableData.value[allIndex].school_laboratory_id = select_laboratory_id.value
    allTableData.value[allIndex].store_id = select_store_id.value
    allTableData.value[allIndex].number_plies = select_number_plies.value
  }else{
    checkList.value.forEach((e, index) => {
    e.school_laboratory_id = select_laboratory_id.value
    e.school_laboratory_name = select_laboratory_name.value
    e.store_id = select_store_id.value
    e.store_name = select_store_name.value
    e.storeList = store_list.value
    e.pliesList = plies_list.value
    e.number_plies = select_number_plies.value
  })
  }
  checkedId.value = -1
  dialogVisible2.value = false
}

const save = async () => {
  if (editStatus.value) {
    let status = await accountStatus({ type: 1 })
    if (status.data !== 3) {
      ElMessage({
        type: 'warning',
        message: '期初建帐结束后可用，请检查仪器期初建帐信息'
      })
      return
    }
    let errorCount = 0
    if (voucher_number.value === '') {
      ElMessage({
        type: 'warning',
        message: '请填写凭证号'
      })
      return
    }
    if (bacth.value === '') {
      ElMessage({
        type: 'warning',
        message: '请填写采购批次'
      })
      return
    }
    let isC = findSameNameAndGender(allTableData.value)
    if (isC !== true) {
      ElMessage({
        type: 'warning',
        message: '分类编号' + isC + '请保持学校编号一致'
      })
      return
    }
    allTableData.value.forEach(
      (e: { asset_number: any; unit_price: number; school_laboratory_id: any; total: number; number_year: number }) => {
        if (!e.asset_number) {
          errorCount = 1
          return
        }
        if (!e.unit_price) {
          errorCount = 3
          return
        }
        if (e.unit_price < 0 || e.unit_price > 99999) {
          errorCount = 3
          return
        }
        if (!e.school_laboratory_id) {
          errorCount = 4
          return
        }
        if (!e.total) {
          errorCount = 5
          return
        }
        if (e.total <= 0 || e.total > 9999) {
          errorCount = 6
          return
        }
        if (e.number_year && e.number_year < 0 && e.number_year > 100) {
          errorCount = 7
          return
        }
      }
    )
    if (errorCount !== 0) {
      ElMessage({
        type: 'warning',
        message:
          errorCount === 1
            ? '学校编号不可为空'
            : errorCount === 3
            ? '请设置单价且单价不能大于99999'
            : errorCount === 4
            ? '请选择实验室'
            : errorCount === 5
            ? '请输入数量'
            : errorCount === 6
            ? '数量需要大于0小于9999'
            : errorCount === 7
            ? '保质期大于0小于100'
            : '请检查必填项'
      })
      return
    }
    fullscreenLoading.value = true
    postBatchInstrument({
      list: allTableData.value,
      voucher_number: voucher_number.value,
      bacth: bacth.value,
      factory: factory.value,
      factory_mobile: factory_mobile.value,
      source: check.value
    }).then((res) => {
      fullscreenLoading.value = false
      if (res.code === 10) {
        ElMessage({
          type: 'success',
          message: res.msg
        })
        editStatus.value = false
        page.value = 2
        wholesale_purchase.value = res.data
        create_time.value = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
        if (date.getMonth() + 1 < 10) {
          create_time.value = date.getFullYear() + '-0' + (date.getMonth() + 1) + '-' + date.getDate()
        }
        clearInstrumentDraft({}).then((res) => {
          console.log(res)
        })
      }
    })
  } else {
    tableData.value = Array<BatchWarehousingList>()
    editStatus.value = true
  }
}

const pageRetuen = () => {
  router.push('/instrumentManage/instoreRecord')
}

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

const uploadTemp = () => {
  window.location.href = BASE_URL + '/template/1.学校名称_入库导入模版.xlsx'
}

const checkSource = (value: number) => {
  check.value = value
}

const is_mobile = () => {
  let reg = /^1[3456789]\d{9}$/
  if (reg.test(factory_mobile.value) && factory_mobile.value.length === 11) {
    return true
  } else {
    ElMessage({
      message: '手机格式不正确',
      type: 'warning'
    })
    return false
  }
}

const check_factory = () => {
  if (factory.value.length > 30) {
    ElMessage({
      message: '厂家输入信息过多',
      type: 'warning'
    })
  }
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
.content {
  .body_top {
    width: 100%;
    background: #ffffff;
    box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.16);
    opacity: 1;
    margin-top: 20px;
    margin-bottom: 20px;
    .title {
      width: 100px;
      height: 40px;
      margin-top: 20px;
      text-align: center;
      line-height: 40px;
      font-size: 16px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #848484;
    }
    .title2 {
      width: 140px;
      height: 40px;
      margin-top: 20px;
      text-align: center;
      line-height: 40px;
      font-size: 16px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #848484;
      text-align: left;
      margin-left: 50px;
    }
    .source {
      width: 100px;
      height: 40px;
      box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.16);
      border-radius: 10px 10px 10px 10px;
      opacity: 1;
      border: 1px solid #05c65d;
      text-align: center;
      line-height: 40px;
      margin-top: 20px;
      margin-left: 20px;
      font-size: 16px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #05c65d;
    }
    .check_source {
      width: 100px;
      height: 40px;
      box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.16);
      border-radius: 10px 10px 10px 10px;
      opacity: 1;
      border: 1px solid #05c65d;
      text-align: center;
      line-height: 40px;
      margin-top: 20px;
      margin-left: 20px;
      font-size: 16px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #ffffff;
      background: #05c65d;
    }
    ::v-deep input {
      width: 500px;
      height: 40px;
      background: #ffffff;
      color: #333333;
      border-radius: 0px 0px 0px 0px;
      opacity: 1;
      border: 1px solid #c9c7c7;
    }
    ::v-deep .el-input {
      width: auto;
      margin-top: 1.25rem;
      margin-left: 1.25rem;
    }
    .subjects {
      ::v-deep input {
        border: 0px;
      }
    }
  }
  .body_title {
    height: 50px;
    background: #dcece3;
    width: 100%;
    p {
      color: rgb(5, 198, 93);
      font-size: 18px;
      text-align: left;
      line-height: 50px;
      padding-left: 20px;
    }
  }
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
      width: 18%;
      max-width: 200px;
      height: 140px;
      text-align: left;
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
  .pagination-block {
    text-align: right;
    margin-bottom: 10px;
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
      color: #333333;
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
      color: #333333;
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
    .select-trigger {
      .el-input {
        .el-input__inner {
          width: 110px;
          padding-left: 0;
          padding-right: 0;
        }
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
.btn {
  width: 100px;
  height: 36px;
  line-height: 36px;
  background: #05c65d;
  color: #ffffff;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
  opacity: 1;
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
  margin-right: 30px;
}
.btn-white {
  color: #333333;
  background: #f3f3f3;
}
.green {
  color: #05c65d !important;
}
.red {
  color: #de4747 !important;
}
.addbtn {
  margin-right: 20px;
  width: 120px;
  height: 40px;
  line-height: 40px;
  background-color: #05c65d;
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
}
.insType {
  padding: 10px;
}
.insTypeS {
  padding: 10px;
  color: #05c65d;
  border-bottom: 2px solid #05c65d;
}
.checked {
  background-color: #d9d9d9;
}
::v-deep .dialogCss {
  min-height: 100%;
  float: right;
  margin-top: 0;
}
::v-deep .dialogCss2 {
  .el-dialog__header {
    background: #61cab5;
    .el-dialog__title {
      color: #ffffff;
    }
  }
  .el-dialog__footer {
    text-align: center;
  }
}
.hide-scrollbar {
  overflow: auto; /* 启用滚动 */
  -ms-overflow-style: none; /* IE 和 Edge */
  scrollbar-width: none; /* Firefox */
}

/* 兼容所有浏览器的通用方法 */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.content_box_f {
  height: 280px;
  text-align: center;
  font-size: 14px;
  margin-top: 20px;
  margin-bottom: 20px;
}
.content_box {
  height: 40px;
  font-size: 14px;
  line-height: 40px;
  color: #626572;
  padding: 0 5px;
  overflow: hidden; /* 确保超出容器的文本被隐藏 */
  white-space: nowrap; /* 确保文本在一行内显示 */
  text-overflow: ellipsis;
}
.content_box_check {
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  color: #61cba5;
  padding: 0 5px;
  overflow: hidden; /* 确保超出容器的文本被隐藏 */
  white-space: nowrap; /* 确保文本在一行内显示 */
  text-overflow: ellipsis;
}
.display-flex {
  display: flex;
}
.background-img {
  // background-image: url('../../../assets/images/ellipse.png');
  background-repeat: no-repeat;
  //background-attachment: fixed ;
  background-position: center center;
  background-size: 100% auto;
}
.base-box {
  width: 100%;
  & > div {
    display: flex;
    align-items: center;
    span {
      align-self: flex-start;
      margin: 10px 0;
      display: block;
      min-width: 7%;
      text-align: left;
      color: #848484;
      float: left;
    }
    p {
      max-width: 93%;
      display: inline-block;
      span {
        align-self: flex-start;
        display: inline-block;
        margin-right: 50px;
        min-width: 0px;
        height: 20px;
        text-align: center;
        color: #333333;
        cursor: pointer;
        box-sizing: border-box;
      }
      span:hover {
        color: #05c65d;
      }
    }
  }
}
.activeItem {
  border: 1px solid #05c65d;
  padding: 0 2px;
  border-radius: 4px;
  color: #05c65d !important;
  box-sizing: border-box;
}
</style>
