<template>
  <div class="container">
    <header>教务管理 > 组织机构</header>
    <div class="title">组织机构</div>
    <div class="upload" v-if="!isShowPic">
      <el-upload
        class="upload-demo"
        drag
        :action="requireApi"
        :data="fileData"
        :limit="1"
        accept=".jpg,.png,.jpeg,.JPG,.JPEG"
        name="image"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <el-icon class="el-icon--upload" :size="100"><upload-filled /></el-icon>
        <div class="el-upload__text">
          暂无组织机构图，将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">只能上传jpg/png文件，且不能超过500kb</div>
        </template>
      </el-upload>
    </div>
    <div class="pic" v-else>
      <div class="showImg">
        <img :src="fileUrl" alt="" />
      </div>
      <div class="btns">
        <div class="btn green-btn" @click="handleDelete(true)">删除</div>
        <el-upload
          class="upload-demo"
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
          <div class="el-upload__text">
            <em class="btn green-btn">重新上传</em>
          </div>
        </el-upload>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { delPic, findInstitutionalFramework, save } from '@/service/register-examine/index'
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import localCache from '@/utils/localCache'
import { BASE_URL } from '@service/request/config'
import { UploadFilled } from '@element-plus/icons-vue'
const isShowPic = ref(false)
const requireApi = ref(BASE_URL + 'swrserveadmin/OssImage/uploadImage')
const fileData = reactive({
  token: localCache.getCookie('swr_token')
})
const fileUrl = ref('')
const fileId = ref('')
const uploadRef = ref()
//文件上传成功
const handleAvatarSuccess: any = async (response: any, uploadFile: { raw: Blob | MediaSource }) => {
  console.log(36, response)
  try {
    let params = {
      url: response.data.file_url,
      file_name: response.data.file_name
    }
    const { data, code } = await save(params)
    if (code === 10) {
      ElMessage({
        type: 'success',
        message: '上传成功'
      })
      handleDeleteRes()
      setTimeout(() => {
        getFindInstitutionalFramework()
      }, 100)
      // fileUrl.value = data.url
      // fileId.value = data.id
      // isShowPic.value = true
      uploadRef.value.handleRemove(response)
    }
  } catch (error) {
    console.log(error)
  }
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
const getFindInstitutionalFramework = async () => {
  try {
    const { data, code } = await findInstitutionalFramework()
    if (code === 10) {
      if (data.length !== 0) {
        fileUrl.value = data.url
        fileId.value = data.id
        isShowPic.value = true
      } else {
        isShowPic.value = false
      }
    }
  } catch (error) {
    console.log(error)
  }
}
getFindInstitutionalFramework()
//删除图片
const handleDelete = async (val: boolean) => {
  if (fileId.value === '') return
  ElMessageBox.confirm('您正在删除组织机构图，改操作无法撤销，请确认是否删除？', '删除', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        const params = {
          id: fileId.value
        }
        const { data, code } = await delPic(params)
        if (code === 10) {
          console.log(data)
          if (val) {
            ElMessage({
              type: 'success',
              message: '删除成功'
            })
          }
          isShowPic.value = false
        }
      } catch (error) {
        console.log(error)
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除'
      })
    })
}
const handleDeleteRes = async () => {
  if (fileId.value === '') return
  try {
    const params = {
      id: fileId.value
    }
    const { code } = await delPic(params)
    if (code === 10) {
      isShowPic.value = false
    }
  } catch (error) {
    console.log(error)
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  text-align: left;
  display: flex;
  flex-direction: column;

  header {
    height: 30px;
  }

  .title {
    height: 60px;
    display: flex;
    align-items: center;
    background-color: #dcece3;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    padding-left: 1.8%;
    font-size: 20px;
    color: #05c65d;
    font-weight: bold;
  }

  .upload {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    text-align: center;
    background-color: #fff;
  }

  .pic {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: calc(100% - 90px);
    background-color: #fff;
    padding: 20px;
    box-sizing: border-box;
    .showImg {
      overflow: auto;
      flex: 1;
      width: 100%;
      text-align: center;
      img {
        width: 80%;
      }
    }

    .btns {
      display: flex;
      align-items: center;
      height: 35px;
      margin-top: 20px;

      .btn {
        width: 90px;
        text-align: center;
        margin-right: 20px;
      }
    }
  }
}

::v-deep .el-upload-dragger {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 500px;
  height: 300px;
}

.el-upload__tip {
  color: #ee9a59;
}
.icon {
  color: #05c65d;
}
</style>
