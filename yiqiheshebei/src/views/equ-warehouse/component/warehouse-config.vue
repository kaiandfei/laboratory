<template>
  <div class="page-body">
    <div class="dispose-title">
      <span>仓库配置-{{ itemData.title }}</span>
      <div class="title-btn">
        <span class="btn" @click="back()">返回</span>
        <span class="btn" @click="batchAdd()">+批量新增</span>
        <span class="btn" @click="itemAdd()">+新增</span>
      </div>
    </div>
    <div v-for="(typeItem, typeIndex) in ['仪器柜', '资料柜', '药品柜', '其他']" :key="typeIndex">
      <p class="category-title">
        {{ typeItem }}
        <img
          :src="imgShow(childrenShow[typeIndex])"
          alt=""
          @click="childrenShow[typeIndex] = !childrenShow[typeIndex]"
          :title="childrenShow[typeIndex] ? '收起' : '展开'"
        />
      </p>
      <div class="room-list" v-show="childrenShow[typeIndex]">
        <div v-for="(item, index) in ListComputed(RequestData, typeIndex + 1)" :key="index" class="room-item">
          <div class="item-box">
            <p class="item-title">
              <span>{{ item.title }}</span>
            </p>
            <p class="subject">柜层数: {{ item.number_plies }}</p>
            <div class="img-box">
              <img v-show="item.url" class="picture" :src="item.url?.split(',')[0]" alt="" />
              <img class="qr" :src="item.qr_code" alt="" />
              <!-- <qrcode-vue class="qr" :value="item.qr_code" :size="100" level="H" /> -->
            </div>
            <div class="operation">
              <div>
                <img src="@/assets/images/common/record.png" alt="" />
                <span @click="itemAdd(item)">编辑</span>
              </div>
              <div>
                <img src="@/assets/images/common/del.png" alt="" />
                <span @click="deleteItem(item.id)">删除</span>
              </div>
            </div>
          </div>
        </div>
        <!-- <CabinetItem
          v-for="(item, index) in ListComputed(RequestData, typeIndex + 1)"
          :key="index"
          :item-data="item"
          @edit-item="itemAdd"
          @delete-success="getData(itemData.id)"
        /> -->
        <p v-if="ListComputed(RequestData, typeIndex + 1).length === 0">暂无数据</p>
      </div>
    </div>
    <el-dialog custom-class="ew-edit-dialog" v-model="editShow" title="新增or修改" width="600px">
      <el-form ref="editForm" :model="editFormData" :rules="rules" label-width="140px" :key="editShow">
        <el-form-item label="分类：" prop="type">
          <el-select v-model="editFormData.type" placeholder="请选择">
            <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称：" prop="title">
          <el-input v-model="editFormData.title" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="柜层数：">
          <el-input v-model="editFormData.number_plies" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="设备号：">
          <el-input v-model="editFormData.numbers" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="负责人：">
          <el-select v-model="editFormData.user_id" placeholder="请选择">
            <el-option v-for="item in userList" :key="item.id" :label="item.username" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图片：">
          <el-upload
            ref="upload"
            :action="BASE_URL + 'swrserveadmin/OssImage/uploadImage'"
            :data="filedata"
            name="image"
            list-type="picture-card"
            :on-success="uploadSuccess"
            :on-remove="handleRemove"
            :file-list="filesList"
            accept=".jpg,.png,.jpeg"
          >
            <span>+点击上传</span>
            <!-- <el-icon><plus /></el-icon> -->
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancel()">取消</el-button>
          <el-button :loading="loading" type="primary" @click="submitForm(editForm)">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog custom-class="ew-edit-dialog" v-model="batchShow" title="批量新增" width="600px">
      <el-form ref="batchEditForm" :model="batchEditFormData" :rules="batchRules" label-width="140px" :key="batchShow">
        <el-form-item label="分类：" prop="type">
          <el-select v-model="batchEditFormData.type" placeholder="请选择">
            <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="柜数量：" prop="num">
          <el-input v-model="batchEditFormData.num" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="柜层数：">
          <el-input v-model="batchEditFormData.number_plies" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="负责人：">
          <el-select v-model="batchEditFormData.user_id" placeholder="请选择">
            <el-option v-for="item in userList" :key="item.id" :label="item.username" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图片：">
          <el-upload
            ref="upload"
            :action="BASE_URL + 'swrserveadmin/OssImage/uploadImage'"
            :data="filedata"
            name="image"
            list-type="picture-card"
            :on-success="batchUploadSuccess"
            :on-remove="batchHandleRemove"
            :file-list="filesList"
            accept=".jpg,.png,.jpeg"
          >
            <span>+点击上传</span>
            <!-- <el-icon><plus /></el-icon> -->
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="batchShow = false">取消</el-button>
          <el-button type="primary" :loading="loading" @click="submitFormBatch(batchEditForm)">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, toRefs, computed } from 'vue'

