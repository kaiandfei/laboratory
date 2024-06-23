<template>
  <div class="home" v-if="login">
    <Menu />
    <div class="h_body">
      <Header @print="getPdf($route.meta.title)" class="head_b" />
      <div class="h_b" id="h_b">
        <div id="print-dom">
          <keep-alive include="ExperimentPlan">
            <router-view :key="$route.meta.title" />
          </keep-alive>
        </div>
      </div>
      <Footer class="foot_b" />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import { login } from '@/network/log'
import Menu from '@/components/Menu.vue'
import Header from '@/components/Header.vue'
import {
  tokenCheck,
  laboratoryBySubject,
  getRemark,
  getClass,
  getSubject,
} from '@/network/log'
import { getDatebyweek } from '@network/subscribe'
import { getTeacher } from '@network/infomationStatistical'

import localCache from '@/utils/localCache'
import { Message } from 'element-ui'

// import print from 'print-js'
// import StudentTask from './views/studentTask.vue'

export default {
  name: 'Home',
  components: {
    Menu,
    Header,
  },
  data() {
    return {
      login: false,
    }
  },
  created() {
    if (localCache.getCookie('swr_token')) {
      const token = localCache.getCookie('swr_token')
      this.checkToken(token)
    } else {
      Message({
        type: 'warning',
        message: '请先登录,三秒后跳转登录页',
      })
      setTimeout(() => {
        window.location.href = process.env.VUE_APP_APP_LOGINURL
      }, 3000)
    }
  },
  methods: {
    clickPrint() {
      // print('print', 'html')
      const subOutputRankPrint = document.getElementById('print')
      console.log(subOutputRankPrint.innerHTML)
      const newContent = subOutputRankPrint.innerHTML
      const oldContent = document.body.innerHTML
      document.body.innerHTML = newContent
      window.print()
      window.location.reload()
      document.body.innerHTML = oldContent
      return false
    },
    checkToken(token) {
      tokenCheck({ token: token }).then((res) => {
        if (res.code === 10) {
          this.$store.commit('mutLoginMsg', res.data)
          const data1 = {
            type: 1,
            token: res.data.token,
          }
          const data2 = {
            type: 2,
            token: res.data.token,
          }
          Promise.all([
            getDatebyweek().then((res) => {
              this.$store.commit('mutSchoolDate', res.data)
            }),
            laboratoryBySubject(data1).then((res) => {
              this.$store.commit('mutSetLab', res.data)
            }),
            getClass(data1).then((res) => {
              const arr = res.data
                .sort((a, b) => a.name.replace(/\D/g, '') - b.name.replace(/\D/g, ''))
                .sort((a, b) => a.grade_id - b.grade_id)
              console.log('🚀 ~ file: LabHome.vue:92 ~ getClass ~ arr:', arr)
              this.$store.commit('mutSetClass', arr)
            }),
            getSubject().then((res) => {
              this.$store.commit('mutSetSubject', res.data)
            }),
            getRemark(data1).then((res) => {
              this.$store.commit('mutSetmanage', res.data)
            }),
            getRemark(data2).then((res) => {
              this.$store.commit('mutSetteacher', res.data)
            }),
          ]).then(() => {
            getTeacher().then((res) => {
              this.$store.commit('mutSetTeacherArr', res.data)
              sessionStorage.setItem('state', JSON.stringify(this.$store.state))
              this.login = true
            })
            // if (this.$store.getters.getUserMsg.role_id !== 4) {
            //   getTeacher().then((res) => {
            //     this.$store.commit('mutSetTeacherArr', res.data)
            //     sessionStorage.setItem('state', JSON.stringify(this.$store.state))
            //     this.login = true
            //   })
            // } else {
            //   sessionStorage.setItem('state', JSON.stringify(this.$store.state))
            //   this.login = true
            // }
          })
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.home {
  display: flex;
  height: 100%;
  & > :nth-child(2) {
    flex: 1;
  }
}
.h_b {
  position: absolute;
  top: 60px;
  left: 0;
  right: 0;
  bottom: 60px;
  overflow-y: auto;
  overflow-x: hidden;
  & > div {
    height: 100%;
    box-sizing: border-box;
  }
}
.h_b > div::-webkit-scrollbar {
  width: 8px;
}
.h_body {
  position: relative;
  .head_b {
    position: absolute;
    top: 0;
  }
  .foot_b {
    position: absolute;
    bottom: 0;
  }
}
</style>
