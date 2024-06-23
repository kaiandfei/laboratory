<template>
  <header>
    <div class="breadCrumbs">
      <div>实验室管理</div>
      <div class="back" v-if="goMgtTabs" @click="backLabMgt">
        <img class="backImg" src="@/assets/images/laboratory-manage/back.png" alt="" />
        <span>返回</span>
      </div>
    </div>
  </header>

  <div v-if="!goMgtTabs">
    <div class="recommend">
      <div class="filter-box">
        <BaseFilter :config-data="filterData" @change-filter="changeFilter" />
      </div>
      <div v-if="![4].includes(store.state.login.userInfo.role_id)" class="btn" @click="addLab">录入实验室</div>
    </div>
    <p class="title">共筛选出{{ laboratoryObj.count }}条</p>
    <div class="item-box">
      <div class="item-laboratory" v-for="(item, index) in laboratoryObj.data" :key="index">
        <p
          :style="{ color: item.color_code, background: item.color_code.replace(')', ', 0.1)') }"
          class="one-line"
          :title="item.title"
        >
          <span class="icon" :style="{ background: item.color_code }" />
          {{ item.title }}
        </p>
        <div class="item-content" @click="showDetail(item)">
          <div class="lable" v-if="item.camera.length !== 0">{{ item.online === 1 ? '使用中' : '空 闲' }}</div>
          <div class="detail-box">
            <img class="cameraCss" v-if="item.online === 1" src="@/assets/images/laboratory-manage/camera.png" alt="" />
            <img class="cameraCss" v-else src="@/assets/images/laboratory-manage/cameraoff.png" alt="" />
            <div class="img-box" v-if="item.camera.length === 0">
              <img :src="item.picture" alt="" />
              <!-- <img src="@/assets/images/laboratory-manage/lab.png" alt="" /> -->
            </div>
            <div class="img-box" v-if="filter1(item)" @click.stop="searchCamera(item.camera)">
              <img src="@/assets/images/laboratory-manage/cam.png" alt="" style="width: 100%" />
              <img
                class="cameraicon"
                v-show="item.camera[0]?.channelStatus === 1"
                src="@/assets/images/laboratory-manage/camera.png"
              />
              <img
                class="cameraicon"
                v-show="item.camera[0]?.channelStatus === 0"
                src="@/assets/images/laboratory-manage/cameraoff.png"
              />
            </div>
          </div>
          <!-- <div class="line" /> -->
          <div class="click-box">
            <p v-if="![4].includes(store.state.login.userInfo.role_id)" @click.stop="handleManage(item)">
              <img src="../../../assets/images/laboratory-standard/edit.png" alt="" />
              管理
            </p>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      custom-class="laboratory-add-dialog"
      v-model="addShow"
      :title="!editFormInput.id ? '新增实验室' : '编辑实验室'"
      width="50%"
    >
      <el-form ref="addRuleFormRef" :model="editFormInput" :rules="addRules" label-width="160px" :key="addShow">
        <el-form-item label="实验名称：" prop="title">
          <el-input
            v-model="editFormInput.title"
            placeholder="请输入实验室名称"
            maxlength="25"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="类型：" prop="type" class="sel-tag">
          <el-select
            v-model="editFormInput.type"
            multiple
            collapse-tags
            placeholder="请选择"
            style="width: 90% !important"
          >
            <el-option
              v-show="item.id !== 0"
              v-for="item in typeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学科：" prop="subject">
          <el-checkbox-group v-model="editFormInput.subject">
            <el-checkbox
              v-for="item in subjectArr"
              :key="item.id"
              :label="item.id"
              :disabled="store.state.login.userInfo.role_id === 2"
            >
              {{ item.name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <!-- <el-form-item label="分类：" prop="level">
          <el-radio-group v-model="editFormInput.level">
            <el-radio :label="1">Ⅰ类</el-radio>
            <el-radio :label="2">Ⅱ类</el-radio>
            <el-radio :label="3">Ⅲ类</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <!-- <el-form-item label="学科分类：">
          <el-checkbox-group v-model="editFormInput.subject_type">
            <el-checkbox :label="1">文科</el-checkbox>
            <el-checkbox :label="2">理科</el-checkbox>
          </el-checkbox-group>
        </el-form-item> -->
        <!-- <el-form-item label="配备：">
          <el-radio-group v-model="editFormInput.is_must">
            <el-radio :label="1">必配</el-radio>
            <el-radio :label="2">选配</el-radio>
          </el-radio-group>
        </el-form-item> -->

        <el-form-item label="建设时间：">
          <el-date-picker
            v-model="editFormInput.build_time"
            type="date"
            placeholder="请选择建设时间"
            size="small"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="功能描述：">
          <el-input
            type="textarea"
            v-model="editFormInput.desc"
            placeholder="请输入功能描述"
            maxlength="256"
            show-word-limit
            style="width: 90%"
          ></el-input>
        </el-form-item>
        <el-form-item label="位置：" prop="location">
          <el-input v-model="editFormInput.location" placeholder="请输入位置" maxlength="25" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="面积：" prop="area">
          <el-input
            v-model="editFormInput.area"
            @keyup="inputAdjust"
            oninput="if(value>500)value=500"
            @input="(val:any) => inputChange(val, 'area')"
            placeholder="请输入面积"
            style="width: 90%"
          ></el-input>
          ㎡
        </el-form-item>
        <el-form-item label="实验室底色：" class="icon-box" prop="color_code">
          <el-color-picker
            v-model="editFormInput.color_code"
            color-format="rgb"
            size="small"
            @active-change="colorChange"
          />
          <!-- <i
            class="icon-square"
            v-for="(item, index) in ['(238,163,89)', '(48,185,48)', '(95,175,228)', '(238,238,89)']"
            :style="{
              background: 'rgb' + item,
              border: item === editFormInput.color_code ? '2px solid #fff' : '',
              boxShadow: item === editFormInput.color_code ? '0px 3px 6px rgba(0, 0, 0, 0.16)' : ''
            }"
            @click="editFormInput.color_code = item"
            :key="index"
          ></i> -->
        </el-form-item>
        <el-form-item label="上传实验室照片：" prop="picture">
          <el-upload
            ref="upload"
            :action="BASE_URL + 'swrserveadmin/OssImage/uploadImage'"
            :data="{
              token: store.state.login.userInfo.token
            }"
            name="image"
            list-type="picture-card"
            :before-upload="beforeAvatarUpload"
            :on-success="uploadSuccess"
            :on-remove="handleRemove"
            :file-list="filesList"
            accept=".jpg,.png,.jpeg"
          >
            <span>+点击上传</span>
            <!-- <el-icon><plus /></el-icon> -->
          </el-upload>
        </el-form-item>
        <el-form-item label="管理员：" prop="userIDs" class="sel-tag">
          <el-select
            v-model="editFormInput.userIDs"
            multiple
            collapse-tags
            placeholder="请选择"
            style="width: 90% !important"
          >
            <el-option v-for="item in optionsAdmin" :key="item.id" :label="item.username" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预约是否审核" prop="is_order">
          <el-radio-group v-model="editFormInput.is_order">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="绑定设备号：">
          <!-- <div class="camerabox">
            <div class="camerasel"> -->
          <el-select v-model="editFormInput.camera.deviceSerial" placeholder="请选择" style="width: 90% !important">
            <el-option
              v-for="item in caremaList"
              :key="item.deviceSerial"
              :label="item.deviceName"
              :value="item.deviceSerial"
              @click="selcamera(item)"
            ></el-option>
          </el-select>
          <!-- </div>
          </div> -->
        </el-form-item>
        <el-form-item label="通道号：">
          <!-- <div class="camerabox">
            <div class="cameratd"> -->
          <el-select v-model="editFormInput.camera.channelName" placeholder="请选择" style="width: 90% !important">
            <el-option
              v-for="item in cameratd"
              :key="item.channelId"
              :label="item.channelName"
              :value="item.channelId"
              @click="selcamera1(item)"
            ></el-option>
          </el-select>
          <!-- </div>
          </div> -->
        </el-form-item>
        <el-form-item label="实验室二维码：">
          <img v-if="editFormInput.qr_code" style="width: 130px; height: 130px" :src="editFormInput.qr_code" alt="" />
          <!-- <qrcode-vue class="qr-img" :value="baseUrl + editFormInput.id" :size="100" level="H" /> -->
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="addSureClick(addRuleFormRef)">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog custom-class="laboratory-detail-dialog" v-model="detailShow" title="实验室详情" width="45%">
      <div class="list fl">
        <p>
          <span>实验名称：</span>
          <span>{{ editFormData.title }}</span>
        </p>
        <p>
          <span>类型：</span>
          <span v-for="(item, index) in editFormData.type" :key="index">{{ item.name }}&nbsp;&nbsp;</span>
        </p>
        <p>
          <span>学科：</span>
          <span v-for="(item, index) in editFormData.subject" :key="index">
            {{ subjectArrDetail.find((e) => e.id === item.subject_id)?.name }}&nbsp;&nbsp;
          </span>
        </p>
        <!-- <p>
          <span>分类：</span>
          <span>{{ standardList[editFormData.level].name }}</span>
        </p> -->
        <!-- <p>
          <span>学科分类：</span>
          <span>
            {{ editFormData.subject_type === 1 ? '文科' : editFormData.subject_type === 2 ? '理科' : '文科/理科' }}
          </span>
        </p> -->
        <p>
          <span>配备：</span>
          <span>{{ requireList[editFormData.is_must].name }}</span>
        </p>
        <p class="have-width">
          <span>功能描述：</span>
          <span>
            {{ editFormData.desc }}
          </span>
        </p>
        <p>
          <span>位置：</span>
          <span>{{ editFormData.location }}</span>
        </p>
        <p>
          <span>面积：</span>
          <span>{{ editFormData.area }} ㎡</span>
        </p>
        <p>
          <span>建设时间：</span>
          <span>{{ editFormData.build_time?.split(' ')[0] }}</span>
        </p>
        <p>
          <span>实验室底色：</span>
          <i class="icon-square" :style="{ background: editFormData.color_code }"></i>
        </p>
        <p class="have-width">
          <span>实验室照片：</span>
          <template v-if="editFormData.picture.length > 0">
            <el-image
              v-for="(item, index) in editFormData.picture"
              :key="index"
              style="width: 100px; height: 100px; margin-right: 10px"
              :src="item?.url_path"
              :preview-src-list="[item?.url_path]"
              :initial-index="1"
            ></el-image>
          </template>
        </p>
        <p>
          <span>设备号：</span>
          <template v-if="editFormData.camera.length > 0">
            <span>{{ editFormData.camera[0]?.deviceName ? editFormData.camera[0].deviceName : '' }}</span>
          </template>
        </p>
        <p>
          <span>通道号：</span>
          <template v-if="editFormData.camera.length > 0">
            <span>{{ editFormData.camera[0]?.channelName ? editFormData.camera[0].channelName : '' }}</span>
          </template>
        </p>
      </div>
      <div class="message fr">
        <p class="header">信息</p>
        <p>
          <span>管理员：</span>
          <span v-for="(item, index) in editFormData.users" :key="index">{{ item + ' ' }}</span>
        </p>
        <p id="qrcode1">
          <span>实验室二维码：</span>
          <img class="qr-img" :src="editFormData.qr_code" alt="" />
          <!-- <qrcode-vue class="qr-img" :value="baseUrl + editFormData.id" :size="100" level="H" /> -->
        </p>
        <div class="button" @click="downLoad(editFormData.title)">
          <a href="" id="qrcode1down"></a>
          <img src="@assets/images/laboratory-manage/download.png" alt="" />
          下载
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailShow = false">取消</el-button>
          <el-button type="primary" @click="detailShow = false">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog custom-class="delete-tips-dialog" v-model="deleteDialog" title="提示" width="400px">
      <div class="message">
        <div class="tips">是否确认删除{{ willDeleteItem.title }}？</div>
        <div class="tips color-o">*提示：删除后无法恢复！</div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteDialog = false">取消</el-button>
          <el-button type="primary" @click="sureDel">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
  <!-- <ConfigChecklist v-if="configShow" :item="clickItem" /> -->
  <MgtTabs
    v-if="goMgtTabs"
    :typeList="typeList"
    :_item="_item"
    :backLabMgt="backLabMgt"
    :getData="getData"
    :filesList="filesList"
  />
  <Camera @closepage="closeCanera" v-if="cameraShow" :item="cameraNow"></Camera>
