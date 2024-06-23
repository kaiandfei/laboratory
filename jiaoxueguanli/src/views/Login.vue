<template>
  <div class="box">
    <div class="popos_box">
      <img src="@images/login/title.png" alt="" />
      <div>
        <p class="title">登录</p>
        <p>账号</p>
        <input v-model="input" placeholder="请输入账号" />
        <p>密码</p>
        <input type="password" v-model="password" placeholder="请输入密码" />
        <div class="nother">
          <!-- <span>忘记密码</span> -->
        </div>
        <button @click="sureLogin">登录</button>
      </div>
    </div>
    <div style="padding: 30px" v-if="false">
      <button style="margin: 0 5px" @click="account(1)">教师</button>
      <button style="margin: 0 5px" @click="account(2)">备课组长</button>
      <button style="margin: 0 5px" @click="account(3)">实验室管理员</button>
    </div>
  </div>
</template>

<script>
import { login, laboratoryBySubject, getRemark, getClass } from '@/network/log'
export default {
  data() {
    return {
      input: '',
      password: '',
    }
  },
  created() {
    var that = this
    document.onkeydown = function () {
      var key = window.event.keyCode
      if (key === 13) {
        that.sureLogin() // 触发事件
      }
    }
  },
  methods: {
    account(index) {
      if (index === 1) {
        this.input = 'teacher10'
        this.password = '123456'
      } else if (index === 2) {
        this.input = 'beike10'
        this.password = '123456'
      } else if (index === 3) {
        this.input = 'exp_admin10'
        this.password = '123456'
      }
    },
    sureLogin() {
      const data = {
        username: this.input,
        password: this.password,
      }
      login(data).then((res) => {
        if (res.code === 10) {
          const data1 = {
            type: 1,
            token: res.data.token,
          }
          const data2 = {
            type: 2,
            token: res.data.token,
          }
          laboratoryBySubject(data1).then((res) => {
            console.log(res)
            this.$store.commit('mutSetLab', res.data)
            console.log(this.$store.state.labList)
          })
          getClass(data1).then((res) => {
            console.log(res)
            this.$store.commit('mutSetClass', res.data)
          })
          getRemark(data1).then((res) => {
            console.log(res)
            this.$store.commit('mutSetmanage', res.data)
          })
          getRemark(data2).then((res) => {
            console.log(res)
            this.$store.commit('mutSetteacher', res.data)
          })
          this.username = res.data.username
          this.$store.commit('mutLoginMsg', res.data)
          sessionStorage.setItem('state', JSON.stringify(this.$store.state))
          if (
            res.data.role_id === 4 ||
            res.data.role_id === 3 ||
            res.data.role_id === 2
          ) {
            this.$router.push('/labhome')
          } else {
            this.$router.push('/bigData')
          }
        }
      })
    },
  },
  beforeDestroy() {
    document.onkeydown = ''
  },
}
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100vh;
  background: url('../assets/images/login/bj.png');
  background-size: 100% 100%;
  .popos_box {
    position: fixed;
    top: 50%;
    left: 50%;
    margin-top: -390px;
    margin-left: -610px;
    width: 1220px;
    height: 780px;
    background: url('../assets/images/login/popos.png');
    background-size: 100% 100%;
    & > img {
      float: left;
      margin: 107px 0 0 66px;
      width: 445px;
      height: 96px;
    }
    & > div {
      float: right;
      margin-right: 132px;
      width: 440px;
      height: 100%;
      p {
        text-align: left;
        margin-top: 50px;
        height: 24px;
        font-size: 24px;
        color: #000000;
      }
      & > :nth-child(2) {
        margin-top: 92px;
      }
      .title {
        text-align: center;
        margin: 94px auto 0;
        width: 96px;
        height: 62px;
        line-height: 62px;
        font-size: 30px;
        color: #05c65d;
        box-sizing: border-box;
        border-bottom: 4px solid #05c65d;
      }
      input {
        margin-top: 16px;
        height: 44px;
        line-height: 44px;
        width: 100%;
        border: 0px;
        font-size: 18px;
        background-color: rgba(255, 255, 255, 0);
        border-bottom: 1px solid #05c65d;
      }
      button {
        width: 240px;
        height: 56px;
        line-height: 56px;
        border: 0px;
        color: #f1f4f3;
        font-size: 24px;
        background-color: #05c65d;
        border-radius: 28px;
        cursor: pointer;
      }
    }
  }
}
.nother {
  height: 130px;
  span {
    margin-top: 44px;
    float: right;
    font-size: 18px;
    color: #333;
    cursor: pointer;
  }
  span:hover {
    color: #05c65d;
  }
}
</style>
