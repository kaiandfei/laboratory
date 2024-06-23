<template>
  <div class="checkNotice">
    <div class="title">
      {{ infoData.title }}
    </div>
    <div class="baseinfo">
      <div class="left">
        <span class="time">
          <img src="@images/notice/time.png" alt="" />
          {{ infoData.create_time }}
        </span>
        <span>来源：{{ infoData.create_user }}</span>
      </div>
      <div class="right">
        <span>浏览量：{{ infoData.see_count || 0 }}</span>
      </div>
    </div>
    <div class="infomain" v-html="infoData.content"></div>
    <div class="footer">
      <span>附件：</span>
      <div class="item">
        <div v-for="(item, index) in infoData.fileList" :key="index" @click="download(item.url)">
          {{ item.file_name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// import { noticeDetail } from "@/service/noticeApi";
import { ref, defineEmits, defineProps, toRefs, watch } from 'vue'
const $emit = defineEmits(['back'])
const $props = defineProps(['detailNotice'])
const refs = toRefs($props)
const infoData: any = ref({})
watch(
  () => refs.detailNotice.value,
  (newValue, oldValue) => {
    console.log(111, newValue)

    infoData.value.title = newValue.title
    infoData.value.create_time = newValue.create_time
    infoData.value.create_user = newValue.create_user
    infoData.value.see_count = newValue.see_count
    infoData.value.content = newValue.content
    infoData.value.fileList = newValue.notice_file
  }
)
const download = (url: string) => {
  window.location.href = url
}
</script>

<style lang="scss" scoped>
.checkNotice {
  text-align: left;
  height: 750px;
  padding: 20px;
  box-sizing: border-box;
  background-color: #fff;

  .title {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
  }

  .baseinfo {
    display: flex;
    margin: 20px 0;
    justify-content: space-between;

    .left {
      .time {
        margin-right: 30px;

        img {
          width: 18px;
          height: 18px;
          position: relative;
          top: 5px;
          margin-right: 5px;
        }
      }
    }
  }

  .infomain {
    word-wrap: break-word;
  }

  .footer {
    display: flex;
    margin: 20px 0;
    // align-items: center;

    .item {
      color: #05c65d;
      cursor: pointer;

      div {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
