<template>
  <div class="container">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="isEdit ? rules : ''"
      label-width="150px"
      class="demo-ruleForm"
      status-icon
    >
      <el-form-item label="实验室名称：" prop="title">
        <span v-if="!isEdit">{{ detailForm.title }}</span>
        <el-input v-model="ruleForm.title" v-else />
      </el-form-item>
      <el-form-item label="类型：" prop="type">
        <template v-if="!isEdit">
          <span v-for="(item, index) in detailForm.type" :key="index">
            {{
              mapConst(typeList, item) +
              (detailForm.type.length === 1 ? '' : index !== detailForm.type.length - 1 ? '/' : '')
            }}
          </span>
        </template>
        <!-- <div :class="{ isBorder: !isEdit }"> -->
        <el-select
          v-else
          v-model="ruleForm.type"
          placeholder="请选择"
          multiple
          :collapse-tags="isEdit"
          style="width: 100%"
        >
          <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <!-- </div> -->
      </el-form-item>
      <el-form-item label="学科：" prop="subject">
        <template v-if="!isEdit">
          <span v-for="(item, index) in detailForm.subject" :key="index">
            {{
              mapConst(subjectArr, item) +
              (detailForm.subject.length === 1 ? '' : index !== detailForm.subject.length - 1 ? '/' : '')
            }}
          </span>
        </template>
        <el-checkbox-group v-model="ruleForm.subject" v-else>
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
        <span v-if="!isEdit">{{ mapConst(STANDARLIST, detailForm.level) }}</span>
        <el-radio-group v-model="ruleForm.level" v-else>
          <el-radio :label="1">Ⅰ类</el-radio>
          <el-radio :label="2">Ⅱ类</el-radio>
          <el-radio :label="3">Ⅲ类</el-radio>
        </el-radio-group>
      </el-form-item> -->
      <el-form-item label="是否需要预约审核：" prop="is_order">
        <span v-if="!isEdit">{{ detailForm.is_order === 1 ? '是' : '否' }}</span>
        <el-radio-group v-model="ruleForm.is_order" v-else>
          <el-radio :label="1">是</el-radio>
          <el-radio :label="2">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="功能描述：" prop="desc">
        <span v-if="!isEdit">{{ detailForm.desc || '无' }}</span>
        <el-input v-model="ruleForm.desc" type="textarea" v-else />
      </el-form-item>
      <el-form-item label="位置：" prop="location">
        <span v-if="!isEdit">{{ detailForm.location || '无' }}</span>
        <el-input v-model="ruleForm.location" v-else />
      </el-form-item>
      <el-form-item label="面积：" prop="area">
        <span v-if="!isEdit">{{ detailForm.area + '㎡' }}</span>
        <el-input v-model="ruleForm.area" v-else />
      </el-form-item>
      <el-form-item label="建设时间：" prop="create_time">
        <span v-if="!isEdit">{{ detailForm.create_time }}</span>
        <el-date-picker
          v-else
          v-model="ruleForm.create_time"
          type="datetime"
          placeholder="请选择建设时间"
          size="small"
          value-format="YYYY-MM-DD HH:mm:ss"
          :disabled="!isEdit"
        />
      </el-form-item>
      <el-form-item label="实验室底色：" prop="color_code">
        <span v-if="!detailForm.color_code">无</span>
        <el-color-picker v-model="detailForm.color_code" color-format="rgb" :disabled="!isEdit" v-if="!isEdit" />
        <el-color-picker v-model="ruleForm.color_code" color-format="rgb" v-else />
      </el-form-item>
    </el-form>
    <div class="info">
      <div class="infoTitle mb-20">信息</div>
      <div class="infoItemUser mb-20">
        <span class="w-140">管理员：</span>
        <template v-if="!isEdit">
          <span v-for="(item, index) in detailForm.userIDs" :key="index">
            {{
              mapConst(optionsAdmin, item) +
              (detailForm.userIDs.length === 1 ? '' : index !== detailForm.userIDs.length - 1 ? '/' : '')
            }}
          </span>
        </template>
        <el-select
          v-else
          v-model="ruleForm.userIDs"
          placeholder="请选择管理员"
          multiple
          collapse-tags
          style="width: 70%"
        >
          <el-option v-for="item in optionsAdmin" :key="item.id" :label="item.username" :value="item.id"></el-option>
        </el-select>
      </div>
      <div class="infoItem mb-20">
        <span class="w-140">实验室二维码：</span>
        <div v-if="!isEdit">
          <img style="width: 130px; height: 130px" :src="detailForm.qr_code" alt="" />
        </div>
        <div v-else>
          <img style="width: 130px; height: 130px" :src="ruleForm.qr_code" alt="" />
        </div>
      </div>
      <div class="infoItem mb-20">
        <span class="w-140">实验室照片：</span>
        <div v-if="!isEdit">
          <img
            style="width: 130px; height: 130px"
            v-for="(item, index) in filesList"
            :key="index"
            :src="item.url"
            alt=""
          />
        </div>
        <el-upload
          v-else
          ref="upload"
          :action="BASE_URL + 'swrserveadmin/OssImage/uploadImage'"
          :data="{
            token: store.state.login.userInfo.token
          }"
          name="image"
          list-type="picture-card"
          :on-success="uploadSuccess"
          :on-remove="handleRemove"
          :on-progress="handleProgress"
          :file-list="filesList"
          accept=".jpg,.png,.jpeg"
        >
          <span>+点击上传</span>
          <!-- <el-icon><plus /></el-icon> -->
        </el-upload>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { addLaboratory, getLaboratoryDetail } from '@service/laboratory-manage/overview/index'
