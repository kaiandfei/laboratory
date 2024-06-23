<template>
  <div class="msg">
    <div
      class="msg-title"
      :style="{ color: option.color, fontSize: option.fontSize + 'px' }"
    >
      {{ title }}
    </div>
    <div class="msg-mian" :style="{ backgroundColor: option?.bgColor || '#fff' }">
      <div class="no-data" v-if="loading">暂无数据</div>
      <div
        class="context"
        v-else
        :style="{ color: option.contentColor, fontSize: option.contentSize + 'px' }"
      >
        <div v-for="(item, index) in currNoteData" :key="index">
          <div class="msgList">
            {{ item.title }}
          </div>
          <div v-html="item.content"></div>
        </div>
      </div>
      <div class="not-footer">
        <img
          class="pag"
          :src="currentPage === 1 ? pre : preActive"
          alt=""
          @click="handlePre"
        />
        <span>{{ currentPage + '/' + this.total }}</span>
        <img
          class="pag"
          :src="currentPage === this.total ? next : nextActive"
          alt=""
          @click="handleNext"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { messageList } from '@/api/index.js'
import LocalCache from '@/utils/localCache'
export default {
  name: 'Message',
  props: {
    option: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      currNoteData: [],
      currentPage: 1,
      total: 0,
      loading: false,
      pre: require('@/assets/images/laboratory/pre.png'),
      preActive: require('@/assets/images/laboratory/pre-active.png'),
      next: require('@/assets/images/laboratory/next.png'),
      nextActive: require('@/assets/images/laboratory/next-active.png'),
    }
  },
  computed: {
    title() {
      return LocalCache.getCookie('isSystem') === '1' || !LocalCache.getCookie('isSystem')
        ? '消息通知'
        : this.option.title
    },
    contentColor() {
      return this.option.contentColor || '#fff'
    },
    contentSize() {
      return this.option.contentSize + 'px' || '14px'
    },
  },
  mounted() {
    console.log('qeqw', this.option)
    this.getNoticeList()
  },
  methods: {
    //获取注意事项
    async getNoticeList() {
      this.loading = false
      this.currNoteData = []
      try {
        let params = {
          page: this.currentPage,
          limit: 1,
        }
        const { code, data } = await messageList(params)
        if (code === 10) {
          this.currNoteData = data.data
          this.total = data.total
          if (this.currNoteData.length === 0) this.loading = true
        }
      } catch (error) {
        this.loading = true
        console.log(error)
        // location.href = `https://stackoverflow.com/search?q=js+${error.message}`
      }
    },
    //上一页
    handlePre() {
      if (this.currentPage === 1) return
      this.currentPage--
      this.getNoticeList()
    },
    //下一页
    handleNext() {
      if (this.currentPage >= this.total) return
      this.currentPage++
      this.getNoticeList()
    },
  },
}
</script>

<style lang="scss" scoped>
.msg {
  // position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.16);
  border-radius: 10px;
  .msg-title {
    height: 80px;
    line-height: 70px;
    font-size: 20px;
    color: #fff;
    background: #61cab5;
    border-radius: 10px;
    padding-left: 20px;
    box-sizing: border-box;
  }
  .msg-mian {
    height: calc(100% - 80px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 10px;
    background-color: #fff;
    margin-top: -20px;
    padding: 20px;
    box-sizing: border-box;
    .context {
      height: 90%;
      overflow: auto;
      ::v-deep .el-textarea {
        height: 100%;
        .el-textarea__inner {
          height: 100%;
          border: none !important;
          resize: none;
        }
      }
    }
    .not-footer {
      height: 10%;
      display: flex;
      justify-content: center;
      align-items: center;
      .pag {
        width: 30px;
        height: 30px;
        margin: 0 20px;
        cursor: pointer;
      }
    }
  }
}
.no-data {
  width: 100%;
  font-size: 30px;
  font-weight: bold;
  text-align: center;
  margin: auto;
}
::v-deep .el-textarea__inner {
  color: v-bind(contentColor);
  font-size: v-bind(contentSize);
}
.msgList {
  border-bottom: 1px solid #ccc;
  padding-top: 10px;
  box-sizing: border-box;
}
</style>
