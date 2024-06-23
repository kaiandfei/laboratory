<template>
  <div>
    <div class="box">
      <el-input
        v-model="itemData.input"
        class="border-b"
        placeholder="这是一段可编辑文字说明，可以插入实验简介"
      ></el-input>
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
    }
  },
  created() {},
  mounted() {},
  methods: {},
}
</script>

<style lang="scss" scoped></style>
