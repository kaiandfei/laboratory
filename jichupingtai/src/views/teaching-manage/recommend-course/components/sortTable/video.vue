<template>
  <div>
    <div class="row">
      <div class="video-ui">
        <el-upload
          class="upload"
          accept="video/*"
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
          <el-button class="btn" size="small" type="primary">新增视频</el-button>
        </el-upload>
        <ul>
          <li v-for="(item, index) in fileList" :key="index">
            <video :src="item ? item.url : ''" controls="controls" />
          </li>
        </ul>
      </div>
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
    console.log('🚀 ~ file: video.vue:43 ~ created ~ this.itemData:', this.itemData)
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
      if (!/\.(mp4|avi)$/.test(file.name)) {
        this.$message.error('上传视频只能是 mp4,avi 格式!')
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

<style lang="scss" scoped>
.video-ui {
  text-align: left;
  // ::v-deep .upload,
  // .el-upload-list {
  //   display: block;
  // }
  & > ul {
    width: 100%;
    display: flex;
    & > li {
      margin: 10px 10px 10px 0;
      display: inline-block;
      & > video {
        width: 220px;
      }
    }
  }
}
</style>
