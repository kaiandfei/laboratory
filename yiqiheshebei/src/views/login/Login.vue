<template>
  <div class="box">
    <div class="popos_box">
      <img src="../../assets/images/login/title.png" alt="" />
      <div>
        <p class="title">登录</p>
        <p>账号</p>
        <input v-model="accountForm.username" placeholder="请输入账号" />
        <p>密码</p>
        <input type="password" v-model="accountForm.password" placeholder="请输入密码" />
        <div class="nother">
          <span>忘记密码</span>
        </div>
        <button @click="loginClick">登录</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// import { loginServer } from '@/service/login/login'
import { defineComponent, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '../../store/index'
import { setSession } from '@/utils/sessions'

export default defineComponent({
  setup() {
    const store = useStore()
    let router = useRouter()

    const accountForm = reactive({
      // 如果取不到值 则默认赋值''
      // username: 'swr_admin',
      username: '',
      password: ''
    })
    const loginClick = () => {
      // 登录

      // 通过接口登陆
      store.dispatch('login/actLogin', { ...accountForm }).then((res) => {
        if (res.code === 10) {
          Promise.all([
            // 请求学科列表
            store.dispatch('common/actSubject'),
            store.dispatch('common/actLaboratoryAdmin'),
            store.dispatch('router/FETCH_PERMISSION')
          ]).then(() => {
            saveStore()
            router.push('/index')
          })
        }
      })
    }

    const saveStore = () => {
      setSession('state', JSON.stringify(store.state))
    }
    const account = (type: number) => {
      console.log(type)
    }
    return {
      accountForm,
      loginClick,
      account
    }
  }
})
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100vh;
  background: url('../../assets/images/login/bj.png');
  background-size: 100% 100%;
  .popos_box {
    position: fixed;
    top: 50%;
    left: 50%;
    margin-top: -390px;
    margin-left: -610px;
    width: 1220px;
    height: 780px;
    background: url('../../assets/images/login/popos.png');
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
