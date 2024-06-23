<template>
  <el-dialog
    v-if="dialogVisible"
    :title="title"
    :visible.sync="dialogVisible"
    :width="currComponent.name === 'Face' ? '35%' : '30%'"
    :top="'20vh'"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :append-to-body="true"
    center
  >
    <component
      ref="currRefs"
      :is="currComponent"
      :ruleForm="ruleForm"
      :str="str"
      :msg="msg"
      @toggleComponent="toggleComponent"
      @handleClose="handleClose"
      @getRuleForm="getRuleForm"
      v-bind="$attrs"
      v-on="$listeners"
    ></component>
  </el-dialog>
</template>

<script>
const faceRecognitionTitleData = ['人脸识别', '录入信息', '正在录入', '签到/签退']
import face from '../component/face-identify.vue'
export default {
  name: 'Dialog',
  data() {
    return {
      title: '人脸识别',
      str: false,
      dialogVisible: false,
      currComponent: face,
      ruleForm: {},
      msg: '',
    }
  },
  inject: ['updateComData', 'openSetInterval'],

  methods: {
    initCom() {
      this.currComponent = face
    },
    handleClose() {
      this.$refs.currRefs?.closeCamera && this.$refs.currRefs?.closeCamera()
      this.dialogVisible = false
      setTimeout(() => {
        this.title = '人脸识别'
      }, 500)
      this.updateComData()
      this.openSetInterval()
    },
    toggleComponent(com, i = 0, str = false, msg = '') {
      this.str = str
      this.msg = msg
      this.currComponent = com
      this.title = faceRecognitionTitleData.find((item, index) => index === i)
    },
    getRuleForm(data) {
      this.ruleForm = data
    },
  },
}
</script>

<style lang="scss" scoped>
:deep .el-dialog__header {
  background-color: #61cab5;
  .el-dialog__title {
    color: #fff;
  }
}
:deep .el-dialog__body {
  text-align: center;
}
</style>
