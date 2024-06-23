<template>
  <div id="app" class="green-light">
    <div>
      <img
        class="change"
        :class="[isCollapse ? 'change-close' : 'change-open']"
        src="@images/menu/open-close.png"
        alt=""
        @click="isCollapse = !isCollapse"
      />
      <div class="title" :class="[isCollapse ? 'title-close' : 'title-open']">
        <img src="@images/menu/logo.png" alt="" />
        实验室教学管理
      </div>
      <el-menu
        default-active="1-4-1"
        class="el-menu-vertical-demo"
        :collapse="isCollapse"
        text-color="#333"
        active-text-color="#05C65D"
        hide-timeout="1000"
        show-timeout="1000"
        @select="selMenu"
      >
        <el-menu-item index="/experimentPlan">
          <img src="@images/menu/experiment-plan.png" alt="" />
          <span slot="title">实验教学计划</span>
        </el-menu-item>
        <el-menu-item index="/MyExperiment">
          <img src="@images/menu/my-experiment.png" alt="" />
          <span slot="title">我的实验方案</span>
        </el-menu-item>
        <el-menu-item index="/subscribe">
          <img src="@images/menu/subscribe-active.png" alt="" />
          <span slot="title">实验室预约</span>
        </el-menu-item>
        <el-menu-item index="/InstrumentPre">
          <img src="@images/menu/subscribe-active.png" alt="" />
          <span slot="title">仪器准备</span>
        </el-menu-item>
      </el-menu>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Navigation',
  data() {
    return {
      isCollapse: false,
    }
  },
  methods: {
    selMenu(key, keyPath) {
      console.log(111)
      this.$router.push(key)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@assets/css/base.css';
@import '~@assets/css/style.css';
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  & > :nth-child(1) {
    position: relative;
    .change {
      position: absolute;
      width: 40px;
      height: 40px;
      cursor: pointer;
      z-index: 100;
    }
    .change-open {
      top: 47px;
      right: 0;
      margin-right: -20px;
    }
    .change-close {
      top: 47px;
      right: 0;
      right: 5px;
    }
    @keyframes title-open {
      0% {
        left: 74px;
      }
      100% {
        left: 13px;
      }
    }
    @keyframes title-close {
      0% {
        left: 13px;
      }
      100% {
        left: 74px;
      }
    }
    .title-open {
      top: 50px;
      left: 13px;
      animation-name: title-open;
      animation-duration: 0.5s;
    }
    .title-close {
      top: 50px;
      left: 74px;
      animation-name: title-close;
      animation-duration: 0.5s;
    }
  }
  & > :nth-child(2) {
    flex: 1;
  }
  .el-menu {
    border-right: 0;
    .is-active {
      background-color: #f3f4f8;
    }
  }
  .el-menu--collapse {
    box-sizing: border-box;
    padding-top: 146px;
    width: 50px;
    height: 1080px;
  }
  .el-submenu__title {
    padding: 0 14px !important;
  }
  .el-tooltip {
    padding: 0 14px !important;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    background-color: #ffffff;
    box-sizing: border-box;
    padding-top: 110px;
    width: 192px;
    height: 1300px;
  }
  .el-submenu {
    text-align: left;
    .el-submenu__title {
      padding-left: 14px !important;
    }
  }
  .el-menu-item {
    text-align: left;
    padding-left: 14px !important;
    height: 80px;
    line-height: 80px;
    span {
      margin-left: 10px;
    }
  }
}
.title {
  position: absolute;
  height: 33px;
  line-height: 33px;
  width: 154px;
  text-align: left;
  font-size: 16px;
  color: #333;
  z-index: 99;
  img {
    float: left;
    margin-right: 4px;
  }
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
</style>
