<template>
  <div class="header header-bg">
    <transition name="fade1">
      <div v-show="helpShow" class="help_bg" @click="imgGroup">
        <transition name="fade">
          <img
            v-show="imgShow === 4"
            class="header"
            src="../assets/images/menu/teacher_header.png"
            alt=""
          />
        </transition>
        <transition name="fade">
          <img
            v-show="imgShow === 4"
            class="body"
            src="../assets/images/menu/teacher_body.png"
            alt=""
          />
        </transition>
        <transition name="fade">
          <img
            v-show="imgShow === 2"
            class="header"
            src="../assets/images/menu/exp-header.png"
            alt=""
          />
        </transition>
        <transition name="fade">
          <img
            v-show="imgShow === 2"
            class="body"
            src="../assets/images/menu/exp-body.png"
            alt=""
          />
        </transition>
        <transition name="fade">
          <img
            v-show="imgShow === 3"
            class="header"
            src="../assets/images/menu/group-header.png"
            alt=""
          />
        </transition>
        <transition name="fade">
          <img
            v-show="imgShow === 3"
            class="body"
            src="../assets/images/menu/group-body.png"
            alt=""
          />
        </transition>
        <span class="high_light">{{ time }}</span>
        <img
          @click.stop="closeHelp"
          class="footer"
          src="../assets/images/menu/close.png"
          alt=""
        />
      </div>
    </transition>
    <div class="print" @click="printClick">
      <img src="../assets/images/menu/print.png" alt="" />
      打印
    </div>
    <div class="help" @click="clickHelp">
      <img src="../assets/images/menu/help.png" alt="" />
      帮助
    </div>
    <div class="user">
      <img src="../assets/images/menu/user.png" alt="" />
      {{ username === '' ? '请登录' : username }}
    </div>
    <el-dialog title="登录" :visible.sync="dialogVisible" width="30%">
      <span>账号</span>
      <el-input v-model="input" placeholder="请输入账号" />
      <span>密码</span>
      <el-input v-model="password" placeholder="请输入密码" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureLogin">确 定</el-button>
      </span>
    </el-dialog>
    <div class="home" @click="exit()">
      <img src="../assets/images/common/quit.png" alt="" />
      首页
    </div>
  </div>
</template>

<script>
import { login } from '@/network/log'

export default {
  name: 'HeaderView',
  data() {
    return {
      dialogVisible: false,
      imgShow: 1,
      isCollapse: true,
      helpShow: false,
      username: '',
      input: '',
      password: '',
      time: 10,
      timer: '',
    }
  },
  created() {
    this.username = this.$store.state.userMsg.username
    this.imgGroup()
  },
  methods: {
    exit() {
      sessionStorage.removeItem('state')
      window.location.href = process.env.VUE_APP_APP_LOGINURL
    },
    printClick() {
      this.$emit('print')
      // Print(this.$refs.print)
    },
    imgGroup() {
      this.imgShow = this.$store.state.userMsg.role_id
      console.log(this.$store.state.userMsg)
      // if (this.imgShow === 3) {
      //   this.imgShow = 1
      // } else {
      //   this.imgShow++
      // }
    },
    // 定时器
    clickHelp() {
      const _that = this
      this.helpShow = true
      this.timer = setInterval(function () {
        _that.time--
        if (_that.time === 0) {
          _that.closeHelp()
        }
        console.log(_that.time)
      }, 1000)
    },
    closeHelp() {
      this.helpShow = false
      this.time = 10
      clearInterval(this.timer)
    },
    sureLogin() {
      const data = {
        username: this.input,
        password: this.password,
      }
      login(data).then((res) => {
        console.log(res)
        if (res.code === 10) {
          this.username = res.data.username
          this.dialogVisible = false
        } else {
          this.$message({
            message: '登录失败,请检查账号密码',
            type: 'warning',
          })
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.header {
  position: relative;
  height: 60px;
  width: 100%;
  .print {
    top: 18px;
    right: 300px;
    position: absolute;
    width: 120px;
    height: 24px;
    line-height: 24px;
    text-align: left;
    font-size: 12px;
    color: #333;
    cursor: pointer;
    img {
      float: left;
      margin-right: 8px;
      width: 24px;
      height: 24px;
    }
    &:hover {
      color: #05c65d;
    }
  }
  .help {
    top: 18px;
    right: 200px;
    position: absolute;
    width: 120px;
    height: 24px;
    line-height: 24px;
    text-align: left;
    font-size: 12px;
    color: #333;
    cursor: pointer;
    img {
      float: left;
      margin-right: 8px;
      width: 24px;
      height: 24px;
    }
    &:hover {
      color: #05c65d;
    }
  }
  .user {
    top: 18px;
    right: 80px;
    position: absolute;
    min-width: 120px;
    height: 24px;
    line-height: 24px;
    text-align: left;
    font-size: 12px;
    color: #333;
    img {
      float: left;
      margin-right: 8px;
      width: 24px;
      height: 24px;
    }
  }
  .home {
    position: absolute;
    top: 18px;
    right: 0;
    width: 80px;
    height: 24px;
    line-height: 24px;
    text-align: left;
    font-size: 12px;
    color: #333;
    cursor: pointer;
    img {
      float: left;
      margin-right: 8px;
      width: 24px;
      height: 24px;
    }
    &:hover {
      color: #05c65d;
    }
  }
}
.help_bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('../assets/images/menu/help_bg.png');
  background-size: 100% 100%;
  z-index: 10000;
  & .header {
    position: fixed;
    top: 34px;
    left: 50%;
    margin-left: -170px;
    width: 340px;
    height: 86px;
  }
  & .body {
    position: fixed;
    top: 180px;
    left: 50%;
    margin-left: -794px;
    width: 1588px;
    height: 600px;
  }
  & .footer {
    position: fixed;
    top: 800px;
    left: 50%;
    margin-left: -130px;
    width: 260px;
    height: 92px;
    cursor: pointer;
    opacity: 0.4;
  }
  & .footer:hover {
    opacity: 0.8;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.fade1-enter-active,
.fade1-leave-active {
  transition: opacity 1s;
}
.fade1-enter, .fade1-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.high_light {
  position: fixed;
  top: 30px;
  right: 100px;
  width: 30px;
  height: 30px;
  line-height: 30px;
  border-radius: 15px;
  background-color: #fff;
  color: #05c65d;
  font-weight: 700;
}
</style>
