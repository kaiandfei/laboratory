<template>
  <div>
    <header>
      <div class="fl">
        <span>仪器管理</span>
        <el-icon><arrow-right /></el-icon>
        <span v-show="!assetShow">仪器编号管理</span>
        <span v-show="assetShow" @click="assetNumberBack" style="cursor: pointer">仪器编号管理</span>
        <el-icon v-show="assetShow"><arrow-right /></el-icon>
        <span v-show="assetShow">生成资产编号</span>
      </div>
    </header>
    <div class="searchArea" v-show="!assetShow">
      <el-input v-model="searchValue" placeholder="请输入关键字" style="float: left; width: 60%"></el-input>
      <el-button type="primary" @click="search" style="float: right">搜索</el-button>
    </div>
    <div class="tableArea" v-show="!assetShow">
      <el-table
        :data="instrumentNumberList.data"
        style="width: 100%"
        :header-cell-style="{ background: '#EFEFEF', color: '#000' }"
        :cell-style="{ background: '#ffffff', borderBottom: '1px solid #EFEFEF' }"
        default-expand-all
        row-key="key"
        :tree-props="{ children: 'detail', hasChildren: 'hasChildren' }"
      >
        <el-table-column label="序号" prop="key"></el-table-column>
        <el-table-column label="分类编号" prop="number"></el-table-column>
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="规格" prop="specification"></el-table-column>
        <el-table-column label="总库存" prop="totals"></el-table-column>
        <el-table-column label="单位" prop="unit"></el-table-column>
        <el-table-column label="类型" prop="type">
          <template #default="scope">
            <span v-show="scope.row.type === 1">仪器</span>
            <span v-show="scope.row.type === 2">设备</span>
          </template>
        </el-table-column>
        <el-table-column label="仪器库" prop="school_laboratory_name"></el-table-column>
        <el-table-column label="采购批次" prop="bacth">
          <template #default="scope">
            <span v-show="scope.row.bacth === ''">{{ '/' }}</span>
            <span v-show="scope.row.bacth !== ''">{{ scope.row.bacth }}</span>
          </template>
        </el-table-column>
        <el-table-column label="到期时间" prop="end_time">
          <template #default="scope">
            <span v-show="scope.row.end_time === ''">{{ '/' }}</span>
            <span v-show="scope.row.end_time !== ''">{{ scope.row.end_time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单价" prop="unit_price">
          <template #default="scope">
            <span v-show="scope.row.unit_price === ''">{{ '/' }}</span>
            <span v-show="scope.row.unit_price !== ''">{{ scope.row.unit_price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="资产编号" prop="asset_number">
          <template #default="scope">
            <span>{{ scope.row.asset_number === '' ? '无' : scope.row.asset_number }}</span>
          </template>
        </el-table-column>
        <el-table-column label="责任人" prop="user_name"></el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <div
              v-show="!scope.row.key"
              style="color: green; float: left; cursor: pointer"
              @click="showDetail(scope.row)"
            >
              查看详情
            </div>
            <div
              v-show="!scope.row.key && scope.row.asset_number === ''"
              style="color: green; float: right; cursor: pointer"
              @click="makeAsset(scope.row)"
            >
              生成资产编号
            </div>
            <div v-show="!scope.row.key && scope.row.asset_number !== ''" style="color: #626572; float: right">
              生成资产编号
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="footer" style="float: right; margin-top: 20px">
      <el-pagination
        v-model:currentPage="currentPage"
        :page-size="15"
        @current-change="handleCurrentChange"
        background
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <asset
      :selectAssetNumber="selectAssetNumber"
      v-if="assetShow"
      :assetShow="assetShow"
      @assetNumberBack="assetNumberBack()"
    ></asset>
    <detail :selectDetailId="selectDetailId" v-if="detailShow" :detailShow="detailShow" @back="back()"></detail>
  </div>
</template>
<script lang="ts" setup>
import { ref, toRefs, reactive } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
import detail from './component/detail.vue'
import asset from './component/makAsset.vue'
import { numberManageData } from '@/service/instrument-manage/instrument-numebr-manage/types'
import { getNumberManageList } from '@/service/instrument-manage/instrument-numebr-manage/index'

const dataMap = reactive({
  instrumentNumberList: numberManageData,
  selectDetailId: 0,
  selectAssetNumber: ''
})

let { instrumentNumberList, selectDetailId, selectAssetNumber } = toRefs(dataMap)
let searchValue = ref('')
let detailShow = ref(false)
let assetShow = ref(false)
let total = ref(0)
let currentPage = ref(1)

getNumberManageList({ page: 1, keyword: '' }).then((res) => {
  console.log(res.data)
  instrumentNumberList.value = res.data
  total.value = res.data.total
})

const search = () => {
  console.log('搜索功能')
}
const showDetail = (data: any) => {
  detailShow.value = !detailShow.value
  selectDetailId.value = data.id
  console.log(selectDetailId.value + '位置')
  console.log(data)
}

const makeAsset = (data: any) => {
  assetShow.value = true
  selectAssetNumber.value = data.number
  console.log(selectAssetNumber.value)
  console.log(data + '生成资产编号')
}

const handleCurrentChange = () => {
  console.log('切换分页信息')
}
const back = () => {
  detailShow.value = false
}
const assetNumberBack = () => {
  assetShow.value = false
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
  height: 40px;
  width: 24%;
  float: right;
  margin-bottom: 40px;
}
</style>
