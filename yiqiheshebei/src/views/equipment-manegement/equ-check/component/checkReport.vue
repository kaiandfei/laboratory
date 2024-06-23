<template>
  <header v-show="reportShow">
    <span>设备管理 > 设备盘点 > 盘点报告</span>
    <span class="backPage" @click="back">
      <img src="../../../../assets/images/laboratory-standard/cancel.png" style="" />
      返回
    </span>
  </header>
  <main v-show="reportShow">
    <div class="titleArea">
      <div class="title">盘点报告</div>
      <div class="butttonArea" @click="pullData">
        <img src="@assets/images/account-school/exp.png" />
        <span>导出</span>
      </div>
    </div>
    <div class="infoArea">
      <div class="row">
        <span>盘点起始时间：{{ infoData.start_time + '~' + infoData.end_time }}</span>
      </div>
      <div class="row">
        <span>种类：</span>
        <span style="color: #05c65d">{{ infoData.new_summary.type_count }}</span>
        <span>种</span>
      </div>
      <div class="row">
        <span>数量：</span>
        <span style="color: #05c65d">{{ infoData.new_summary.total_amount }}</span>
        <span>件</span>
      </div>
      <div class="row">
        <span>截止 {{ infoData.start_time }}</span>
        <span>，账面数量为</span>
        <span style="color: #05c65d">{{ infoData.new_summary.total_amount }}</span>
        <span>件</span>
        <span>，账面金额为</span>
        <span style="color: #05c65d">
          {{ infoData.new_summary.total_origin_money ? infoData.new_summary.total_origin_money.toFixed(2) : 0 }}
        </span>
        <span>元</span>
        <span>，折旧金额为</span>
        <span style="color: #05c65d">
          {{ infoData.new_summary.total_new_money ? infoData.new_summary.total_new_money.toFixed(2) : 0 }}
        </span>
        <span>元</span>
        <!--        <span>，实物金额为</span>-->
        <!--        <span style="color: #05c65d">{{ infoData.real_price }}</span>-->
      </div>
      <!--      <div class="row">-->
      <!--        <span>截止 {{ infoData.start_time }}</span>-->
      <!--        <span>，盘盈数量：</span>-->
      <!--        <span style="color: #05c65d">{{ infoData.y_amount }}</span>-->
      <!--        <span>件</span>-->
      <!--        <span>，盘盈金额：</span>-->
      <!--        <span style="color: #05c65d">{{ infoData.y_price }}</span>-->
      <!--        <span>元</span>-->
      <!--        <span>，盈亏数量：</span>-->
      <!--        <span style="color: #ee9a59">{{ infoData.k_amount }}</span>-->
      <!--        <span>件</span>-->
      <!--        <span>，盈亏金额：</span>-->
      <!--        <span style="color: #ee9a59">{{ infoData.k_price }}</span>-->
      <!--        <span>元</span>-->
      <!--      </div>-->
    </div>
    <div class="tableArea">
      <el-table :data="tableData" style="width: 100%" :header-cell-style="{ background: '#EFEFEF' }">
        <el-table-column align="left" type="index" label="序号"></el-table-column>
        <el-table-column align="left" prop="number" label="编号"></el-table-column>
        <el-table-column align="left" prop="asset_number" label="资产编号"></el-table-column>
        <el-table-column align="left" prop="name" label="名称"></el-table-column>
        <el-table-column align="left" prop="specification" :show-overflow-tooltip="true" label="规格"></el-table-column>
        <el-table-column align="left" prop="unit" label="单位"></el-table-column>
        <el-table-column align="left" prop="price" label="总金额"></el-table-column>
        <el-table-column align="left" prop="bacth" label="批次"></el-table-column>
        <el-table-column align="left" prop="factory" label="厂家"></el-table-column>
        <el-table-column align="left" prop="inventory_num" label="盘点数"></el-table-column>
        <el-table-column align="left" prop="price" label="总金额"></el-table-column>
        <el-table-column align="left" prop="new_total_price" label="折旧金额"></el-table-column>
        <el-table-column align="left" prop="position" label="位置"></el-table-column>
      </el-table>
    </div>
    <div class="paginationArea">
      <el-pagination
        v-model:currentPage="pageData.currentPage"
        :page-size="pageData.pageSize"
        :disabled="pageData.disabled"
        :background="pageData.background"
        layout="prev, pager, next, jumper"
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
import { getCheckReportList, pullCheckReport } from '../../../../service/instrument-manage/instrument-check/index'

let props = defineProps({ reportShow: Boolean })
let { reportShow } = toRefs(props)
let emit = defineEmits(['back'])
const tableData: any = ref([])
const infoData: any = ref({
  new_summary: {}
})
const inventory_id: any = ref('')
const pageData: any = ref({
  currentPage: 1,
  pageSize: 15,
  disabled: false,
  background: true,
  total: 0
})

const initData = (ID: number) => {
  inventory_id.value = ID
  getCheckReportList({ inventory_total_id: ID, keyword: '' }).then((res) => {
    tableData.value = res.data.list
    infoData.value = res.data.summery
  })
}
defineExpose({
  initData
})

const handleSizeChange = () => {
  console.log('')
}

const handleCurrentChange = () => {
  console.log('')
}

const pullData = () => {
  let data: any = ''
  pullCheckReport({ inventory_total_id: inventory_id.value }).then((res) => {
    if (res.code === 10) {
      data = res.data
      window.location.href = data
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
  .infoArea {
    width: 100%;
    height: 250px;
    float: left;
    background-color: white;
    .row {
      width: 90%;
      height: 20%;
      float: left;
      margin-left: 5%;
      display: flex;
      align-items: center;
      span {
        float: left;
        font-size: 20px;
      }
    }
  }
  .titleArea {
    width: 100%;
    height: 80px;
    float: left;
    margin-top: 20px;
    display: flex;
    align-items: center;
    background-color: #dcece3;
    .title {
      font-size: 20px;
      height: 30px;
      width: 10%;
      float: left;
      font-weight: bold;
      color: #05c65d;
    }
    .butttonArea {
      float: left;
      margin-left: 80%;
      height: 40px;
      cursor: pointer;
      width: 8%;
      display: flex;
      align-items: center;
      background-color: white;
      border-radius: 10px;
      border: 1px solid #05c65d;
      img {
        width: 20px;
        height: 20px;
        float: left;
        margin-left: 20%;
      }
      span {
        float: left;
        margin-left: 20%;
      }
    }
  }
  .tableArea {
    width: 100%;
    margin-top: 20px;
    float: left;
  }
}
</style>
