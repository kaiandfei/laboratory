<template>
  <div>
    <el-dialog
      custom-class="edit-dialog"
      v-model="editState"
      width="50%"
      title="损耗、报废登记卡编辑"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <div class="topArea">
        <div class="titleArea">
          <span style="float: left; margin-left: 5%">损耗报废状态:</span>
          <span style="margin-left: 0%; color: #ee9a59">
            <span v-show="scrapRegistrationList.status === 1">未提交</span>
            <span v-show="scrapRegistrationList.status === 2">待审核</span>
            <span v-show="scrapRegistrationList.status === 3">已撤回</span>
            <span v-show="scrapRegistrationList.status === 4">通过</span>
            <span v-show="scrapRegistrationList.status === 5">未通过</span>
          </span>
        </div>
        <div class="detailArea">
          <div class="nav" style="width: 50%">
            <div class="name">类型：</div>
            <div>
              <el-select v-model="scrapRegistrationList.mode">
                <el-option
                  v-for="item in optionType"
                  :key="item.label"
                  :value="item.value"
                  :label="item.label"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="nav" style="float: right">
            <div class="name">损耗报废单号：</div>
            <div>{{ scrapRegistrationList.record_number }}</div>
          </div>
          <div class="nav" style="width: 50%">
            <div class="name">原因</div>
            <div>
              <el-select v-model="scrapRegistrationList.cause">
                <el-option
                  v-for="item in optionScope"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="nav" style="float: right; margin-bottom: 40px">
            <div class="name">提交时间</div>
            <div>{{ scrapRegistrationList.put_time }}</div>
          </div>
          <div class="nav" style="width: 50%">
            <div class="name">处理方式</div>
            <el-select v-model="scrapRegistrationList.process_mode">
              <el-option
                v-for="item in optionDisposal"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </div>
          <div class="nav" style="width: 50%">
            <div class="name">价值</div>
            <div>
              <el-input v-model="scrapRegistrationList.price"></el-input>
            </div>
          </div>
          <div class="nav" style="float: right; height: 40px">
            <div class="name">审核人</div>
            <div>{{ scrapRegistrationList.audit_user_name }}</div>
          </div>
          <div class="nav" style="width: 50%; height: 60px">
            <div class="name">备注</div>
            <div>
              <el-input v-model="scrapRegistrationList.desc" type="textarea" :rows="2"></el-input>
            </div>
          </div>
          <div class="nav" style="float: right; height: 40px">
            <div class="name">审核时间</div>
            <div>{{ scrapRegistrationList.audit_time }}</div>
          </div>
          <div class="nav" style="float: right; height: 90px">
            <div class="name">审核备注</div>
            <div>{{ scrapRegistrationList.audit_desc }}</div>
          </div>
          <div class="nav" style="width: 65%; height: 100px; display: block">
            <div class="name" style="width: 30%">上传照片说明</div>
            <div class="imgArea">
              <el-upload
                class="uploadImg"
                ref="upload"
                v-model:file-list="imgList"
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
            </div>
          </div>
        </div>
        <div class="tableArea">
          <el-table
            :data="scrapRegistrationList.list"
            style="width: 100%"
            height="220"
            :header-cell-style="{ background: '#DCECE3', color: '#000' }"
            :cell-style="{ background: '#ffffff', borderBottom: '1px solid #EFEFEF' }"
            row-key="id"
            :tree-props="{ children: 'detail', hasChildren: 'hasChildren' }"
          >
            <el-table-column label="学校编号" prop="asset_number"></el-table-column>
            <el-table-column label="名称" prop="name"></el-table-column>
            <!-- <el-table-column label="批次" prop="bacth">
              <template #default="scope">
                <input v-if="!scope.row.detail" style="width: 100%" v-model="scope.row.bacth" />
                <span v-if="scope.row.detail">{{ scope.row.bacth }}</span>
              </template>
            </el-table-column> -->
            <el-table-column label="仪器库" prop="laboratory_id">
              <template #default="scope">
                <div v-if="!scope.row.detail">
                  <select
                    v-model="scope.row.laboratory_id"
                    @change="getData(scope.row.laboratory_id, scope.row.id, scope.$index)"
                  >
                    <option
                      v-for="item in optionsLaboratory"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value"
                    ></option>
                  </select>
                </div>
                <div v-if="scope.row.detail">{{ scope.row.laboratory_name }}</div>
              </template>
            </el-table-column>
            <el-table-column label="仪器柜" prop="store_id">
              <template #default="scope">
                <div v-if="!scope.row.detail">
                  <select v-model="scope.row.store_id">
                    <option
                      v-for="item in optionStore(storeListBox[scope.$index])"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value"
                    ></option>
                  </select>
                </div>
                <div v-if="scope.row.detail">{{ scope.row.store_name }}</div>
              </template>
            </el-table-column>
            <el-table-column label="层数" prop="number_plies">
              <template #default="scope">
                <div v-if="!scope.row.detail">
                  <select v-model="scope.row.number_plies">
                    <option
                      v-for="item in optionPlies(storeListBox[scope.$index], scope.row.store_id || 1)"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value"
                    ></option>
                  </select>
                </div>
                <div v-if="scope.row.detail">{{ '第' + scope.row.number_plies + '层' }}</div>
              </template>
            </el-table-column>
            <el-table-column label="数量" prop="total">
              <template #default="scope">
                <div v-if="!scope.row.detail">
                  <input type="number" style="width: 100%" v-model="scope.row.total" />
                </div>
                <div v-if="scope.row.detail">{{ scope.row.total }}</div>
              </template>
            </el-table-column>
            <!-- <el-table-column label="操作">
              <template #default="scope">
                <div v-if="scope.row.detail" style="color: green; cursor: pointer" @click="addScrapList(scope.row.id)">
                  新增维修
                </div>
                <div
                  v-if="!scope.row.detail"
                  style="color: green; cursor: pointer"
                  @click="deleteList(scope.row.id, scope.row.Pid)"
                >
                  删除
                </div>
              </template>
            </el-table-column> -->
          </el-table>
        </div>
      </div>
      <div class="buttonArea">
        <el-button type="info" @click="cancel()">取消</el-button>
        <el-button type="primary" @click="saveData()">保存</el-button>
        <el-button type="primary" @click="commitData()">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref, toRefs, reactive, computed } from 'vue'
