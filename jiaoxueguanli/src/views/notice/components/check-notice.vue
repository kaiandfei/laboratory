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
    <div class="infomain">
      <quill-editor
        v-model="infoData.content"
        ref="myQuillEditor"
        @focus="onEditorFocus($event)"
      ></quill-editor>
    </div>
    <!-- <div class="infomain ql-editor" v-html="infoData.content"></div> -->
    <div class="footer">
      <span>附件：</span>
      <div class="item">
        <div
          v-for="(item, index) in infoData.notice_file"
          :key="index"
          @click="download(item.url)"
        >
          {{ item.file_name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
export default {
  components: {
    quillEditor,
  },
  props: ['detailNotice'],
  computed: {
    infoData() {
      return this.detailNotice
    },
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    download(url) {
      window.location.href = url
    },
    onEditorFocus(event) {
      console.log(65, event)
      event.enable(false)
    },
  },
}
</script>

<style lang="scss" scoped>
.checkNotice {
  text-align: left;
  height: 740px;
  padding: 20px;
  box-sizing: border-box;
  background-color: #fff;
  overflow: auto;

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

  ::v-deep .infomain {
    // max-height: 560px;
    // overflow-y: auto;
    word-wrap: break-word;

    .ql-toolbar.ql-snow {
      display: none;
    }
    .ql-container.ql-snow {
      border: none;
    }
    em {
      font-style: italic !important;
    }
  }

  .footer {
    display: flex;
    margin: 20px 0 0;
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
