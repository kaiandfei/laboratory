<template>
  <main>
    <div class="sel-box">
      <div class="operation">
        <span>新增设备损耗、报废登记</span>
      </div>
    </div>
    <div class="add_box">
      <div class="add_card" v-show="addStatus">
        <p>损耗、报废登记卡</p>
        <el-form :model="addScrap" label-width="150px" style="width: 70%">
          <el-form-item class="is-required" label="类型:">
            <el-select v-model="addScrap.mode">
              <el-option
                v-for="item in optionType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="is-required" label="报废理由">
            <el-select v-model="addScrap.cause">
              <el-option
                v-for="item in optionScope"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="is-required" label="处理方式">
            <el-select v-model="addScrap.process_mode">
              <el-option
                v-for="item in optionDisposal"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注:">
            <el-input v-model="addScrap.desc"></el-input>
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
          <el-form-item class="is-required" label="设备:">
            <div v-for="(item, index) in addScrap.list" :key="index">
              <span>{{ item.asset_number + ' - ' }}</span>
              <span>{{ item.name + ' - ' }}</span>
              <span>{{ item.specification }}</span>
              <span @click="addScrap.list.splice(index, 1)" style="padding-left: 20px; cursor: pointer">移除</span>
            </div>
          </el-form-item>
        </el-form>
        <p>可在右侧点击添加设备</p>
      </div>
      <div class="add_card" v-show="!addStatus">
        <p>损耗、报废登记卡</p>
        <el-form :model="addScrap" label-width="150px" style="width: 70%">
          <el-form-item label="类型:">
            <span>{{ addScrap.type === 1 ? '损耗' : '报废' }}</span>
          </el-form-item>
          <el-form-item label="报废理由">
            <span>
              <span v-show="addScrap.cause === 1">仪器超过使用年限，性能已不能达到实验需要的最低要求，且无法修复</span>
              <span v-show="addScrap.cause === 2">损坏严重，无法修复</span>
              <span v-show="addScrap.cause === 3">主要部件无处购配，无法修复使用</span>
              <span v-show="addScrap.cause === 4">修理费昂贵，无修理价值</span>
            </span>
          </el-form-item>
          <el-form-item label="处理方式">
            <span>{{ addScrap.process_mode === 1 ? '实验室留用' : '建立废旧仪器实验室' }}</span>
          </el-form-item>
          <el-form-item label="备注:">
            <span>{{ addScrap.desc }}</span>
          </el-form-item>
          <el-form-item label="图片:">
            <div v-for="(item, index) in addScrap.url" :key="index">
              <img :src="item" />
            </div>
          </el-form-item>
          <el-form-item label="清单:">
            <div v-for="(item, index) in addScrap.list" :key="index">
              <span>{{ item.asset_number + ' - ' }}</span>
              <span>{{ item.name + ' - ' }}</span>
              <span>{{ item.specification }}</span>
            </div>
          </el-form-item>
        </el-form>
        <p>可在右侧点击添加设备</p>
      </div>
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
            :show-overflow-tooltip="true"
            prop="name"
            label="名称"
            min-width="30"
          ></el-table-column>
          <el-table-column
            align="left"
            :show-overflow-tooltip="true"
            prop="specification"
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
            :small="small"
            :disabled="disabled"
            :background="background"
            :hide-on-single-page="true"
            layout="prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
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
import { ElMessageBox } from 'element-plus'
import { findSchoolUser } from '@/service/equ-manage/add-equ-warehouse/index'
import { getEquList1 } from '@service/equ-manage/lendEqu'
import { BASE_URL } from '@service/request/config'
import { useStore } from '@store/index'
import type { UploadFile } from 'element-plus/es/components/upload/src/upload.type'
import { postAddScrapInfo } from '@service/equ-manage/scrapRegistration/index'
import { addScrapList } from '@service/equ-manage/scrapRegistration/types'
import { ElMessage } from 'element-plus'

let addStatus = ref(true)
const total = ref(1)
const small = ref(true)
const disabled = ref(false)
const background = ref(true)
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
    label: '损耗',
    value: 1
  },
  {
    label: '报废',
    value: 2
  }
])
const optionScope = reactive([
  {
    label: '仪器超过使用年限，性能已不能达到实验需要的最低要求，且无法修复',
    value: 1
  },
  {
    label: '损坏严重，无法修复',
    value: 2
  },
  {
    label: '主要部件无处购配，无法修复使用',
    value: 3
  },
  {
    label: '修理费昂贵，无修理价值',
    value: 4
  }
])
const optionDisposal = reactive([
  {
    label: '实验室留用',
    value: 1
  },
  {
    label: '建立废旧仪器实验室',
    value: 2
  }
])

const tableData: any = ref([])

const addScrap: addScrapList = reactive({
  status: 1,
  type: 2,
  cause: 1,
  mode: 1,
  process_mode: 1,
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
  addScrap.url = urlData
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
  addScrap.url = urlData
}

// 获取搜索到的设备信息
const getEquAll = (value: string) => {
  selForm.keyword = value
  getEquList1(selForm).then((res) => {
    console.log(res.data)
    tableData.value = res.data.data
    total.value = res.data.total
    console.log(tableData.value)
  })
}
getEquAll('')

//暴露出搜索方法
defineExpose({
  getEquAll
})

// 提交新增的数据信息
const addSave = () => {
  if (!addScrap.mode) {
    ElMessage({
      type: 'warning',
      message: '请选择类型'
    })
    return
  }
  if (!addScrap.cause) {
    ElMessage({
      type: 'warning',
      message: '请选择报废理由'
    })
    return
  }
  if (!addScrap.process_mode) {
    ElMessage({
      type: 'warning',
      message: '请选择处理方式'
    })
    return
  }
  if (addScrap.list.length === 0) {
    ElMessage({
      type: 'warning',
      message: '请选择设备'
    })
    return
  }
  postAddScrapInfo(addScrap).then((res) => {
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

  let count = 0
  addScrap.list.forEach((item) => {
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
    addScrap.list.push({
      hardware_number: e.hardware_number,
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
      total: e.total,
      unit_price: e.unit_price
    })
  }
}

//分页功能
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
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
      margin: 10px 0;
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
// .add_box {
//   margin-top: 40px;
// }
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
  height: 560px;
}
</style>
