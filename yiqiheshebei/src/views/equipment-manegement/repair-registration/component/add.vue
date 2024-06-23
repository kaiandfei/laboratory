<template>
  <main>
    <div class="sel-box">
      <div class="operation">
        <span>新增设备维修保养登记</span>
      </div>
    </div>
    <div class="add_box">
      <div class="add_card">
        <p>维修保养登记卡</p>
        <el-form :model="addRepair" label-width="150px" style="width: 70%">
          <el-form-item class="is-required" label="类型:">
            <el-select v-model="addRepair.mode" :disabled="!addStatus">
              <el-option
                v-for="item in optionType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="is-required" label="负责企业">
            <el-input v-model="addRepair.factory" :disabled="!addStatus"></el-input>
          </el-form-item>
          <el-form-item class="is-required" label="开始时间">
            <el-date-picker
              type="date"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD"
              v-model="addRepair.start_time"
              :disabled="!addStatus"
            ></el-date-picker>
          </el-form-item>
          <el-form-item class="is-required" label="预计完成时间">
            <el-date-picker
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD"
              type="date"
              v-model="addRepair.plan_end_time"
              :disabled="!addStatus"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="损坏情况:">
            <el-input v-model="addRepair.desc" :disabled="!addStatus"></el-input>
          </el-form-item>
          <el-form-item label="图片：">
            <el-upload
              class="uploadImg"
              ref="upload"
              :action="BASE_URL + 'swrserveadmin/OssImage/uploadImage'"
              :data="fileData"
              name="image"
              :limit="3"
              list-type="picture-card"
              :on-success="uploadSuccess"
              :on-remove="handleRemove"
              accept=".jpg,.png,.jpeg"
            >
              <span>+点击上传</span>
            </el-upload>
          </el-form-item>
          <el-form-item label="清单:">
            <div v-for="(item, index) in addRepair.list" :key="index">
              <span>{{ item.asset_number + ' - ' }}</span>
              <span>{{ item.name + ' - ' }}</span>
              <span>{{ item.specification }}</span>
              <span
                v-show="addStatus"
                @click="addRepair.list.splice(index, 1)"
                style="padding-left: 20px; cursor: pointer"
              >
                移除
              </span>
            </div>
          </el-form-item>
        </el-form>
        <p>可在右侧点击添加设备</p>
      </div>
      <!-- <div class="add_card" v-show="!addStatus">
        <p>损坏、赔偿登记卡</p>
        <el-form :model="addRepair" label-width="150px" style="width: 70%">
          <el-form-item label="类型:">
            <el-select v-model="addRepair.mode" disabled>
              <el-option
                v-for="item in optionType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="负责企业">
            <el-input v-model="addRepair.factory" disabled></el-input>
          </el-form-item>
          <el-form-item label="开始时间">
            <el-date-picker
              type="date"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD"
              v-model="addRepair.start_time"
              disabled
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="预计完成时间">
            <el-date-picker
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD"
              type="date"
              v-model="addRepair.plan_end_time"
              disabled
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="损坏情况:">
            <el-input v-model="addRepair.desc" disabled></el-input>
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
              accept=".jpg,.png,.jpeg"
            >
              <span>+点击上传</span>
            </el-upload>
          </el-form-item>
          <el-form-item label="清单:">
            <div v-for="(item, index) in addRepair.list" :key="index">
              <span>{{ item.asset_number + ' - ' }}</span>
              <span>{{ item.name + ' - ' }}</span>
              <span>{{ item.specification }}</span>
              <span @click="addRepair.list.splice(index, 1)" style="padding-left: 20px; cursor: pointer">移除</span>
            </div>
          </el-form-item>
        </el-form>
        <p>可在右侧点击添加设备</p>
      </div> -->
      <div class="equ_list">
        <el-table
          ref="multipleTableRef"
          :data="tableData"
          style="width: 100%"
          :header-cell-style="{ background: '#F3F3F3', color: '#000' }"
          :cell-style="{ background: '#ffffff', borderBottom: '1px solid #EFEFEF' }"
          :height="544"
          @row-click="equClick"
        >
          <el-table-column align="left" type="index" label="序号" min-width="5" />
          <el-table-column align="left" prop="number" label="分类编号" min-width="20" />
          <el-table-column align="left" prop="asset_number" label="资产编号" min-width="20" />
          <el-table-column
            align="left"
            prop="name"
            :show-overflow-tooltip="true"
            label="名称"
            min-width="30"
          ></el-table-column>
          <el-table-column
            align="left"
            prop="specification"
            :show-overflow-tooltip="true"
            label="规格型号"
            min-width="15"
          />
          <el-table-column align="left" prop="laboratory_name" label="位置" min-width="25" />
          <el-table-column align="left" prop="unit_price" label="单价" min-width="25" />
          <el-table-column align="left" label="厂家" prop="factory" min-width="15" />
          <el-table-column align="left" label="到期时间" prop="end_time" min-width="25" />
        </el-table>
        <footer>
          <el-pagination
            v-model:currentPage="selForm.page"
            :page-size="15"
            :background="true"
            layout="prev, pager, next, jumper"
            :hide-on-single-page="true"
            :total="total"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </footer>
      </div>
      <div class="buttonArea">
        <el-button v-show="addStatus === false" type="primary" class="btn green-btn" @click="addStatus = true">
          新增登记卡
        </el-button>
        <el-button v-show="addStatus === true" type="info" class="btn green-btn">新增登记卡</el-button>
        <el-button type="primary" class="btn green-btn" @click="backHome()">返回</el-button>
        <el-button v-show="addStatus === true" type="primary" class="btn green-btn" @click="addSave">保存</el-button>
        <el-button v-show="addStatus === false" type="info" class="btn green-btn">保存</el-button>
      </div>
    </div>
  </main>
