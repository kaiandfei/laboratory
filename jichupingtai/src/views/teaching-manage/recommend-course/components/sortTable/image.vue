<template>
  <div>
    <div class="row">
      <el-upload
        class="upload"
        accept="image/*"
        list-type="picture-card"
        :action="baseUrl + 'swrserveadmin/OssImage/uploadImage'"
        :on-preview="onpreview"
        :data="filedata"
        name="image"
        :before-upload="beforeAvatarUpload"
        :on-success="onsuccess"
        :on-remove="handleRemove"
        :multiple="false"
        :file-list="fileList"
      >
        <template #default><i class="el-icon-plus"></i></template>
        <!-- <img class="iconv" src="@images/common/video-icon.png" alt="" />
        <el-button class="btn" size="small" type="primary">新增图片</el-button> -->
        <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
      </el-upload>
    </div>
  </div>
</template>

<script>
import { useStore } from '@store/index'

import { TEACH_URL } from '@service/request/config'

export default {
  name: '',
  props: ['itemData'],

  data() {
    return {
      input: '',
      fileList: [],
      filedata: {
        token: useStore().state.login.userInfo.token
      },
      baseUrl: TEACH_URL
    }
  },
  created() {
    this.fileList = this.itemData.fileList
  },
  // mounted() {},
  methods: {
    onsuccess(response, file, fileList) {
      console.log('🚀 ~ file: h5p.vue ~ line 299 ~ onsuccess ~ fileList', fileList)
      if (response.code === 10) {
        // file.url = response.data.file_url
        // file.name = response.data.file_name
        // file.chapter_type = this.chapter_type
        // file.chapter = this.title

        this.fileList.push({
          url: response.data.file_url,
          name: response.data.file_name
        })
      }
    },
    beforeAvatarUpload(file) {
      if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(file.name)) {
        this.$message.error('上传图片只能是 .gif,jpeg,jpg,png 格式!')
        return false
      }
    },
    oncatch() {
      console.log('111')
    },
    onpreview(file) {
      window.open(file.url, '_blank')
    },
    handleRemove(file, fileList) {
      console.log('🚀 ~ file: video.vue:90 ~ handleRemove ~ file:', file, fileList)
      this.fileList = fileList
    }
  }
}
</script>

<style lang="scss" scoped></style>
