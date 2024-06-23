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
          <span style="color: #05c65d" v-show="scrapRegistrationList.status === 1">未提交</span>
          <span style="color: #05c65d" v-show="scrapRegistrationList.status === 2">待审核</span>
          <span style="color: #05c65d" v-show="scrapRegistrationList.status === 3">已撤回</span>
          <span style="color: #05c65d" v-show="scrapRegistrationList.status === 4">审核通过</span>
          <span style="color: #05c65d" v-show="scrapRegistrationList.status === 5">审核未通过</span>
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
          <div class="nav" style="float: right; height: 40px">
            <div class="name">审核人</div>
            <div>{{ scrapRegistrationList.audit_name }}</div>
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
          <div class="nav" style="width: 50%; height: 100px; display: block">
            <div class="name">上传照片说明</div>
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
          <div class="nav" style="float: right; height: 90px">
            <div class="name">审核备注</div>
            <div>{{ scrapRegistrationList.audit_desc }}</div>
          </div>
        </div>
        <div class="tableArea">
          <el-table
            :data="scrapRegistrationList.list"
            style="width: 100%"
            height="250"
            :header-cell-style="{ background: '#DCECE3', color: '#000' }"
            :cell-style="{ background: '#ffffff', borderBottom: '1px solid #EFEFEF' }"
          >
            <el-table-column label="分类编号" prop="asset_number"></el-table-column>
            <el-table-column label="资产编号" prop="asset_number"></el-table-column>
            <el-table-column label="名称" prop="name"></el-table-column>
            <!-- <el-table-column label="操作">
              <template #default="scope">
                <div style="color: green; cursor: pointer" @click="deleteList(scope.$index, scope.row.id)">删除</div>
              </template>
            </el-table-column> -->
          </el-table>
        </div>
      </div>
      <div class="buttonArea">
        <el-button type="info" @click="cancel()">取消</el-button>
        <el-button type="primary" @click="commitData(1)">保存</el-button>
        <el-button type="primary" @click="commitData(2)">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref, toRefs, reactive } from 'vue'
import { BASE_URL } from '@service/request/config'
import { useStore } from '@store/index'
import {
  getEditScrapInfo,
  postEditScrapInfo,
  deleteEquInfo,
  submitScrapInfo
} from '@/service/equ-manage/scrapRegistration/index'
import { editScrapInfoDetailData, editScrapData } from '@/service/equ-manage/scrapRegistration/types'
import type { UploadFile } from 'element-plus/es/components/upload/src/upload.type'

let props = defineProps({ editShow: Boolean, selectID: { type: Number, required: true } })
let { editShow, selectID } = toRefs(props)
let emit = defineEmits(['back'])
let editState = ref(false)

const store = useStore()

const fileData = reactive({
  token: store.state.login.userInfo.token
})

editState.value = editShow.value
const dataMap = reactive({
  scrapRegistrationList: editScrapInfoDetailData,
  editScrapInfo: editScrapData,
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
let { scrapRegistrationList, optionScope, optionType, optionDisposal, editScrapInfo } = toRefs(dataMap)

const imgList: any = ref([
  {
    url: ''
  }
])

const initData = () => {
  imgList.value = []
  getEditScrapInfo({ id: selectID.value }).then((res) => {
    if (res.code === 10) {
      scrapRegistrationList.value = res.data
      res.data.pic.forEach((item) => {
        imgList.value.push({
          url: item.url_path
        })
        editScrapInfo.value.url = [item.url_path]
      })
    }
  })
}

initData()

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

const deleteList = (index: number, id: number) => {
  scrapRegistrationList.value.list.splice(index, 1)
  deleteEquInfo({ id: id })
}

const commitData = (type: number) => {
  editScrapInfo.value.id = scrapRegistrationList.value.id
  editScrapInfo.value.list = scrapRegistrationList.value.list
  editScrapInfo.value.mode = scrapRegistrationList.value.mode
  editScrapInfo.value.cause = scrapRegistrationList.value.cause
  editScrapInfo.value.process_mode = scrapRegistrationList.value.process_mode
  editScrapInfo.value.desc = scrapRegistrationList.value.desc
  editScrapInfo.value.status = type
  postEditScrapInfo(editScrapInfo.value).then((res) => {
    if (res.code === 10) {
      emit('back')
    }
  })
  if (type === 2) {
    submitScrapInfo({ id: selectID.value }).then((res) => {
      if (res.code === 10) {
        emit('back')
      }
    })
  }
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
      height: 390px;
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
          width: 200px;
          height: 80px;
          float: left;
        }
      }
    }
    .tableArea {
      width: 90%;
      height: 250px;
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
