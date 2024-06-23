<template>
  <div class="sel-box">
    <div class="flex">
      <div class="sel-head">审核情况：</div>
      <div class="sel-list">
        <span
          class="sel-item"
          v-for="(item, index) in state"
          :key="index"
          :class="item.value === formChange.status ? 'item-focus' : ''"
          @click="stateChange(item.value)"
        >
          {{ item.name }}
        </span>
      </div>
    </div>
    <div class="flex">
      <div class="sel-head">实验时间：</div>
      <div class="sel-list">
        <span
          class="sel-item"
          v-for="(item, index) in weekList"
          :key="index"
          :class="item.value === formChange.week_time ? 'item-focus' : ''"
          @click="weekListChange(item.value)"
        >
          {{ item.name }}
        </span>
      </div>
    </div>
    <div class="flex">
      <div class="sel-head" />
      <div class="sel-list">
        <span
          class="sel-item"
          v-for="(item, index) in week"
          :key="index"
          :class="item.value === formChange.weekend ? 'item-focus' : ''"
          @click="weekChange(item.value)"
        >
          {{ item.name }}
        </span>
      </div>
    </div>
    <div class="flex">
      <div class="sel-head">实验类型：</div>
      <div class="sel-list">
        <span
          class="sel-item"
          v-for="(item, index) in type"
          :key="index"
          :class="item.value === formChange.type ? 'item-focus' : ''"
          @click="typeChange(item.value)"
        >
          {{ item.name }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import state from './seldata.js'
export default {
  // props: {
  //   stateNow: {
  //     type: Number,
  //     default: 0
  //   },
  //   weekListNow: {
  //     type: Number,
  //     default: 0
  //   },
  //   weekNow: {
  //     type: Number,
  //     default: 0
  //   },
  //   typeNow: {
  //     type: Number,
  //     default: 0
  //   }
  // },
  data() {
    return {
      state: state.state,
      weekList: state.weekList,
      week: state.week,
      type: state.type,
      formChange: {
        status: '',
        week_time: '',
        weekend: '',
        type: '',
      },
    }
  },
  created() {
    console.log(state)
  },
  methods: {
    stateChange(index) {
      this.formChange.status = index
      this.$emit('selChange', this.formChange)
    },
    weekListChange(index) {
      this.formChange.week_time = index
      this.$emit('selChange', this.formChange)
    },
    weekChange(index) {
      this.formChange.weekend = index
      this.$emit('selChange', this.formChange)
    },
    typeChange(index) {
      this.formChange.type = index
      this.$emit('selChange', this.formChange)
    },
  },
}
</script>

<style scoped lang="scss">
.sel-box {
  margin-bottom: 20px;
  padding: 10px;
  width: 100%;
  min-height: 100px;
  box-sizing: border-box;
  background-color: #fff;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
  .sel-head {
    width: 128px;
    height: 40px;
    line-height: 40px;
    color: #848484;
    font-size: 16px;
  }
  .sel-list {
    flex: 1;
  }
  .sel-item {
    float: left;
    width: 70px;
    height: 40px;
    line-height: 40px;
    color: #333;
    cursor: pointer;
    &:hover {
      color: #05c65d;
    }
  }
  .item-focus {
    color: #05c65d;
  }
}
</style>
