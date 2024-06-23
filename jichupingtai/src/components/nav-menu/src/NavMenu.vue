<template>
  <div class="base-div">
    <div class="menu-title" title="首页">
      <img src="@/assets/images/logo.png" alt="" v-show="!isShow" />
      <!-- <transition name="title-fade"> -->
      <span v-show="!isShow">基础信息管理</span>
      <!-- </transition> -->
    </div>
    <div class="menu-body">
      <el-menu :default-active="route.path" :collapse="isShow" class="el-menu-vertical-demo">
        <template v-for="(item, index) in sidebarMenu">
          <!-- 二级 -->
          <el-sub-menu v-if="item.children && item.children.length > 0" :index="item.path" :key="index">
            <template #title>
              <div :class="[activePath(item.path) ? 'grean-bg' : '']" />
              <img v-show="!activePath(item.path)" :src="item.meta?.icon || ''" alt="" />
              <img v-show="activePath(item.path)" :src="item.meta?.icon_active || ''" alt="" />
              <span @click.stop="itemClick(item.path)">{{ item.meta?.title }}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item v-for="(m, i) in item.children" :key="i" :index="m.path" @click="itemClick(m.path)">
                {{ m.meta?.title }}
              </el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
          <!-- 一级 -->
          <el-menu-item v-if="!item.children" :index="item.path" @click="itemClick(item.path)" :key="index">
            <div :class="[activePath(item.path) ? 'grean-bg' : '']" />
            <img v-show="!activePath(item.path)" :src="item.meta?.icon || ''" alt="" />
            <img v-show="activePath(item.path)" :src="item.meta?.icon_active || ''" alt="" />
            <span @click.stop="itemClick(item.path)">{{ item.meta?.title }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from '@store/index'
export default defineComponent({
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const store = useStore()
    const role_id = JSON.parse(JSON.stringify(store.state.login.userInfo)).role_id
    const router = useRouter()
    const route = useRoute()
    const path = ref(route.path)
    const sidebarMenu = computed(() => store.state.router.sidebarMenu)

    const activePath = computed(() => {
      return (activePath: string) => {
        return path.value.indexOf(activePath) !== -1
      }
    })
    const itemClick = (url: string) => {
      path.value = url
      console.log(path)
      router.push({
        path: url
      })
    }
    return { path, activePath, route, sidebarMenu, itemClick, role_id }
  }
})
</script>

<style scoped lang="scss">
.base-div {
  height: 100%;
}
.menu-title {
  height: 60px;
  display: flex;
  align-items: center;
  cursor: pointer;
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

.el-menu--collapse {
  width: 50px;
}
.title-fade-enter-active {
  transition: opacity 0.5s;
}
.title-fade-enter-from {
  opacity: 0;
}
:deep(.el-menu) {
  border-right: 0;
  text-align: left;
  .is-active {
    background-color: #f3f4f8;
  }
}
.el-menu--collapse {
  box-sizing: border-box;
  width: 50px;
  height: 100%;
}
.el-tooltip {
  padding: 0 14px !important;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  box-sizing: border-box;
  width: 200px;
  height: calc(100vh - 60px);
  overflow: scroll;
}
:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  position: relative;
  height: 50px;
  line-height: 50px;
  font-size: 14px;
  & > :nth-child(1) {
    position: absolute;
    left: 0;
    width: 8px;
    height: 100%;
  }
  @keyframes grean-bg {
    0% {
      background-color: #fff;
    }
    100% {
    }
  }
  .grean-bg {
    background-color: #05c65d;
    animation-name: grean-bg;
    animation-duration: 0.5s;
  }
  img {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translate(0, -50%);
    // margin: 0 6px 0 -20px;
  }
  span {
    margin-left: 16px;
  }
}
:deep(.el-menu-item-group__title) {
  padding: 0;
  height: 2px;
}
:deep(.el-menu-item-group) {
  .el-menu-item {
    height: 50px;
    line-height: 50px;
    // font-size: 14px;
  }
  .is-active {
    background: #dcece3;
  }
}
/* 设置滚动条的样式 */
::-webkit-scrollbar {
  width: 0px;
}
</style>
