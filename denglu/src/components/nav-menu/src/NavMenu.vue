<template>
  <div>
    <div class="menu-title" title="首页">
      <img src="@/assets/images/logo.png" alt="" v-show="!isShow" />
      <!-- <transition name="title-fade"> -->
      <span v-show="!isShow">实验教学管理</span>
      <!-- </transition> -->
    </div>
    <el-menu :default-active="path" :collapse="isShow" class="el-menu-vertical-demo">
      <!-- <el-sub-menu index="0">
        <template #title>
          <div :class="[activePath('/laboratoryStandard') ? 'grean-bg' : '']" />
          <img v-show="!activePath('/laboratoryStandard')" src="@images/menu/experiment-plan.png" alt="" />
          <img v-show="activePath('/laboratoryStandard')" src="@images/menu/experiment-plan-active.png" alt="" />
          <span @click="itemClick('/laboratoryStandard/configStandard')">实验室标准</span>
        </template>
        <el-menu-item-group>
          <el-menu-item
            index="/laboratoryStandard/configStandard"
            @click="itemClick('/laboratoryStandard/configStandard')"
          >
            实验室配置标准
          </el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group>
          <el-menu-item
            index="/laboratoryStandard/configSetting"
            @click="itemClick('/laboratoryStandard/configSetting')"
          >
            实验室配置设置
          </el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group>
          <el-menu-item index="/laboratoryStandard/typeManage" @click="itemClick('/laboratoryStandard/typeManage')">
            实验室类型管理
          </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
      <el-sub-menu index="1">
        <template #title>
          <div :class="[activePath('/laboratoryManage') ? 'grean-bg' : '']" />
          <img v-show="!activePath('/laboratoryManage')" src="@images/menu/experiment-plan.png" alt="" />
          <img v-show="activePath('/laboratoryManage')" src="@images/menu/experiment-plan-active.png" alt="" />
          <span @click="itemClick('/laboratoryManage/overview')">实验室管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/laboratoryManage/overview" @click="itemClick('/laboratoryManage/overview')">
            实验室总览
          </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
      <el-sub-menu index="2">
        <template #title>
          <div :class="[activePath('/instrumentProcurementPlan') ? 'grean-bg' : '']" />
          <img v-show="!activePath('/instrumentProcurementPlan')" src="@images/menu/experiment-plan.png" alt="" />
          <img v-show="activePath('/instrumentProcurementPlan')" src="@images/menu/experiment-plan-active.png" alt="" />
          <span @click="itemClick('/instrumentProcurementPlan/recommendedPurchase')">仪器设备采购计划</span>
        </template>
        <el-menu-item-group>
          <el-menu-item
            index="/instrumentProcurementPlan/recommendedPurchase"
            @click="itemClick('/instrumentProcurementPlan/recommendedPurchase')"
          >
            推荐采购清单
          </el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group>
          <el-menu-item
            index="/instrumentProcurementPlan/planList"
            @click="itemClick('/instrumentProcurementPlan/planList')"
          >
            计划列表
          </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu> -->
      <el-sub-menu index="3">
        <template #title>
          <div :class="[activePath('/equWarehouse') ? 'grean-bg' : '']"></div>
          <img v-show="!activePath('/equWarehouse')" src="@images/menu/experiment-plan.png" alt="" />
          <img v-show="activePath('/equWarehouse')" src="@images/menu/experiment-plan-active.png" alt="" />
          <span @click="itemClick('/equWarehouse')">仪器设备库</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/equWarehouse" @click="itemClick('/equWarehouse')">仪器设备库</el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
      <!-- <el-menu-item index="/laboratoryTracks" @click="itemClick('/laboratoryTracks')">
        <div :class="[path === '/laboratoryTracks' ? 'grean-bg' : '']" />
        <img v-show="path !== '/laboratoryTracks'" src="@images/menu/experiment-plan.png" alt="" />
        <img v-show="path === '/laboratoryTracks'" src="@images/menu/experiment-plan-active.png" alt="" />
        <span>实验室轨数要求</span>
      </el-menu-item>
      <el-menu-item index="/laboratoryConfig" @click="itemClick('/laboratoryConfig')">
        <div :class="[path === '/laboratoryConfig' ? 'grean-bg' : '']" />
        <img v-show="path !== '/laboratoryConfig'" src="@images/menu/experiment-plan.png" alt="" />
        <img v-show="path === '/laboratoryConfig'" src="@images/menu/experiment-plan-active.png" alt="" />
        <span>实验室配置设置</span>
      </el-menu-item>
      <el-menu-item index="/laboratoryType" @click="itemClick('/laboratoryType')">
        <div :class="[path === '/laboratoryType' ? 'grean-bg' : '']" />
        <img v-show="path !== '/laboratoryType'" src="@images/menu/experiment-plan.png" alt="" />
        <img v-show="path === '/laboratoryType'" src="@images/menu/experiment-plan-active.png" alt="" />
        <span>实验室类型管理</span>
      </el-menu-item>
      <el-menu-item index="/laboratoryList" @click="itemClick('/laboratoryList')">
        <div :class="[path === '/laboratoryList' ? 'grean-bg' : '']" />
        <img v-show="path !== '/laboratoryList'" src="@images/menu/experiment-plan.png" alt="" />
        <img v-show="path === '/laboratoryList'" src="@images/menu/experiment-plan-active.png" alt="" />
        <span>实验室列表</span>
      </el-menu-item>
      <el-menu-item index="/recommendedPurchase" @click="itemClick('/recommendedPurchase')">
        <div :class="[path === '/recommendedPurchase' ? 'grean-bg' : '']" />
        <img v-show="path !== '/recommendedPurchase'" src="@images/menu/experiment-plan.png" alt="" />
        <img v-show="path === '/recommendedPurchase'" src="@images/menu/experiment-plan-active.png" alt="" />
        <span>推荐采购清单</span>
      </el-menu-item> -->
    </el-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
export default defineComponent({
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const path = ref(route.path)
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
    return { path, activePath, itemClick }
  }
})
</script>

<style scoped lang="scss">
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
  width: 200px;
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
.el-submenu__title {
  padding: 0 14px !important;
}
.el-tooltip {
  padding: 0 14px !important;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  box-sizing: border-box;
  width: 200px;
  height: 100%;
}
:deep(.el-sub-menu__title) {
  position: relative;
  height: 80px;
  line-height: 80px;
  font-size: 16px;
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
.el-menu-item {
  height: 60px;
  line-height: 60px;
}
</style>