</template>

<script lang="ts" setup>
import { ref, reactive, toRefs, provide } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
// import ConfigChecklist from './component/config-checklist.vue'
import MgtTabs from './mgt-tabs/index.vue'
import Camera from './component/camera.vue'
import { BaseFilter } from '@/components/base-filter'

import { BASE_URL } from '@service/request/config'

import { useStore } from '@store/index'

import { inputAdjust } from '@/utils/common'

import {
  getLaboratoryList,
  getLaboratoryDetail,
  addLaboratory,
  delLaboratory,
  getcameraAll,
  getThoroughfareList,
  getVideo,
  getcameramsg
} from '@service/laboratory-manage/overview/index'
import { getTypeList } from '@service/laboratory-standard/type-manage/index'

import {
  RequestData,
  SelectForm,
  selectFormData,
  RequestDataItemType,
  RequestDataDetail,
  editForm,
  RequestDataItem
} from '@service/laboratory-manage/overview/types'
import { RequestDataLab } from '@service/laboratory-standard/type-manage/types'
import { ConfigDataType } from '@/components/base-filter/src/types'
import type { ElForm } from 'element-plus'
import type { UploadFile } from 'element-plus/es/components/upload/src/upload.type'
// import { Plus } from '@element-plus/icons-vue'

import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons'