</template>
<script lang="ts" setup>
import { reactive, ref, defineExpose } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { findSchoolUser } from '@/service/equ-manage/add-equ-warehouse/index'
import { getEquList1 } from '@service/equ-manage/lendEqu'
import { BASE_URL } from '@service/request/config'
import { useStore } from '@store/index'
import type { UploadFile } from 'element-plus/es/components/upload/src/upload.type'
import { postAddRepairInfo } from '@service/equ-manage/repairRegistration/index'
import { addRepairList } from '@service/equ-manage/repairRegistration/types'

let addStatus = ref(true)
const total = ref(1)
const store = useStore()
let emit = defineEmits(['back'])

const fileData = reactive({
  token: store.state.login.userInfo.token
})

const selForm = reactive({
  page: 1,
  keyword: '',
  category_id: ''
})

const optionType = reactive([
  {
    label: '维修',
    value: 1
  },
  {
    label: '保养',
    value: 2
  }
])

const tableData: any = ref([])

const addRepair: addRepairList = reactive({
  type: 2,
  factory: '',
  start_time: '',
  plan_end_time: '',
  mode: 1,
  desc: '',
  url: [],
  list: []
})

const userList: any = ref([])
findSchoolUser().then((res) => {
  userList.value = res.data
})

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
  addRepair.url = urlData
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
  addRepair.url = urlData
}

// 获取搜索到的设备信息
const getEquAll = (value: string) => {
  selForm.keyword = value
  getEquList1(selForm).then((res) => {
    tableData.value = res.data.data
    total.value = res.data.total
  })
}
getEquAll('')

//暴露出搜索方法
defineExpose({
  getEquAll
})

