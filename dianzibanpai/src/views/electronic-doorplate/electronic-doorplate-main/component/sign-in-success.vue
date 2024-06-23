<template>
  <div class="container">
    <h1 :class="!str ? '' : 'fail'">{{ !str ? '签到成功' : '签到失败' }}</h1>
    <p>{{ !str ? `欢迎${userName}来上课~` : msg }}</p>
  </div>
</template>

<script>
import localCache from '@/utils/localCache'
export default {
  name: 'SignInSuccess',
  props: {
    str: {
      type: Boolean,
      default: false,
    },
    msg: {
      type: String,
      default: '今日没有实验课开展~',
    },
  },
  data() {
    return {
      userName: localCache.getCookie('userName'),
    }
  },
  mounted() {
    console.log(111, this.str)
  },
}
</script>

<style lang="scss" scoped>
h1 {
  font-size: 30px;
  color: #329581;
}
p {
  margin: 40px 0;
}
.fail {
  color: red;
}
</style>
