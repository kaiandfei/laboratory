<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div>
    <div class="row">
      <el-input class="border-b" v-model="itemData.input1" placeholder="这是一个"></el-input>
      <el-input v-model="itemData.input2" placeholder="填空题"></el-input>
      <el-input v-model="itemData.input3" placeholder="填空题"></el-input>
      <el-input v-model="itemData.input4" placeholder="填空题"></el-input>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  props: ['itemData'],

  data() {
    return {
      input: ''
    }
  },
  // created() {},
  // mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
// .row {
//   display: flex;
// }
</style>
