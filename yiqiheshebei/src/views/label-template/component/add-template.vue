<template>
  <div class="addCantainer">
    <div class="header">{{ headerTitle }} 自定义模板</div>
    <div class="main">
      <div class="left">
        <component
          ref="currRef"
          :is="currCom"
          v-model:infoData="infoData"
          v-model:color="color"
          :activeCom="refs.activeCom.value"
          :isBg="false"
        />
      </div>
      <div class="right">
        <div class="tool">自定义设计工具</div>
        <div class="tem-name">
          <span>模板名称：</span>
          <el-input v-model="comTitle" placeholder="请输入模板的名称" clearable maxlength="100" />
        </div>
        <div class="tem-name">
          <span>模板背景：</span>
          <div class="color-list">
            <div
              class="color-item"
              v-for="item in backgroundColor"
              :key="item"
              :style="{ backgroundColor: item }"
              @click="handleColorClick(item)"
            ></div>
          </div>
          <!-- <el-color-picker v-model="color" :predefine="predefineColors" @change="colorChange" /> -->
          <div class="upload-img">
            <el-upload
              class="avatar-uploader"
              :action="requireApi"
              :data="fileData"
              :limit="1"
              :show-file-list="false"
              ref="uploadRef"
              accept=".jpg,.png,.jpeg,.JPG,.JPEG"
              name="image"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <div class="bg">+</div>
              <span>自定义背景</span>
            </el-upload>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="green-btn btn" :style="{ pointerEvents: loading ? 'none' : 'auto' }" @click="save">保存</div>
      <div class="white-btn btn" @click="cancel">取消</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { saveNote } from '@/service/label-manage/index'
import { ElMessage } from 'element-plus'
import { ref, defineProps, defineEmits, toRefs, reactive } from 'vue'
import comLab from './com-lab.vue'
import comCode from './com-code.vue'
import comInstrumentCard from './com-instrument-card.vue'
import localCache from '@/utils/localCache'
import { BASE_URL } from '@service/request/config'
const requireApi = ref(BASE_URL + 'swrserveadmin/OssImage/uploadImage')
const fileData = reactive({
  token: localCache.getCookie('swr_token')
})
const emits = defineEmits(['toggleIsHome', 'getNoteList'])
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  activeCom: {
    type: Number,
    default: 1
  }
})
const refs = toRefs(props)
const currCom = ref()
const infoData = ref()
const IMG1 = require('@assets/images/label-template/school_logo.png')
const IMG2 = require('@assets/images/label-template/code.png')
switch (refs.activeCom.value) {
  case 1:
    infoData.value = {
      header: '实验教学管理平台',
      school: '苏威尔高级中学',
      title: '物理实验室1',
      isSchool_logo: true,
      qr_code: IMG2,
      school_logo: IMG1
    }
    currCom.value = comLab
    break
  case 2:
    infoData.value = {
      number: '60001',
      deviceName: '仪器柜',
      specification: '规格',
      qr_code: IMG2
    }
    currCom.value = comCode
    break
  case 3:
    infoData.value = {
      number: '60001',
      deviceName: '仪器柜',
      specification: '规格',
      number_year: '三',
      qr_code: IMG2
    }
    currCom.value = comCode
    break
  case 4:
    infoData.value = {
      header: '仪器柜一号仪器（药品存放卡）',
      qr_code: IMG2,
      columns: [
        {
          label: '序号',
          prop: 'index',
          width: '50'
        },
        {
          label: '编号',
          prop: 'asset_number',
          width: '50'
        },
        {
          label: '名称',
          prop: 'name',
          width: '50'
        },
        {
          label: '规格型号',
          prop: 'specification',
          width: '70'
        },
        {
          label: '单位',
          prop: 'unit',
          width: '50'
        },
        {
          label: '数量',
          prop: 'total',
          width: '50'
        },
        {
          label: '存放位置（层）',
          prop: 'number_plies',
          width: '80'
        }
      ]
    }
    currCom.value = comInstrumentCard
    break
  case 5:
    infoData.value = {
      asset_number: '60001',
      deviceName: '仪器柜',
      specification: '规格',
      number_year: '三',
      create_time: '2023',
      position: '柜子1',
      qr_code: IMG2
    }
    currCom.value = comCode
    break
}
const color = ref('#fff')
const backgroundColor = ref([
  '#287FB8',
  '#DE4747',
  '#05C65D',
  '#EEA359',
  '#626572',
  '#3EC4DF',
  '#DCECE3',
  '#F5E44A',
  '#5FC605',
  '#E129B0'
])
const headerTitle = ref('')
headerTitle.value = refs.title.value
// console.log(56, headerTitle.value);