import { selectFormData } from '@service/laboratory-manage/overview/types'
import { STANDARLIST } from '@/constants/laboratoryConst'
import { reactive, ref, defineProps, useAttrs, defineExpose, onUpdated } from 'vue'
import { useStore } from '@store/index'
// import type { FormInstance, FormRules } from 'element-plus'
import type { ElForm } from 'element-plus'
import { ElMessage } from 'element-plus'
import { BASE_URL } from '@service/request/config'
import type { UploadFile } from 'element-plus/es/components/upload/src/upload.type'
const store = useStore()
const $attrs: any = useAttrs()

const $props = defineProps({
  isEdit: Boolean
})
let typeList = ref($attrs.typeList)

interface RuleForm {
  title: string
  type: number[]
  subject: number[]
  level: number
  is_order: number
  desc: string
  location: string
  area: string
  create_time: string
  color_code: string
  userIDs: number[]
  qr_code: string
  picture: string | []
}
let filesList = ref([
  {
    name: '',
    url: 'https://swryangzhou.oss-cn-beijing.aliyuncs.com/image/20220711/092543961.png'
  }
])
const files = ref(Array<any>())
const ruleFormRef = ref<InstanceType<typeof ElForm>>()
const subjectArr = ref([...store.state.common.subjectArr])
const optionsAdmin = ref([...store.state.common.laboratoryAdminArr])
const searchForm = ref(selectFormData)

let ruleForm = ref<RuleForm>({
  title: '',
  type: [],
  subject: [],
  level: 0,
  is_order: 0,
  desc: '',
  location: '',
  area: '',
  create_time: '',
  color_code: '',
  userIDs: [],
  qr_code: '',
  picture: ''
})
let detailForm = ref<RuleForm>({
  title: '',
  type: [],
  subject: [],
  level: 0,
  is_order: 0,
  desc: '',
  location: '',
  area: '',
  create_time: '',
  color_code: '',
  userIDs: [],
  qr_code: '',
  picture: []
})
const mapConst = (_const: any[], _val: string | number) => {
  let res
  _const.forEach((item) => {
    if (item.id === _val) {
      res = item.name || item.title || item.username
    }
  })
  return res
}

