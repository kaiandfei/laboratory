<template>
  <div class="layout">
    <el-container>
      <el-aside width="auto">
        <img
          @click="changeIsShow"
          class="change-menu"
          :class="isShow ? 'close' : 'open'"
          src="@/assets/images/menu/open-close.png"
          alt=""
        />
        <div class="menu-title" title="首页">
          <img src="@/assets/images/logo.png" alt="" v-show="!isShow" />
          <!-- <transition name="title-fade"> -->
          <span v-show="!isShow">智慧实验室</span>
          <!-- </transition> -->
        </div>
        <el-scrollbar class="scrollbar">
          <el-menu
            class="el-menu-vertical-demo my-menu"
            :collapse="isShow"
            collapse-transition
            :default-active="router.path"
          >
            <Menu
              v-if="menuRoutes.length > 0"
              :menuList="menuRoutes"
              @getMenuItemTitle="getMenuItemTitle"
              @toggleRouterAlive="toggleRouterAlive"
            ></Menu>
          </el-menu>
        </el-scrollbar>
      </el-aside>
      <el-container class="main-container">
        <el-header>
          <div class="header-center">
            <div class="line1"></div>
            <div class="line2"></div>
            <div class="line3"></div>
            <div class="header-title">
              <div class="tem-name">
                {{ menuItemTitle }}
              </div>
            </div>
          </div>
          <Header
            :menuItemTitle="menuItemTitle"
            :schoolyearList="schoolyearList"
            :areaCode="area"
            @getCity="getCity"
            @getArea="getArea"
            @getSchool="getSchool"
            @getStandardLevel="getStandardLevel"
            @getSchoolyear="getSchoolyear"
          />
        </el-header>
        <el-main>
          <router-view
            v-if="isRouterAlive"
            :city="city"
            :area="area"
            :school="school"
            :standardLevel="standardLevel"
            :schoolyear="schoolyear"
            :schoolyearList="schoolyearList"
            @getArea="getArea"
          ></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import { routes } from '@/router/index'
import Menu from './menu/index.vue'
import Header from './myHeader/index.vue'
import LocalCache from '@/utils/localCache'
import { useStore } from '@/store/index'
const router = useRoute()
const store = useStore()
let schoolyearList = ref<any>([])
store.state.common.schoolyearList.forEach((item) => {
  schoolyearList.value.push({
    label: `${item.year}第${item.semester === 1 ? '一' : '二'}学期`,
    value: `${item.school_year},${item.semester}`
  })
})
// console.log('121212', schoolyearList.value)

let isRouterAlive = ref(true)
const toggleRouterAlive = () => {
  isRouterAlive.value = false
  setTimeout(() => {
    isRouterAlive.value = true
  }, 300)
}
let city = ref<string | number>('')
let area = ref<string | number>('')
let school = ref('')
let schoolyear = ref<string | number>('')
let standardLevel = ref(2)

const getCity = (val: number) => {
  city.value = val
}
const getArea = (val: number) => {
  area.value = val
}
const getSchool = (val: string) => {
  school.value = val
}
const getStandardLevel = (val: number) => {
  standardLevel.value = val
}
const getSchoolyear = (val: number) => {
  schoolyear.value = val
}

const menuItemTitle = ref(LocalCache.getCache('menuItemTitle'))
const getMenuItemTitle = (val: string) => {
  menuItemTitle.value = val
}
let menuRoutes = ref<any>([])
menuRoutes.value = routes.at(-1)?.children
console.log('1212', menuRoutes.value)
let isShow = ref(false)
const changeIsShow = () => {
  isShow.value = !isShow.value
}
</script>

<style lang="scss" scoped>
.layout {
  height: 100%;
  text-align: left;
  color: #fff;
  .el-container {
    height: 100%;
  }
  .main-container {
    background-image: url('../../assets/images/bigData/bg1.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
}
.el-aside {
  position: relative;
  overflow: visible;
  .menu-title {
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
  border-right: 1px solid #6b6b6b;
}
.el-header {
  position: relative;
  background-color: #04061c;
  .header-center {
    width: 100%;
    height: 50px;
    position: absolute;
    top: 0;
    left: 0;
    .line1 {
      width: 15%;
      border-bottom: 1px solid #195d7e;
      position: absolute;
      bottom: -5px;
    }
    .line2 {
      position: absolute;
      left: 15%;
      bottom: -5px;
      width: 6px;
      border-bottom: 1px solid #195d7e;
      transform: rotate(-45deg);
      transform-origin: left bottom;
    }
    .line3 {
      position: absolute;
      left: calc(15% + 4px);
      bottom: 0;
      width: calc(100% - 15% - 3px);
      border-bottom: 1px solid #195d7e;
    }
    .header-title {
      position: absolute;
      left: 50%;
      bottom: 0;
      font-size: 20px;
      font-style: italic;
      width: 300px;
      height: 35px;
      line-height: 35px;
      text-align: center;
      background: url('../../assets/images/bigData/title.png') no-repeat;
      background-size: 100% 100%;
      .tem-name {
        width: 220px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin: 0 auto;
      }
    }
  }
}
.el-main {
  padding-top: 0;
}
</style>
