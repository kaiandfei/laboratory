<template>
  <div class="nav-header">
    <div class="left-title" title="首页" v-show="isShow">
      <img src="@/assets/images/logo.png" alt="" />
      <span>实验教学管理</span>
    </div>

    <div class="fr user-message">
      <div class="user">
        <img src="@images/menu/user.png" alt="" />
        <p :title="userName">{{ userName }}</p>
      </div>
      <div class="user" @click="loginOut">
        <img src="@images/common/quit.png" alt="" />
        <p>首页</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from '@store/index'
import { removeSession } from '@/utils/sessions'

export default defineComponent({
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const loginOut = () => {
      removeSession('state')
      window.location.href = process.env.VUE_APP_APP_LOGINURL as string
    }
    let userName = computed(() => store.state.login.userInfo.username)
    const store = useStore()
    return {
      loginOut,
      userName
    }
  }
})
</script>

<style scoped lang="scss">
.nav-header {
  height: 34px;
  padding: 13px 0;
  @keyframes title-open {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  .left-title {
    float: left;
    height: 33px;
    line-height: 33px;
    animation-name: title-open;
    animation-duration: 0.5s;
    cursor: pointer;
    img {
      width: 33px;
      height: 33px;
    }
    span {
      padding-left: 4px;
      float: right;
      font-size: 16px;
    }
  }
  .user-message {
    display: flex;
    align-items: center;
    .user {
      margin-left: 10px;
      display: flex;
      align-items: center;
      height: 34px;
      line-height: 34px;
      cursor: pointer;
      img {
        width: 24px;
        height: 24px;
      }
      p {
        padding: 0 4px;
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
