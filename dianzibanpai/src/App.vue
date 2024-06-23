<template>
  <div id="app" class="green-light">
    <router-view />
  </div>
</template>

<script>
// import StudentTask from './views/studentTask.vue'
export default {
  // components: {
  //   Menu,
  //   StudentTask
  // },
  data() {
    return {
      username: '',
      loginState: false,
    }
  },
  created() {},
  mounted() {},
  methods: {
    savaState() {
      sessionStorage.setItem('state', JSON.stringify(this.$store.state))
    },
  },
}
</script>

<style lang="scss">
@import '../src/assets/css/base.scss';
@import '../src/assets/css/style.css';
@import '../src/assets/css/elementBase.scss';
#app {
  font-family: Microsoft YaHei, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
}
</style>