const comTitle = ref('')
const colorChange = (val: string) => {
  color.value = val
}
const currRef = ref()
const loading = ref(false)

const save = async () => {
  if (comTitle.value === '') {
    ElMessage({
      type: 'warning',
      message: '模板名称不能为空'
    })
    return
  }
  console.log(125, currRef.value.listData)

  loading.value = true
  try {
    let params = {
      type: refs.activeCom.value,
      name: comTitle.value,
      color: color.value,
      extra: JSON.stringify(currRef.value.listData)
    }
    // console.log(135, params)
    const { code } = await saveNote(params)
    if (code === 10) {
      ElMessage({
        type: 'success',
        message: '保存成功'
      })
      emits('toggleIsHome')
      emits('getNoteList', refs.activeCom.value)
    }
    loading.value = false
  } catch (error) {
    loading.value = false
    console.log(error)
  }
}
const cancel = () => {
  emits('toggleIsHome')
}
const handleColorClick = (item: string) => {
  color.value = item
  infoData.value.imgUrl = ''
  console.log(item)
}
const uploadRef = ref<any>()
//文件上传成功
const handleAvatarSuccess: any = async (response: any, uploadFile: { raw: Blob | MediaSource }) => {
  uploadRef.value!.clearFiles()
  color.value = ''
  infoData.value.imgUrl = response.data.file_url
}
//文件上传之前
const beforeAvatarUpload: any = (rawFile: any) => {
  const isLt500KB = rawFile.size / 1024 < 500
  if (!isLt500KB) {
    ElMessage.error('文件大小不能超过500kb')
    return false
  }
  return true
}
</script>

<style lang="scss" scoped>
.addCantainer {
  padding: 30px;
  background-color: #fff;

  .header {
    font-size: 30px;
    text-align: center;
  }

  .main {
    display: flex;
    justify-content: center;
    margin: 30px 0;

    .left {
      // width: 400px;
      // height: 500px;
      border: 1px solid #05c65d;
    }

    .right {
      margin-left: 20px;

      .tool {
        font-size: 20px;
        text-align: left;
      }

      .tem-name {
        display: flex;
        align-items: center;
        position: relative;
        margin: 10px 0;
        .upload-img {
          position: absolute;
          left: 80px;
          top: 50px;
          ::v-deep .el-upload {
            display: flex;
            align-items: center;
          }
        }
        // ::v-deep .el-color-picker {
        //   position: relative;
        //   left: -27px;
        // }

        span {
          text-align: left;
          width: 100px;
        }
      }
    }
  }

  .footer {
    display: flex;
    justify-content: center;

    .btn {
      width: 120px;
      height: 40px;
      line-height: 40px;
      border-radius: 10px;
      margin: 0 10px;
      cursor: pointer;
    }
  }
}
.bg {
  display: inline-block;
  width: 30px !important;
  height: 30px;
  line-height: 30px;
  text-align: center;
  color: #b5b5b5;
  font-size: 25px;
  border: 1px solid #b5b5b5;
  margin-right: 10px;
}
.color-list {
  display: flex;
  align-items: center;
  position: relative;
  left: -20px;
  .color-item {
    width: 30px;
    height: 30px;
    margin-right: 10px;
    cursor: pointer;
  }
}
</style>
