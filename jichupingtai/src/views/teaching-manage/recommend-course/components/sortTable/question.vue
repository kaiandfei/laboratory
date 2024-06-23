<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div>
    <div class="box">
      <el-input
        v-model="itemData.title"
        class="border-b"
        placeholder="这是一段可编辑文字说明，可以插入问题说明"
      ></el-input>
      <el-input v-model="itemData.input" type="textarea" :rows="2" placeholder="请输入"></el-input>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  props: ['itemData'],

  data() {
    return {
      input: '',
      textarea: ''
    }
  },
  // created() {},
  // mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.box {
  ::v-deep .el-input {
    margin-bottom: 8px;
  }
}
</style>
