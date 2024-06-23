<template>
  <div>
    <header>
      <div class="fl">
        <span>设备管理</span>
        <el-icon><arrow-right /></el-icon>
        <span>变卖登记</span>
      </div>
      <!-- <div class="searchArea">
        <el-input v-model="compensateValue" placeholder="搜索" />
        <img class="search" src="@assets/images/common/search.png" alt="搜索" @click="search" />
      </div> -->
    </header>
    <mian v-show="!addShow">
      <div class="sel-box" v-show="!addShow">
        <div class="operation">
          <span>变卖登记情况</span>
          <div class="button-box">
            <div class="btn_z green-btn" @click="addShow = true">新增变卖登记</div>
          </div>
        </div>
        <div class="screen">
          <div class="sel-r">
            <div class="mt-4">
              <el-input v-model="selFrom.keyword" placeholder="请输入单号" class="input-with-select">
                <template #append>
                  <!-- <el-button :icon="Search"></el-button> -->
                  <div class="ser-icon">
                    <img src="@assets/images/account-school/search.png" @click="getSaleListByKey" alt="" />
                  </div>
                </template>
              </el-input>
            </div>
          </div>
        </div>
      </div>

      <div class="tableArea">
        <el-table
          :data="saleList2"
          style="width: 100%"
          :header-cell-style="{ background: '#EFEFEF', color: '#000' }"
          :cell-style="cellStyle"
          row-key="id"
          :tree-props="{ children: 'detail', hasChildren: 'hasChildren' }"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="45" :selectable="checkSelectable" />
          <el-table-column align="left" width="30" />
          <el-table-column label="变卖单号" prop="record_number" width="200" show-overflow-tooltip></el-table-column>
          <el-table-column label="设备信息" show-overflow-tooltip>
            <template #default="scope">
              <span v-if="scope.row.detail">{{ scope.row.detail.length }}个</span>
              <div v-else>
                {{ scope.row.name }}
              </div>
              <!--            <el-table :data="scope.row.detail">-->
              <!--              <el-table-column label="仪器名称" prop="name" />-->
              <!--              <el-table-column label="State" prop="number" />-->
              <!--              <el-table-column label="City" prop="specification" />-->
              <!--            </el-table>-->
            </template>
          </el-table-column>
          <el-table-column label="变卖人" prop="realtor" show-overflow-tooltip width="100"></el-table-column>
          <el-table-column label="变卖金额" prop="price" show-overflow-tooltip width="100"></el-table-column>
          <el-table-column label="变卖原因" prop="cause" :align="'left'" show-overflow-tooltip></el-table-column>
          <el-table-column label="登记时间" prop="create_time" show-overflow-tooltip width="160"></el-table-column>
          <el-table-column label="登记人" prop="user_name" show-overflow-tooltip width="100"></el-table-column>
          <el-table-column width="160" prop="">
            <template #header="">
              <div>
                <span>操作</span>
                <el-button
                  style="background-color: #05c65d; color: #fff; cursor: pointer; margin-left: 8px"
                  @click="delAll"
                >
                  批量删除
                </el-button>
              </div>
            </template>
            <template #default="scope">
              <div v-if="scope.row.detail">
                <div style="color: green; float: left; cursor: pointer" @click="operate(scope.row.id, 1, scope.row)">
                  查看详情
                </div>
                <div
                  v-if="scope.row.detail"
                  style="color: green; float: left; margin-left: 10px; cursor: pointer"
                  @click="operate(scope.row.id, 2)"
                >
                  删除
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pageSize">
        <el-pagination
          background
          layout="sizes, total, prev, pager, next, jumper"
          v-model:currentPage="currentPage"
          @current-change="handleCurrentChange1"
          @size-change="handleSizeChange"
          :page-sizes="[10, 20, 50, 100, 200]"
          v-model:page-size="selFrom.size"
          :total="selFrom.total"
        ></el-pagination>
      </div>

      <saleDetail v-if="operationStatus === 1" :itemData="detailDate" @back="back()"></saleDetail>
    </mian>
    <main v-show="addShow">
      <div class="sel-box">
        <div class="operation">
          <span>新增设备变卖登记</span>
        </div>
        <div class="screen">
          <div class="sel-r">
            <div class="mt-4">
              <el-input v-model="selFrom2.keyword" placeholder="请输入关键字" class="input-with-select">
                <template #append>
                  <!-- <el-button :icon="Search"></el-button> -->
                  <div class="ser-icon">
                    <img src="@assets/images/account-school/search.png" @click="getEquAll" alt="" />
                  </div>
                </template>
              </el-input>
            </div>
          </div>
        </div>
      </div>
      <div class="add_box">
        <div class="add_card">
          <p>变卖登记卡</p>
          <el-form :model="saleLend" label-width="150px" style="width: 70%">
            <el-form-item class="is-required" label="变卖人:">
              <el-select v-model="saleLend.realtor_id" filterable placeholder="请选择变卖人">
                <el-option
                  v-for="item in userList"
                  :key="item.id"
                  :label="item.username"
                  :value="item.id"
                  @click="lenderSel(item)"
                />
              </el-select>
              <!-- <el-input v-model="ruleForm.put.username"></el-input> -->
            </el-form-item>
            <el-form-item class="is-required" label="变卖原因:">
              <el-input v-model="saleLend.cause" placeholder="请输入变卖原因"></el-input>
            </el-form-item>
            <el-form-item label="变卖金额:">
              <el-input
                type="number"
                v-model="saleLend.price"
                @input="validatePrice"
                placeholder="请输入变卖金额"
              ></el-input>
            </el-form-item>
            <el-form-item label="变卖时间:">
              <el-date-picker
                value-format="YYYY-MM-DD"
                v-model="saleLend.sale_time"
                type="date"
                placeholder="请选择时间"
              />
            </el-form-item>
            <el-form-item label="说明:">
              <el-input v-model="saleLend.desc" placeholder="请输入其他说明"></el-input>
            </el-form-item>
            <el-form-item label="图片：">
              <el-upload
                class="uploadImg"
                ref="upload"
                :action="BASE_URL + 'swrserveadmin/OssImage/uploadImage'"
                :data="fileData"
                name="image"
                list-type="picture-card"
                :on-success="uploadSuccess"
                :on-remove="handleRemove"
                v-model:file-list="picUrl"
                accept=".jpg,.png,.jpeg"
              >
                <span>+点击上传</span>
              </el-upload>
            </el-form-item>
            <el-form-item label="清单:">
              <div v-for="(item, index) in saleLend.list" :key="index">
                <span class="ts_span" :title="item.asset_number + ' - ' + item.name + ' - ' + item.specification">
                  {{ item.asset_number + ' - ' + item.name + ' - ' + item.specification }}
                </span>
                <span
                  class="ts_span1"
                  @click="saleLend.list.splice(index, 1)"
                  style="padding-left: 20px; cursor: pointer"
                >
                  移除
                </span>
              </div>
            </el-form-item>
          </el-form>
          <p>可在右侧点击添加设备</p>
          <div class="car_foot">
            <div class="btn_z green-btn" @click="addSave">保存</div>
            <div class="btn_z green-btn" @click="addShow = false">返回</div>
          </div>
        </div>
        <div class="equ_list">
          <el-table ref="multipleTableRef" :data="tableData1" style="width: 100%" @row-click="equClick">
            <el-table-column align="left" type="index" label="序号" min-width="5" />
            <el-table-column align="left" prop="number" label="分类编号" min-width="20" show-overflow-tooltip />
            <el-table-column align="left" prop="asset_number" label="资产编号" min-width="20" show-overflow-tooltip />
            <el-table-column
              align="left"
              prop="name"
              label="名称"
              min-width="30"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column align="left" prop="specification" label="规格型号" min-width="15" show-overflow-tooltip />
            <el-table-column align="left" prop="laboratory_name" label="位置" min-width="25" show-overflow-tooltip />
            <el-table-column align="left" prop="unit_price" label="单价" min-width="25" show-overflow-tooltip />
            <el-table-column align="left" label="厂家" prop="factory" min-width="15" show-overflow-tooltip />
            <el-table-column align="left" label="到期时间" prop="end_time" min-width="25" show-overflow-tooltip />
          </el-table>
          <footer>
            <el-pagination
              background
              layout="sizes, total, prev, pager, next, jumper"
              v-model:currentPage="selFrom2.page"
              @current-change="handleCurrentChange2"
              @size-change="handleSizeChange2"
              :page-sizes="[10, 20, 50, 100, 200]"
              v-model:page-size="selFrom2.size"
              :total="selFrom2.total"
            ></el-pagination>
          </footer>
        </div>
      </div>
    </main>
  </div>
