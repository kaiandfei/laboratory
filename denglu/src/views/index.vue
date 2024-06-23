<template>
  <el-container class="main">
    <!-- <el-aside width="auto">
      <NavMenu :isShow="isShow"></NavMenu>
      <img
        @click="changeIsShow"
        class="change-menu"
        :class="isShow ? 'close' : 'open'"
        src="@/assets/images/menu/open-close.png"
        alt=""
      />
    </el-aside> -->
    <el-container>
      <el-header>
        <NavHeader :isShow="isShow" :userName="userName"></NavHeader>
      </el-header>
      <el-main>
        <!-- <router-view></router-view> -->

        <div class="main_body">
          <div class="modular_body"><a href="http://192.168.1.203:8080">进入模块</a></div>
          <div class="login_div"></div>
        </div>
        <el-footer>
          Copyright © {{ new Date().getFullYear() }}
          <a href="http://www.sinoswr.com/" target="_blank">江苏苏威尔科技有限公司</a>
          All Rights Reserved
        </el-footer>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
// import HelloWorld from '@/components/HelloWorld.vue' // @ is an alias to /src
import { NavHeader } from '@/components/nav-header'
// import { NavMenu } from '@/components/nav-menu'
import { useStore } from '@store/index'
import localCache from '@/utils/localCache'

export default defineComponent({
  name: 'Home',
  components: {
    NavHeader
  },
  setup() {
    let isShow = ref(false)
    let userName = ref('未登录')
    const changeIsShow = () => {
      isShow.value = !isShow.value
    }
    const store = useStore()
    const saveStore = () => {
      sessionStorage.setItem('state', JSON.stringify(store))
    }
    // 用户登录信息
    let loginMsg = localCache.getCache('swr_u_msg')
    console.log(loginMsg)
    if (!loginMsg) {
      console.log('空对象')
    } else {
      console.log('有数据')
      console.log(loginMsg)
      userName.value = loginMsg.username
    }
    window.addEventListener('unload', saveStore)
    return {
      isShow,
      userName,
      changeIsShow
    }
  }
})
</script>

<style scoped lang="scss">
.main {
  width: 100%;
  height: 100%;
  .el-aside {
    position: relative;
    overflow: visible;
    .change-menu {
      position: absolute;
      width: 40px;
      height: 40px;
      cursor: pointer;
    }
    .open {
      top: 10px;
      right: -20px;
      animation-name: img-open;
      animation-duration: 0.5s;
    }
    .close {
      top: 10px;
      right: 5px;
      animation-name: img-close;
      animation-duration: 0.5s;
    }
    @keyframes img-open {
      0% {
        right: 5px;
      }
      100% {
        right: -20px;
      }
    }
    @keyframes img-close {
      0% {
        right: -20px;
      }
      100% {
        right: 5px;
      }
    }
  }
  .el-header {
    background-color: #f3f4f8;
  }
  .el-main {
    padding: 20px 0;
    background-color: #e8e8e9;
    .main_body {
      display: flex;
      .modular_body {
        flex: 1;
      }
      .login_div {
        width: 200px;
        height: 300px;
        background-color: #05c65d;
      }
    }
  }
  .el-footer {
    background-color: #f3f4f8;
    height: 50px;
    line-height: 50px;
  }
  a:link {
    color: #05c65d;
  }
  a:visited {
    color: #05c65d;
  }
  a:hover {
    color: #05c65d;
  }
  a:active {
    color: #05c65d;
  }
}
</style>
