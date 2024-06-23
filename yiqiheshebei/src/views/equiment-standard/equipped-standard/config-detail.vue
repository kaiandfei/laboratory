<template>
  <div
    v-loading="containerLoading"
    element-loading-text="保存中，请稍后..."
    element-loading-background="rgba(122, 122, 122, 0.8)"
  >
    <div class="title">
      <div class="text-box">
        <div class="period">{{ props.item?.rail_min }}~{{ props.item?.rail_max }}轨</div>
        <div class="period">
          {{ props.item?.learning_info[0]?.title }}
        </div>
        <!-- <p>
          适用学段：
          <span>{{ props.item?.learning_info[0]?.title }}</span>
        </p>
        <p>
          轨数：
          <span>{{ props.item?.rail_min }}~{{ props.item?.rail_max }}轨</span>
        </p> -->
      </div>
      <div class="btn-box">
        <p v-show="editStatus === 1" class="btn btn-gray" @click="changeEditStatus(0)">取消编辑</p>
        <p
          v-if="![1, 2].includes(store.state.login.userInfo.role_id)"
          v-show="editStatus === 0"
          class="btn btn-white"
          @click="changeEditStatus(1)"
        >
          编辑
        </p>
        <p v-show="tableData.length === 0 && editStatus === 0" class="btn" @click="downloadTem">下载模板</p>
        <p v-show="tableData.length === 0 && editStatus === 0" class="btn" @click="importData">导入</p>
        <div class="btn" v-show="tableData.length !== 0 && editStatus === 0" @click="upFile">导出</div>
        <input v-show="false" ref="uploadFile" type="file" @change="hasUpload" />
        <p v-show="editStatus === 1" class="btn" @click="sureClick">保存</p>
        <p v-show="editStatus === 1" class="btn btn-white" @click="addIns">添加</p>
        <p v-show="editStatus === 1" class="btn btn-white" @click="batchDelete">批量删除</p>
        <p v-show="editStatus === 1" class="btn btn-white" @click="batchAdd">批量添加</p>
      </div>
    </div>
    <div class="tabs">
      <div
        class="tab-item"
        v-for="(item, index) in props.item?.learning_info[0].id !== 1 ? tabList1 : tabList2"
        :key="index"
        @click="handleLiClick(index, item)"
      >
        <p :class="{ 'tab-active': activeName === index }">
          {{ item.label }}
        </p>
      </div>
    </div>
    <el-form
      v-show="editStatus === 0"
      :model="searchForm"
      :inline="true"
      label-width="100px"
      class="demo-form-inline screen"
    >
      <el-form-item label="分类编号">
        <el-input v-model="searchForm.number" placeholder="请输入分类编号" clearable />
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="searchForm.name" placeholder="请输入名称" clearable />
      </el-form-item>
      <el-form-item label="分类">
        <el-cascader
          v-model="searchForm.category"
          :options="categoryOptions"
          :props="casProps"
          collapse-tags
          clearable
          :show-all-levels="false"
          style="width: 90%"
        ></el-cascader>
        <!-- <el-select v-model="searchForm.category" placeholder="请选择分类" clearable>
          <el-option v-for="item in categoryOptions" :key="item.id" :label="item.label" :value="item.id"></el-option>
        </el-select> -->
      </el-form-item>
      <el-form-item label="配备类型">
        <el-select v-model="searchForm.is_must" placeholder="请选择配备类型" clearable>
          <el-option
            v-for="item in equipmentTypeOptions"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <p class="btn" @click="search">
          <img src="@assets/images/common/search.png" alt="" />
          搜索
        </p>
      </el-form-item>
    </el-form>
    <div class="total">
      共计：仪器种类：
      <span class="countColor">{{ summary.number_count }}</span>
      种,数量
      <span class="countColor">{{ summary.min_count }}</span>
      ~
      <span class="countColor">{{ summary.max_count }}</span>
      件，必配
      <span class="countColor">{{ summary.must_count }}</span>
      种，选配
      <span class="countColor">
        {{ summary.not_must_count }}
      </span>
      种
    </div>
    <div class="content">
      <el-table
        v-if="editStatus === 0"
        v-loading="tableLoading"
        :data="tableData"
        style="width: 100%"
        :max-height="'450px'"
        :header-cell-style="{ color: '#000' }"
        :cell-style="{ background: '#ffffff', borderBottom: '1px solid #EFEFEF' }"
      >
        <el-table-column type="index" label="序号" width="50" align="left"></el-table-column>
        <el-table-column
          v-if="![1, 2].includes(store.state.login.userInfo.role_id)"
          prop="type"
          label="类型"
          align="left"
        >
          <template #default="scope">
            <div>
              {{ scope.row.type === 1 ? '仪器' : '设备' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="number" label="分类编号" align="left" sortable>
          <template #default="scope">
            <span v-show="scope.row.name !== ''">{{ scope.row.number }}</span>
            <el-select
              v-if="scope.row.name === ''"
              v-model="scope.row.number"
              filterable
              placeholder="请输入查询"
              remote
              :remote-method="numberChange"
              @focus="numberFocus"
            >
              <el-option
                v-for="(item, index) in searchTableData"
                :key="index"
                :value="item.number"
                @click="selclick(scope.$index, item)"
              >
                {{ item.number + '/' + item.name + '/' + item.specification }}
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="cost_name" label="分类" align="left" sortable show-overflow-tooltip>
          <template #default="scope">
            <div>
              <span v-for="(item, index) in scope.row.cost_name" :key="index">{{ item.title + ' ' }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" align="left" show-overflow-tooltip></el-table-column>
        <el-table-column prop="specification" label="规格型号" align="left" show-overflow-tooltip></el-table-column>
        <el-table-column prop="unit" label="单位" align="left"></el-table-column>
        <el-table-column
          v-if="![1, 2].includes(store.state.login.userInfo.role_id)"
          prop="norm"
          label="执行标准代号"
          align="left"
        ></el-table-column>
        <el-table-column
          v-if="![1, 2].includes(store.state.login.userInfo.role_id)"
          prop="info"
          label="功能描述"
          align="left"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="" label="必配" align="left" width="60">
          <template #default="scope">
            <!-- <span v-show="editStatus === 0">{{ scope.row.must === 1 ? '必配' : '选配' }}</span> -->
            <div class="mycheckBox">
              <span class="mycheck" :class="{ hasBg: scope.row.must == 1 }"></span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="" label="选配" align="left" width="60">
          <template #default="scope">
            <!-- <span v-show="editStatus === 0">{{ scope.row.must === 1 ? '必配' : '选配' }}</span> -->
            <div class="mycheckBox">
              <span class="mycheck" :class="{ hasBg: scope.row.must == 2 }"></span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="" label="数量范围" align="left" :width="editStatus === 0 ? 100 : 200">
          <template #default="scope">
            <span v-show="editStatus === 0">{{ scope.row.min_total }}~{{ scope.row.max_total }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="[1].includes(store.state.login.userInfo.role_id)" prop="" label="现存数量" align="left">
          <template #default="scope">
            <span>{{ scope.row.total }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="![1, 2].includes(store.state.login.userInfo.role_id)"
          prop=""
          label="操作"
          width="200"
          align="center"
        >
          <template #default="scope">
            <div class="click-box">
              <span v-show="scope.row.id" class="click-text" @click="getItemDetail(scope.row.id)">查看详情</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-else
        ref="dragTable"
        v-loading="tableLoading"
        :data="tableDataOnePage"
        style="width: 100%"
        :max-height="editStatus === 1 ? '500px' : '450px'"
        :header-cell-style="{ color: '#000' }"
        :cell-style="{ background: '#ffffff', borderBottom: '1px solid #EFEFEF' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column v-if="editStatus === 1" type="selection" width="55" />
        <el-table-column type="index" label="序号" width="50" align="left"></el-table-column>
        <el-table-column
          v-if="![1, 2].includes(store.state.login.userInfo.role_id)"
          prop="type"
          label="类型"
          align="left"
        >
          <template #default="scope">
            <div>
              {{ scope.row.type === 1 ? '仪器' : '设备' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="number" label="分类编号" align="left" sortable>
          <template #default="scope">
            <span v-show="scope.row.name !== ''">{{ scope.row.number }}</span>
            <el-select
              v-if="scope.row.name === ''"
              v-model="scope.row.number"
              filterable
              placeholder="请输入查询"
              remote
              :remote-method="numberChange"
              @focus="numberFocus"
            >
              <el-option
                v-for="(item, index) in searchTableData"
                :key="index"
                :value="item.number"
                @click="selclick(scope.$index, item)"
              >
                {{ item.number + '/' + item.name + '/' + item.specification }}
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="cost_name" label="分类" align="left" sortable show-overflow-tooltip>
          <template #default="scope">
            <div>
              <span v-for="(item, index) in scope.row.cost_name" :key="index">{{ item.title + ' ' }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" align="left" show-overflow-tooltip></el-table-column>
        <el-table-column prop="specification" label="规格型号" align="left" show-overflow-tooltip></el-table-column>
        <el-table-column prop="unit" label="单位" align="left"></el-table-column>
        <el-table-column
          v-if="![1, 2].includes(store.state.login.userInfo.role_id)"
          prop="norm"
          label="执行标准代号"
          align="left"
        ></el-table-column>
        <el-table-column
          v-if="![1, 2].includes(store.state.login.userInfo.role_id)"
          prop="info"
          label="功能描述"
          align="left"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="" label="必配" align="left" width="60">
          <template #default="scope">
            <!-- <span v-show="editStatus === 0">{{ scope.row.must === 1 ? '必配' : '选配' }}</span> -->
            <div class="mycheckBox" @click="editStatus === 1 ? (scope.row.must = 1) : ''">
              <span class="mycheck" :class="{ hasBg: scope.row.must == 1 }"></span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="" label="选配" align="left" width="60">
          <template #default="scope">
            <!-- <span v-show="editStatus === 0">{{ scope.row.must === 1 ? '必配' : '选配' }}</span> -->
            <div class="mycheckBox" @click="editStatus === 1 ? (scope.row.must = 2) : ''">
              <span class="mycheck" :class="{ hasBg: scope.row.must == 2 }"></span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="" label="数量范围" align="left" :width="200">
          <template #default="scope">
            <el-input
              v-show="editStatus === 1"
              class="scope-input"
              v-model.number="scope.row.min_total"
              oninput="value=value.replace(/[^\d]+/g,'');if(value>1000) value=1000;if(value<=0) value=1"
            ></el-input>
            <span v-show="editStatus === 1">~</span>
            <el-input
              v-show="editStatus === 1"
              class="scope-input"
              v-model.number="scope.row.max_total"
              oninput="value=value.replace(/[^\d]+/g,'');if(value>1000) value=1000;if(value<=0) value=1"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column v-if="[1].includes(store.state.login.userInfo.role_id)" prop="" label="现存数量" align="left">
          <template #default="scope">
            <span>{{ scope.row.total }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="![1, 2].includes(store.state.login.userInfo.role_id)"
          prop=""
          label="操作"
          width="200"
          align="center"
        >
          <template #default="scope">
            <div class="click-box">
              <span
                v-show="editStatus === 1"
                class="click-text"
                style="color: red"
                @click="deleteItem(1, scope.row, scope.$index)"
              >
                删除
              </span>
              <span v-show="editStatus === 1 && scope.row.id">&nbsp;&nbsp;</span>
              <span v-show="scope.row.id" class="click-text" @click="getItemDetail(scope.row.id)">查看详情</span>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column width="100" align="left" v-if="editStatus === 1">
          <template #default>
            <img src="@/assets/images/common/listChange.png" alt="" class="move-icon" />
           </template>
        </el-table-column> -->
      </el-table>
      <div>
        <el-pagination
          v-if="editStatus === 0"
          class="pagination"
          v-model:currentPage="tableCurrentPage"
          v-model:page-size="pageSize"
          :page-sizes="[20, 50, 100, 200]"
          :pager-count="3"
          @size-change="handleSizeChange"
          background
          layout="total, prev, pager, next, jumper,sizes"
          :total="tableTotal"
        ></el-pagination>

        <el-pagination
          v-if="editStatus === 1"
          class="pagination"
          v-model:currentPage="tableCurrentPageEdit"
          :pageSize="pageSize"
          background
          layout="total, prev, pager, next, jumper"
          :total="tableData.length"
        ></el-pagination>
      </div>
      <div class="mask" v-if="loading"></div>
      <div class="progressFixed" v-if="loading">
        <el-progress :text-inside="true" :stroke-width="15" :percentage="percentage" status="success" />
        <div class="desc">正在导入中，请勿操作当前页面~</div>
      </div>
    </div>
    <el-dialog custom-class="cd-detail-dialog" v-model="detailShow" title="详情" width="50%">
      <div class="left-box">
        <p>
          <span>分类编号：</span>
          <span>{{ detailObj.number }}</span>
        </p>
        <p>
          <span>名称：</span>
          <span>{{ detailObj.name }}</span>
        </p>
        <p>
          <span>规格型号：</span>
          <span>{{ detailObj.specification }}</span>
        </p>
        <p>
          <span>分类：</span>
          <span v-for="(item, index) in detailObj.category" :key="index">{{ item.title }}&nbsp;</span>
        </p>
        <p>
          <span>价值分类：</span>
          <span>{{ detailObj.type === 1 ? '低值易耗' : '非低值易耗' }}</span>
        </p>
        <p>
          <span>单位：</span>
          <span>{{ detailObj.unit }}</span>
        </p>
        <p>
          <span>功能描述：</span>
          <span>{{ detailObj.info }}</span>
        </p>
        <p>
          <span>使用年限：</span>
          <span>{{ detailObj.number_year }}</span>
        </p>
        <p>
          <span>标准：</span>
          <span>{{ detailObj.norm }}</span>
        </p>
      </div>
      <div class="right-box">
        <p>
          <span>设备照片：</span>
          <img :src="detailObj.picture" alt="" />
        </p>
        <p>
          <span>上次编辑时间：</span>
          <span>{{ detailObj.update_time }}</span>
        </p>
        <p>
          <span>上次编辑人：</span>
          <span>{{ detailObj.username }}</span>
        </p>
      </div>
      <!-- <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailShow = false">取消</el-button>
          <el-button type="primary" @click="sureClick()">确认</el-button>
        </span>
      </template> -->
    </el-dialog>
    <el-drawer v-model="drawer" title="添加仪器">
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
        @selection-change="handleSearchTableDataChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column property="number" label="仪器编号：" />
        <el-table-column property="name" label="名称：" show-overflow-tooltip />
        <!-- <el-table-column property="info" label="功能描述：" show-overflow-tooltip /> -->
        <el-table-column property="specification" label="规格型号：" show-overflow-tooltip />
      </el-table>
      <el-pagination
        class="pagination"
        v-model:currentPage="currentPage"
        :page-size="15"
        pager-count="3"
        @current-change="handleCurrentChange"
        background
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <div class="sure-btn">
        <div class="btn btn-white" @click="close">关闭</div>
        <div class="btn" @click="addSureClick">确认</div>
      </div>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, reactive, toRefs, onUnmounted, nextTick, computed, watch, onMounted } from 'vue'

import { ElMessage, ElMessageBox } from 'element-plus'

import {
  tracksInstrumentList,
  instrumentStandardSave,
  instrumentStandardCached,
  instrumentStandardDel,
  instrumentStandardDetail,
  railImport
} from '@service/laboratory-standard/equipped-standard/index'
import axios from 'axios'
import localCache from '@/utils/localCache'
import { getAll } from '@service/equiment-standard/type-manage/index'
import { ConfigList, EditList } from '@service/laboratory-standard/equipped-standard/types'
import { getBaseInstrument } from '@service/equiment-standard/base-message/index'
import { ListData } from '@service/equiment-standard/base-message/types'
import { BASE_URL } from '@service/request/config'
import Sortable from 'sortablejs'
import { useStore } from '@store/index'
// import { inputAdjust } from '@/utils/common'

const activeName = ref(0)
const tabList1 = ref([
  {
    label: '表1：物理配备标准',
    id: 1
  },
  {
    label: '表2：化学配备标准',
    id: 2
  },
  {
    label: '表3：生物配备标准',
    id: 3
  }
])
const tabList2 = ref([
  {
    label: '表1：小学科学配备标准',
    id: 4
  }
])
const handleLiClick = (index: number, item: any) => {
  if (editStatus.value === 1) {
    ElMessage({
      message: '编辑状态下无法切换学科',
      type: 'warning'
    })
  } else {
    activeName.value = index
    selectObj.value.subject_id = item.id
    // getDetail()
    changeEditStatus(0)
  }
}
interface SearchFormtype {
  number: string
  name: string
  category: string[]
  is_must?: number | string
}
const searchForm = ref<SearchFormtype>({
  number: '',
  name: '',
  category: []
  // is_must: 0
})
const casProps = {
  value: 'id',
  label: 'title',
  emitPath: false,
  multiple: true,
  checkStrictly: true
}
const categoryOptions = ref<any>([])
const equipmentTypeOptions = ref([
  {
    label: '必配',
    id: 1
  },
  {
    label: '选配',
    id: 2
  }
])
const getAllType = () => {
  getAll().then((res) => {
    categoryOptions.value = res.data
    // categoryOptions.value = getTreeData(res.data)
  })
}
const getTreeData = (data: any[]) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].children.length < 1) {
      // children若为空数组，则将children设为undefined
      data[i].children = undefined
    } else {
      // children若不为空数组，则继续 递归调用 本方法
      getTreeData(data[i].children)
    }
  }
  return data
}
getAllType()
const search = () => {
  changeEditStatus(0)
}
const multipleSelection = ref<any>([])
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val
  console.log('12212', multipleSelection.value)
}

const batchDelete = () => {
  if (multipleSelection.value.length === 0) {
    ElMessage.warning('请选择要删除的数据')
    return
  }
  deleteItem(0, '', 0)
  // multipleSelection.value = val
}
//抽屉数据
let drawer = ref(false)
const batchAdd = () => {
  drawer.value = true
  getSearchData(1, currentPage.value, searchInput.value)
}
// 添加仪器
const addIns = () => {
  thisPageData()
  tableData.value.splice((tableCurrentPageEdit.value - 1) * pageSize.value, 0, { name: '' })
  tableDataOnePage.value = []
  thisPageData()
}

const thisPageData = () => {
  if (tableDataOnePage.value.length !== 0) {
    tableData.value.splice((tableCurrentPageEdit.value - 1) * pageSize.value, pageSize.value, ...tableDataOnePage.value)
  }
  tableDataOnePage.value = JSON.parse(
    JSON.stringify(
      tableData.value.slice(
        (tableCurrentPageEdit.value - 1) * pageSize.value,
        tableCurrentPageEdit.value * pageSize.value
      )
    )
  )
  tableLoading.value = false
}

const numberChange = (val: any) => {
  getSearchData(1, currentPage.value, val)
}
const numberFocus = () => {
  getSearchData(1, currentPage.value, '')
}
const selclick = (index: any, item: any) => {
  // let flag = tableData.value.some((e) => {
  //   return item.number === e.number
  // })
  // if (!flag) {
  let arr = Array<{ title: string }>()
  item.cat_titles?.split(',').forEach((e: any) => {
    arr.push({ title: e })
  })
  let row = {
    ...item,
    id: 0,
    min_total: 1,
    max_total: 10,
    cost_name: arr,
    type: item.type.value,
    cost_type: item.cost_type.value,
    must: item.is_must.value
  }
  tableDataOnePage.value[index] = row
  // } else {
  //   ElMessage({
  //     message: '所选分类已存在,不可重复添加！',
  //     type: 'error'
  //   })
  // }
}
const searchInput = ref('')
const searchTableDataSelection = ref<any>([])
const handleSearchTableDataChange = (val: any) => {
  searchTableDataSelection.value = val
  // console.log('12212', searchTableDataSelection.value)
}
// const delRepeat = (arr: Array) => {
//   for (var i = 0; i < arr.length - 1; i++) {
//     for (var j = i + 1; j < arr.length; j++) {
//       if (arr[i].name == arr[j].name) {
//         arr.splice(j, 1)
//         j--
//       }
//     }
//   }
// }
const close = () => {
  drawer.value = false
}
const addSureClick = () => {
  let arrdd: any = []
  for (let i = 0; i < searchTableDataSelection.value.length; i++) {
    // let flag = tableData.value.some((item) => {
    //   return item.number === searchTableDataSelection.value[i].number
    // })
    // if (flag) {
    //   ElMessage({
    //     message: '所选分类已存在,不可重复添加！',
    //     type: 'error'
    //   })
    //   return
    // }
    let arr = Array<{ title: string }>()
    searchTableDataSelection.value[i].cat_titles?.split(',').forEach((e: any) => {
      arr.push({ title: e })
    })
    // console.log(1111, arr)
    arrdd.push({
      ...searchTableDataSelection.value[i],
      id: 0,
      min_total: 1,
      max_total: 10,
      cost_name: arr,
      type: searchTableDataSelection.value[i].type.value,
      cost_type: searchTableDataSelection.value[i].cost_type.value,
      must: searchTableDataSelection.value[i].is_must.value
    })
  }
  thisPageData()

  tableData.value.splice((tableCurrentPageEdit.value - 1) * pageSize.value, 0, ...arrdd)
  tableDataOnePage.value = []
  thisPageData()

  drawer.value = false
}
const props = defineProps({ item: { type: Object, required: true } })
const store = useStore()
let optionsSelect = [...store.state.common.subjectArr]

let dataMap = reactive({
  tableData: Array<ConfigList>(),
  tableDataOnePage: Array<ConfigList>(),
  searchTableData: Array<ListData>(),
  currentPage: 1,
  total: 0,
  inputSearch: '',
  detailShow: false,
  selectObj: {
    subject_id: props.item?.learning_info[0].id !== 1 ? 1 : 4,
    type: ''
  },
  detailObj: {
    id: 0,
    info: '',
    is_must: 0,
    name: '',
    norm: '',
    number: '',
    picture: '',
    specification: '',
    type: 0,
    unit: '',
    number_year: 0,
    category: [{ title: '' }],
    update_time: '',
    username: ''
  },
  deleteList: Array<ConfigList>()
})

let {
  tableData,
  tableDataOnePage,
  searchTableData,
  currentPage,
  total,
  inputSearch,
  detailShow,
  selectObj,
  detailObj,
  deleteList
} = toRefs(dataMap)
let summary = ref({
  max_count: 0,
  min_count: 0,
  must_count: 0,
  not_must_count: 0,
  number_count: 0
})

let loading = ref(false)
let tableLoading = ref(false)
let tableCurrentPage = ref(1)
let tableCurrentPageEdit = ref(1)
let pageSize = ref(20)
let tableTotal = ref(0)
const getDetail = (val: boolean) => {
  tableLoading.value = true
  console.log('🚀 ~ file: config-detail.vue:774 ~ getDetail ~ tableLoading.value:', tableLoading.value)
  if (searchForm.value.is_must === '') delete searchForm.value.is_must
  let params: any = {
    need_page: val,
    page: tableCurrentPage.value,
    page_size: pageSize.value,
    rail_id: props.item.id,
    ...selectObj.value,
    ...searchForm.value
  }
  // if (val) {
  //   params['need_cache'] = val
  // }
  tracksInstrumentList(params)
    .then((res: any) => {
      tableData.value = res.data.data
      tableTotal.value = res.data.count
      summary.value = res.data.summary
      if (editStatus.value === 1) {
        tableDataOnePage.value = []
        thisPageData()
      }
    })
    .finally(() => {
      tableLoading.value = false
    })
}
getDetail(true)
const isSave = ref(true)
const getInstrumentStandardCached = async (val: number, count = 0) => {
  getDetail(false)

  // let arr: any = []
  // for (let i = 0; i < tableData.value.length; i++) {
  //   let obj = {
  //     ...tableData.value[i],
  //     subject_id: selectObj.value.subject_id,
  //     rail_id: props.item.id,
  //     is_must: tableData.value[i].must
  //   }
  //   arr.push(obj)
  // }
  // const { code } = await instrumentStandardCached({
  //   data: arr,
  //   page: val,
  //   subject_id: selectObj.value.subject_id,
  //   rail_id: props.item.id
  // })
  // if (code === 10) {
  //   isSave.value = true
  //   if (count !== 0) {
  //     getDetail(false)
  //   }
  // } else {
  //   isSave.value = false
  //   getDetail(false)
  // }
}
// getInstrumentStandardCached(tableCurrentPage.value, 1)
watch(
  () => tableCurrentPage.value,
  async (newVal, oldVal) => {
    // await getInstrumentStandardCached(oldVal)
    getDetail(true)
  }
)
watch(
  () => tableCurrentPageEdit.value,
  (newVal, oldVal) => {
    // await getInstrumentStandardCached(oldVal)
    tableLoading.value = true
    tableData.value.splice((oldVal - 1) * pageSize.value, pageSize.value, ...tableDataOnePage.value)
    tableDataOnePage.value = []

    thisPageData()
  }
)

// onMounted(() => {
//   document.getElementById('page1')?.addEventListener(
//     'click',
//     (e) => {
//       let isFlag = true
//       for (let i = 0; i < tableData.value.length; i++) {
//         if (!tableData.value[i].name) {
//           ElMessage({
//             message: '保存数据不能有空数据！',
//             type: 'warning'
//           })
//           isFlag = false
//           break
//         }
//         if (tableData.value[i].min_total > tableData.value[i].max_total) {
//           ElMessage({
//             type: 'warning',
//             message: '数量范围填写异常，无法缓存，范围最小值不能大于最大值！'
//           })
//           isFlag = false
//           break
//         }
//         if (tableData.value[i].must === 0) {
//           ElMessage({
//             type: 'warning',
//             message: '必配、选配不能为空，请检查！'
//           })
//           isFlag = false
//           break
//         }
//       }
//       if (!isFlag) {
//         e.stopPropagation()
//       }
//     },
//     true
//   )
// })

const handleSizeChange = () => {
  getDetail(true)
}

let editStatus = ref(0)
let subjectSelect = ref(null)

const changeEditStatus = (type: number) => {
  deleteList.value = []
  if (!selectObj.value.subject_id) {
    ElMessage({ type: 'info', message: '请选择学科后进行编辑' }), (subjectSelect.value as any).focus()
    return
  }
  editStatus.value = type
  // getInstrumentStandardCached(tableCurrentPage.value, 1)
  if (type === 1) {
    getDetail(false)

    tableCurrentPageEdit.value = 1
    // nextTick(() => {
    //   initDropTable()
    // })
  } else {
    tableData.value = []
    tableDataOnePage.value = []

    getDetail(true)
  }
}
// let computedTableData = computed(() => {
//   return JSON.parse(
//     JSON.stringify(tableData.value.slice((tableCurrentPageEdit.value - 1) * 10, tableCurrentPageEdit.value * 10))
//   )
// })

const dragTable = ref()
const initDropTable = () => {
  const el = dragTable.value.$el.querySelector('.el-table__body tbody')
  console.log(el)
  Sortable.create(el, {
    handle: '.move-icon', //设置指定列作为拖拽
    onEnd(evt: any) {
      const { newIndex, oldIndex } = evt
      let arr = JSON.parse(JSON.stringify(tableDataOnePage.value))
      console.log(newIndex)
      console.log(oldIndex)
      console.log(tableDataOnePage.value)
      const currRow = arr.splice(oldIndex, 1)[0]
      console.log(currRow)
      arr.splice(newIndex, 0, currRow)
      tableDataOnePage.value = []
      nextTick(() => {
        tableDataOnePage.value = JSON.parse(JSON.stringify(arr))
        thisPageData()
        console.log(tableData.value)
      })

      // sortIndex()
    }
  })
}
let containerLoading = ref(false)
const sureClick = async () => {
  containerLoading.value = true
  thisPageData()

  let arr = Array<EditList>()
  for (let i = 0; i < tableData.value.length; i++) {
    if (!tableData.value[i].name) {
      ElMessage({
        message: '保存数据不能有空数据！',
        type: 'warning'
      })
      containerLoading.value = false
      return
    }
    if (tableData.value[i].min_total > tableData.value[i].max_total) {
      ElMessage({
        type: 'warning',
        message: '数量范围填写异常，无法保存，范围最小值不能大于最大值！'
      })
      containerLoading.value = false
      return
    }
    if (tableData.value[i].must === 0) {
      ElMessage({
        type: 'warning',
        message: '必配、选配不能为空，请检查！'
      })
      containerLoading.value = false
      return
    }
    let obj = {
      ...tableData.value[i],
      subject_id: selectObj.value.subject_id,
      rail_id: props.item.id,
      is_must: tableData.value[i].must
    }
    arr.push(obj)
  }
  // console.log('qqqqq', arr)
  let delIds: any = []
  deleteList.value.forEach((e) => {
    delIds.push(e.id)
  })

  if (deleteList.value.length > 0) {
    instrumentStandardDel({ ids: delIds })
  }
  // await getInstrumentStandardCached(tableCurrentPage.value)
  if (isSave.value) {
    setTimeout(() => {
      instrumentStandardSave({ subject_id: selectObj.value.subject_id, rail_id: props.item.id, data: arr })
        .then((res) => {
          if (res.code === 10) {
            deleteList.value = []
            getDetail(true)
            editStatus.value = 0
            ElMessage({
              type: 'success',
              message: '保存成功'
            })
          }
        })
        .finally(() => {
          containerLoading.value = false
        })
    }, 500)
  }
}

const getSearchData = (explode: number, page: number, name_or_number: string) => {
  getBaseInstrument({
    explode,
    page,
    name_or_number
  }).then((res) => {
    searchTableData.value = res.data.data
    total.value = res.data.total
  })
}

const handleCurrentChange = () => {
  getSearchData(1, currentPage.value, searchInput.value)
}

const deleteItem = (key: number, val: any = '', index: number) => {
  // deleteList.value = []
  ElMessageBox.confirm('确认删除?删除会删除所选数据，删除后可以通过添加仪器，重新添加。', '', {
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
    .then(() => {
      thisPageData()
      if (key === 0) {
        multipleSelection.value.forEach((item: any) => {
          if (item.id !== 0) {
            deleteList.value.push(item)
          }
          for (let i = 0; i < tableData.value.length; i++) {
            if (item.number === tableData.value[i].number) {
              tableData.value.splice(i, 1)
              return
            }
          }
        })
      } else {
        if (val.id !== 0 && val.number) {
          deleteList.value.push(val)
        }
        tableData.value.splice((tableCurrentPageEdit.value - 1) * pageSize.value + index, 1)
      }
      tableDataOnePage.value = []
      thisPageData()
    })
    .catch(() => {
      console.log()
    })
}

const getItemDetail = (id: number) => {
  detailShow.value = true
  instrumentStandardDetail({ id }).then((res) => {
    detailObj.value = res.data
  })
}
const downloadTem = () => {
  window.location.href = BASE_URL + '/template/区域名称_配备标准列表导入模版.xlsx'
  console.log('downloadTem')
}
const uploadFile: any = ref(null)
const importData = () => {
  uploadFile.value.value = null
  uploadFile.value.click()
}

const token = localCache.getCookie('swr_token')
const upFile = () => {
  axios
    .post(BASE_URL + '/schooldvc/railinstrumentstandard/export', {
      rail_id: props.item.id,
      subject_id: selectObj.value.subject_id,
      token
    })
    .then((res) => {
      // const blob = new Blob([res.data]) //处理文档流
      const subjectArr = ['物理', '化学', '生物']
      const fileName = `${subjectArr[activeName.value]}配备标准列表.xlsx`
      const elink = document.createElement('a')
      elink.download = fileName
      elink.style.display = 'none'
      elink.href = res.data
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href) // 释放URL 对象
      document.body.removeChild(elink)
    })
}

let percentage = ref(0)
const time = ref<any>(null)
const hasUpload = () => {
  percentage.value = 0
  loading.value = true
  time.value = setInterval(() => {
    if (percentage.value < 99) {
      percentage.value += 1
    }
  }, 20)
  let file = uploadFile.value.files[0]
  let form: any = new FormData()
  form.append('subject_id', selectObj.value.subject_id)
  form.append('rail_id', props.item.id)
  form.append('excel_file', file)

  railImport(form)
    .then((res) => {
      loading.value = false
      clearInterval(time.value)
      if (res.code === 10) {
        ElMessage({ type: 'success', message: '导入成功' })
        getDetail(false)
      } else if (res.code === '555') {
        ElMessage({ type: 'error', message: '数据重复，请查看反馈表格' })
        // const blob = new Blob([res.data]) //处理文档流
        const fileName = '导入错误数据.xlsx'
        const elink = document.createElement('a')
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = res.data
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href) // 释放URL 对象
        document.body.removeChild(elink)
        getDetail(false)
      }
    })
    .catch((error) => {
      clearInterval(time.value)
      console.log('err', error)
      loading.value = false
    })
}
onUnmounted(() => {
  clearInterval(time.value)
})
</script>

<style scoped lang="scss">
.title {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  padding: 0 30px;
  width: 100%;
  height: 50px;
  line-height: 60px;
  font-size: 20px;
  font-family: Microsoft YaHei;
  box-sizing: border-box;
  background: #dcece3;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);

  .text-box {
    flex: 1;
    display: flex;
    justify-content: left;
    color: #05c65d;

    .period {
      margin: 0 20px;
      font-weight: bold;
    }
  }

  .btn-box {
    position: absolute;
    right: 10px;
    width: 100%;
    display: flex;
    justify-content: flex-end;

    .btn {
      margin-left: 10px;
    }
  }
}

.select-box {
  display: flex;
  padding: 0 30px;
  width: 100%;
  height: 60px;
  line-height: 60px;
  box-sizing: border-box;
  background: #ffffff;

  p:nth-of-type(2) {
    margin-left: 20px;
  }

  :deep(.el-select) {
    .el-input__inner {
      width: 200px;
    }
  }
}

.content {
  margin-top: 10px;

  .click-box {
    color: #05c65d;

    .click-text {
      cursor: pointer;
    }
  }

  .mycheckBox {
    display: flex;
    justify-content: center;
    align-items: center;

    .mycheck {
      width: 20px;
      height: 20px;
      border: 1px solid #c9c7c7;
      background: #fff;
    }

    .hasBg {
      border: 0px solid #c9c7c7;
      background: #fff url('../../../assets/images/common/check.png');
    }
  }

  .scope-input {
    width: 40%;
    // height: 24px;
    color: #05c65d;
  }

  input[type='checkbox'] {
    position: relative;
    width: 18px;
    height: 18px;
    font-size: 14px;
    border-radius: 3px;
    cursor: pointer;
  }

  input[type='checkbox']::after {
    position: absolute;
    top: 0;
    color: #000;
    width: 18px;
    height: 18px;
    display: inline-block;
    visibility: visible;
    padding-left: 0px;
    text-align: center;
    content: ' ';
    border-radius: 3px;
  }

  input[type='checkbox']:checked::after {
    content: ' ';
    color: #fff;
    font-size: 12px;
    font-weight: bold;
    border-radius: 3px;
    background: #fff url('../../../assets/images/common/check.png');
    background-size: cover;
  }
}

.add-input {
  text-align: left;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  :deep(.el-input) {
    width: 300px;
  }

  .search-div {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 5px 0;
    width: 30px;
    height: 30px;
    background: #05c65d;
    cursor: pointer;
  }

  & > p {
    margin-left: 20px;
    color: red;
  }
}

footer {
  margin-top: 20px;
  text-align: right;
}

:deep(.cd-detail-dialog) {
  .el-dialog__body {
    border-top: #05c65d 1px solid;
    box-sizing: border-box;
    display: flex;
    text-align: left;

    .left-box,
    .right-box {
      flex: 1;

      & > p {
        font-size: 16px;
        padding-left: 80px;

        span {
          display: inline-block;
          height: 40px;
        }

        span:nth-of-type(1) {
          width: 120px;
          color: #848484;
        }

        img {
          margin-bottom: 20px;
          vertical-align: top;
          width: 200px;
          height: 114px;
        }
      }
    }

    .right-box {
      flex: 1;
    }
  }
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

.btn-white {
  color: #05c65d;
  border: 1px solid #05c65d;
  background: #f3f3f3;
}

.btn-gray {
  color: #fff;
  border: 1px solid #b5b5b5;
  background: #b5b5b5;
}

.green {
  color: #05c65d;
}

.yellow {
  color: #ec8c42;
}

.tabs {
  display: flex;
  background-color: #fff;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
  cursor: pointer;

  .tab-item {
    flex: 1;
    height: 50px;
    line-height: 50px;
    font-size: 20px;
    font-weight: bold;
    > p {
      width: 220px;
      height: 50px;
      margin: 0 auto;
      box-sizing: border-box;
    }
  }

  .tab-active {
    color: #05c65d;
    border-bottom: 6px solid #05c65d;
  }
}

.screen {
  display: flex;
  align-items: center;
  width: 100%;
  height: 60px;
  background-color: #fff;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
  margin-top: 10px;

  .el-form-item {
    margin-bottom: 0;
  }
}

.total {
  height: 30px;
  line-height: 30px;
  text-align: right;
  margin-top: 10px;
}

::v-deep .el-drawer__header {
  margin-bottom: 0;
}

::v-deep .el-drawer__body {
  overflow: auto;
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
.sure-btn {
  display: flex;
  justify-content: space-evenly;
  .btn {
    width: 100px;
    height: 35px;
    line-height: 35px;
  }
}
.btns {
  display: flex;
  justify-content: center;
  align-items: center;
  .btn {
    width: 100px;
    margin: 10px;
  }
}
.desc {
  width: 100%;
  text-align: center;
  font-size: 28px;
  color: #fff;
  margin-top: 10px;
}
.mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999999;
}
.progressFixed {
  position: fixed;
  z-index: 1000000;
  top: 45%;
  width: 80%;
}
.countColor {
  color: #05c65d;
}
.pagination {
  margin: 10px 0;
  text-align: right;
}
.move-icon {
  cursor: pointer;
  float: right;
  margin: 3px 28px;
  width: 24px;
  height: 24px;
}
</style>
