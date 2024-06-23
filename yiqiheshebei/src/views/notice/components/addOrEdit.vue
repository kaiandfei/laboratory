<template>
  <div class="container">
    <div class="add">
      <span>创建通知</span>
      <div class="btns">
        <div class="btn green-btn btn-edit" :class="submitLoading ? 'isDisabled' : ''" @click="submitForm(ruleFormRef)">
          提交
        </div>
      </div>
    </div>
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="80px" class="demo-ruleForm" status-icon>
      <el-form-item label="新闻标题" prop="title" class="newTitle">
        <el-input v-model="ruleForm.title" maxlength="50" placeholder="请输入新闻标题" show-word-limit />
        <span class="explain">
          说明：标题要准确反应文章的主要内容，不得歪曲文章原意、以偏概全、断章取义、无中生有、内容空洞
        </span>
      </el-form-item>
      <el-form-item label="作者" prop="create_user">
        <el-input v-model="ruleForm.create_user" maxlength="20" placeholder="请输入新闻标题" show-word-limit />
      </el-form-item>
      <el-form-item label="通知正文" prop="content">
        <div class="ql-snow">
          <quill-editor
            v-model:content="ruleForm.content"
            ref="myQuillEditor"
            :options="editorOption"
            content-type="html"
          ></quill-editor>
        </div>
      </el-form-item>
      <el-form-item label="添加附件" prop="file" class="file">
        <el-upload
          :file-list="filesList"
          class="upload-demo"
          :data="fileData"
          ref="uploadRef"
          :action="BASE_URL + 'swrserveadmin/OssImage/uploadImage'"
          multiple
          accept=" .xlsx, .pdf, .doc, .docx, .xls, .rar, .zip, .png , .jpg, .jepg"
          :limit="10"
          :on-success="uploadSuccess"
          :on-remove="handleRemove"
          name="image"
        >
          <el-button type="primary">上传文件</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { BASE_URL } from '@service/request/config'
import { saveNotice } from '@/service/noticeApi'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { reactive, ref, defineEmits, defineProps, toRefs, watch } from 'vue'
import { useStore } from '@store/index'
import { ElMessage } from 'element-plus'
import type { UploadFile } from 'element-plus/es/components/upload/src/upload.type'
import type { ElForm } from 'element-plus'
const $emit = defineEmits(['back'])
const $props = defineProps(['detailNotice', 'isEdit', 'editId'])
const refs = toRefs($props)
const store = useStore()
const fileData = reactive({
  token: store.state.login.userInfo.token
})
interface RuleForm {
  create_user: string
  title: string
  content: string
}
const ruleFormRef = ref<InstanceType<typeof ElForm>>()
let ruleForm = ref<RuleForm>({
  title: '',
  create_user: '',
  content: ''
})
// console.log(refs.detailNotice);
watch(
  () => refs.detailNotice.value,
  (newValue, oldValue) => {
    ruleForm.value.title = newValue.title
    ruleForm.value.create_user = newValue.create_user
    myQuillEditor.value.setHTML(newValue.content)
    let obj = {
      file_name: '',
      url: ''
    }
    let obj1 = {
      name: '',
      url: ''
    }
    newValue.notice_file.forEach((item: any) => {
      obj1.name = item.file_name
      obj1.url = item.url
      obj.file_name = item.file_name
      obj.url = item.url
      filesList.value.push(obj1)
      files.value.push(obj)
    })
    console.log(85, ruleForm.value)
  }
)
// ruleForm = refs.detailNotice
const myQuillEditor = ref()
const rules = reactive({
  title: [{ required: true, message: '请输入新闻标题', trigger: 'blur' }],
  create_user: [{ required: true, message: '请输入作者', trigger: 'blur' }],
  content: [{ required: true, message: '请输入通知正文', trigger: 'blur' }]
})
let editorOption = {
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线
      [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
      [{ align: [] }], // 对齐方式
      [{ size: ['small', false, 'large', 'huge'] }], // 字体大小
      // [{ font: [] }], // 字体种类
      // [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
      // [{ direction: 'ltl' }], // 文本方向
      // [{ direction: 'rtl' }], // 文本方向
      // [{ indent: '-1' }, { indent: '+1' }], // 缩进
      [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表
      // [{ script: 'sub' }, { script: 'super' }], // 上标/下标
      ['blockquote', 'code-block'], // 引用  代码块
      ['clean'] // 清除文本格式
      // ['image'], // 链接、图片
    ]
  }
}
const filesList = ref(Array<any>())
const files = ref(Array<any>())
const uploadRef = ref()

const uploadSuccess = (response: any, file: UploadFile, fileList: UploadFile[]) => {
  let obj = {
    file_name: '',
    url: ''
  }
  obj.file_name = response.data.file_name
  obj.url = response.data.file_url
  files.value.push(obj)
}
const handleRemove = (file: UploadFile, fileList: UploadFile[]) => {
  let obj = {
    file_name: '',
    url: ''
  }
  fileList.forEach((item: any) => {
    obj.file_name = item.response.data.file_name
    obj.url = item.response.data.file_url
    files.value.push(obj)
  })
}
let submitLoading = ref(false)
const submitForm = async (formEl: InstanceType<typeof ElForm> | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      submitLoading.value = true
      try {
        let params: any = {
          title: ruleForm.value.title,
          create_user: ruleForm.value.create_user,
          content: ruleForm.value.content,
          notice_file: files.value
        }
        if (refs.isEdit.value) {
          params['id'] = refs.editId.value
        }
        const { code } = await saveNotice(params)
        if (code === 10) {
          ElMessage({
            type: 'success',
            message: '保存成功'
          })
          setTimeout(() => {
            submitLoading.value = false
          }, 1000)
          $emit('back')
        } else {
          setTimeout(() => {
            submitLoading.value = false
          }, 1000)
        }
      } catch (error) {
        setTimeout(() => {
          submitLoading.value = false
        }, 1000)
        console.log(error)
        throw new Error('error')
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.isDisabled {
  pointer-events: none;
}

.edit {
  width: 80px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  border-radius: 5px;
  cursor: pointer;
}

.container {
  text-align: left;

  .add {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    background-color: #dcece3;
    box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.16);

    span {
      font-size: 20px;
      font-weight: bold;
      color: #05c65d;
      margin-left: 20px;
    }

    .btn-edit {
      width: 80px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      border-radius: 5px;
      cursor: pointer;
      margin-right: 20px;
    }
  }

  .demo-ruleForm {
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0px 1px 4px 1px rgba(0, 0, 0, 0.16);
    padding: 20px;
  }

  .el-input {
    width: 45%;
  }
}

.newTitle ::v-deep .el-form-item__content {
  display: flex;

  .explain {
    flex: 1;
    color: #ee9a59;
    margin-left: 20px;
  }
}

:deep(.ql-toolbar) {
  text-align: left;
}

:deep(.ql-editor) {
  min-height: 180px;
}

:deep(.ql-formats) {
  height: 21px;
  line-height: 21px;
}

.file {
  margin-top: 80px;
}
</style>
