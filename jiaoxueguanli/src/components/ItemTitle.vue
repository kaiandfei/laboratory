<template>
  <div class="box">
    <span :title="titleText">{{ titleText }}</span>
    <span v-if="showBg" />
    <div v-show="isNew">新</div>
    <img
      class="show-child"
      src="@images/taskFeedback/show-child.png"
      alt=""
      v-show="isShowChild && flag === true"
      @click="changeShow"
    />
    <img
      class="show-child"
      src="@images/taskFeedback/retract-child.png"
      alt=""
      v-show="isShowChild && flag === false"
      @click="changeShow"
    />
  </div>
</template>

<script>
export default {
  name: 'ItemTitle',
  props: {
    titleText: {
      type: String,
      default: '暂无',
    },
    showBg: {
      type: Boolean,
      default: true,
    },
    isNew: {
      type: Boolean,
      default: false,
    },
    isShowChild: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      flag: true,
    }
  },
  methods: {
    changeShow() {
      this.flag = !this.flag
      this.$emit('changeShow')
    },
  },
}
</script>

<style lang="scss" scoped>
.box {
  margin-bottom: 8px;
  width: 230px;
  position: relative;
  height: 44px;
  // background: red;
  span:nth-of-type(1) {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translate(-50%, 0);
    width: 200px;
    height: 24px;
    font-size: 16px;
    font-family: Microsoft YaHei;
    line-height: 24px;
    color: #05c65d;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  span:nth-child(2) {
    position: absolute;
    bottom: 0px;
    left: 0;
    display: inline-block;
    width: 230px;
    height: 4px;
    background: #05c65d;
    opacity: 1;
  }
  .show-child {
    position: absolute;
    left: 21px;
    top: 4px;
    width: 38px;
    height: 38px;
    cursor: pointer;
  }
  div {
    position: absolute;
    right: -30px;
    top: 8px;
    color: red;
  }
}
</style>