const downLoad = (name: string) => {
  // let canvas = document.getElementById('qrcode1')?.getElementsByTagName('canvas')[0]
  // let url = canvas?.toDataURL('image/png')
  let downloadLink = document.getElementById('qrcode1down')
  downloadLink?.setAttribute('href', editFormData.value.qr_code || '')
  downloadLink?.setAttribute('download', name + '二维码.png')
  downloadLink?.click()
}

const store = useStore()

// const standardList = reactive([
//   {
//     id: 0,
//     name: '全部'
//   },
//   {
//     id: 1,
//     name: 'Ⅰ类'
//   },
//   {
//     id: 2,
//     name: 'Ⅱ类'
//   },
//   {
//     id: 3,
//     name: 'Ⅲ类'
//   }
// ])
const requireList = reactive([
  {
    id: 0,
    name: '全部'
  },
  {
    id: 1,
    name: '必配'
  },
  {
    id: 2,
    name: '选配'
  }
])

const dataMap = reactive({
  subjectArr: [...store.state.common.subjectArr],
  subjectArrDetail: [...store.state.common.subjectArr],
  optionsAdmin: [...store.state.common.laboratoryAdminArr],
  typeList: [RequestDataLab],
  laboratoryObj: RequestData,
  willDeleteItem: RequestDataDetail,
  editFormInput: editForm,
  editFormData: RequestDataDetail,
  filterData: Array<ConfigDataType>(),
  filesList: [{ name: 'string', url: 'string' }],
  files: Array<any>(),
  deleteDialog: false,
  clickItem: RequestDataItem,
  searchForm: selectFormData
})
let {
  subjectArr,
  subjectArrDetail,
  optionsAdmin,
  typeList,
  laboratoryObj,
  willDeleteItem,
  editFormInput,
  editFormData,
  filterData,
  filesList,
  files,
  deleteDialog,
  clickItem,
  searchForm
} = toRefs(dataMap)
filesList.value.shift()
let typeArr: {
  id: number
  name: string
}[] = reactive([
  {
    id: 0,
    name: '全部'
  }
])
getTypeList().then((res) => {
  typeList.value = res.data
  typeArr.push(...typeList.value)
})

