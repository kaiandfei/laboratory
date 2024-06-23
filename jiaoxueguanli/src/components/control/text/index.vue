<template>
  <div class="text">{{ data[prop] }}</div>
</template>

<script>
export default {
  name: 'ComText',
  props: {
    prop: {
      type: String,
      default: '',
    },
    data: {
      type: Object,
      default: () => ({}),
    },
  },
}
</script>

<style lang="scss" scoped>
.text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
