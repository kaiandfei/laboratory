<template>
  <div>
    <div class="panel-header">
      <div class="default-select">
        <el-select v-model="defaultValue" class="m-2" v-for="(item, index) in selItems" :key="index">
          <el-option :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
      <div class="line">
        <div class="line1"></div>
        <div class="line2"></div>
        <div class="line3"></div>
        <div class="template-name">数据分析中心</div>
      </div>
      <div class="header-right">
        <div class="save" @click="openSave">
          <el-icon><Collection /></el-icon>
          保存
        </div>
      </div>
    </div>
    <el-dialog
      v-model="dialogVisible"
      title="保存模板"
      width="30%"
      :close-on-click-modal="false"
      center
      @close="handleClose"
    >
      <el-form :model="form" :rules="rules" ref="ruleFormRef" class="form">
        <el-form-item label="模板所属" label-width="80" prop="area_level">
          <el-select v-model="form.area_level" placeholder="请选择模板所属" style="width: 100%">
            <el-option v-for="(item, index) in temBelong" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="区域" label-width="80" prop="area">
          <el-select v-model="form.area" placeholder="请选择区域" style="width: 100%">
            <el-option v-for="(item, index) in areaList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="模板名称" label-width="80" prop="name">
          <el-input v-model="form.name" placeholder="请输入模板名称" maxlength="25" show-word-limit />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="resetForm(ruleFormRef)">取消</el-button>
          <el-button type="primary" @click="confirm(ruleFormRef)" :loading="btnLoading">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElLoading } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { makeDiagramTemplate, uploadImage } from '@/service/dataPage/index'
import html2canvas from 'html2canvas'
import { useStore } from '@store/index'
const store = useStore()
const props = defineProps(['panelList', 'panelBodyId', 'temName', 'temId'])
const $emit = defineEmits(['backHome', 'getPanelBody'])
const defaultValue = ref(0)
const selItems = [
  {
    label: '某市',
    value: 0
  },
  {
    label: '某区',
    value: 0
  },
  {
    label: '某学校',
    value: 0
  },
  {
    label: '某标准测算',
    value: 0
  },
  {
    label: '某学年某学期',
    value: 0
  }
]

const dialogVisible = ref(false)
interface RuleForm {
  name: string
  area_level: string
  area: string
}
const addZero = (num: any) => {
  if (parseInt(num) < 10) {
    num = '0' + num
  }
  return num
}
const d = new Date()
const year = d.getFullYear()
const month = d.getMonth() + 1
const day = d.getDate()
const form = ref({
  name: '数据模版' + year + addZero(month) + addZero(day),
  area_level: store.state.login?.userInfo.area_level,
  area: ''
})
onMounted(() => {
  console.log('wewqeq', props.temName)
  if (props.temName) {
    form.value.name = props.temName
  }
})
if (store.state.login?.userInfo.role_id === 1) {
  form.value.area = store.state.login?.userInfo.school.id
  form.value.area_level = 3
} else {
  form.value.area =
    store.state.login?.userInfo.area_level === 2 ? store.state.login?.userInfo.city : store.state.login?.userInfo.area
  form.value.area_level = store.state.login?.userInfo.area_level === 2 ? 1 : 2
}
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules<RuleForm>>({
  name: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
  area_level: [
    {
      required: true,
      message: '请选择模板所属',
      trigger: 'change'
    }
  ],
  area: [
    {
      required: true,
      message: '请选择区域',
      trigger: 'change'
    }
  ]
})
const temBelong = ref<any>([])
const getAreaLevel = () => {
  if (store.state.login?.userInfo.role_id === 1) {
    temBelong.value = [
      {
        label: '校级',
        value: 3
      }
    ]
  } else {
    if (store.state.login?.userInfo.area_level === 2) {
      temBelong.value = [
        {
          label: '市级',
          value: 1
        }
      ]
    } else {
      temBelong.value = [
        {
          label: '区级',
          value: 2
        }
      ]
    }
  }
}
getAreaLevel()
const areaList = ref<any>([])
const getAreaList = () => {
  if (store.state.login?.userInfo.role_id === 1) {
    areaList.value = [
      {
        label: store.state.login?.userInfo.school.name,
        value: store.state.login?.userInfo.school.id
      }
    ]
  } else {
    areaList.value =
      store.state.login?.userInfo.area_level === 3
        ? [
            {
              label: store.state.login?.userInfo.areaname,
              value: store.state.login?.userInfo.area
            }
          ]
        : [
            {
              label: store.state.login?.userInfo.cityname,
              value: store.state.login?.userInfo.city
            }
          ]
  }
}
getAreaList()