let subArr = JSON.parse(JSON.stringify(store.state.common.subjectArr))
switch (store.state.login.userInfo.school.school_type_id) {
  case 1:
    subArr = subArr.slice(-1)
    subjectArr.value = subArr.slice(-1)
    subArr.unshift({
      id: 0,
      name: '全部'
    })
    break
  case 2:
  case 3:
  case 4:
  case 5:
    subArr = subArr.slice(0, 3)
    subjectArr.value = subArr.slice(0, 3)
    subArr.unshift({
      id: 0,
      name: '全部'
    })
    break
  case 6:
  case 7:
    subArr.unshift({
      id: 0,
      name: '全部'
    })
    break
}
// console.log(111, subArr)

filterData.value = [
  {
    name: '类型',
    list: typeArr,
    keyName: 'type'
  }
  // {
  //   name: '标准分类',
  //   list: standardList,
  //   keyName: 'classify'
  // },
  // {
  //   name: '配备要求',
  //   list: requireList,
  //   keyName: 'is_must'
  // }
]
if (![2, 3, 4].includes(store.state.login.userInfo.role_id)) {
  filterData.value.unshift({
    name: '学科',
    list: subArr,
    keyName: 'subject'
  })
}

const getData = (form: SelectForm) => {
  if ([2, 3, 4].includes(store.state.login.userInfo.role_id)) {
    form.subject = store.state.login.userInfo.subject_id
  }
  getLaboratoryList(form).then((res) => {
    if (res.code === 10) {
      laboratoryObj.value = res.data
    }
  })
}
getData(searchForm.value)

