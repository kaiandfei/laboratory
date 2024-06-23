<template>
  <header v-show="detailShow">
    <span>设备管理 > 期初设备建帐 > 查看</span>
    <div @click="back" class="fr">
      <img src="@/assets/images/laboratory-standard/cancel.png" />
      返回
    </div>
  </header>
  <main v-show="detailShow">
    <div class="titleArea">
      <div class="title1">{{ subjectName + '设备期初建帐' }}</div>
    </div>
    <div class="searchArea">
      <div class="area">
        <span>建帐种类：{{ accountData.species_num }}</span>
        <span>建帐数量：{{ accountData.num }}</span>
        <span>建帐金额：{{ accountData.price }}</span>
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
      <el-table :data="tableData" style="width: 100%" :header-cell-style="{ background: '#EFEFEF' }">
        <el-table-column align="left" type="index" label="序号"></el-table-column>
        <el-table-column
          align="left"
          prop="number"
          label="分类编号"
          width="130"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          align="left"
          prop="asset_number"
          label="学校编号"
          width="130"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column align="left" prop="name" label="名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column
          align="left"
          prop="specification"
          :show-overflow-tooltip="true"
          label="规格型号"
          width="100"
        ></el-table-column>
        <el-table-column align="left" prop="unit" label="单位"></el-table-column>
        <!-- <el-table-column align="left" prop="level" label="标准分类">
          <template #default="scope">
            <span>{{ ['', 'Ⅰ类', 'Ⅱ类', 'Ⅲ类'][scope.row.level] || '' }}</span>
          </template>
        </el-table-column> -->
        <el-table-column align="left" prop="source" label="期初来源">
          <template #default="scope">
            <span v-show="scope.row.source === 1">集采</span>
            <span v-show="scope.row.source === 2">自制</span>
            <span v-show="scope.row.source === 3">馈赠</span>
            <span v-show="scope.row.source === 4">自购</span>
            <span v-show="scope.row.source === 5">调拨</span>
          </template>
        </el-table-column>
        <el-table-column align="left" prop="voucher_number" label="凭证号" show-overflow-tooltip></el-table-column>
        <el-table-column align="left" prop="bacth" label="采购批次" show-overflow-tooltip></el-table-column>
        <el-table-column align="left" prop="factory" label="厂家"></el-table-column>
        <el-table-column align="left" prop="price" label="金额" width="100"></el-table-column>
        <el-table-column align="left" prop="" label="位置" width="200">
          <template #default="scope">
            <span>
              {{ scope.row.laboratory_name + '/' + scope.row.store_name + '/第' + scope.row.number_plies + '层' }}
            </span>
            <!-- <div v-for="(item, index) in scope.row.location" :key="index">
              <span>{{ item.laboratory_name + item.store_name + item.number_plies + '层' }}</span>
            </div> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="paginationArea">
      <el-pagination
        v-model:currentPage="pageData.currentPage"
        v-model:page-size="pageData.pageSize"
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
import { getDetailInfo } from '../../../../service/instrument-manage/account-establishment/index'

let props = defineProps({ detailShow: Boolean, subjectName: String })
let { detailShow, subjectName } = toRefs(props)
let emit = defineEmits(['back'])
const tableData: any = ref([])
const selectId: any = ref(1)
const inputValue: any = ref('')

const pageData: any = ref({
  currentPage: 1,
  pageSize: 15,
  disabled: false,
  background: true,
  total: 0
})

const accountData: any = ref({
  num: '',
  price: '',
  type: ''
})

const initData = (ID: number) => {
  selectId.value = ID
  getDetailInfo({ id: ID, keyword: '', page: pageData.value.currentPage }).then((res: any) => {
    tableData.value = res.data.list.data
    pageData.value.total = res.data.total
    accountData.value.num = res.data.all_num
    accountData.value.price = res.data.all_price.toFixed(2)
    accountData.value.species_num = res.data.species_num
  })
}

defineExpose({
  initData
})

const searchList = () => {
  getDetailInfo({ id: selectId.value, keyword: inputValue.value, page: pageData.value.currentPage }).then(
    (res: any) => {
      tableData.value = res.data.list.data
      pageData.value.total = res.data.total
      accountData.value.num = res.data.all_num
      accountData.value.price = res.data.all_price.toFixed(2)
      accountData.value.species_num = res.data.species_num
    }
  )
}

const handleSizeChange = () => {
  console.log('')
}

const handleCurrentChange = () => {
  initData(selectId.value)
}

const back = () => {
  emit('back', 2)
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
    // float: right;
    margin-right: 6px;
  }
  .fr {
    display: inline-flex;
    align-items: center;
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
  }
  .searchArea {
    height: 60px;
    width: 100%;
    background-color: #fff;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    clear: both;
    display: flex;
    align-items: center;
    .area {
      width: 40%;
      float: left;
      display: flex;
      margin-left: 3%;
      align-items: center;
      justify-content: space-between;
      span {
        float: left;
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 21px;
        color: #848484;
      }
    }
    .search {
      float: left;
      margin-left: 35%;
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
  .tableArea {
    width: 100%;
    margin-top: 20px;
  }
}
</style>