// import { RequestDataLab } from '@service/laboratory-standard/type-manage/types'
// import { getTypeList } from '@service/laboratory-standard/type-manage/index'
import { storeByLaboratory } from '@service/laboratory-manage/overview/index'
import { StoreItemType } from '@service/laboratory-manage/overview/types'
import { addInstrument, batchAddInstrument } from '@service/equ-warehouse/index'
import { getSchoolUser } from '@service/login/login'

import { BASE_URL } from '@service/request/config'
import { useStore } from '@store/index'

import type { ElForm } from 'element-plus'
import type { UploadFile } from 'element-plus/es/components/upload/src/upload.type'
import { delStore } from '@service/equ-warehouse/index'
// import QrcodeVue from 'qrcode.vue'

import { ElMessageBox, ElMessage } from 'element-plus'

// import CabinetItem from './cabinet-item.vue'

let props = defineProps({
  itemData: {
    type: Object,
    required: true
  }
})
let { itemData } = toRefs(props)

let emit = defineEmits(['back'])

const back = () => {
  emit('back')
}

const dataMap = reactive({
  RequestData: Array<StoreItemType>(),
  childrenShow: [true, true, true, true],
  editShow: false,
  batchShow: false,
  editFormData: {
    type: 1,
    title: '',
    numbers: '',
    number_plies: 0,
    user_id: '',
    user_name: '',
    school_laboratory_id: itemData.value.id,
    school_laboratory_name: itemData.value.title,
    url: ''
  },
  batchEditFormData: {
    type: 1,
    num: 1,
    number_plies: 0,
    user_id: '',
    user_name: '',
    school_laboratory_id: itemData.value.id,
    school_laboratory_name: itemData.value.title,
    url: ''
  },
  filesList: Array<{ name: string; url: string }>(),
  files: Array<any>(),
  typeList: [
    {
      id: 1,
      name: '仪器柜'
    },
    {
      id: 2,
      name: '资料柜'
    },
    {
      id: 3,
      name: '药品柜'
    },
    {
      id: 4,
      name: '其他'
    }
  ],
  userList: Array<{
    id: number
    username: string
  }>(),
  loading: false,
  editId: 0
})
let {
  RequestData,
  childrenShow,
  editShow,
  batchShow,
  editFormData,
  batchEditFormData,
  filesList,
  files,
  typeList,
  userList,
  loading,
  editId
} = toRefs(dataMap)

const getData = (id: number) => {
  storeByLaboratory({ id }).then((res) => {
    RequestData.value = res.data
  })
}

getSchoolUser().then((res) => {
  if (res.code === 10) {
    userList.value = res.data
  }
})

getData(itemData.value.id)

const store = useStore()
const filedata = reactive({
  token: store.state.login.userInfo.token
})

const imgShow = (index: boolean) => {
  if (index) {
    return require('@/assets/images/common/close.png')
  } else {
    return require('@/assets/images/common/open.png')
  }
}

const cancel = () => {
  filesList.value = []
  editShow.value = false
}

const ListComputed = computed(() => {
  return (list: any[], type: number) => {
    let arr = Array<any>()
    list.forEach((e) => {
      if (e.type === type) {
        arr.push(e)
      }
    })
    return arr
  }
})