const changeFilter = (form: SelectForm) => {
  searchForm.value = form
  getData(searchForm.value)
}

let addShow = ref(false)

let addLab = () => {
  getcameraAll({ groupNo: 's' + store.state.login.userInfo.school_code, pageSize: 9999, pageNo: 1 }).then((res) => {
    console.log(res)
    caremaList.value = res.data
  })
  editFormInput.value = editForm
  // editFormInput.value.subject = [searchForm.value.subject]
  if (searchForm.value.subject === 0 && store.state.login.userInfo.role_id === 1) {
    editFormInput.value.subject = []
  } else if (searchForm.value.subject !== 0 && store.state.login.userInfo.role_id === 1) {
    editFormInput.value.subject = [searchForm.value.subject]
  } else {
    editFormInput.value.subject = [store.state.login.userInfo.subject_id]
  }
  filesList.value = [
    {
      name: '',
      url: 'https://swryangzhou.oss-cn-beijing.aliyuncs.com/image/20220711/092543961.png'
    }
  ]
  addShow.value = true
}

const colorChange = (color: string) => {
  editFormInput.value.color_code = color
}

const addRuleFormRef = ref<InstanceType<typeof ElForm>>()
const addRules = reactive({
  // level: {
  //   required: true,
  //   message: '请选择分类',
  //   trigger: 'change'
  // },
  title: {
    required: true,
    message: '请输入实验室名称',
    trigger: 'blur'
  },
  color_code: {
    required: true,
    message: '请选择实验室底色',
    trigger: 'change'
  },
  type: {
    type: 'array',
    required: true,
    message: '请选择类型',
    trigger: 'blur'
  },
  is_order: {
    required: true,
    message: '请选择预约是否审核',
    trigger: 'change'
  },
  area: {
    required: true,
    message: '请输入面积',
    trigger: 'blur'
  },
  location: {
    required: true,
    message: '请输入位置',
    trigger: 'blur'
  },
  subject: {
    type: 'array',
    required: true,
    message: '请选择学科',
    trigger: 'change'
  },
  userIDs: {
    type: 'array',
    required: true,
    message: '请选择管理员',
    trigger: 'change'
  }
})

const filedata = reactive({
  token: store.state.login.userInfo.token
})
const beforeAvatarUpload = (file: any) => {
  console.log('file', file)
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isLt5M) {
    ElMessage({
      type: 'warning',
      message: '文件大小不能超过 5MB!'
    })
  }
  return isLt5M
}
const uploadSuccess = (response: unknown, file: UploadFile, fileList: UploadFile[]) => {
  console.log('🚀 ~ file: index.vue ~ line 444 ~ uploadSuccess ~ fileList', fileList)
  files.value = fileList
}

const handleRemove = (file: UploadFile, fileList: UploadFile[]) => {
  console.log(file, fileList)
  files.value = fileList
}

const addSureClick = (formEl: InstanceType<typeof ElForm> | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      let userName = ''
      editFormInput.value.userIDs.forEach((e: number) => {
        if (optionsAdmin.value.find((i) => i.id === e)) {
          if (userName !== '') {
            userName += ','
          }
          userName += optionsAdmin.value.find((i) => i.id === e)?.username
        }
      })

      if (files.value.length === 0) {
        editFormInput.value.picture = filesList.value[0].url
      } else {
        let string = ''
        files.value.forEach((e) => {
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
        })
        editFormInput.value.picture = string
      }
      if (editFormInput.value.camera.channelId) {
        editFormInput.value.camera = [editFormInput.value.camera]
      } else {
        editFormInput.value.camera = []
      }

      addLaboratory({
        ...editFormInput.value,
        userIDs: editFormInput.value.userIDs.join(','),
        users: userName,
        type: editFormInput.value.type.join(','),
        subject_type: editFormInput.value.subject_type.length == 2 ? 3 : editFormInput.value.subject_type[0],
        subject: editFormInput.value.subject.join(',')
      }).then((res) => {
        if (res.code === 10) {
          files.value = []
          ElMessage({
            type: 'success',
            message: res.msg
          })
          addShow.value = false
          getData(searchForm.value)
          editFormInput.value = editForm
          filesList.value = []
        }
      })
    } else {
      ElMessage({
        type: 'warning',
        message: '请填写必填项'
      })
      return false
    }
  })
}

