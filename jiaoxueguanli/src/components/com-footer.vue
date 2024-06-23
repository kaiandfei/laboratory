<template>
  <div class="footer">
    Copyright © {{ new Date().getFullYear() }}
    <a href="http://www.sinoswr.com/" target="_blank">江苏苏威尔科技有限公司</a> All
    Rights Reserved
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
}
</script>

<style scoped>
.footer {
  height: 60px;
  line-height: 60px;
  width: 100%;
  text-align: center;
  background-color: #e8e8e9;
}
.footer a {
  color: rgb(17, 160, 216);
}
.footer a:hover {
  color: rgb(101, 203, 243);
}
</style>