import { BASE_URL } from '@service/request/config'
import { useStore } from '@store/index'
import {
  getEditScrapInfo,
  getLaboratoryList,
  storeByLaboratory,
  postEditScrapInfo,
  submitScrapInfo
} from '@/service/instrument-manage/scrapRegistration/index'
import { editScrapInfoDetailData, editScrapData } from '@/service/instrument-manage/scrapRegistration/types'
import type { UploadFile } from 'element-plus/es/components/upload/src/upload.type'
import { ElMessage } from 'element-plus'

let props = defineProps({ editShow: Boolean, selectID: { type: Number, required: true } })
let { editShow, selectID } = toRefs(props)
let emit = defineEmits(['back'])
let editState = ref(false)
const subjectID: any = ref(0)

subjectID.value = JSON.parse(sessionStorage.getItem('state') || '').login.userInfo.subject_id

const store = useStore()

const fileData = reactive({
  token: store.state.login.userInfo.token
})

editState.value = editShow.value
const dataMap = reactive({
  // scrapRegistrationList: {
  //   type: '维修',
  //   scrap_status: '已撤回',
  //   scrap_number: '2929029',
  //   reason: '',
  //   submit_time: '202110.21',
  //   deal_solution: '实验室留用',
  //   value: 1000,
  //   detail: '',
  //   audit_user: '',
  //   audit_time: '',
  //   audit_detail: '',
  //   imgDetail: [
  //     {
  //       id: 1,
  //       url: 'https://swryangzhou.oss-cn-beijing.aliyuncs.com/image/20220209/172710585.jpg'
  //     },
  //     {
  //       id: 2,
  //       url: ''
  //     }
  //   ]
  // },
  scrapRegistrationList: editScrapInfoDetailData,
  editScrapInfo: editScrapData,
  storeListBox: Array<
    {
      id: number
      title: string
      number_plies: number
    }[]
  >(),
  optionsLaboratory: [
    {
      value: 0,
      name: ''
    }
  ],
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
  ]
})
let { scrapRegistrationList, optionScope, optionType, optionDisposal, optionsLaboratory, storeListBox, editScrapInfo } =
  toRefs(dataMap)

const imgList: any = ref([
  {
    url: ''
  }
])