// 提交新增的数据信息
const addSave = () => {
  if (!addRepair.mode) {
    ElMessage({
      type: 'warning',
      message: '请选择类型'
    })
    return
  }
  if (!addRepair.factory) {
    ElMessage({
      type: 'warning',
      message: '请填写负责企业'
    })
    return
  }
  if (!addRepair.start_time) {
    ElMessage({
      type: 'warning',
      message: '请选择出借时间'
    })
    return
  }
  if (!addRepair.plan_end_time) {
    ElMessage({
      type: 'warning',
      message: '请选择预计归还时间'
    })
    return
  }
  if (addRepair.list.length === 0) {
    ElMessage({
      type: 'warning',
      message: '请选择设备'
    })
    return
  }
  postAddRepairInfo(addRepair).then((res) => {
    if (res.code === 10) {
      addStatus.value = false
      getEquAll('')
    }
  })
}

//添加选中的设备
const equClick = (e: any) => {
  if (!addStatus.value) {
    return
  }
  // if (JSON.stringify(addRepair.list).indexOf(JSON.stringify(e)) !== -1) {
  //   ElMessageBox.alert('当前设备已在领用清单中!', '提示', {
  //     confirmButtonText: '确认'
  //   })
  // } else {
  //   e.instrument_id = e.id
  //   console.log(e)
  //   console.log('获取到的设备信息')
  //   // addRepair.list.push(JSON.parse(JSON.stringify(e)))
  //   addRepair.list.push({
  //     hardware_number: e.hardware_number,
  //     asset_number: e.asset_number,
  //     name: e.name,
  //     bacth: e.bacth,
  //     instrument_id: e.instrument_id,
  //     specification: '',
  //     laboratory_id: e.laboratory_id,
  //     laboratory_name: e.laboratory_name,
  //     store_name: e.store_name,
  //     store_id: e.store_id,
  //     number_plies: e.number_plies,
  //     total: e.total
  //   })
  //   console.log(addRepair.list)
  // }

  let count = 0
  addRepair.list.forEach((item) => {
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
    addRepair.list.push({
      hardware_number: e.number,
      asset_number: e.asset_number,
      name: e.name,
      bacth: e.bacth,
      instrument_id: e.instrument_id,
      specification: '',
      laboratory_id: e.laboratory_id,
      laboratory_name: e.laboratory_name,
      store_name: e.store_name,
      store_id: e.store_id,
      number_plies: e.number_plies,
      total: e.total
    })
  }
}

const handleCurrentChange = (val: number) => {
  selForm.page = val
  getEquAll(selForm.keyword)
}

const backHome = () => {
  emit('back')
}
</script>
<style scoped lang="scss">
main {
  width: 100%;
  .sel-box {
    width: 100%;
    height: 80px;
    .operation {
      float: left;
      height: 80px;
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
  .del-res {
    margin-top: 10px;
    height: 56px;
    span {
      float: left;
      height: 56px;
      line-height: 56px;
      font-size: 20px;
      color: #404040;
    }
    .green-t {
      padding: 0 8px;
      color: #05c65d;
    }
    & > div {
      float: right;
      margin: 10px 20px 0 0;
      display: flex;
      align-items: center;
      img {
        margin-right: 4px;
        width: 20px;
        height: 20px;
      }
    }
  }
  .buttonArea {
    float: left;
    width: 30%;
    margin-top: 20px;
  }
}
footer {
  margin: 28px 0 16px;
  text-align: right;
}
.operation-box {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: space-around;
  div {
    display: flex;
    align-items: center;
    cursor: pointer;
    img {
      margin-right: 12px;
      width: 20px;
      height: 20px;
    }
  }
}
.add_box {
  margin-top: 40px;
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
  .button-box {
    width: 80px;
  }
  :deep(.el-input) {
    width: 240px;
  }
  :deep(.uploadImg) {
    text-align: left;
    .el-upload--picture-card {
      width: 80px;
      height: 80px;
      line-height: 80px;
    }
    .el-upload-list__item {
      width: 80px;
      height: 80px;
    }
  }
  img {
    float: left;
    width: 80px;
    height: 80px;
  }
}
.equ_list {
  float: right;
  width: 68%;
  height: 600px;
}
</style>
