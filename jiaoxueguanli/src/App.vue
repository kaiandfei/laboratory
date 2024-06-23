<template>
  <div id="app" class="green-light">
    <router-view />
    <!-- <div class="app-box" v-if="loginState && web">
      <Menu/>
      <div>
        <div class="header header-bg">
          <div class="user" @click="dialogVisible = true">
            <img src="./assets/images/menu/user.png" alt="">
            {{username === '' ? '请登录' : username}}
          </div>
          <el-dialog
            title="登录"
            :visible.sync="dialogVisible"
            width="30%">
            <span>账号</span>
            <el-input v-model="input" placeholder="请输入账号"/>
            <span>密码</span>
            <el-input v-model="password" placeholder="请输入密码"/>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="sureLogin">确 定</el-button>
            </span>
          </el-dialog>
          <div class="home" @click="$router.push('/')">
            <img src="./assets/images/menu/home.png" alt="">
            首页
          </div>
        </div>
        <router-view/>
      </div>
    </div>
    <div v-if="!loginState && web">
      <router-view/>
    </div>
    <StudentTask :stuData="stuData" v-if="!web"/> -->
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
      web: false,
      stuData: {},
    }
  },
  created() {
    console.log(this.$route.query)
    this.stuData = this.$route.query
    if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent) === false) {
      this.web = true
    } else {
      this.web = false
    }
  },
  mounted() {
    // window.addEventListener('beforeunload', this.savaState)
    // window.addEventListener('load', () => {
    //   sessionStorage.clear()
    // })
  },
  methods: {
    savaState() {
      sessionStorage.setItem('state', JSON.stringify(this.$store.state))
    },
  },
}
</script>

<style lang="scss">
@import '../src/assets/css/base.css';
@import '../src/assets/css/style.css';
@import '../src/assets/css/elementBase.css';
#app {
  font-family: Microsoft YaHei, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  text-align: center;
  height: 100vh;
  word-break: break-all;
  // & > .app-box {
  //   display: flex;
  // }
  // & > .app-box > :nth-child(2) {
  //   flex: 1;
  // }
}

.r-box {
  width: 100%;
}
</style>
