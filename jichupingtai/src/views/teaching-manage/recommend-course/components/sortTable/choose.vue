<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div>
    <div class="box">
      <el-input
        v-model="itemData.title"
        class="border-b"
        placeholder="这是一段可编辑文字说明，可以插入问题说明"
      ></el-input>
      <el-input v-model="itemData.A" class="border-b" placeholder="这是一个选项A"></el-input>
      <el-input v-model="itemData.B" class="border-b" placeholder="这是一个选项B"></el-input>
      <el-input v-model="itemData.C" class="border-b" placeholder="这是一个选项C"></el-input>
      <el-input v-model="itemData.D" class="border-b" placeholder="这是一个选项D"></el-input>
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

<style lang="scss" scoped></style>