const initData = () => {
  imgList.value = []
  getEditScrapInfo({ id: selectID.value }).then((res) => {
    scrapRegistrationList.value = res.data
    scrapRegistrationList.value.list.forEach((item) => {
      Object.assign(item, { detail: [] })
    })
    res.data.pic.forEach((item) => {
      imgList.value.push({
        url: item.url_path
      })
      editScrapInfo.value.url = [item.url_path]
    })
  })
}

initData()

getLaboratoryList({ subject: subjectID.value }).then((res) => {
  let arr = Array<{
    value: number
    name: string
  }>()

  res.data.data.forEach((e) => {
    const obj = {
      value: e.id,
      name: e.title
    }
    arr.push(obj)
  })
  optionsLaboratory.value = arr
})

const getData = (ID: number, rowId: number, index: number) => {
  storeByLaboratory({ id: ID }).then((res) => {
    storeListBox.value[index] = res.data
  })
}

let optionStore = computed(() => {
  return (list: { id: number; title: string }[]) => {
    let arr = Array<{
      value: number
      name: string
    }>()
    list?.forEach((e) => {
      const obj = {
        value: e.id,
        name: e.title
      }
      arr.push(obj)
    })
    return arr
  }
})

let optionPlies = computed(() => {
  return (list: { id: number; number_plies: number }[], storeId: number) => {
    let num = 1
    list?.forEach((e) => {
      if (e.id === storeId) {
        num = e.number_plies
      }
    })
    let arr = Array<{
      value: number
      name: string
    }>()
    for (let i = 0; i < num; i++) {
      const obj = {
        value: i + 1,
        name: `第${i + 1}层`
      }
      arr.push(obj)
    }
    return arr
  }
})

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
  editScrapInfo.value.url = urlData
}

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
  editScrapInfo.value.url = urlData
}

// const addScrapList = (id: number) => {
//   let index = 0
//   scrapRegistrationList.value.list.forEach((item, pot) => {
//     if (id === item.id) {
//       index = pot
//     }
//   })

//   let count = 0
//   scrapRegistrationList.value.list[index].detail.forEach((item) => {
//     count = count + Number(item.total)
//   })
//   if (count > scrapRegistrationList.value.list[index].total) {
//     ElMessage('数量超出')
//     return
//   }
//   scrapRegistrationList.value.list[index].detail.push({
//     Pid: scrapRegistrationList.value.list[index].detail.length,
//     laboratory_name: '',
//     store_name: '',
//     bacth: '',
//     laboratory_id: 1,
//     store_id: 1,
//     number_plies: 1,
//     total: 0
//   })
//   console.log(scrapRegistrationList.value.list)
// }

// const deleteList = (id: number, pot: number) => {
//   let index = 0
//   scrapRegistrationList.value.list.forEach((item, position) => {
//     if (id === item.id) {
//       index = position
//     }
//   })

//   scrapRegistrationList.value.list[index].detail.splice(pot - 1, 1)
// }

// 保存功能
const saveData = () => {
  editScrapInfo.value.list = []
  scrapRegistrationList.value.list.forEach((item) => {
    editScrapInfo.value.list.push({
      id: item.id,
      laboratory_id: item.laboratory_id,
      instrument_id: item.instrument_id,
      store_id: item.store_id,
      total: item.total,
      name: item.name,
      number_plies: item.number_plies,
      bacth: item.bacth,
      asset_number: item.asset_number,
      hardware_number: item.hardware_number,
      unit_price: item.unit_price
    })
  })

  editScrapInfo.value.id = selectID.value
  editScrapInfo.value.mode = scrapRegistrationList.value.mode
  editScrapInfo.value.cause = scrapRegistrationList.value.cause
  editScrapInfo.value.process_mode = scrapRegistrationList.value.process_mode
  editScrapInfo.value.price = scrapRegistrationList.value.price
  editScrapInfo.value.desc = scrapRegistrationList.value.desc
  editScrapInfo.value.status = 1

  postEditScrapInfo(editScrapInfo.value).then((res) => {
    if (res.code === 10) {
      ElMessage({
        message: '保存成功',
        type: 'success'
      })
      emit('back')
    }
  })
}

