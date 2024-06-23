<template>
  <div class="container">
    <h1>人脸识别失败</h1>
    <div class="desc">
      可能有以下⼏种情况导致：<br />
      1.未录⼊⼈脸信息；<br />
      2.⽹络问题；<br />
    </div>
    <div class="footer">
      <div class="secondary-btn" @click="handleRetry">重试</div>
      <div class="primary-btn" @click="handleInputFace">录入人脸</div>
    </div>
  </div>
</template>

<script>
import face from './face-identify.vue'
import inputFace from './input-face.vue'
export default {
  name: 'FaceFail',
  data() {
    return {}
  },
  methods: {
    handleRetry() {
      this.$emit('toggleComponent', face)
    },
    handleInputFace() {
      this.$emit('toggleComponent', inputFace, 1)
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  h1 {
    font-size: 30px;
    color: #ff3e3e;
    margin-bottom: 30px;
  }
  .desc {
    text-align: left;
  }
  .footer {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    .secondary-btn {
      margin-right: 20px;
    }
  }
}
</style>