const deleteItem = (id: number) => {
  ElMessageBox.confirm('是否确认删除?', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      delStore({ id }).then((res) => {
        if (res.code === 10) {
          ElMessage({
            type: 'success',
            message: '删除成功'
          })
          getData(itemData.value.id)
        }
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除'
      })
    })
}

// const editOrAdd = (item: unknown) => {}

const batchAdd = () => {
  batchShow.value = true
  filesList.value = [
    {
      name: '',
      url: 'https://swryangzhou.oss-cn-beijing.aliyuncs.com/image/20220714/154211001.png'
    }
  ]
}

const itemAdd = (item?: StoreItemType) => {
  if (item) {
    files.value = []
    filesList.value = []
    let arr = item.url ? item.url.split(',') : []
    arr.forEach((e) => {
      filesList.value.push({
        name: '',
        url: e
      })
    })
    editId.value = item.id
    editFormData.value = {
      type: item.type,
      title: item.title,
      numbers: item.numbers,
      number_plies: item.number_plies,
      user_id: (item.user_id as any) || '',
      user_name: item.user_name,
      school_laboratory_id: itemData.value.id,
      school_laboratory_name: itemData.value.title,
      url: item.url
    }
  } else {
    editId.value = 0
    editFormData.value = {
      type: 1,
      title: '',
      numbers: '',
      number_plies: 0,
      user_id: '',
      user_name: '',
      school_laboratory_id: itemData.value.id,
      school_laboratory_name: itemData.value.title,
      url: ''
    }
    filesList.value = [
      {
        name: '',
        url: 'https://swryangzhou.oss-cn-beijing.aliyuncs.com/image/20220714/154211001.png'
      }
    ]
  }
  editShow.value = true
}

const uploadSuccess = (response: unknown, file: UploadFile, fileList: UploadFile[]) => {
  console.log('🚀 ~ file: index.vue ~ line 444 ~ uploadSuccess ~ fileList', fileList)
  files.value = fileList
}
const handleRemove = (file: UploadFile, fileList: UploadFile[]) => {
  console.log(file, fileList)
  files.value = fileList
}

const batchUploadSuccess = (response: unknown, file: UploadFile, fileList: UploadFile[]) => {
  console.log('🚀 ~ file: index.vue ~ line 444 ~ uploadSuccess ~ fileList', fileList)
  files.value = fileList
}
const batchHandleRemove = (file: UploadFile, fileList: UploadFile[]) => {
  console.log(file, fileList)
  files.value = fileList
}

const editForm = ref<InstanceType<typeof ElForm>>()

