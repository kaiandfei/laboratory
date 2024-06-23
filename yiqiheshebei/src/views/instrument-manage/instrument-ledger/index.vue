<template>
  <div>
    <header>
      <div class="fl">
        <span>{{ route.meta.name }}管理</span>
        <el-icon><arrow-right /></el-icon>
        <span @click="detailShow = false">教学{{ route.meta.type === 1 ? '仪器' : '设备' }}总账</span>
        <el-icon v-show="detailShow"><arrow-right /></el-icon>
        <span v-show="detailShow">明细</span>
      </div>
      <div v-show="detailShow" class="fr" @click="cancel">
        <img src="@assets/images/laboratory-standard/cancel.png" alt="" />
        <span class="cancel">返回</span>
      </div>
    </header>
    <div v-show="!detailShow">
      <div class="searchArea">
        <div class="nav">
          <div class="name">分类：</div>
          <div class="search">
            <el-cascader
              v-model="searchObj.classify"
              :options="optionType"
              :props="casProps"
              :show-all-levels="false"
              style="width: 100%"
            ></el-cascader>
            <!-- <el-select v-model="searchObj.classify" placeholder="">
              <el-option v-for="item in optionType" :key="item.id" :label="item.title" :value="item.id"></el-option>
            </el-select> -->
          </div>
        </div>
        <div class="nav">
          <div class="name">学科：</div>
          <div class="search">
            <el-select
              v-model="searchObj.subject_id"
              placeholder=""
              :disabled="!!store.state.login.userInfo.subject_id"
            >
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
        <div class="buttonArea" @click="search()"><img src="@assets/images/common/search.png" alt="" /></div>
        <div v-if="[1, 2].includes(store.state.login.userInfo.role_id)" class="buttonArea text" @click="exportExcel()">
          导出
        </div>
      </div>
      <div class="dataArea" :class="{ hasHeight: !showMore }">
        <div class="nav" v-for="(item, index) in statisticalList" :key="index">
          <div class="title">{{ item.year }}</div>
          <div class="valueArea">
            <div class="value">
              <span>总件数：</span>
              {{ (item.total || 0) + '件' }}
            </div>
            <div class="value">
              <span>总价值：</span>
              {{ (item.price || 0) + '元' }}
            </div>
          </div>
        </div>
        <div v-if="statisticalList.length > 5" class="more" @click="showMore = !showMore">
          {{ !showMore ? '查看' : '收起' }}更多
        </div>
      </div>
      <div class="tableArea">
        <el-table
          :data="returnData.data"
          style="width: 100%"
          :header-cell-style="{
            padding: 0,
            borderLeft: '1px solid #05c65d',
            borderBottom: '1px solid #05c65d',
            background: '#EFEFEF',
            color: '#000'
          }"
          :cell-style="{ background: '#ffffff', borderBottom: '1px solid #EFEFEF' }"
          default-expand-all
          @sort-change="sortChange"
        >
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column
            prop="asset_number"
            :label="route.meta.type === 1 ? '学校编号' : '资产编号'"
            sortable="custom"
            show-overflow-tooltip
            width="110"
          ></el-table-column>
          <el-table-column
            prop="number"
            label="分类编号"
            show-overflow-tooltip
            sortable="custom"
            width="110"
          ></el-table-column>
          <el-table-column prop="name" label="名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="specification" label="规格" show-overflow-tooltip></el-table-column>
          <el-table-column prop="unit" label="单位"></el-table-column>
          <el-table-column :label="`${Number(returnData.year)}年`" align="center">
            <el-table-column label="现有数" align="center">
              <el-table-column prop="last_year_total" label="数量" sortable="custom">
                <template #default="scope">
                  <span>{{ scope.row?.last_year?.total ? scope.row?.last_year?.total : 0 }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="last_year_unit_price" label="金额" sortable="custom">
                <template #default="scope">
                  <span>{{ scope.row?.last_year?.unit_price ? scope.row?.last_year?.unit_price : 0 }}</span>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table-column>
          <el-table-column :label="`${Number(returnData.year) - 1}年12月`" align="center">
            <el-table-column label="增（减）" align="center">
              <el-table-column label="数量">
                <template #default="scope">
                  <span>
                    {{
                      scope.row?.last_year2?.total - scope.row?.last_year3?.total
                        ? scope.row?.last_year2?.total - scope.row?.last_year3?.total
                        : 0
                    }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="金额">
                <template #default="scope">
                  <span>
                    {{
                      scope.row?.last_year2?.unit_price - scope.row?.last_year3?.unit_price
                        ? scope.row?.last_year2?.total - scope.row?.last_year2?.total
                        : 0
                    }}
                  </span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="合计" align="center">
              <el-table-column prop="last_year2.total" label="数量">
                <template #default="scope">
                  <span>{{ scope.row?.last_year2?.total ? scope.row?.last_year2?.total : 0 }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="last_year2.unit_price" label="金额">
                <template #default="scope">
                  <span>{{ scope.row?.last_year2?.unit_price ? scope.row?.last_year2?.unit_price : 0 }}</span>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table-column>
          <el-table-column :label="`${Number(returnData.year) - 2}年12月`" align="center">
            <el-table-column label="增（减）" align="center">
              <el-table-column label="数量">
                <template #default="scope">
                  <span>
                    {{
                      scope.row?.last_year3?.total - scope.row?.last_year4?.total
                        ? scope.row?.last_year3?.total - scope.row?.last_year4?.total
                        : 0
                    }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="金额">
                <template #default="scope">
                  <span>
                    {{
                      scope.row?.last_year3?.unit_price - scope.row.last_year4?.unit_price
                        ? scope.row?.last_year3?.total - scope.row?.last_year4?.total
                        : 0
                    }}
                  </span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="合计" align="center">
              <el-table-column prop="last_year3.total" label="数量">
                <template #default="scope">
                  <span>{{ scope.row?.last_year3?.total ? scope.row?.last_year3?.total : 0 }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="last_year3.unit_price" label="金额">
                <template #default="scope">
                  <span>{{ scope.row?.last_year3?.unit_price ? scope.row?.last_year3?.unit_price : 0 }}</span>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table-column>
          <el-table-column :label="`${Number(returnData.year) - 3}年12月`" align="center">
            <el-table-column label="增（减）" align="center">
              <el-table-column label="数量">
                <template #default="scope">
                  <span>
                    {{
                      scope.row?.last_year4?.total - scope.row?.last_year5?.total
                        ? scope.row?.last_year4?.total - scope.row?.last_year5?.total
                        : 0
                    }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="金额">
                <template #default="scope">
                  <span>
                    {{
                      scope.row?.last_year4?.unit_price - scope.row?.last_year5?.unit_price
                        ? scope?.row.last_year4?.total - scope.row?.last_year5?.total
                        : 0
                    }}
                  </span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="合计" align="center">
              <el-table-column prop="last_year4.total" label="数量">
                <template #default="scope">
                  <span>{{ scope.row?.last_year4?.total ? scope.row?.last_year4?.total : 0 }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="last_year4.unit_price" label="金额">
                <template #default="scope">
                  <span>{{ scope.row?.last_year4?.unit_price ? scope.row?.last_year4?.unit_price : 0 }}</span>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="scope">
              <span class="click-text" @click="getDetail(scope.row)">明细</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pageValue">
        <el-pagination
          background
          layout="total, prev, pager, next, jumper"
          v-model:currentPage="searchObj.page"
          @current-change="handleCurrentChange"
          :page-size="15"
          :total="returnData.total"
        ></el-pagination>
      </div>
    </div>
    <Detail v-if="detailShow" :itemData="detailItem" />
  </div>
</template>
<script lang="ts" setup>
import { toRefs, ref, reactive, watch } from 'vue'
import { useRoute, onBeforeRouteLeave } from 'vue-router'

import { ArrowRight } from '@element-plus/icons-vue'
import Detail from './component/detail.vue'

import { getLedgerList, getLedgerStatistical } from '@service/instrument-manage/ledger'
import { SearchForm, DataList, LedgerListData, LedgerStatistical } from '@service/instrument-manage/ledger/types'
import { getInstrumentCategory } from '@service/equiment-standard/type-manage'
import localCache from '@/utils/localCache'
import axios from 'axios'
import { useStore } from '@/store'

let store = useStore()
let route = useRoute()
console.log('🚀 ~ file: index.vue ~ line 159 ~ route', route)

let options = [{ id: '', name: '全部' }, ...store.state.common.subjectArr]
const casProps = ref({
  value: 'id',
  label: 'title',
  emitPath: false,
  multiple: false,
  checkStrictly: true
})
let metaType = ref(route.meta.type)
getInstrumentCategory({ type: metaType.value }).then((res) => {
  optionType.value = res.data
})
const dataMap = reactive({
  detailShow: false,
  returnData: LedgerListData,
  statisticalList: Array<LedgerStatistical>(),
  detailItem: Object(),
  optionType: Array<{
    id: number | string
    title: string
  }>(),
  searchObj: {
    page: 1,
    number: '',
    classify: '',
    asset_number: '',
    subject_id: store.state.login.userInfo.subject_id || '',
    type: route.meta.type as number
  },
  showMore: false
})
let sortData: any = reactive({})

let { detailShow, returnData, statisticalList, detailItem, optionType, searchObj, showMore } = toRefs(dataMap)

let cancel = () => {
  detailShow.value = false
}

let subject_id = ref<number | string>('')
const getData = (data: SearchForm) => {
  let params = { ...data, ...sortData }
  subject_id.value = data.subject_id
  getLedgerList(params).then((res) => {
    returnData.value = res.data
  })
  getLedgerStatistical({
    type: data.type,
    number: data.number,
    classify: data.classify,
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
      process.env.VUE_APP_BASE_URL_BASE + '/schooldvc/SchoolGeneralLedger/generalLedgerList',
      { token, ...searchObj.value, ...sortData, is_explode: 1 },
      { responseType: 'blob' }
    )
    .then((res) => {
      const blob = new Blob([res.data]) // 处理文档流
      const fileName =
        store.state.login.userInfo.school.name + '-' + '教学' + (route.meta.type === 1 ? '仪器' : '设备') + '总账.xlsx'
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
    detailShow.value = false
    getData(searchObj.value)
  }
)

onBeforeRouteLeave((to) => {
  console.log(2233)
  if (!/instrumentLedger/.test(to.path)) {
    stopWatch()
  }
})

const search = () => {
  getData(searchObj.value)
}
const handleCurrentChange = () => {
  getData(searchObj.value)
}

const getDetail = (data: DataList) => {
  detailShow.value = true
  detailItem.value = { ...data, subject_id: subject_id.value }
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
  width: 100%;
  height: 80px;
  float: left;
  margin: 10px 0 20px 0;
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
      font-size: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
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
  .click-text {
    color: #05c65d;
    cursor: pointer;
  }
}

.pageValue {
  float: right;
  text-align: right;
  margin: 20px 0;
}
</style>