const cancel = () => {
  editFormInput.value = editForm
  addShow.value = false
  filesList.value = []
}
const selcamera = (item: any) => {
  editFormInput.value.camera = item
  console.log(editFormInput.value)
  getThoroughfare()
}
const selcamera1 = (item: any) => {
  editFormInput.value.camera = item
  console.log(editFormInput.value)
}
const cameratd: any = ref([])
const getThoroughfare = () => {
  getThoroughfareList({ pageSize: 9999, pageNo: 1, deviceSerial: editFormInput.value.camera.deviceSerial }).then(
    (res) => {
      console.log(res)
      cameratd.value = res.data.list
    }
  )
}
const caremaList: any = ref([])
const cameraShow = ref(false)
const closeCanera = () => {
  cameraShow.value = false
  cameraNow.url = ''
  cameraNow.id = ''
  cameraNow.expireTime = ''
  cameraNow.labName = ''
  cameraNow.img = ''
}
const cameraNow = reactive({
  url: '',
  id: '',
  expireTime: '',
  labName: '',
  img: ''
})
const filter1 = (item: any) => {
  if (item.camera.length === 0) return false
  if (item.camera.length === 1) {
    if (Number(item.camera[0].channel_no) % 2 === 0) {
      return true
    } else {
      return false
    }
  } else {
    return item.camera.some((item: any) => Number(item.channel_no) % 2 === 0)
  }
}
// 摄像头的查看
const searchCamera = (ele: any) => {
  for (let i = 0; i < ele.length; i++) {
    if (Number(ele[i].channel_no) % 2 === 0) {
      getVideo(ele[i]).then((res) => {
        console.log(res)
        cameraNow.url = res.data.url
        cameraNow.id = res.data.id
        cameraNow.expireTime = res.data.expireTime
        cameraNow.labName = ele[i].labName
        cameraNow.img = ele[i].img
        cameraShow.value = true
        console.log(cameraNow)
      })
      return
    }
  }
  // getcameramsg(item).then((res) => {
  //   console.log(res)
  // })
}
const editItem = (item: any) => {
  editFormInput.value = editForm
  filesList.value = []
  getcameraAll({ groupNo: 's' + store.state.login.userInfo.school_code, pageSize: 9999, pageNo: 1 }).then((res) => {
    console.log('筛选那个头', res)
    caremaList.value = res.data
  })
  getLaboratoryDetail({
    id: item.id
  }).then((res) => {
    // 将详情信息转化为编辑信息
    let type: number[] = []
    res.data.type.forEach((e) => type.push(e.id || 0))
    let subject: number[] = []
    res.data.subject.forEach((e) => subject.push(e.subject_id || 0))
    let subject_type = res.data.subject_type === 1 ? [1] : res.data.subject_type === 2 ? [2] : [1, 2]
    res.data.picture.forEach((e) => {
      filesList.value.push({
        name: '',
        url: e.url_path
      })
    })

    let picture = ''
    filesList.value.forEach((e) => {
      if (picture === '') {
        picture = picture + e.url
      } else {
        picture = picture + ',' + e.url
      }
    })
    let camera = {}
    if (res.data.camera.length !== 0) {
      camera = res.data.camera[0]
      selcamera(camera)
    }
    const obj = {
      ...res.data,
      type,
      subject,
      subject_type,
      picture,
      camera
    }
    editFormInput.value = obj
  })
  addShow.value = true
}

const deleteItem = (item: any) => {
  willDeleteItem.value = item
  deleteDialog.value = true
}

const sureDel = () => {
  delLaboratory({ id: willDeleteItem.value.id }).then((res) => {
    if (res.code === 10) {
      ElMessage({
        type: 'success',
        message: '删除成功'
      })
      deleteDialog.value = false
      getData(searchForm.value)
    }
  })
}

let detailShow = ref(false)

const showDetail = (item: RequestDataItemType) => {
  getLaboratoryDetail({
    id: item.id
  }).then((res) => {
    console.log(res.data)
    editFormData.value = res.data
  })
  detailShow.value = true
}

let configShow = ref(false)
const getConfigCheckList = (item: RequestDataItemType) => {
  clickItem.value = item
  configShow.value = true
}
//获取详情信息
let goMgtTabs = ref(false)

let _item = ref({})
const handleManage = (_val: any): void => {
  // provide('_item', _val)
  _item.value = _val
  goMgtTabs.value = true
}
const backLabMgt = (): void => {
  searchForm.value.subject = 0
  searchForm.value.type = 0
  getData(searchForm.value)
  goMgtTabs.value = false
}