const submitForm = (formEl: InstanceType<typeof ElForm> | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      loading.value = true
      if (files.value.length === 0) {
        let url: string[] = []
        filesList.value.forEach((e) => {
          url.push(e.url)
        })
        editFormData.value.url = url.join(',')
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
        editFormData.value.url = string
      }

      let obj: any = editFormData.value
      if (editId.value !== 0) {
        obj = {
          ...editFormData.value,
          id: editId.value
        }
      }
      addInstrument(obj)
        .then((res) => {
          if (res.code === 10) {
            files.value = []
            filesList.value = []
            editShow.value = false
            ElMessage({
              type: 'success',
              message: res.msg
            })
            getData(itemData.value.id)
            editFormData.value = {
              type: 1,
              title: '',
              numbers: '',
              number_plies: 0,
              user_id: '',
              user_name: '',
              school_laboratory_id: itemData.value.id,
              school_laboratory_name: itemData.value.title,
              url: ''
            }
          }
        })
        .finally(() => {
          loading.value = false
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

const batchEditForm = ref<InstanceType<typeof ElForm>>()

const submitFormBatch = (formEl: InstanceType<typeof ElForm> | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      loading.value = true
      if (files.value.length === 0) {
        batchEditFormData.value.url = filesList.value[0].url
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
        batchEditFormData.value.url = string
      }
      batchAddInstrument(batchEditFormData.value)
        .then((res) => {
          if (res.code === 10) {
            files.value = []
            filesList.value = []
            ElMessage({
              type: 'success',
              message: res.msg
            })
            getData(itemData.value.id)
            batchShow.value = false
          }
        })
        .finally(() => {
          loading.value = false
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

const rules = reactive({
  type: [
    {
      required: true,
      message: '请选择分类',
      trigger: 'blur'
    }
  ],
  title: [
    {
      required: true,
      message: '请输入名称',
      trigger: 'blur'
    }
  ]
})

const batchRules = reactive({
  type: [
    {
      required: true,
      message: '请选择分类',
      trigger: 'blur'
    }
  ],
  num: [
    {
      required: true,
      message: '请输入数量',
      trigger: 'blur'
    }
  ]
})
</script>

<style scoped lang="scss">
.page-body {
  margin-top: 10px;
  .category-title {
    display: flex;
    justify-content: left;
    align-items: center;
    margin-bottom: 20px;
    padding: 0 34px;
    height: 56px;
    line-height: 60px;
    background-color: #fff;
    color: #05c65d;
    text-align: left;
    font-size: 16px;
    font-weight: bold;
    border-bottom: 4px solid #05c65d;
    img {
      cursor: pointer;
    }
  }
  .room-item {
    float: left;
    position: relative;
    margin: 0 0.5% 30px;
    width: 24%;
    min-width: 400px;
    height: 345px;
    background-color: #fff;
    border-radius: 0 10px 10px 10px;
    .item-box {
      position: absolute;
      padding: 0 9.25% 0 6.75%;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      .item-title {
        margin-top: 20px;
        height: 26px;
        line-height: 26px;
        font-size: 20px;
        font-weight: bold;
        color: #333;
        & > :nth-child(1) {
          float: left;
        }
        & > :nth-child(2) {
          float: right;
        }
      }
      .subject {
        margin-top: 10px;
        height: 20px;
        line-height: 20px;
        color: #333;
        font-size: 14px;
        text-align: left;
      }
      .operation {
        margin-top: 10px;
        height: 40px;
        line-height: 40px;
        color: #333;
        font-size: 16px;
        & > div {
          float: left;
          height: 100%;
          width: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            margin-right: 6px;
            width: 24px;
            height: 24px;
          }
          span {
            color: #333;
            cursor: pointer;
            &:hover {
              color: #05c65d;
            }
          }
        }
        & > :nth-child(1) {
          border-right: 1px solid #c9c7c7;
          box-sizing: border-box;
        }
      }
      .img-box {
        position: relative;
        width: 100%;
        height: 200px;
        border-bottom: 1px dashed #333;
        .picture {
          position: absolute;
          left: 0;
          width: 60%;
          height: 95%;
        }
        .qr {
          position: absolute;
          top: 46px;
          right: 5px;
          width: 30%;
          z-index: 1;
        }
      }
    }
  }
  .dispose-title {
    margin-bottom: 20px;
    padding: 0 34px;
    height: 60px;
    line-height: 60px;
    text-align: left;
    font-size: 20px;
    background-color: #fff;
  }
  .title-btn {
    float: right;
    .btn {
      display: inline-block;
      margin-left: 30px;
      width: 108px;
      height: 36px;
      line-height: 36px;
      color: #fff;
      background: #05c65d;
      border-radius: 10px;
      font-size: 14px;
      text-align: center;
      box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
      cursor: pointer;
    }
  }
  .room-list {
    & > p {
      margin-bottom: 20px;
    }
    &:after {
      display: block;
      clear: both;
      content: '';
      visibility: hidden;
      height: 0;
    }
  }

  :deep(.ew-edit-dialog) {
    .el-dialog__body {
      border-top: #05c65d 1px solid;
      box-sizing: border-box;

      .el-form {
        width: 500px;
      }
      span {
        color: #05c65d;
      }
      .el-form-item__content {
        text-align: left;
        .el-input {
          width: 300px;
        }
      }
    }
  }
}
</style>