const rules = reactive({
  level: {
    required: true,
    message: '请选择分类',
    trigger: 'change'
  },
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
    message: '请选择分类',
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

const getdetail = (_val: any) => {
  filesList.value = []
  getLaboratoryDetail({
    id: _val.id
  }).then((res) => {
    // 将详情信息转化为编辑信息
    let type: number[] = []
    res.data.type.forEach((e) => type.push(e.id || 0))
    let subject: number[] = []
    res.data.subject.forEach((e) => subject.push(e.subject_id || 0))
    res.data.picture?.forEach((e) => {
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
    }
    const obj: any = {
      ...res.data,
      type,
      subject,
      picture,
      camera
    }
    detailForm.value = obj
  })
}
getdetail($attrs._item)

const initForm = () => {
  ruleForm.value = {
    ...detailForm.value,
    title: detailForm.value.title,
    type: detailForm.value.type,
    subject: detailForm.value.subject,
    level: detailForm.value.level,
    is_order: detailForm.value.is_order,
    desc: detailForm.value.desc,
    location: detailForm.value.location,
    area: detailForm.value.area,
    create_time: detailForm.value.create_time,
    color_code: detailForm.value.color_code,
    userIDs: detailForm.value.userIDs,
    qr_code: detailForm.value.qr_code,
    picture: detailForm.value.picture
  }
}

const submitForm = async (formEl: InstanceType<typeof ElForm> | undefined) => {
  console.log(!formEl)

  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      let userName = ''
      ruleForm.value.userIDs.forEach((e: number) => {
        if (optionsAdmin.value.find((i) => i.id === e)) {
          if (userName !== '') {
            userName += ','
          }
          userName += optionsAdmin.value.find((i) => i.id === e)?.username
        }
      })
      console.log('aaaa', files.value)
      if (files.value.length === 0) {
        ruleForm.value.picture = 'https://swryangzhou.oss-cn-beijing.aliyuncs.com/image/20220711/092543961.png'
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
        ruleForm.value.picture = string
      }
      let params: any = {
        ...ruleForm.value,
        userIDs: ruleForm.value.userIDs.join(','),
        users: userName,
        type: ruleForm.value.type.join(','),
        subject: ruleForm.value.subject.join(',')
      }

      addLaboratory(params).then((res) => {
        if (res.code === 10) {
          files.value = []
          ElMessage({
            type: 'success',
            message: res.msg
          })
          getdetail($attrs._item)
        }
      })
      // console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}
let upload: any = ref(null)
const uploadSuccess = (response: unknown, file: UploadFile, fileList: UploadFile[]) => {
  console.log('🚀 ~ file: index.vue ~ line 444 ~ uploadSuccess ~ fileList', fileList)
  files.value = fileList
}

const handleRemove = (file: UploadFile, fileList: UploadFile[]) => {
  console.log(file, fileList)
  files.value = fileList
}
const handleProgress = (e: any, file: UploadFile, fileList: UploadFile[]) => {
  console.log(e, file, fileList)
  files.value = fileList
}
defineExpose({ ruleForm, initForm, submitForm, ruleFormRef, files, upload, filesList })
</script>
<style scoped lang="scss">
.container {
  display: flex;
  padding: 20px;
  text-align: left;
  .el-form {
    width: 40%;
    margin-right: 100px;
  }
  .info {
    width: 30%;
    padding: 20px;
    background-color: #f3f3f3;
    .infoTitle {
      text-align: center;
      color: #05c65d;
      font-size: 24px;
    }
    .infoItemUser {
      align-items: center;
      ::v-deep .isBorder .el-input__inner {
        background-color: #f3f3f3;
      }
    }
    .infoItem,
    .infoItemUser {
      display: flex;
      // align-items: center;
    }
  }
}
.w-140 {
  display: inline-block;
  text-align: right;
  width: 120px;
}

::v-deep .isBorder .el-input__inner {
  border: none;
  box-shadow: 0 0 0 0px;
  color: black;
  resize: none;
  background-color: #fff;
}
::v-deep .isBorder .el-textarea__inner {
  border: none;
  box-shadow: 0 0 0 0px;
  color: black;
  resize: none;
  background-color: #fff;
}
::v-deep .isBorder .el-input__suffix {
  display: none;
}
</style>
