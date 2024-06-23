<template>
  <!-- <div id="nav">
    <router-link to="/">Home</router-link>
    |
    <router-link to="/about">About</router-link>
  </div> -->
  <router-view />
</template>

<style lang="scss">
@import '../src/assets/css/base.css';
@import '../src/assets/css/elementBase.css';
@import '../src/assets/css/style.css';
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  width: 100%;
}
.b {
  color: #2c3e50;
}
#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
:root {
  --el-color-primary: #05c65d !important;
}
input[type='checkbox'] {
  cursor: pointer;
  position: relative;
  width: 15px;
  height: 15px;
  font-size: 14px;
}

input[type='checkbox']::after {
  position: absolute;
  top: 0;
  color: #000;
  width: 15px;
  height: 15px;
  display: inline-block;
  visibility: visible;
  padding-left: 0px;
  text-align: center;
  content: ' ';
  border-radius: 3px;
}

input[type='checkbox']:checked::after {
  content: '✓';
  color: #fff;
  font-size: 12px;
  font-weight: bold;
  background-color: #05c65d;
}

input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}
.el-button--primary {
  --el-button-font-color: #ffffff;
  --el-button-background-color: #05c65d !important;
  --el-button-border-color: #05c65d !important;
  --el-button-hover-color: #05c65d !important;
  --el-button-active-font-color: #e6e6e6;
  --el-button-active-background-color: #05c65d !important;
  --el-button-active-border-color: #05c65d !important;
}
/* 设置滚动条的样式 */
::-webkit-scrollbar {
  width: 6px;
}
/* 滚动槽 */
::-webkit-scrollbar-track {
  border-radius: 10px;
}
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.1);
}
::-webkit-scrollbar-thumb:window-inactive {
  background: rgba(31, 228, 58, 0.4);
}
</style>
