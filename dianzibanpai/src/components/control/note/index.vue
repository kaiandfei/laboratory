<template>
  <div class="note">
    <div
      class="note-title"
      :style="{ color: option.color, fontSize: option.fontSize + 'px' }"
    >
      {{ title }}
    </div>
    <div class="note-mian" :style="{ backgroundColor: option?.bgColor || '#fff' }">
      <div class="no-data" v-if="noticeData.length <= 0">暂无数据</div>
      <div class="context" v-else>
        <el-input type="textarea" v-model="currNoteData.content" readonly> </el-input>
      </div>
      <div class="not-footer">
        <img
          class="pag"
          :src="currPage === 0 ? pre : preActive"
          alt=""
          @click="handlePre"
        />
        <span>{{ currPage + 1 + '/' + noticeData.length }}</span>
        <img
          class="pag"
          :src="currPage === noticeData.length - 1 ? next : nextActive"
          alt=""
          @click="handleNext"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { noticeList } from '@/api/index.js'
import LocalCache from '@/utils/localCache'
export default {
  name: 'Note',
  props: {
    option: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      noticeData: [],
      currNoteData: {},
      currPage: 0,
      pre: require('@/assets/images/laboratory/pre.png'),
      preActive: require('@/assets/images/laboratory/pre-active.png'),
      next: require('@/assets/images/laboratory/next.png'),
      nextActive: require('@/assets/images/laboratory/next-active.png'),
    }
  },
  computed: {
    title() {
      return LocalCache.getCookie('isSystem') === '1' || !LocalCache.getCookie('isSystem')
        ? '实验室注意事项'
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
    this.getNoticeList()
  },
  methods: {
    //获取注意事项
    async getNoticeList() {
      this.noticeData = []
      try {
        let params = {
          // labor_id: 1,
          labor_id: parseInt(LocalCache.getCookie('labor_id')),
        }
        const { code, data } = await noticeList(params)
        if (code === 10) {
          this.noticeData = data
          this.currNoteData = this.noticeData[this.currPage]
        }
      } catch (error) {
        console.log(error)
        // location.href = `https://stackoverflow.com/search?q=js+${error.message}`
      }
    },
    //上一页
    handlePre() {
      if (this.currPage === 0) return
      this.currPage--
      this.currNoteData = this.noticeData[this.currPage]
    },
    //下一页
    handleNext() {
      if (this.currPage >= this.noticeData.length - 1) return
      this.currPage++
      this.currNoteData = this.noticeData[this.currPage]
    },
  },
}
</script>

<style lang="scss" scoped>
.note {
  // position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.16);
  border-radius: 10px;
  .note-title {
    height: 80px;
    line-height: 70px;
    font-size: 20px;
    color: #fff;
    background: #61cab5;
    border-radius: 10px;
    padding-left: 20px;
    box-sizing: border-box;
  }
  .note-mian {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 10px;
    background-color: #fff;
    margin-top: -20px;
    padding: 20px;
    box-sizing: border-box;
    .context {
      flex: 1;
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
      height: 50px;
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
</style>
