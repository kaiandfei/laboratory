<template>
  <div class="progress">
    <span class="title">{{ titleText }}</span>
    <el-progress
      :text-inside="true"
      :stroke-width="20"
      :percentage="percentage > 100 ? 100 : percentage"
      :color="colorValue(percentage)"
      :show-text="false"
    />
    <span :style="{ color: colorValue(percentage) }">{{ contentText }}</span>
  </div>
</template>

<script>
export default {
  name: 'ProgressColor',
  props: {
    titleText: {
      type: String,
      default: '',
    },
    percentage: {
      type: Number,
      default: 0,
    },
    contentText: {
      type: String,
      default: '',
    },
  },
  computed: {
    colorValue() {
      return function (index) {
        if (index <= 10) {
          return '#F17676'
        }
        if (index > 10 && index <= 59) {
          return '#DFC93C'
        }
        if (index > 59) {
          return '#4EDC4E'
        }
      }
    },
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
.progress {
  width: 100%;
  //margin: 10px 3%;
  display: flex;
  flex-direction: row;
  ::v-deep .el-progress {
    width: 74%;
    margin: 0 18px;
  }
  .title {
    text-align: right;
    width: 56px;
  }
}
</style>
