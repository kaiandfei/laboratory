<template>
  <div>
    <header>
      <div class="fl">
        <span>{{ route.meta.name }}管理</span>
        <el-icon><arrow-right /></el-icon>
        <span>教学{{ route.meta.type === 1 ? '仪器' : '设备' }}分类账</span>
      </div>
    </header>
    <div class="searchArea">
      <div class="nav">
        <div class="name">学科：</div>
        <div class="search">
          <el-select v-model="searchObj.subject_id" clearable :disabled="!!store.state.login.userInfo.subject_id">
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </div>
      </div>
      <div class="nav">
        <div class="name">{{ route.meta.type === 1 ? '学校编号：' : '资产编号：' }}</div>
        <div class="search">
          <el-input v-model="searchObj.asset_number"></el-input>
        </div>
      </div>
      <div class="nav">
        <div class="name">分类编号：</div>
        <div class="search">
          <el-input v-model="searchObj.number"></el-input>
        </div>
      </div>
      <!-- <div class="nav">
        <div class="name">类型：</div>
        <div class="search">
          <el-select v-model="searchObj.types" clearable>
            <el-option
              v-for="item in [
                { id: 1, name: '非亏损数据' },
                { id: 2, name: '亏损数据' }
              ]"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
      </div> -->
      <div class="buttonArea" @click="search()"><img src="@assets/images/common/search.png" alt="" /></div>
      <div v-if="[1, 2].includes(store.state.login.userInfo.role_id)" class="buttonArea text" @click="exportExcel()">
        导出
      </div>
    </div>
    <div class="dataArea" :class="{ hasHeight: !showMore }">
      <div class="nav" v-for="(item, index) in statisticalList" :key="index">
        <div class="title" :title="item.title">{{ item.title }}</div>
        <div class="valueArea">
          <div class="value">
            <span>总件数：</span>
            {{ Math.abs(item.total || 0) + '件' }}
          </div>
          <div class="value">
            <span>总价值：</span>
            {{ Math.abs(item.allPrice || 0) + '元' }}
          </div>
        </div>
      </div>
      <div v-if="statisticalList.length > 5" class="more" @click="showMore = !showMore">
        {{ !showMore ? '查看' : '收起' }}更多
      </div>
    </div>
    <div class="tableArea">
      <el-table
        :data="baseData.data"
        style="width: 100%"
        :header-cell-style="{
          padding: '4px 0',
          borderLeft: '1px solid #05c65d',
          borderBottom: '1px solid #05c65d',
          background: '#EFEFEF',
          color: '#000'
        }"
        :cell-style="{ background: '#ffffff', borderBottom: '1px solid #EFEFEF' }"
        default-expand-all
        @sort-change="sortChange"
      >
        <el-table-column
          label="分类编号"
          prop="number"
          sortable="custom"
          show-overflow-tooltip
          width="110"
        ></el-table-column>
        <el-table-column
          :label="route.meta.type === 1 ? '学校编号' : '资产编号'"
          prop="asset_number"
          sortable="custom"
          show-overflow-tooltip
          width="110"
        ></el-table-column>
        <el-table-column label="名称" prop="school_instrument_name" show-overflow-tooltip></el-table-column>
        <el-table-column label="规格" prop="specification" show-overflow-tooltip></el-table-column>
        <el-table-column label="单位" prop="unit"></el-table-column>
        <el-table-column
          label="时间"
          prop="create_time"
          show-overflow-tooltip
          sortable="custom"
          width="160"
        ></el-table-column>
        <el-table-column
          label="凭证号"
          prop="voucher_number"
          show-overflow-tooltip
          sortable="custom"
          width="100"
        ></el-table-column>
        <el-table-column label="摘要" prop="source">
          <template #default="scope">
            {{
              ['期初建账', '集采', '自制', '馈赠', '自购', '调拨', '盘点', '损耗报废', '损坏赔偿', '变卖登记'][
                scope.row.source
              ]
            }}
          </template>
        </el-table-column>
        <el-table-column label="产地" prop="factory" show-overflow-tooltip></el-table-column>
        <el-table-column label="增加" align="center">
          <el-table-column label="单价" prop="unit_price">
            <template #default="scope">
              <div>
                {{ scope.row.total >= 0 ? scope.row.unit_price : '/' }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="数量" prop="total">
            <template #default="scope">
              <div>
                {{ scope.row.total >= 0 ? scope.row.total : '/' }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="金额" prop="">
            <template #default="scope">
              <div>
                {{ scope.row.total >= 0 ? (scope.row.unit_price * scope.row.total).toFixed(2) : '/' }}
              </div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="减少" align="center">
          <el-table-column label="单价" prop="">
            <template #default="scope">
              <div>
                {{ !(scope.row.total >= 0) ? scope.row.unit_price : '/' }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="数量" prop="">
            <template #default="scope">
              <div>
                {{ !(scope.row.total >= 0) ? Math.abs(scope.row.total) : '/' }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="金额" prop="">
            <template #default="scope">
              <div>
                {{ !(scope.row.total >= 0) ? Math.abs(scope.row.unit_price * scope.row.total).toFixed(2) : '/' }}
              </div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="结余" align="center">
          <el-table-column label="数量" prop="total_now" sortable="custom">
            <template #default="scope">
              {{ route.meta.type === 1 || scope.row.total >= 0 ? scope.row.total_now : 0 }}
            </template>
          </el-table-column>
          <el-table-column label="金额" prop="total_price" sortable="custom">
            <template #default="scope">
              <div>
                {{
                  route.meta.type === 1 || scope.row.total >= 0
                    ? parseInt(scope.row.unit_price || 0) * scope.row.total_now
                    : 0
                }}
              </div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="操作人" prop="user_name" show-overflow-tooltip width="100"></el-table-column>
        <el-table-column label="存放位置" prop="location" show-overflow-tooltip width="150"></el-table-column>
      </el-table>
    </div>
    <div class="pageValue">
      <el-pagination
        background
        layout="sizes, total, prev, pager, next, jumper"
        v-model:currentPage="searchObj.page"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :page-sizes="[10, 20, 50, 100, 200]"
        v-model:page-size="searchObj.size"
        :total="searchObj.total"
      ></el-pagination>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { toRefs, reactive, watch, ref } from 'vue'
import { onBeforeRouteLeave, useRoute } from 'vue-router'

import { ArrowRight } from '@element-plus/icons-vue'

import { getClassify, getClassifyStatistical } from '@service/instrument-manage/ledger/index'
import { SearchForm, LedgerListData, LedgerStatistical } from '@service/instrument-manage/ledger/types'
import localCache from '@/utils/localCache'
import axios from 'axios'
import { useStore } from '@/store'
let route = useRoute()

let store = useStore()
let options = [...store.state.common.subjectArr]

const dataMap: any = reactive({
  baseData: LedgerListData,
  statisticalList: Array<LedgerStatistical>(),
  searchObj: {
    page: 1,
    size: 10,
    total: 0,
    number: '',
    classify: '',
    types: 1,
    asset_number: '',
    subject_id: store.state.login.userInfo.subject_id || '',
    type: route.meta.type as number
  },
  showMore: false
})
let sortData: any = reactive({})

let { baseData, statisticalList, searchObj, showMore } = toRefs(dataMap)

const getData = (data: SearchForm) => {
  let params = { ...data, ...sortData }
  getClassify(params).then((res) => {
    baseData.value = res.data
    searchObj.value.total = res.data.total
  }),
    getClassifyStatistical({
      type: data.type,
      types: data.types,
      number: data.number,
      asset_number: data.asset_number,
      subject_id: data.subject_id
    }).then((res) => {
      statisticalList.value = res.data
    })
}

getData(searchObj.value)

const exportExcel = () => {
  const token = localCache.getCookie('swr_token')
  axios
    .post(
      process.env.VUE_APP_BASE_URL_BASE + '/schooldvc/SchoolGeneralLedger/classify',
      { token, ...searchObj.value, ...sortData, is_explode: 1 },
      { responseType: 'blob' }
    )
    .then((res) => {
      const blob = new Blob([res.data]) // 处理文档流
      const fileName =
        store.state.login.userInfo.school.name +
        '-' +
        '教学' +
        (route.meta.type === 1 ? '仪器' : '设备') +
        '分类账.xlsx'
      const elink = document.createElement('a')
      elink.download = fileName
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href) // 释放URL 对象
      document.body.removeChild(elink)
    })
}

const stopWatch = watch(
  () => {
    return route.meta.type
  },
  () => {
    searchObj.value.type = route.meta.type as number
    getData(searchObj.value)
  }
)

onBeforeRouteLeave((to) => {
  console.log('🚀 ~ file: index.vue:278 ~ onBeforeRouteLeave ~ to:', to)
  console.log(2233)
  if (!/typeLedger/.test(to.path)) {
    stopWatch()
  }
})

const search = () => {
  getData(searchObj.value)
}

const handleCurrentChange = () => {
  getData(searchObj.value)
}
const handleSizeChange = (val: number) => {
  searchObj.value.size = val
  getData(searchObj.value)
}
const sortChange = ({ column, prop, order }) => {
  if (prop !== null) {
    sortData = {}
    if (order === 'descending') {
      sortData[`order_${prop}`] = 2
    } else {
      sortData[`order_${prop}`] = 1
    }
    search()
    console.log(column, prop, order)
  }
}
</script>
<style lang="scss" scoped>
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
    .title-cancel {
      cursor: pointer;
    }
    .cancel {
      margin-left: 10px;
    }
  }
  .fr {
    cursor: pointer;
  }
}
.searchArea {
  margin: 10px 0 20px 0;
  width: 100%;
  height: 80px;
  float: left;
  background: #fff;
  .nav {
    width: 22%;
    height: 100%;
    float: left;
    display: flex;
    align-items: center;
    justify-content: center;
    .name {
      width: 30%;
      height: 40px;
      line-height: 40px;
      float: left;
      text-align: right;
      color: #848484;
    }
    .search {
      width: 70%;
      height: 100%;
      float: right;
      display: flex;
      align-items: center;
      justify-content: center;
      :deep(.el-input) {
        // width: 90%;
        .el-input__inner {
          width: 100%;
        }
      }
    }
  }
  .buttonArea {
    float: left;
    height: 30px;
    width: 40px;
    margin: 25px 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #05c65d;
    cursor: pointer;
  }
  .text {
    padding: 4px 0;
    width: 60px;
    border-radius: 6px;
    color: #fff;
    box-sizing: border-box;
  }
}
.dataArea {
  width: 100%;
  float: left;
  margin-bottom: 20px;
  position: relative;
  .nav {
    width: 17%;
    height: 112px;
    float: left;
    margin: 0 3% 10px 0;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
    background: #ffffff;
    .title {
      width: 100%;
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-size: 20px;
      // display: flex;
      // justify-content: center;
      // align-items: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      background: #dcece3;
      color: #05c65d;
      font-weight: bold;
    }
    .valueArea {
      width: 100%;
      height: 72px;
      .value {
        width: 100%;
        height: 30px;
        line-height: 40px;
        text-align: left;
        & > span {
          text-align: right;
          display: inline-block;
          width: 45%;
          color: #848484;
        }
      }
    }
  }
  .more {
    position: absolute;
    top: 0;
    right: 1px;
    width: 24px;
    height: 112px;
    background: rgba(220, 236, 227, 0.39);
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
    color: #05c65d;
    font-weight: 400;
    font-size: 16px;
    border-radius: 10px;
    text-align: center;
    writing-mode: vertical-lr;
    z-index: 999;
    cursor: pointer;
  }
}

.hasHeight {
  max-height: 116px;
  overflow-y: hidden;
}

.tableArea {
  width: 100%;
  float: left;
  height: 60%;
}

.pageValue {
  float: right;
  text-align: right;
  margin: 20px 0;
}
</style>