const commitData = () => {
  editScrapInfo.value.list = []
  scrapRegistrationList.value.list.forEach((item) => {
    editScrapInfo.value.list.push({
      id: item.id,
      laboratory_id: item.laboratory_id,
      instrument_id: item.instrument_id,
      store_id: item.store_id,
      total: item.total,
      name: item.name,
      number_plies: item.number_plies,
      bacth: item.bacth,
      asset_number: item.asset_number,
      hardware_number: item.hardware_number,
      unit_price: item.unit_price
    })
  })

  editScrapInfo.value.id = selectID.value
  editScrapInfo.value.mode = scrapRegistrationList.value.mode
  editScrapInfo.value.cause = scrapRegistrationList.value.cause
  editScrapInfo.value.process_mode = scrapRegistrationList.value.process_mode
  editScrapInfo.value.price = scrapRegistrationList.value.price
  editScrapInfo.value.desc = scrapRegistrationList.value.desc
  editScrapInfo.value.status = 2

  postEditScrapInfo(editScrapInfo.value).then((res) => {
    if (res.code === 10) {
      ElMessage({
        message: '提交成功',
        type: 'success'
      })
      emit('back')
    }
  })
  // editScrapInfo.value.list = []
  // for (const key in scrapRegistrationList.value.list) {
  //   scrapRegistrationList.value.list[key].detail.forEach((item) => {
  //     editScrapInfo.value.list.push({
  //       id: item.Pid,
  //       laboratory_id: item.laboratory_id,
  //       instrument_id: scrapRegistrationList.value.list[key].instrument_id,
  //       store_id: item.store_id,
  //       total: item.total,
  //       name: scrapRegistrationList.value.list[key].name,
  //       number_plies: item.number_plies,
  //       bacth: item.bacth
  //     })
  //   })
  // }
  // editScrapInfo.value.mode = scrapRegistrationList.value.mode
  // editScrapInfo.value.cause = scrapRegistrationList.value.cause
  // editScrapInfo.value.process_mode = scrapRegistrationList.value.process_mode
  // editScrapInfo.value.cost = scrapRegistrationList.value.cost
  // editScrapInfo.value.desc = scrapRegistrationList.value.desc
  // console.log(editScrapInfo.value)
  // postEditScrapInfo(editScrapInfo.value).then((res) => {
  //   console.log(res)
  // })
  // submitScrapInfo({ id: selectID.value }).then((res) => {
  //   if (res.code === 10) {
  //     emit('back')
  //   }
  // })
}

const cancel = () => {
  emit('back')
}
</script>
<style lang="scss" scoped>
:deep(.el-input__inner) {
  width: 200px;
}

:deep(.el-textarea) {
  width: 200px;
}

:deep(.imgArea) {
  .uploadImg {
    text-align: left;
    .el-upload--picture-card {
      // float: left;
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

:deep(.edit-dialog) {
  margin-top: 50px;
  height: 850px;
  .el-dialog__body {
    border-top: #05c65d 1px solid;
    box-sizing: border-box;
    .title-box {
      display: flex;
      justify-content: space-evenly;
      height: 60px;
      .edit-title {
        width: 24%;
        height: 40px;
        line-height: 40px;
        color: #848484;
        border: #b5b5b5 1px solid;
        box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
        border-radius: 5px;
        cursor: pointer;
      }
      .active-item {
        color: #05c65d;
      }
    }
    .titleArea {
      width: 40%;
      height: 5%;
      float: left;
      margin-left: 5%;
      // display: flex;
      // justify-content: center;
      // align-items: center;
    }
    .detailArea {
      width: 90%;
      height: 420px;
      float: left;
      margin-left: 5%;
      padding: 0;
      border: 1px solid #05c65d;
      .nav {
        width: 35%;
        height: 40px;
        float: left;
        align-items: center;
        // justify-content: left;
        display: flex;
        .name {
          float: left;
          width: 40%;
          height: 40%;
          margin-left: 20px;
          align-items: center;
          display: flex;
        }
        .imgArea {
          margin-top: 20px;
          width: 280px;
          height: 80px;
          float: left;
        }
      }
    }
    .tableArea {
      width: 90%;
      height: 220px;
      float: left;
      margin-left: 5%;
      margin-top: 20px;
      border: 1px solid #05c65d;
    }
    .buttonArea {
      height: 50px;
      margin: 20px 5% 10px 0;
      float: right;
    }
  }
}
</style>
