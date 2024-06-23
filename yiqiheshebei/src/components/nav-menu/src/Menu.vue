<template>
  <div>
    <template v-for="(item, index) in menuList" :key="index">
      <el-sub-menu v-if="item.children && item.children.length > 0" :index="item.path">
        <template #title>
          <div :class="[activePath(item.path) ? 'grean-bg' : '']" />
          <img v-show="!activePath(item.path)" src="@images/menu/experiment-plan.png" alt="" />
          <img v-show="activePath(item.path)" src="@images/menu/experiment-plan-active.png" alt="" />
          <span @click.stop="itemClick(item.path)">{{ item.meta?.title }}</span>
        </template>
        <el-menu-item-group>
          <!-- <Menu :menuList="item.children"></Menu> -->
          <el-menu-item v-for="(m, i) in item.children" :key="i" :index="m.path" @click="itemClick(m.path)">
            {{ m.meta?.title }}
          </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
      <el-menu-item v-else :index="item.path">
        <div :class="[activePath(item.path) ? 'grean-bg' : '']" />
        <img v-show="!activePath(item.path)" src="@images/menu/experiment-plan.png" alt="" />
        <img v-show="activePath(item.path)" src="@images/menu/experiment-plan-active.png" alt="" />
        <span @click.stop="itemClick(item.path)">{{ item.meta?.title }}</span>
      </el-menu-item>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, toRefs, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const props = defineProps({
  menuList: {
    type: Array as () => Array<any>,
    default: () => []
  }
})

let { menuList } = toRefs(props)
const router = useRouter()

let dataMap = reactive({
  route: useRoute()
})
let { route } = toRefs(dataMap)

const activePath = computed(() => {
  return (active: string) => {
    return route.value.path.indexOf(active) !== -1
  }
})

const urlNow = ref('')
const itemClick = (url: string) => {
  urlNow.value = url
  router.push({
    path: url
  })
}
</script>
