<template>
  <div class="notecContainer">
    <div class="noteItem" v-for="(item, index) in noteList" :key="index">
      <div class="title">
        <div style="width: 200px">
          <span>{{ item.title }}</span>
          <!-- <el-input v-model="item.title" placeholder="Please input" /> -->
        </div>
        <div class="line" />
        <img
          class="deleteImg"
          src="@/assets/images/laboratory-manage/del.png"
          alt=""
          v-if="noteList.length > 1 && index !== 0 && isNoteEdit"
          @click="handleDel(index)"
        />
      </div>
      <el-input
        :class="!isNoteEdit ? 'noteInfo' : ''"
        v-model="item.content"
        type="textarea"
        placeholder="添加注意事项"
        maxlength="500"
        show-word-limit
        :readonly="!isNoteEdit"
        :autosize="isNoteEdit ? { minRows: 1, maxRows: 20 } : true"
      />
    </div>
    <div class="addNoteItem" @click="addNote" v-if="isNoteEdit">
      <img src="@/assets/images/laboratory-manage/add.png" alt="" />
      新增
    </div>
  </div>
</template>

<script setup lang="ts">
import type { saveNoticeType, noticeItemType } from '@/service/laboratory-manage/overview/types'
import { ref, defineExpose, useAttrs, defineProps, defineEmits } from 'vue'
import { noticeList, saveNotice } from '@service/laboratory-manage/overview/index'
import { ElMessage } from 'element-plus'
const $attrs: any = useAttrs()
const $props = defineProps({
  isNoteEdit: Boolean
})
const emits = defineEmits(['isNoteEdit'])
// console.log('111111111', $attrs)
const noteList: any = ref([
  {
    content: '',
    create_time: '',
    id: '',
    is_del: '',
    labor_id: '',
    title: '注意事项',
    update_time: ''
  }
])
const getNoticeList = async () => {
  try {
    let params = {
      labor_id: $attrs._item.id
    }
    const { code, data } = await noticeList(params)
    if (code === 10) {
      if (data.length !== 0) {
        noteList.value = data
      }
    }
  } catch (error) {
    throw new Error('error')
  }
}
getNoticeList()
const addNote = (): void => {
  if (noteList.value.length < 15) {
    noteList.value.push({
      content: '',
      id: '',
      title: '注意事项'
    })
  }
}
const handleDel = (_i: number): void => {
  noteList.value.splice(_i, 1)
}
const save = async () => {
  if (noteList.value.length === 0) {
    ElMessage({
      type: 'warning',
      message: '请添加注意事项！！！'
    })
    return
  }
  try {
    let notice_list: noticeItemType[] = []
    noteList.value.forEach((item: any) => {
      notice_list.push({
        id: item.id,
        title: item.title,
        content: item.content
      })
    })
    let params: saveNoticeType = {
      labor_id: $attrs._item.id,
      notice_list
    }
    console.log(11111111, params)

    const { code, msg } = await saveNotice(params)
    if (code === 200) {
      ElMessage({
        type: 'success',
        message: msg
      })
      getNoticeList()
      emits('update:isNoteEdit', false)
    }
  } catch (error) {
    throw new Error('error')
  }
}

defineExpose({ noteList, save, getNoticeList })
</script>

<style scoped lang="scss">
.title {
  font-weight: bold;
  position: relative;
  .deleteImg {
    width: 20px;
    height: 20px;
    cursor: pointer;
    position: absolute;
    top: 0;
    left: 213px;
  }
  .line {
    margin: 10px 0 20px;
    width: 233px;
    height: 5px;
    background-color: #05c65d;
  }
}
.notecContainer {
  text-align: left;
  padding: 20px;
  .noteItem {
    margin-bottom: 20px;
    .noteInfo {
      ::v-deep .el-textarea__inner {
        height: 100%;
        border: none !important;
        resize: none;
      }
    }
  }
  .addNoteItem {
    cursor: pointer;
    color: #05c65d;
    display: flex;
    align-items: center;
    margin-top: 20px;
    img {
      width: 26px;
      height: 26px;
    }
  }
}
</style>
