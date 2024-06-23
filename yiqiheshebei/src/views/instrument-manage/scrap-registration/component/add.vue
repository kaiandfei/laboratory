<template>
  <div v-show="addState">
    <div class="leftArea">
      <div class="head-area">
        <div class="title">损耗、报废登记卡</div>
        <div class="buttonArea">
          <el-button v-show="conserveShow === false" type="primary" @click="conserveShow = true">新增登记卡</el-button>
          <el-button v-show="conserveShow === true" type="info">新增登记卡</el-button>
          <el-button type="primary" @click="back()">返回</el-button>
          <el-button type="primary" v-show="conserveShow === true" @click="commit(1)">保存</el-button>
          <el-button type="info" v-show="conserveShow === false">保存</el-button>
          <el-button v-show="conserveShow === true" type="primary" @click="commit(2)">提交</el-button>
          <el-button v-show="conserveShow === false" type="info">提交</el-button>
        </div>
      </div>
      <div class="title2">损耗、报废登记卡</div>
      <div class="topArea" v-show="conserveShow === true">
        <div class="first">
          <div class="nav nav-type">
            <div class="name is-must-div">类型:</div>
            <div>
              <el-select v-model="scrapRegistrationInfo.mode">
                <el-option
                  v-for="item in optionType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="nav nav-img">
            <div class="name">图片：</div>
            <div class="imgArea">
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
                v-model:file-list="fileListRes"
              >
                <span>+点击上传</span>
              </el-upload>
            </div>
          </div>
        </div>
        <div class="nav">
          <div class="name is-must-div">报废理由:</div>
          <div>
            <el-select v-model="scrapRegistrationInfo.cause">
              <el-option
                v-for="item in optionScope"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="nav">
          <div class="name is-must-div">处理方式:</div>
          <div>
            <el-select v-model="scrapRegistrationInfo.process_mode">
              <el-option
                v-for="item in optionDisposal"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="nav">
          <div class="name is-must-div">报废总金额:</div>
          <div>
            <el-input v-model="scrapRegistrationInfo.price"></el-input>
          </div>
        </div>
        <div class="nav" style="height: 80px">
          <div class="name">备注:</div>
          <div>
            <el-input v-model="scrapRegistrationInfo.desc" type="textarea" :rows="2"></el-input>
          </div>
        </div>
      </div>
      <div class="topArea" v-show="conserveShow === false">
        <div class="nav">
          <div class="name">类型:</div>
          <div>
            {{ scrapRegistrationInfo.type === 1 ? '损耗' : '报废' }}
          </div>
        </div>
        <div class="nav" style="float: right; width: 45%; height: 100px">
          <div class="name" style="float: left">图片：</div>
          <div v-for="(item, index) in scrapRegistrationInfo.url" :key="index">
            <img :src="item.url" />
          </div>
        </div>
        <div class="nav">
          <div class="name">报废理由:</div>
          <div style="flex: 1">
            <span v-show="scrapRegistrationInfo.cause === 1">
              仪器超过使用年限，性能已不能达到实验需要的最低要求，且无法修复
            </span>
            <span v-show="scrapRegistrationInfo.cause === 2">损坏严重，无法修复</span>
            <span v-show="scrapRegistrationInfo.cause === 3">主要部件无处购配，无法修复使用</span>
            <span v-show="scrapRegistrationInfo.cause === 4">修理费昂贵，无修理价值</span>
          </div>
        </div>
        <div class="nav">
          <div class="name">处理方式:</div>
          <div>
            {{ scrapRegistrationInfo.process_mode === 1 ? '实验室留用' : '建立废旧仪器实验室' }}
          </div>
        </div>
        <div class="nav">
          <div class="name">备注:</div>
          <div style="width: 300px; word-wrap: break-word; height: 100px; overflow-y: auto">
            {{ scrapRegistrationInfo.desc }}
          </div>
        </div>
      </div>
      <div class="title2">损耗、报废仪器位置及数量清单</div>
      <div class="bottomArea" v-show="conserveShow === true">
        <div class="tableArea">
          <el-table
            :data="scrapRegistrationInfo.list"
            style="width: 100%"
            height="280"
            :header-cell-style="{ background: '#DCECE3', color: '#000' }"
            :cell-style="{ background: '#ffffff', borderBottom: '1px solid #EFEFEF' }"
          >
            <el-table-column label="序号" type="index"></el-table-column>
            <el-table-column label="编号" prop="hardware_number"></el-table-column>
            <el-table-column label="学校编号" prop="asset_number"></el-table-column>
            <el-table-column label="名称" prop="name"></el-table-column>
            <!-- <el-table-column label="批次" prop="bacth"></el-table-column> -->
            <el-table-column label="仪器库" prop="school_laboratory_name">
              <template #default="scope">
                <span>{{ scope.row.laboratory_name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="仪器柜" prop="store_id">
              <template #default="scope">
                <span>{{ scope.row.store_name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="层数" prop="number_plies">
              <template #default="scope">
                <span>{{ '第' + scope.row.number_plies + '层' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="数量" prop="total">
              <template #default="scope">
                <input style="width: 100%" v-model="scope.row.total" />
              </template>
            </el-table-column>
            <el-table-column label="操作" prop="">
              <template #default="scope">
                <div @click="remove(scope.$index)">删除</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- <span class="title">增加一条仪器信息</span>
        <span style="color: #333333; font-size: 10px">您可以在右侧选择，也可以直接填写编号</span> -->
      </div>
      <div class="bottomArea" v-show="conserveShow === false">
        <div class="tableArea">
          <el-table
            :data="scrapRegistrationInfo.list"
            style="width: 100%"
            height="280"
            :header-cell-style="{ background: '#DCECE3', color: '#000' }"
            :cell-style="{ background: '#ffffff', borderBottom: '1px solid #EFEFEF' }"
          >
            <el-table-column label="序号" type="index"></el-table-column>
            <el-table-column label="编号" prop="hardware_number"></el-table-column>
            <el-table-column label="学校编号" prop="asset_number"></el-table-column>
            <el-table-column label="名称" prop="name"></el-table-column>
            <!-- <el-table-column label="批次" prop="bacth"></el-table-column> -->
            <el-table-column label="仪器库" prop="laboratory_name"></el-table-column>
            <el-table-column label="仪器柜" prop="store_name"></el-table-column>
            <el-table-column label="层数" prop="number_plies">
              <template #default="scope">
                <span>{{ '第' + scope.row.number_plies + '层' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="数量" prop="total"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="rightArea">
      <div class="containerArea">
        <div class="infoArea" v-for="item in instrumentList" :key="item.id">
          <div class="detailList">
            <div class="part">
              <div class="name" style="font-size: 20px; font-weight: bold">{{ item.name }}</div>
            </div>
            <div class="part" style="width: 20%; height: 120px; float: right">
              <img :src="item.picture" />
            </div>
            <div class="part">
              <div class="name">规格</div>
              <div>{{ item.specification }}</div>
            </div>
            <div class="part">
              <div class="name">学校编号</div>
              <div>{{ item.asset_number }}</div>
            </div>
            <div class="part">
              <div style="color: green; width: 50%" class="name">本周各时段最大实验用量</div>
            </div>
            <div class="part" style="width: 100%">
              <div class="weekArea" v-for="(n, index) in item.weekList" :key="index">
                {{ week[index] + ':' }}
                {{ n }}
              </div>
            </div>
            <div class="stockTitle" v-show="item.stockStatus === false" @click="getSchoolInstrumentDetail(item)">
              展开库存列表
            </div>
            <div class="stockTitle" v-show="item.stockStatus === true" @click="item.stockStatus = false">
              取消展开库存列表
            </div>
          </div>
          <div class="tableArea" v-show="item.stockStatus === true">
            <el-table
              :data="item.detail"
              style="width: 96%; margin-left: 2%"
              :header-cell-style="{ background: '#F3F3F3', color: '#000' }"
              :cell-style="{ background: '#ffffff', borderBottom: '1px solid #EFEFEF' }"
            >
              <el-table-column label="序号" type="index"></el-table-column>
              <el-table-column label="编号" prop="hardware_number" show-overflow-tooltip></el-table-column>
              <el-table-column label="名称" prop="name" show-overflow-tooltip></el-table-column>
              <!-- <el-table-column label="批次" width="100" prop="bacth"></el-table-column> -->
              <el-table-column
                label="仪器库"
                prop="laboratory_name"
                width="100"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column label="仪器柜" prop="store_name" show-overflow-tooltip></el-table-column>
              <el-table-column label="层数" prop="number_plies" show-overflow-tooltip>
                <template #default="scope">
                  <span v-if="scope.row.number_plies !== 0">{{ '第' + scope.row.number_plies + '层' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="数量" prop="total">
                <template #default="scope">
                  <span style="color: #05c65d">{{ scope.row.total }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" prop="">
                <template #default="scope">
                  <span
                    v-show="conserveShow === true"
                    style="cursor: pointer; color: #05c65d"
                    @click="addScrap(scope.row)"
                  >
                    报废仪器
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <el-pagination
        class="pagination"
        v-model:currentPage="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100, 300]"
        :pager-count="3"
        @current-change="handleTableCurrentPage"
        @size-change="handleSizeChange"
        layout="total, prev, pager, next,sizes"
        :total="containerTotal"
      ></el-pagination>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, toRefs, reactive, defineExpose } from 'vue'
import { BASE_URL } from '@service/request/config'
import { useStore } from '@store/index'
import type { UploadFile } from 'element-plus/es/components/upload/src/upload.type'
import { schoolInstrumentDetail } from '@/service/instrument-manage/lendRegistration/index'
import { getInstrumentInfo, postAddScrapInfo } from '@/service/instrument-manage/scrapRegistration/index'
import { instrumnetData } from '@/service/instrument-manage/scrapRegistration/types'
import { ElMessage, ElMessageBox } from 'element-plus'

let conserveShow = ref(true)
let props = defineProps({ addShow: Boolean, searchValue: { type: String, required: true } })
let { addShow, searchValue } = toRefs(props)
let emit = defineEmits(['back'])
let addState = ref(true)

const store = useStore()

addState.value = addShow.value

const scrapRegistrationInfo: any = ref({ type: 1 })
const dataMap = reactive({
  instrumentList: [instrumnetData],
  week: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  optionType: [
    {
      label: '损耗',
      value: 1
    },
    {
      label: '报废',
      value: 2
    }
  ],
  optionScope: [
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
  ],
  optionDisposal: [
    {
      label: '实验室留用',
      value: 1
    },
    {
      label: '建立废旧仪器实验室',
      value: 2
    }
  ],
  optionBatch: [
    {
      label: '2021.02.12',
      value: '2021.02.12'
    },
    {
      label: '2021.03.21',
      value: '2021.03.21'
    },
    {
      label: '2021.02.13',
      value: '2021.02.13'
    }
  ],
  optionLaboratory: [
    {
      label: '物理实验室',
      value: '物理实验室'
    },
    {
      label: '化学实验室',
      value: '化学实验室'
    }
  ],
  optionStore: [
    {
      label: '橱柜',
      value: '橱柜'
    },
    {
      label: '橱柜2',
      value: '橱柜2'
    }
  ],
  optionPile: [
    {
      labeL: '第一层',
      value: '第一层'
    },
    {
      label: '第二层',
      value: '第二层'
    },
    {
      label: '第三层',
      value: '第三层'
    }
  ]
})

const fileData = reactive({
  token: store.state.login.userInfo.token
})

let { instrumentList, week, optionType, optionScope, optionDisposal } = toRefs(dataMap)

const initData = () => {
  instrumentList.value = []
  scrapRegistrationInfo.value.list = []
  scrapRegistrationInfo.value.desc = ''
  scrapRegistrationInfo.value.url = []
}

initData()
const currentPage = ref(1)
const pageSize = ref(10)
const containerTotal = ref(100)
const search = (id: any) => {
  getInstrumentInfo({
    keyword: searchValue.value,
    subject_id: id,
    limit: pageSize.value,
    page: currentPage.value
  }).then((res) => {
    instrumentList.value = res.data.data
    containerTotal.value = res.data.count
    instrumentList.value.forEach((item) => {
      Object.assign(item, { stockStatus: false })
      // item.detail.forEach((element) => {
      //   Object.assign(element, { hardware_number: item.number, asset_number: item.asset_number, bacth: item.bacth })
      // })
    })
  })
}
const handleTableCurrentPage = (val: number) => {
  currentPage.value = val
  search(store.state.login.userInfo.subject_id)
}
const handleSizeChange = (val: number) => {
  pageSize.value = val
  search(store.state.login.userInfo.subject_id)
}
const getSchoolInstrumentDetail = async (item: any) => {
  try {
    const params = {
      id: item.id
    }
    const { data, code } = await schoolInstrumentDetail(params)
    if (code === 10) {
      item.detail = data
      item.stockStatus = true
    }
  } catch (error) {
    console.log(error)
  }
}

defineExpose({
  search
})

const addScrap = (info: any) => {
  if (scrapRegistrationInfo.value.list.some((e: any) => e.id === info.id)) {
    ElMessageBox.alert('当前仪器已在清单中!', '提示', {
      confirmButtonText: '确认'
    })
    return
  }
  scrapRegistrationInfo.value.list.push({
    id: info.id,
    hardware_number: info.hardware_number,
    asset_number: info.asset_number,
    name: info.name,
    bacth: info.bacth,
    instrument_id: info.instrument_id,
    specification: '',
    laboratory_id: info.school_laboratory_id,
    laboratory_name: info.laboratory_name,
    store_name: info.store_name,
    store_id: info.store_id,
    number_plies: info.number_plies,
    total: info.total,
    type: 1,
    unit_price: info.unit_price
  })
}
const fileListRes = ref<any>([])
const uploadSuccess = (response: unknown, file: UploadFile, fileList: UploadFile[]) => {
  const urlData: any = []
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
    fileListRes.value.push({
      url: str,
      name: e.name
    })
  })
  scrapRegistrationInfo.value.url = urlData
}

const handleRemove = (file: UploadFile, fileList: UploadFile[]) => {
  const urlData: any = []
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
    fileListRes.value.push({
      url: str,
      name: e.name
    })
  })
  scrapRegistrationInfo.value.url = urlData
}

const remove = (pot: number) => {
  scrapRegistrationInfo.value.list.splice(pot, 1)
}

const commit = (status: number) => {
  if (!scrapRegistrationInfo.value.mode) {
    ElMessage({
      type: 'warning',
      message: '请选择类型'
    })
    return
  }
  if (!scrapRegistrationInfo.value.cause) {
    ElMessage({
      type: 'warning',
      message: '请选择报废理由'
    })
    return
  }
  if (!scrapRegistrationInfo.value.process_mode) {
    ElMessage({
      type: 'warning',
      message: '请选择处理方式'
    })
    return
  }
  if (!scrapRegistrationInfo.value.price) {
    ElMessage({
      type: 'warning',
      message: '请输入报废金额'
    })
    return
  }
  if (scrapRegistrationInfo.value.list.length === 0) {
    ElMessage({
      type: 'warning',
      message: '请选择仪器'
    })
    return
  }
  scrapRegistrationInfo.value.status = status
  // if (scrapRegistrationInfo.value.list.length === 0) {
  //   ElMessage('清单不能为空')
  //   return
  // }
  postAddScrapInfo(scrapRegistrationInfo.value).then((res) => {
    if (res.code === 10) {
      conserveShow.value = false
      search(store.state.login.userInfo.subject_id)
    }
  })
}
const back = () => {
  emit('back')
}
</script>
<style lang="scss" scoped>
:deep(.el-input__inner) {
  width: 200px;
}
::v-deep .el-pagination .el-input__inner {
  width: 100px;
}
:deep(.el-textarea) {
  width: 200px;
}
:deep(.imgArea) {
  .uploadImg {
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
}
.leftArea {
  background-color: #ffffff;
  width: 50%;
  float: left;
  height: 800px;
  margin-top: 20px;

  .head-area {
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    float: left;
    background-color: #dcece3;
    .title {
      float: left;
      width: 30%;
      font-size: 20px;
      color: #05c65d;
    }
    .buttonArea {
      width: 60%;
      float: left;
      margin-left: 30%;
    }
  }
  .title2 {
    width: 100%;
    font-size: 20px;
    color: #05c65d;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 15px 0 15px 0;
  }
  .topArea {
    width: 90%;
    height: 30%;
    float: left;
    margin-left: 5%;
    padding: 10px 0 10px 0;
    border: 1px solid #05c65d;
    .nav {
      width: 55%;
      height: 40px;
      float: left;
      // align-items: center;
      display: flex;
      justify-content: left;
      .name {
        float: left;
        width: 100px;
        height: 40%;
        margin-left: 20px;
        align-items: center;
        display: flex;
      }

      span {
        display: inline-block;
        text-align: left;
      }

      img {
        width: 80px;
        height: 80px;
        float: left;
      }
    }
    .first {
      text-align: left;
      display: flex;
      .nav {
        width: 60%;
        height: 40px;
        float: left;
        align-items: center;
        display: flex;
        .name {
          float: left;
          width: 25%;
          height: 40%;
          margin-left: 20px;
          align-items: center;
          display: flex;
        }

        span {
          text-align: left;
        }

        img {
          width: 80px;
          height: 80px;
          float: left;
        }
      }
      .nav-type {
        width: 68%;
      }
      .nav-img {
        display: flex;
        align-items: flex-start;
        .name {
          width: 70px;
        }
      }
    }
    .title2 {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .titleArea {
    width: 50%;
    margin: 10px 0 10px 0;
    float: left;
  }
  .bottomArea {
    width: 90%;
    height: 40%;
    float: left;
    margin-left: 5%;
    border: 1px solid #05c65d;
    // padding: 10px 0 10px 0;
    .tableArea {
      width: 100%;
      float: left;
    }
    .title {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: green;
      margin: 10px 0 10px 0;
      cursor: pointer;
    }
  }
}
.rightArea {
  width: 45%;
  height: 800px;
  overflow-y: scroll;
  float: right;
  padding: 10px 0 10px 0;
  margin-top: 10px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .containerArea {
    height: 750px;
    overflow-y: auto;
  }
  .infoArea {
    width: 90%;
    float: left;
    margin-left: 5%;
    margin-top: 20px;
    border: 1px solid #05c65d;
    .detailList {
      width: 100%;
      .part {
        margin: 10px 0;
        display: flex;
        text-align: left;
        .name {
          min-width: 80px;
          float: left;
          margin-left: 20px;
          display: flex;
          vertical-align: top;
        }
        .weekArea {
          width: 12%;
          background: #dcece3;
          margin-left: 2%;
        }
        img {
          width: 80px;
          height: 80px;
          float: left;
        }
      }
      .stockTitle {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: green;
        margin: 10px 0 10px 0;
        cursor: pointer;
      }
    }
  }
}
</style>
