<template>
  <div class="layout">
    <el-header>
      <div class="header-back">
        <div @click="backHome">
          <img src="@/assets/images/bigData/back.png" alt="" />
          返回
        </div>
      </div>
    </el-header>
    <el-container v-if="!/chart/i.test(route.name as string)">
      <el-aside width="auto">
        <img
          @click="changeIsShow"
          class="change-menu"
          :class="isShow ? 'close' : 'open'"
          src="@/assets/images/menu/open-close.png"
          alt=""
        />
        <!-- <div class="menu-title" title="首页">
          <span v-show="!isShow">更多数据</span>
        </div> -->
        <el-scrollbar class="scrollbar">
          <el-menu
            class="el-menu-vertical-demo my-menu"
            :collapse="isShow"
            collapse-transition
            :default-active="route.path"
          >
            <Menu :menuList="menuRoutes"></Menu>
          </el-menu>
        </el-scrollbar>
      </el-aside>
      <el-container class="main-container">
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
    <el-container class="main-container-charts" v-else>
      <router-view></router-view>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { useRouter, useRoute } from 'vue-router'
import { ref } from 'vue'
import { routes } from '@/router/index'

import Menu from '@/views/dataPage/menu/index.vue'
import LocalCache from '@/utils/localCache'
import { useStore } from '@/store/index'
const router = useRouter()
const route = useRoute()

const store = useStore()
console.log('🚀 ~ store1:', store, store.state.login.userInfo)
LocalCache.setCache('menuItemI', 0)
LocalCache.setCache('menuItemTitle', route.meta.title)

let menuRoutes = ref<any>([])
menuRoutes.value = routes[4].children

let isShow = ref(false)
const changeIsShow = () => {
  isShow.value = !isShow.value
}

const backHome = () => {
  console.log('🚀 ~ backHome ~ route:', route)

  if (/chart/i.test(route.name as string)) {
    router.go(-1)
    return
  }
  const routesArr: any = routes
  LocalCache.setCache('menuItemI', 0)
  LocalCache.setCache('menuItemTitle', routesArr.at(-1)?.children[0].meta.title)
  // store.dispatch('router/getTemplateList')
  store.commit('router/setHasPermission', false)
  router.push('/dataPage')
}
</script>

<style lang="scss" scoped>
.layout {
  height: 100%;
  text-align: left;
  // color: #fff;
  .el-header {
    background-color: #04061c;

    .header-back {
      display: flex;
      align-items: center;
      height: 60px;
      line-height: 1;
      color: #fff;
      div {
        display: flex;
        align-items: center;
        padding: 4px 10px;
        cursor: pointer;
      }
      img {
        margin-right: 5px;
        width: 20px;
        height: 20px;
      }
    }
  }
  .el-container {
    height: calc(100% - 60px);
  }
  .main-container {
    height: 100%;
    background: #e8e8e9;
  }
  .main-container-charts {
    height: calc(100% - 60px);
    background: #e8e8e9;
  }
}
.el-aside {
  position: relative;
  overflow: visible;
  .menu-title {
    margin-left: 18px;
    height: 60px;
    display: flex;
    align-items: center;
    cursor: pointer;
    color: black;
    @keyframes title-open {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }
    img {
      margin: 0 4px 0 14px;
      height: 33px;
      width: 33px;
      animation-name: title-open;
      animation-duration: 0.5s;
    }
    span {
      margin-left: 6px;
      font-size: 18px;
      animation-name: title-open;
      animation-duration: 0.5s;
    }
  }
  .change-menu {
    position: absolute;
    width: 40px;
    height: 40px;
    cursor: pointer;
    z-index: 1;
  }
  .open {
    top: 10px;
    right: -20px;
    animation-name: img-open;
    animation-duration: 0.5s;
  }
  .close {
    top: 10px;
    right: 12px;
    animation-name: img-close;
    animation-duration: 0.5s;
  }
  @keyframes img-open {
    0% {
      right: 12px;
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
      right: 12px;
    }
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
  }
  .my-menu {
    border-right: 0;
    background-color: #fff;
  }
  // ::v-deep .el-menu-item:hover {
  //   color: #fff;
  //   background-color: #003066;
  // }
  ::v-deep .el-menu-item {
    color: black;
  }
  ::v-deep .el-menu-item.is-active {
    color: #05c65d;
    background-color: #f3f4f8;
  }
}
.scrollbar {
  height: calc(100% - 60px);
  // border-right: 1px solid #6b6b6b;
}

.el-main {
  padding-top: 0;
}
</style>
