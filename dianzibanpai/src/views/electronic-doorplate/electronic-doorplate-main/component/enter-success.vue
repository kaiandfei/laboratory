<template>
  <div class="container">
    <div class="operate">{{ !str ? '信息录入成功！' : '信息录入失败！' }}</div>
    <div>
      <img class="success-img" :src="!str ? successImageSrc : failImageSrc" alt="" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'EnterSuccess',
  props: {
    str: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      successImageSrc: require('@/assets/images/laboratory/success.png'),
      failImageSrc: require('@/assets/images/laboratory/fail.png'),
    }
  },
  mounted() {},
}
</script>

<style lang="scss" scoped>
.operate {
  font-size: 20px;
  font-weight: bold;
  margin: 0 50px 50px;
}
.success-img {
  width: 160px;
  height: 160px;
}
</style>
