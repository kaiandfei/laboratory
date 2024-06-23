<template>
  <div class="nav">
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
      :default-active="path"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      text-color="#333"
      active-text-color="#05C65D"
      hide-timeout="1000"
      show-timeout="1000"
      @select="selMenu"
    >
      <template v-for="(item, index) in sidebarMenu">
        <el-submenu
          v-if="item.children && item.children.length > 0"
          :index="item.path"
          :key="index"
        >
          <template slot="title">
            <div :class="[activePath(item.path) ? 'grean-bg' : '']" />
            <img v-show="!activePath(item.path)" :src="item.meta.icon" alt="" />
            <img v-show="activePath(item.path)" :src="item.meta.icon_active" alt="" />
            <span slot="title">{{ item.meta.title }}</span>
          </template>
          <el-menu-item-group>
            <el-menu-item v-for="(m, i) in item.children" :key="i" :index="m.path">
              {{ m.meta.title }}
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item v-if="!item.children" :key="index" :index="item.path">
          <div :class="[activePath(item.path) ? 'grean-bg' : '']" />
          <img v-show="!activePath(item.path)" :src="item.meta.icon" alt="" />
          <img v-show="activePath(item.path)" :src="item.meta.icon_active" alt="" />
          <span slot="title">{{ item.meta.title }}</span>
        </el-menu-item>
      </template>

      <!-- <el-menu-item index="/myExperiment" v-show="roleId === 3 || roleId === 4">
        <div :class="[path === '/myExperiment' ? 'grean-bg' : '']"/>
        <img v-show="path !== '/myExperiment'" src="@images/menu/my-experiment.png" alt="">
        <img v-show="path === '/myExperiment'" src="@images/menu/my-experiment-active.png" alt="">
        <span slot="title">我的实验方案</span>
      </el-menu-item>
      <el-menu-item index="/subscribe" v-show="roleId === 4">
        <div :class="[path === '/subscribe' ? 'grean-bg' : '']"/>
        <img v-show="path !== '/subscribe'" src="@images/menu/subscribe.png" alt="">
        <img v-show="path === '/subscribe'" src="@images/menu/subscribe-active.png" alt="">
        <span slot="title">实验预约</span>
      </el-menu-item> -->
      <!-- <el-menu-item index="/subscribeExamine" v-show="roleId === 2">
        <div :class="[path === '/subscribeExamine' ? 'grean-bg' : '']"/>
        <img v-show="path !== '/subscribeExamine'" src="@images/menu/examine.png" alt="">
        <img v-show="path === '/subscribeExamine'" src="@images/menu/examine-active.png" alt="">
        <span slot="title">实验预约审核</span>
      </el-menu-item>
      <el-menu-item index="/examineList" v-show="roleId === 2|| roleId === 4">
        <div :class="[path === '/examineList' ? 'grean-bg' : '']"/>
        <img v-show="path !== '/examineList'" src="@images/menu/examine-list.png" alt="">
        <img v-show="path === '/examineList'" src="@images/menu/examine-list-active.png" alt="">
        <span slot="title">实验预约列表</span>
      </el-menu-item>
      <el-menu-item index="/instrumentPre" v-show="roleId === 2">
      <div :class="[path === '/instrumentPre' ? 'grean-bg' : '']"/>
        <img v-show="path !== '/instrumentPre'" src="@images/menu/instrument.png" alt="">
        <img v-show="path === '/instrumentPre'" src="@images/menu/instrument-active.png" alt="">
        <span slot="title">仪器准备</span>
      </el-menu-item>
      <el-menu-item index="/experimentalRecord" v-show="roleId === 2 || roleId === 3 || roleId === 4">
        <div :class="[path === '/experimentalRecord' ? 'grean-bg' : '']"/>
        <img v-show="path !== '/experimentalRecord'" src="@images/menu/experimental-record.png" alt="">
        <img v-show="path === '/experimentalRecord'" src="@images/menu/experimental-record-active.png" alt="">
        <span slot="title">实验课记录</span>
      </el-menu-item>
      <el-menu-item index="/taskFeedback" v-show="roleId === 4">
        <div :class="[path === '/taskFeedback' ? 'grean-bg' : '']"/>
        <img v-show="path !== '/taskFeedback'" src="@images/menu/taskFeedback.png" alt="">
        <img v-show="path === '/taskFeedback'" src="@images/menu/taskFeedback-active.png" alt="">
        <span slot="title">学生实验任务反馈</span>
      </el-menu-item>
      <el-menu-item index="/experimentalEvaluation" v-show="roleId === 4">
        <div :class="[path === '/experimentalEvaluation' ? 'grean-bg' : '']"/>
        <img v-show="path !== '/experimentalEvaluation'" src="@images/menu/experimental-evaluation.png" alt="">
        <img v-show="path === '/experimentalEvaluation'" src="@images/menu/experimental-evaluation-active.png" alt="">
        <span slot="title">实验评价</span>
      </el-menu-item>
      <el-menu-item index="/dataStatistics">
        <div :class="[path === '/dataStatistics' ? 'grean-bg' : '']"/>
        <img v-show="path !== '/dataStatistics'" src="@images/menu/data-statistics.png" alt="">
        <img v-show="path === '/dataStatistics'" src="@images/menu/data-statistics-active.png" alt="">
        <span slot="title">实验数据统计</span>
      </el-menu-item> -->
      <!-- <el-menu-item index="/commonExp">
        <div :class="[path === '/commonExp' ? 'grean-bg' : '']"/>
        <img v-show="path !== '/commonExp'" src="@images/menu/common-exp.png" alt="">
        <img v-show="path === '/commonExp'" src="@images/menu/common-exp-active.png" alt="">
        <span slot="title">公共实验资源</span>
      </el-menu-item>
      <el-menu-item index="/instrumentManage"  v-show="roleId === 2">
        <div :class="[path === '/instrumentManage' ? 'grean-bg' : '']"/>
        <img v-show="path !== '/instrumentManage'" src="@images/menu/yq.png" alt="">
        <img v-show="path === '/instrumentManage'" src="@images/menu/yq-active.png" alt="">
        <span slot="title">仪器管理</span>
      </el-menu-item>
      <el-menu-item index="/dangerousGoodsManage"  v-show="roleId === 2">
        <div :class="[path === '/dangerousGoodsManage' ? 'grean-bg' : '']"/>
        <img v-show="path !== '/dangerousGoodsManage'" src="@images/menu/danger.png" alt="">
        <img v-show="path === '/dangerousGoodsManage'" src="@images/menu/danger-active.png" alt="">
        <span slot="title">危险品管理</span>
      </el-menu-item>
      <el-menu-item index="/teachingSetting"  v-show="roleId === 3">
        <div :class="[path === '/teachingSetting' ? 'grean-bg' : '']"/>
        <img v-show="path !== '/teachingSetting'" src="@images/menu/teacher.png" alt="">
        <img v-show="path === '/teachingSetting'" src="@images/menu/teacher-active.png" alt="">
        <span slot="title">教学设置</span>
      </el-menu-item> -->
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: false,
      path: this.$route.path,
      roleId: this.$store.state.userMsg.role_id,
      sidebarMenu: this.$store.state.sidebarMenu,
    }
  },
  created() {},
  mounted() {},
  watch: {
    $route(to, from) {
      console.log('🚀 ~ file: Menu.vue:158 ~ $route ~ from:', from)
      this.path = to.path
    },
  },
  computed: {
    activePath() {
      return (activePath) => {
        return this.path.indexOf(activePath) !== -1
      }
    },
  },
  methods: {
    selMenu(key, keyPath) {
      console.log('🚀 ~ file: Menu.vue:171 ~ selMenu ~ keyPath:', keyPath)
      this.path = key
      this.$router.push({ path: key })
    },
  },
}
</script>

