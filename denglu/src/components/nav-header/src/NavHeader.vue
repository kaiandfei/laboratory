<template>
  <div class="nav-header">
    <div class="left-title" title="首页" v-show="isShow">
      <img src="@/assets/images/logo.png" alt="" />
      <span>实验教学管理</span>
    </div>

    <el-dropdown trigger="click">
      <div class="user">
        <img src="@images/menu/user.png" alt="" />
        <p>{{ userName }}</p>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item icon="User" @click="openperson">个人中心</el-dropdown-item>

          <el-dropdown-item icon="el-icon-back" @click="loginOut">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import router from '@/router'
import localCache from '@/utils/localCache'

export default defineComponent({
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    userName: {
      type: String,
      default: '请登录'
    }
  },
  setup() {
    const openperson = () => {
      console.log('111')
    }
    const loginOut = () => {
      localCache.deleteCache()
      localCache.clearCookie('swr_u_msg')
      console.log('cook：' + localCache.getCookie('swr_u_msg'))
      router.push('/login')
    }
    console.log('2')
    return {
      loginOut,
      openperson
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
  .user {
    display: flex;
    align-items: center;
    width: 100px;
    height: 34px;
    line-height: 34px;
    cursor: pointer;
    img {
      width: 24px;
      height: 24px;
    }
    p {
      padding: 0 4px;
      width: 68px;
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  :deep(.el-dropdown) {
    float: right;
  }
}
</style>