const inputChange = (val: any, item: string) => {
  val = String(val)
  editFormInput.value[item] = val.indexOf('.') != -1 ? val.split('.')[0] + '.' + val.split('.')[1].slice(0, 2) : val
}
</script>

<style scoped lang="scss">
header {
  height: 30px;
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  line-height: 30px;
  color: #626572;
  opacity: 1;
  .breadCrumbs {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .back {
      display: flex;
      align-items: center;
      cursor: pointer;
      .backImg {
        width: 20px;
        height: 20px;
        margin-right: 15px;
      }
    }
  }
}
.recommend {
  margin-top: 10px;
  padding: 0 30px;
  width: 100%;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  .filter-box {
    padding: 15px 0;
    width: 90%;
  }
}
.title {
  margin: 10px 0;
  text-align: left;
}

.item-box {
  display: flex;
  flex-wrap: wrap;
  .item-laboratory {
    margin: 0 1.2% 20px 0;
    width: 24%;
    // width: 400px;
    & > p {
      position: relative;
      width: 60%;
      padding-left: 18px;
      height: 40px;
      line-height: 40px;
      background: #d8efff;
      box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
      font-size: 16px;
      font-weight: bold;
      color: #60a5db;
      border-radius: 10px 10px 0px 0px;
      .icon {
        position: absolute;
        left: 6px;
        top: 7px;
        width: 11px;
        height: 26px;
        background: #5fafe4;
        border-radius: 13px;
      }
    }
  }
  .item-laboratory:nth-of-type(4n) {
    margin-right: 0;
  }
  .item-content {
    position: relative;
    padding: 12px 25px;
    width: 100%;
    background: #ffffff;
    text-align: left;
    border-radius: 0px 10px 10px 10px;
    box-sizing: border-box;
    .lable {
      position: absolute;
      top: 0;
      right: 10px;
      width: 30px;
      line-height: 30px;
      height: 76px;
      text-align: center;
      writing-mode: vertical-lr;
      background: #05c65d;
      color: #ffffff;
      z-index: 100;
    }
    p {
      color: #333333;
    }
    .detail-box {
      position: relative;
      cursor: pointer;
      .cameraCss {
        z-index: 100;
        position: absolute;
        left: -15px;
        top: -15px;
        width: 35px;
        height: 35px;
      }
      & > p:nth-of-type(1) {
        height: 40px;
        line-height: 40px;
      }
      & > p:nth-of-type(2) {
        height: 30px;
        line-height: 30px;
        color: #848484;
      }
      & > p:nth-of-type(3) {
        height: 20px;
        padding-left: 20px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .camera-state {
        width: 100%;
        text-align: center;
        .green {
          color: #05c65d;
        }
        .red {
          color: red;
        }
      }
    }
    .img-box {
      margin: 6px 0;
      display: flex;
      position: relative;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 230px;
      border: 1px dashed #ccc;
      img {
        max-width: 100%;
        max-height: 100%;
        // width: 340px;
        // height: 230px;
      }
      // img:nth-of-type(1) {
      //   margin-right: 20px;
      // }
      .cameraicon {
        position: absolute;
        top: -10px;
        left: -15px;
        width: 50px;
        height: 50px;
      }
      .qrcode {
        margin: auto;
      }
    }
    .line {
      margin: 10px 0;
      width: 100%;
      height: 0;
      border-bottom: 1px dashed #c9c7c7;
    }
    .click-box {
      display: flex;
      justify-content: center;
      align-items: center;
      & > p {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 33%;
        height: 38px;
        cursor: pointer;
        img {
          margin-right: 6px;
        }
      }
    }
  }
}

footer {
  margin: 16px;
  display: flex;
  justify-content: right;
  p {
    margin-right: 30px;
    height: 36px;
    line-height: 36px;
    span {
      font-size: 16px;
      font-weight: bold;
      line-height: 21px;
      color: #05c65d;
      opacity: 1;
    }
  }
}
:deep(.laboratory-add-dialog) {
  margin-top: 50px;
  .el-dialog__body {
    height: 700px;
    border-top: #05c65d 1px solid;
    box-sizing: border-box;
    overflow: auto;
    .el-form {
      width: 100%;
      .el-form-item {
        overflow: hidden;
        margin-bottom: 6px;
        .el-form-item__content {
          text-align: left;
          .el-input {
            width: 90%;
            .el-input__inner {
              width: 100%;
            }
          }
          .el-date-editor {
            width: 90%;
            .el-input {
              width: 100%;
              .el-input__inner {
                width: 100%;
              }
            }
          }
          .el-select {
            width: 90%;
            min-height: 30px;
            .el-input {
              width: 100%;
              .el-input__inner {
                width: 100%;
                min-height: 30px !important;
              }
            }
          }
          .el-radio-group {
            height: 40px;
          }
          .el-checkbox-group {
            height: 40px;
          }
          // .el-upload {
          //   height: 100px;
          //   line-height: 100px;
          // }
          // .el-upload-list {
          //   max-height: 100px;
          // }
        }
      }
      .sel-tag {
        .el-select {
          width: 24% !important;
          min-height: 30px;
          .el-input {
            width: 100%;
            .el-input__inner {
              width: 100%;
              min-height: 30px !important;
            }
          }
        }
      }
      .icon-box {
        .el-form-item__content {
          display: flex;
          align-items: center;
          .icon-square:hover {
            border: 2px solid #ffffff;
            box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
          }
        }
      }
    }

    span {
      color: #05c65d;
    }
  }
}
:deep(.laboratory-detail-dialog) {
  margin-top: 60px;
  .el-dialog__body {
    border-top: #05c65d 1px solid;
    box-sizing: border-box;
    overflow: hidden;
    .list {
      width: 60%;
      & > p {
        display: flex;
        // align-items: center;
        width: 100%;
        min-height: 40px;
        text-align: left;
        color: #333;
        & > span:nth-of-type(1) {
          display: inline-block;
          padding-left: 15%;
          width: 40%;
          color: #848484;
          box-sizing: border-box;
        }
        // img {
        //   width: 200px;
        //   height: 114px;
        // }
        .icon-square {
          margin-top: -2px;
        }
      }
      & > .have-width {
        line-height: normal;
        overflow: hidden;
        & > span:nth-of-type(1) {
          float: left;
        }
        & > span:nth-of-type(2) {
          display: inline-block;
          line-height: 20px;
          width: 60%;
          min-height: 20px;
        }
      }
    }
    .message {
      margin-right: 6%;
      padding: 20px;
      width: 30%;
      // height: 300px;
      background: #f3f3f3;
      box-sizing: border-box;
      .header {
        height: 31px;
        font-size: 24px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 31px;
        text-align: center;
        color: #05c65d;
      }
      & > p {
        text-align: left;
        color: #333;
        & > span {
          height: 24px;
          line-height: 24px;
        }
        & > span:nth-of-type(1) {
          display: inline-block;
          // padding-left: 10px;
          // min-width: 48%;
          color: #848484;
          box-sizing: border-box;
        }
        .qr-img {
          display: block;
          width: 150px;
          height: 150px;
          margin: 20px auto;
          background: rgba(0, 0, 0, 0.64);
          opacity: 1;
        }
      }
      .qrcode-box {
        cursor: pointer;
      }
      .button {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        width: 100px;
        height: 36px;
        background: #05c65d;
        font-weight: 400;
        font-size: 14px;
        color: #ffffff;
        box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
        opacity: 1;
        border-radius: 10px;
        cursor: pointer;
        img {
          margin: 6px;
        }
      }
    }
  }
}
:deep(.delete-tips-dialog) {
  .el-dialog__body {
    border-top: #05c65d 1px solid;
    box-sizing: border-box;
    overflow: hidden;
    .message {
      .tips {
        padding-left: 30px;
        text-align: left;
        color: #333333;
      }
      .color-o {
        margin-top: 10px;
        color: #eea359;
      }
    }
  }
}

.span-hover {
  cursor: pointer;
}
.span-hover:hover {
  color: #05c65d;
}
.btn {
  align-self: flex-start;
  margin-top: 20px;
  width: 210px;
  height: 36px;
  line-height: 36px;
  background: #05c65d;
  color: #ffffff;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
  opacity: 1;
  border-radius: 10px;
  cursor: pointer;
}
.green {
  color: #05c65d !important;
}
.icon-square {
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: 2px;
  background: #05c65d;
  margin-right: 8px;
  box-sizing: border-box;
}
.camerabox {
  width: 100%;
  .camerasel {
    float: left;
    width: 300px;
  }
  .cameratd {
    float: left;
    margin-left: 20px;
    width: 300px;
  }
}
</style>