</template>
<script lang="ts" setup>
import { ArrowRight } from '@element-plus/icons-vue'
import saleDetail from './component/detail.vue'
import { getSaleList, delSale, addEquSale, delSaleBatch } from '@/service/equ-manage/registration-sale/index'
import { saleData, saleList } from '@/service/equ-manage/registration-sale/types'
import { reactive, ref, toRefs } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getEquList1 } from '@service/equ-manage/lendEqu'
import { findSchoolUser } from '@service/equ-manage/add-equ-warehouse'
import { BASE_URL } from '@service/request/config'
import { useStore } from '@/store'
import { UploadFile } from 'element-plus/es/components/upload/src/upload.type'
import { BaseListType } from '@service/instrument-procurement-plan/recommended-purchase/types'

let picUrl = ref([])
let addStatus = ref(true)
let addShow = ref(false)
let operationStatus = ref(0)
let detailDate = ref({})
let compensateShow = ref(false)
let compensateValue = ref('')
let currentPage = ref(1)
const total1: any = ref(1)
let size = ref(10)
const small = ref(true)
const background = ref(true)
const disabled = ref(false)
const chaeckId = ref([])
const dataMap: any = reactive({
  saleList2: Array<saleList>(),
  selFrom: {
    page: 1,
    size: 10,
    total: 0,
    keyword: '',
    category_id: ''
  },
  selFrom2: {
    page: 1,
    size: 10,
    total: 0,
    keyword: ''
  }
})
let { saleList2, selFrom, selFrom2 } = toRefs(dataMap)
const initData = () => {
  getSaleList({ keyword: compensateValue.value, page: currentPage.value, size: size.value }).then((res) => {
    saleList2.value = res.data.list
    selFrom.value.total = res.data.total
  })
}

