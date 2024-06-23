<template>
  <div>
    <div class="line">
      <div class="title">实验：</div>
      <div class="details">
        {{ forms.reportTempletName }}
      </div>
    </div>
    <div class="line" v-for="(item, index) in forms.reportTempletData" :key="index">
      <div class="title">{{ item.title }}：</div>
      <div class="details" v-if="item.type === 1">
        {{ item.teachercontent.input }}
      </div>
      <div class="details" v-if="item.type === 2">
        {{ item.teachercontent.title }}
        <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="item.teachercontent.input"></el-input>
      </div>
      <div class="details" v-if="item.type === 3">
        <el-image
          style="width: 100px; height: 100px"
          v-for="(e, i) in item.teachercontent.fileList"
          :key="i"
          :src="e.url"
          :preview-src-list="item.teachercontent.fileList.map((e) => e.url)"
        ></el-image>
      </div>
      <div class="details" v-if="item.type === 4">
        <ul>
          <li v-for="(e, i) in item.teachercontent.fileList" :key="i">
            <video :src="e ? e.url : ''" controls="controls" />
          </li>
        </ul>
      </div>
      <div class="details" v-if="item.type === 5">
        <span>{{ item.teachercontent.input1 }}</span>
        <el-input class="border-b" v-model="item.teachercontent.input2" placeholder="填空题"></el-input>
        <span>{{ item.teachercontent.input3 }}</span>
      </div>
      <div class="details" v-if="item.type === 6">
        <span>{{ item.teachercontent.input1 }}</span>
        <el-input class="border-b" v-model="item.teachercontent.input2" placeholder="填空题"></el-input>
        <el-input class="border-b" v-model="item.teachercontent.input3" placeholder="填空题"></el-input>
        <el-input class="border-b" v-model="item.teachercontent.input4" placeholder="填空题"></el-input>
      </div>
      <div class="details" v-if="item.type === 7">
        <p>{{ item.teachercontent.title }}</p>
        <el-radio-group v-model="item.teachercontent.value">
          <el-radio :label="'A'">{{ item.teachercontent.A }}</el-radio>
          <el-radio :label="'B'">{{ item.teachercontent.B }}</el-radio>
          <el-radio :label="'C'">{{ item.teachercontent.C }}</el-radio>
          <el-radio :label="'D'">{{ item.teachercontent.D }}</el-radio>
        </el-radio-group>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  props: {
    propsData: {
      type: Object,
      default: () => {
        return {}
      }
      // reportTempletName, reportTempletData
    }
  },
  data() {
    return {
      forms: {},
      radioData: []
    }
  },
  watch: {
    propsData: {
      handler(n) {
        this.forms = n
      },
      deep: true,
      immediate: true
    }
  },
  // created() {
  //   this.forms = JSON.parse(JSON.stringify(this.propsData))
  // },
  // mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.line {
  display: flex;
  align-items: flex-start;
  margin: 0 0 10px 0;
  // height: 30px;
  line-height: 30px;
  .title {
    width: 70px;

    // text-align: right;
  }
  .details {
    flex: 1;
    & > p {
      margin-bottom: 6px;
    }
    :deep(.el-input) {
      margin-right: 10px;
      width: 240px;
      .el-input__inner {
        width: 100% !important;
      }
    }
    :deep(.border-b) {
      .el-input__inner {
        border: none;
        border-bottom: 1px solid #c9c7c7;
      }
    }
    :deep(.el-radio-group) {
      display: flex;
      flex-direction: column;
      .el-radio {
        margin: 4px 0;
      }
    }
  }
  ul {
    display: flex;
    li {
      video {
        margin: 0 6px 6px 0;
        width: 200px;
      }
    }
  }
}
</style>
