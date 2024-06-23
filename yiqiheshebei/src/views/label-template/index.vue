<template>
  <div class="container">
    <header>
      <span>标签管理 > 标签模板 {{ isHome ? '' : '> 自定义模板' }}</span>
    </header>
    <div v-if="isHome">
      <div class="title">标签模板</div>
      <ul class="tabs">
        <li
          :class="{ 'li-active': active === item.id }"
          v-for="(item, index) in TABS"
          :key="item.id"
          @click="handleLiClick(index + 1)"
        >
          {{ item.tab }}
        </li>
      </ul>
      <component
        :is="currCom"
        :key="active"
        :activeCom="active"
        :list="list"
        :selectedNode="selectedNode"
        @toggleIsHome="toggleIsHome"
        @selectNoteItem="selectNoteItem"
      />
    </div>
    <div v-else>
      <addTemplate @toggleIsHome="toggleIsHome" @getNoteList="getNoteList" :title="title" :activeCom="active" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { noteList, selectNote } from '@/service/label-manage/index'
import { ref, reactive, nextTick } from 'vue'
import laboratory from './component/laboratory.vue'
import comCard from './component/com-card.vue'
import instrumentCard from './component/instrument-card.vue'
import addTemplate from './component/add-template.vue'
interface obj {
  tab: string
  id: number
}
const TABS: obj[] = []
const TABSNAME = ['实验室二维码', '仪器二维码', '设备二维码', '仪器柜卡', '资产标签']
TABSNAME.forEach((item, index) => {
  let obj1: obj = { tab: '', id: 1 }
  obj1['tab'] = item
  obj1['id'] = index + 1
  TABS.push(obj1)
})
const list: any = ref([])
const selectedNode: any = ref([])
const getNoteList = async (id: number) => {
  try {
    let params = {
      note_template_type: id
    }
    const { data, code } = await noteList(params)
    if (code === 10) {
      list.value = data.node_list
      // format(data.node_list)
    }
  } catch (error) {
    console.log(error)
  }
}
getNoteList(1)
const currCom = ref()
const active = ref(1)
currCom.value = laboratory
const handleLiClick = (index: number) => {
  active.value = index
  getNoteList(index)
  switch (index) {
    case 1:
      currCom.value = laboratory
      break
    case 2:
    case 3:
    case 5:
      currCom.value = comCard
      break
    case 4:
      currCom.value = instrumentCard
      break
  }
}
const selectNoteItem = async (count: number, id: number) => {
  try {
    let params = {
      type: active.value,
      source: count,
      source_id: id
    }
    const { data, code } = await selectNote(params)
    if (code === 10) {
      handleLiClick(active.value)
      // console.log(data);
    }
  } catch (error) {
    console.log(error)
  }
}
const isHome = ref(true)
const title = ref('')
const toggleIsHome = (val: string) => {
  title.value = val
  isHome.value = !isHome.value
  handleLiClick(active.value)
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

header {
  height: 30px;

  & > span {
    float: left;
    margin-right: 6px;
    font-size: 16px;
    color: #626572;
  }
}

.title {
  font-weight: bold;
  font-size: 30px;
  text-align: left;
  background-color: #dcece3;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  font-size: 20px;
  color: #05c65d;
  padding: 15px 20px;
  box-sizing: border-box;
}

.tabs {
  display: flex;
  margin: 18px 0 0;
  height: 60px;
  line-height: 60px;
  background-color: white;
  border-radius: 10px;
  font-size: 20px;
  font-weight: 700;
  color: #626572;

  li {
    flex: 1;
    cursor: pointer;
    border-radius: 10px;
  }

  .li-active {
    color: #05c65d;
    background-color: #bef1d5;
  }
}
</style>
