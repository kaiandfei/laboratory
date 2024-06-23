<template>
  <div>
    <div class="base">
      <div class="title handle">{{ name }}：</div>
      <component class="mian" :is="type" :item-data="propsData"></component>
      <img src="@/assets/images/common/del-green.png" alt="" @click="removeAt(index)" />
    </div>
  </div>
</template>

<script>
import introductionVue from './introduction.vue'
import questionVue from './question.vue'
import imageVue from './image.vue'
import videoVue from './video.vue'
import fillVue1 from './fill1.vue'
import fillVue2 from './fill2.vue'

import chooseVue from './choose.vue'

export default {
  components: {
    introductionVue,
    questionVue,
    imageVue,
    videoVue,
    fillVue1,
    fillVue2,
    chooseVue
  },
  name: '',
  props: {
    type: {
      type: String,
      default: 'introductionVue'
    },
    name: {
      type: String,
      default: '简介'
    },
    index: {
      type: Number,
      default: 0
    },
    propsData: {
      type: Object || String || Array,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  // created() {},
  // mounted() {},
  methods: {
    removeAt(index) {
      this.$emit('removeCallback', index)
    }
  }
}
</script>

<style lang="scss" scoped>
.base {
  display: flex;
  align-items: flex-start;
  padding: 10px 50px 10px 20px;
  .title {
    // height: 30px;
    line-height: 30px;
    min-width: 80px;
    text-align: left;
    color: #848484;
  }
  .mian {
    flex: 1;
  }
  img {
    align-self: center;
    margin-left: 20px;
    width: 20px;
  }
  ::v-deep .row {
    display: flex;
    align-items: flex-start;
    .el-input {
      margin-right: 10px;
      width: 20% !important;
    }
  }
}
</style>
