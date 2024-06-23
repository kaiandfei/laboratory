<template>
  <el-container class="main">
    <el-aside width="auto">
      <NavMenu :isShow="isShow"></NavMenu>
      <img
        @click="changeIsShow"
        class="change-menu"
        :class="isShow ? 'close' : 'open'"
        src="@/assets/images/menu/open-close.png"
        alt=""
      />
    </el-aside>
    <el-container>
      <el-header>
        <NavHeader :isShow="isShow"></NavHeader>
      </el-header>
      <el-main>
        <router-view v-if="login"></router-view>
      </el-main>
      <el-footer>
        Copyright © {{ new Date().getFullYear() }}
        <a href="http://www.sinoswr.com/" target="_blank">江苏苏威尔科技有限公司</a>
        All Rights Reserved
      </el-footer>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
// import HelloWorld from '@/components/HelloWorld.vue' // @ is an alias to /src
import { NavHeader } from '@/components/nav-header'
import { NavMenu } from '@/components/nav-menu'
import { tokenCheck } from '@service/login/login'
import { setSession } from '@/utils/sessions'
import localCache from '@/utils/localCache'
import { ElMessage } from 'element-plus'

import { useStore } from '@store/index'

const store = useStore()

let isShow = ref(false)
let login = ref(false)

const changeIsShow = () => {
  isShow.value = !isShow.value
}
const saveStore = () => {
  setSession('state', JSON.stringify(store.state))
}

// token校验
const checkToken = (token: any) => {
  tokenCheck({ token: token }).then((res) => {
    if (res.code === 10) {
      Promise.all([
        // 请求学科列表
        store.dispatch('common/actSubject'),
        store.dispatch('common/actLaboratoryAdmin'),
        store.dispatch('common/getCurrentStandLevel')
      ]).then(() => {
        store.commit('login/changeUserInfo', res.data)
        saveStore()
        login.value = true
      })
    }
  })
}

if (localCache.getCookie('swr_token')) {
  let token = localCache.getCookie('swr_token')
  checkToken(token)
} else {
  ElMessage({
    type: 'warning',
    message: '请先登录,三秒后跳转登录页'
  })
  setTimeout(() => {
    window.location.href = process.env.VUE_APP_APP_LOGINURL as string
  }, 3000)
}
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
    background-color: #e8e8e9;
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