<style lang="scss">
.nav {
  position: relative;
  background: #fff;
  // height: 100vh;
  .change {
    position: absolute;
    width: 40px;
    height: 40px;
    cursor: pointer;
    z-index: 100;
  }
  .change-open {
    top: 10px;
    right: 0;
    margin-right: -20px;
  }
  .change-close {
    top: 10px;
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
    top: 14px;
    left: 14px;
    animation-name: title-open;
    animation-duration: 0.5s;
  }
  .title-close {
    top: 14px;
    left: 74px;
    animation-name: title-close;
    animation-duration: 0.5s;
  }
  .el-menu {
    border-right: 0;
    .is-active {
      background-color: #f3f4f8;
    }
    .el-menu-item-group__title {
      padding: 1px 0;
    }
  }
  .el-menu--collapse {
    box-sizing: border-box;
    padding-top: 60px;
    width: 50px;
    height: 100%;
  }
  .el-tooltip {
    padding: 0 14px !important;
  }
  // .el-menu-vertical-demo:not(.el-menu--collapse) {
  //   box-sizing: border-box;
  //   padding-top: 60px;
  //   width: 192px;
  //   height: 100%;
  // }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    margin-top: 60px;
    box-sizing: border-box;
    width: 200px;
    height: calc(100vh - 60px);
    overflow-y: scroll;
  }
  .el-submenu {
    text-align: left;
    .el-submenu__title {
      padding: 0 20px;
      height: 60px;
      line-height: 60px;
      span {
        margin-left: 6px;
      }
    }
    .el-menu-item {
      min-width: 0;
    }
  }
  .el-menu-item {
    text-align: left;
    padding-left: 14px;
    height: 60px;
    line-height: 60px;
    & > :nth-child(1) {
      position: absolute;
      left: 0;
      width: 8px;
      height: 100%;
    }
    @keyframes grean-bg {
      0% {
        background-color: #fff;
      }
      100% {
      }
    }
    .grean-bg {
      background-color: #42b983;
      animation-name: grean-bg;
      animation-duration: 0.5s;
    }
    span {
      margin-left: 6px;
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
      margin-top: 6px;
      margin-right: 4px;
      width: 22px;
      height: 22px;
    }
  }
  /* 设置滚动条的样式 */
  ::-webkit-scrollbar {
    width: 0px;
  }
}
</style>