initData()
const getSaleListByKey = () => {
  console.log(selFrom.value)
  getSaleList(selFrom.value).then((res) => {
    saleList2.value = res.data.list
    selFrom.value.total = res.data.total
  })
}
const operate = (id: number, status: number, data: any) => {
  operationStatus.value = status
  if (status === 1) {
    detailDate.value = data
    console.log(detailDate.value)
  }
  if (status === 2) {
    ElMessageBox.confirm('您正在删除变卖记录，该操作无法撤销,请确认是否删除?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
      .then(() => {
        delSale({ id: id }).then((res) => {
          if (res.code === 10) {
            ElMessage({
              type: 'success',
              message: '删除成功!'
            })
            getSaleList({ keyword: compensateValue.value, page: currentPage.value, size: size.value }).then((res) => {
              saleList2.value = res.data.list
              selFrom.value.total = res.data.total
            })
          } else {
            ElMessage({
              type: 'error',
              message: '删除失败!'
            })
          }
        })
      })
      .catch(() => {
        console.log('')
      })
  }
}
const cellStyle = (row: any) => {
  if (!row.row.detail) {
    return {
      background: '#DCECE3'
    }
  }
}
const handleCurrentChange1 = (val: number) => {
  initData()
}
const handleSizeChange = (val: number) => {
  selFrom.value.size = val
  getSaleList(selFrom.value).then((res) => {
    saleList2.value = res.data.list
    selFrom.value.total = res.data.total
  })
}
const handleCurrentChange2 = (val: number) => {
  getEquAll()
}
const handleSizeChange2 = (val: number) => {
  selFrom2.value.size = val
  getEquAll()
}
const back = () => {
  operationStatus.value = 0
}
const tableData1: any = ref([])

let saleLend: any = reactive({
  realtor_id: '',
  price: '',
  type: 2,
  cause: '',
  desc: '',
  sale_time: '',
  url: '',
  list: []
})
const userList: any = ref([])
findSchoolUser().then((res) => {
  console.log('111')
  console.log(res)
  userList.value = res.data
})
const openAdd = () => {
  getEquAll()
  addShow.value = true
}

const getEquAll = () => {
  console.log(selFrom2.value)
  getEquList1(selFrom2.value).then((res) => {
    tableData1.value = res.data.data
    selFrom2.value.total = res.data.total
    console.log(tableData1.value)
  })
}
getEquAll()
const store = useStore()
const fileData = reactive({
  token: store.state.login.userInfo.token
})

const validatePrice = () => {
  // 使用正则表达式来验证价格输入，只允许数字和一个小数点
  saleLend.price = saleLend.price.replace(/[^0-9.]/g, '')
  saleLend.price = saleLend.price.match(/^\d*(\.?\d{0,2})/g)[0]
  if (saleLend.price > 99999.99) {
    ElMessage({
      type: 'info',
      message: '金额不能超过99999.99'
    })
    saleLend.price = 99999.99
  }
}
const lenderSel = (item: any) => {
  console.log(item)
  saleLend.realtor_id = item.id
  saleLend.realtor = item.username
}
//添加图片
const uploadSuccess = (response: unknown, file: UploadFile, fileList: UploadFile[]) => {
  const urlData: string[] = []
  const list = [...fileList]
  let string = ''
  list.forEach((e) => {
    let str = (
      e as {
        response: {
          data: {
            file_url: string
          }
        }
      }
    ).response
      ? (
          e as {
            response: {
              data: {
                file_url: string
              }
            }
          }
        ).response.data.file_url
      : (e as { url: string }).url
    if (string === '') {
      string = string + str
    } else {
      string = string + ',' + str
    }
    urlData.push(str)
  })
  saleLend.url = urlData
}

//移除图片
const handleRemove = (file: UploadFile, fileList: UploadFile[]) => {
  const urlData: string[] = []
  const list = [...fileList]
  let string = ''
  list.forEach((e) => {
    let str = (
      e as {
        response: {
          data: {
            file_url: string
          }
        }
      }
    ).response
      ? (
          e as {
            response: {
              data: {
                file_url: string
              }
            }
          }
        ).response.data.file_url
      : (e as { url: string }).url
    if (string === '') {
      string = string + str
    } else {
      string = string + ',' + str
    }
    urlData.push(str)
  })
  saleLend.url = urlData
}
//添加选中的设备
const equClick = (e: any) => {
  if (!addStatus.value) {
    return
  }

  let count = 0
  saleLend.list.forEach((item) => {
    if (item.instrument_id === e.id) {
      count++
    }
  })
  if (count > 0) {
    ElMessageBox.alert('当前设备已在清单中!', '提示', {
      confirmButtonText: '确认'
    })
  } else {
    e.instrument_id = e.id
    // addDamage.list.push(JSON.parse(JSON.stringify(e)))
    saleLend.list.push({
      unit_price: e.unit_price,
      number: e.number,
      asset_number: e.asset_number,
      specification: e.specification,
      name: e.name,
      bacth: e.bacth,
      instrument_id: e.instrument_id,
      laboratory_id: e.laboratory_id,
      laboratory_name: e.laboratory_name,
      store_name: e.store_name,
      store_id: e.store_id,
      number_plies: e.number_plies,
      total: e.total
    })
    console.log(saleLend.list)
  }
}

const addSave = () => {
  if (!saleLend.realtor_id) {
    ElMessage({
      type: 'warning',
      message: '请选择变卖人'
    })
    return
  }
  if (!saleLend.cause) {
    ElMessage({
      type: 'warning',
      message: '填写变卖原因'
    })
    return
  }
  if (saleLend.list.length === 0) {
    ElMessage({
      type: 'warning',
      message: '请选择设备'
    })
    return
  }
  console.log(saleLend)
  addEquSale(saleLend).then((res) => {
    if (res.code === 10) {
      addShow.value = false
      getSaleListByKey()
      getEquAll()
      saleLend.realtor_id = ''
      saleLend.desc = ''
      saleLend.cause = ''
      saleLend.price = ''
      saleLend.sale_time = ''
      saleLend.url = ''
      picUrl.value = []
      saleLend.list = []
      ElMessage({
        type: 'success',
        message: '操作成功'
      })
    }
  })
}

const checkSelectable = (row: any) => {
  //通过id来禁止不能选择的项
  // return row.id !== 1
  //通过索引index来禁止不能选择的项
  if ('detail' in row) {
    return true
  } else {
    return false
  }
}
const handleSelectionChange = (val: any) => {
  chaeckId.value = []
  val.forEach((item) => {
    chaeckId.value.push({
      id: item.id
    })
  })
}

const delAll = () => {
  console.log(chaeckId.value.length)
  if (chaeckId.value.length < 1) {
    ElMessage({
      type: 'error',
      message: '请选择要删除的数据!'
    })
    return
  }
  ElMessageBox.confirm('您正在批量删除变卖记录，该操作无法撤销,请确认是否删除?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
    .then(() => {
      delSaleBatch({ ids: chaeckId.value }).then((res) => {
        if (res.code === 10) {
          ElMessage({
            type: 'success',
            message: '删除成功!'
          })
          getSaleList({ keyword: compensateValue.value, page: currentPage.value, size: size.value }).then((res) => {
            saleList2.value = res.data.list
            selFrom.value.total = res.data.total
          })
        }
      })
    })
    .catch(() => {
      console.log('')
    })
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

  .searchArea {
    height: 40px;
    width: 24%;
    float: right;
    position: relative;

    :deep(.el-input) {
      position: absolute;
      right: 0;
      top: 0;
      width: 300px;
      line-height: 30px;
    }

    .search {
      position: absolute;
      right: 0;
      top: 0;
      width: 20px;
      height: 20px;
      padding: 5px 10px;
      background: #05c65d;
      cursor: pointer;
    }
  }
}

.buttonArea {
  width: 100%;
  height: 80px;
  float: left;
  margin: 20px 0px 20px 0px;
  display: flex;
  align-items: center;
  background-color: #dcece3;

  span {
    font-size: 20px;
    height: 20%;
    width: 20%;
    float: left;
    display: flex;
    align-items: center;
    font-weight: bold;
    color: #05c65d;
  }

  .buttonStyle {
    float: right;
    width: 10%;
    height: 100%;
    border-radius: 10px;
    height: 30px;
    margin-left: 70%;
  }
}

.pageSize {
  margin: 28px 0 16px;
  text-align: right;
}

.sel-box {
  margin: 10px 0;
  width: 100%;
  height: 120px;

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
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
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
        }
      }
    }

    .sel-r {
      float: right;
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
    }
  }
}

.add_box {
  margin-top: 60px;
}

.add_card {
  float: left;
  width: 30%;
  background-color: #fff;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);

  & > p {
    height: 40px;
    line-height: 40px;
    color: #848484;
  }

  .car_foot {
    padding-bottom: 20px;
    display: flex;
    justify-content: space-around;

    & > div {
      width: 30%;
    }
  }

  :deep(.el-input) {
    width: 240px;
  }
}

.equ_list {
  float: right;
  width: 68%;
  height: 200px;
}

.re_msg:after {
  content: '';
  clear: left;
  display: block;
}

.re_p {
  font-size: 16px;
  color: #848484;
}

.ts_span {
  float: left;
  white-space: nowrap; //使文本单行显示
  text-overflow: ellipsis; //多余的部分用省略号来代替
  overflow: hidden; // 隐藏多余的部分
  width: 60%;
  height: 40px;
}

.ts_span1 {
  float: right;
  height: 40px;
}
</style>
