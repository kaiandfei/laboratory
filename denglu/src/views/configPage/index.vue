<template>
  <div class="configContainer">
    <div class="config-header">
      <!-- 返回 -->
      <div class="header-back" @click="backHome">
        <img src="@/assets/images/bigData/back.png" alt="" />
        返回
      </div>
    </div>
    <filter-search ref="filterSearchRef" @getIsActive="getIsActive" @getType="getType" @getUserId="getUserId" />
    <div class="config-main">
      <content :isActive="isActive" :type="type" :userId="userId" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { store } from '@/store/index'
import FilterSearch from './filter-search.vue'
import Content from './content.vue'
import { useRouter, useRoute } from 'vue-router'
import LocalCache from '@/utils/localCache'
import { routes } from '@/router/index.ts'
//路由
const router = useRouter()
const route = useRoute()
const filterSearchRef = ref(null)
const isActive = ref<string | number>('')
const type = ref<string | number>('')
const userId = ref<any>(store.state.login?.userInfo.id)
// watch(filterSearchRef, (newValue: any, oldValue) => {
//   isActive.value = newValue.configForm.isActive
//   type.value = newValue.configForm.type
//   userId.value = newValue.configForm.userId
//   console.log('ssdssss', newValue.configForm)
// })
const getIsActive = (val: number) => {
  isActive.value = val
}
const getType = (val: number) => {
  type.value = val
}
const getUserId = (val: number) => {
  userId.value = val
}
const backHome = () => {
  const routesArr: any = routes
  LocalCache.setCache('menuItemI', 0)
  LocalCache.setCache('menuItemTitle', routesArr.at(-1)?.children[0].meta.title)
  // store.dispatch('router/getTemplateList')
  store.commit('router/setHasPermission', false)
  router.push('/dataPage')
}
</script>

<style lang="scss" scoped>
.configContainer {
  height: 100%;
  background-color: #e8e8e9;
  text-align: left;
  .config-header {
    background-color: #04061c;
    padding-left: 20px;
    color: #fff;
    .header-back {
      display: flex;
      align-items: center;
      width: 60px;
      height: 60px;
      cursor: pointer;
      > img {
        margin-right: 5px;
        width: 20px;
        height: 20px;
      }
    }
  }
  .config-main {
    height: calc(100% - 120px);
    padding: 20px;
    box-sizing: border-box;
    overflow: auto;
  }
}
</style>