const openSave = () => {
  dialogVisible.value = true
}
const getFileFromBase64 = (data: any) => {
  let _base64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgAB...'
  let fileName = '图片1.jpg' // 文件名
  let opType = _base64.split(';base64')[0].slice(5)
  const dataArr = data.split(',')
  const byteString = atob(dataArr[1])
  const options = {
    type: opType,
    endings: 'native'
  }
  const u8Arr = new Uint8Array(byteString.length)
  for (let i = 0; i < byteString.length; i++) {
    u8Arr[i] = byteString.charCodeAt(i)
  }
  let _fileObj = new File([u8Arr], fileName, options)
  return _fileObj
}
const screenshotUrl = ref<any>('')
const getScreenshot = () => {
  setTimeout(() => {
    const id = props.panelBodyId
    html2canvas(id, {
      allowTaint: false,
      useCORS: true,
      backgroundColor: '#02072c',
      scale: 2,
      dpi: 300
    }).then((canvas) => {
      screenshotAndUpload(getFileFromBase64(canvas.toDataURL('image/png')))
    })
  }, 100)
}
const screenshotAndUpload = async (val) => {
  try {
    let formData = new FormData()
    formData.append('image', val)
    const { data, code } = await uploadImage(formData)
    if (code === 10) {
      screenshotUrl.value = data.file_url
      save()
      console.log(222, screenshotUrl.value)
    }
  } catch (error) {
    console.log(error)
    // location.href = `https://stackoverflow.com/search?q=js+${error.message}`
  }
}
let loading = ref<any>(false)
const openFullScreen = () => {
  loading.value = ElLoading.service({
    lock: true,
    text: '正在保存中，请稍等',
    background: 'rgba(0, 0, 0, 0.7)'
  })
}
const save = async () => {
  openFullScreen()
  // console.log(198, screenshotUrl.value)
  try {
    let params: any = {
      name: form.value.name,
      area_level: form.value.area_level,
      area: form.value.area_level === 3 ? 0 : form.value.area,
      school_id: form.value.area_level === 3 ? form.value.area : 0,
      extra_data: JSON.stringify({ tem: [...props.panelList], url: screenshotUrl.value })
    }
    if (props.temId) {
      params['id'] = props.temId
    }
    const { code } = await makeDiagramTemplate(params)
    if (code === 10) {
      dialogVisible.value = false
      resetForm(ruleFormRef.value)
      ElMessage.success('创建成功')
      $emit('backHome')
    }
    btnLoading.value = false
    loading.value.close()
  } catch (error) {
    btnLoading.value = false
    loading.value.close()
    console.log('err', error)
  }
}
const btnLoading = ref<boolean>(false)
//保存模板
const confirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      btnLoading.value = true
      $emit('getPanelBody')
      getScreenshot()
    } else {
      console.log('error submit!', fields)
    }
  })
}
const resetForm = (formEl: FormInstance | undefined) => {
  dialogVisible.value = false
  if (!formEl) return
  formEl.resetFields()
}
const handleClose = () => {
  resetForm(ruleFormRef.value)
}
</script>

<style lang="scss" scoped>
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 60px;
  // background-color: #04061c;
  padding: 0 20px;
  box-sizing: border-box;
  color: #fff;
  position: relative;
  ::v-deep .el-input__suffix-inner,
  .el-select {
    pointer-events: none;
  }

  .header-right {
    display: flex;
    align-items: center;
    height: 60px;
    cursor: pointer;

    .save {
      display: flex;
      align-items: center;
      margin-left: 20px;
      background-color: #0d3150;
      border-radius: 10px;
      padding: 5px 10px;
      box-sizing: border-box;
      cursor: pointer;
      z-index: 1;
      .el-icon {
        margin-right: 5px;
      }
    }
  }
}
.line {
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 80%;
  // line-height: 40px
  .line1 {
    width: 15%;
    border-bottom: 1px solid #195d7e;
    position: absolute;
    bottom: -5px;
  }
  .line2 {
    position: absolute;
    left: 15%;
    bottom: -5px;
    width: 6px;
    border-bottom: 1px solid #195d7e;
    transform: rotate(-45deg);
    transform-origin: left bottom;
  }
  .line3 {
    position: absolute;
    left: calc(15% + 4px);
    bottom: 0;
    width: calc(100% - 15% - 3px);
    border-bottom: 1px solid #195d7e;
  }
  .template-name {
    position: absolute;
    left: 62%;
    bottom: 0;
    font-size: 20px;
    font-style: italic;
    width: 200px;
    height: 30px;
    line-height: 35px;
    text-align: center;
    background: url('../../assets/images/bigData/title.png') no-repeat;
    background-size: 100% 100%;
    ::v-deep .el-select {
      width: 120px;
      margin-right: 10px;
      z-index: 1000;
      .el-select__wrapper {
        background-color: #001e3d;
        box-shadow: unset !important;
        // border: 1px solid #12cbf1;
      }
      .el-select__placeholder {
        color: #fff !important;
      }
    }
  }
}
.default-select {
  ::v-deep .el-select {
    width: 100px;
    margin-right: 10px;
    z-index: 1000;
    .el-select__wrapper {
      background-color: #001e3d;
      box-shadow: unset !important;
      // border: 1px solid #12cbf1;
      .el-select__icon {
        color: #00adff;
      }
    }
    .el-select__placeholder {
      color: #fff !important;
    }
  }
}
.form {
  margin-top: 10px;
}
::v-deep .el-dialog__header {
  border-bottom: 1px solid #05c65d;
  margin-right: 0;
}
::v-deep .el-dialog__footer {
  text-align: right;
}
</style>
