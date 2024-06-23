<template>
  <template v-for="(item, index) in menuList" :key="item.path">
    <!-- 没有子路由 -->
    <el-menu-item :index="item.path" v-if="!item.children && !item.meta.isHidden" @click="goRoute(item, index)">
      <img v-if="activePathI !== index" :src="require(`@/assets/images/bigData/${item.meta.icon}.png`)" alt="" />
      <img v-else :src="require(`@/assets/images/bigData/${item.meta.icon_active}.png`)" alt="" />
      <template #title>
        <span class="menuTitle">
          {{ item.meta.title }}
        </span>
      </template>
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import LocalCache from '@/utils/localCache'
defineProps(['menuList'])
const $emits = defineEmits(['getMenuItemTitle', 'toggleRouterAlive'])
const router = useRouter()
const route = useRoute()
let activePathI = ref(LocalCache.getCache('menuItemI') || 0)
console.log(route)

const goRoute = (vc: any, i: number) => {
  if (vc.meta.extra_data) {
    LocalCache.setCache('extra_data', vc.meta.extra_data)
  }
  activePathI.value = i
  router.push(vc.path)
  LocalCache.setCache('menuItemTitle', vc.meta.title)
  LocalCache.setCache('menuItemI', i)
  if (vc.meta.type) {
    LocalCache.setCache('comType', vc.meta.type)
  }
  $emits('toggleRouterAlive')
  $emits('getMenuItemTitle', vc.meta.title)
}
</script>

<style scoped lang="scss">
img {
  width: 22px;
  height: 22px;
}
.menuTitle {
  overflow: hidden;
  text-wrap: nowrap;
  text-overflow: ellipsis;
}
</style>
