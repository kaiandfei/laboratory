<template>
  <div>
    <header>
      <div>
        <div class="logo">
          <img src="@assets/images/logo.png" alt="" />
          实验教学管理
        </div>
        <div class="user-box">
          <el-dropdown v-if="userName !== '未登录'" trigger="click">
            <div class="user">
              <img src="@images/menu/user.png" alt="" />
              {{ userName }}
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item icon="el-icon-user" @click="openperson">个人中心</el-dropdown-item>
                <el-dropdown-item icon="el-icon-back" @click="loginOut">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-dropdown trigger="click" v-if="userIdentity.length !== 0">
            <div class="change-identity">切换身份</div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="(item, index) in userIdentity" :key="index" @click="changeRole(item.role_id)">
                  {{ item.role_name }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </header>
    <main v-show="!personShow && !noticeDialogVisible && !dialogVisible">
      <div class="bg-header">
        <div class="operation">
          <img src="@assets/images/login/h-title.png" alt="" />
          <div class="login-prop" v-show="loginShow && !wxlogData.state && !changepswState">
            <div class="change-box" @click="changewx">
              <img class="small" src="@assets/images/login/wx.png" alt="" />
              <p>微信登录</p>
              <img class="big" src="@assets/images/login/loginqr.png" alt="" />
            </div>
            <p class="pop-title">账号密码登录</p>
            <div class="input-box">
              <img src="@assets/images/login/account.png" alt="" />
              <input type="text" placeholder="账号/手机号" v-model="accountForm.username" @keydown.enter="loginClick" />
            </div>
            <div class="input-box">
              <img src="@assets/images/login/password.png" alt="" />
              <input type="password" placeholder="密码" v-model="accountForm.password" @keydown.enter="loginClick" />
            </div>
            <div class="pas-about">
              <div @click="remember = !remember">
                <img v-show="remember" src="@assets/images/login/sure.png" alt="" />
                <i v-show="!remember"></i>
                <span>记住密码</span>
              </div>
              <span @click="returnCP">忘记密码?</span>
            </div>
            <div class="log-btn" @click="loginClick">登录</div>
            <div class="register">
              没有账号？
              <span @click="toggleRegister">立即注册</span>
            </div>
          </div>
          <div class="login-prop" v-show="loginShow && wxlogData.state">
            <div class="change-box" @click="changeaccount">
              <img class="small" src="@assets/images/login/lock.png" alt="" />
              <p>账号登录</p>
              <img class="big" src="@assets/images/login/lock-big.png" alt="" />
            </div>
            <p class="pop-title">账号密码登录</p>
            <img class="qr-code" :src="wxlogData.pic" alt="" />
            <p class="wx-title">使用微信扫描二维码登录“实验教学管理平台”</p>
            <div class="register">
              没有账号？
              <span @click="toggleRegister">立即注册</span>
            </div>
          </div>
          <div class="login-prop" v-show="loginShow && changepswState">
            <p class="pop-title">重置密码</p>
            <div class="inp-box">
              <div class="inp1"><el-input v-model="cpData.phone" placeholder="请输入手机号"></el-input></div>
              <div class="inp2">
                <div class="ch1"><el-input v-model="cpData.code" placeholder="请输入验证码"></el-input></div>
                <div class="ch2 point" @click="getCodephoneCP" v-show="cpData.time === 0">获取验证码</div>
                <div class="ch3" v-show="cpData.time !== 0">{{ cpData.time }}s</div>
              </div>
              <div class="inp3">
                <el-input type="password" v-model="cpData.psw" placeholder="请输入新密码"></el-input>
              </div>
              <div class="inp3">
                <el-input type="password" v-model="cpData.pswchange" placeholder="确认新密码"></el-input>
              </div>
              <div class="log-btn" @click="upPsw">确认</div>
              <p class="wx-title point" @click="changepswState = false">返回登录</p>
            </div>
          </div>
        </div>
      </div>
      <div class="carousel">
        <el-carousel height="50px" direction="vertical" autoplay v-if="carouselData.length > 0">
          <el-carousel-item v-for="item in carouselData" :key="item.id" @click="handleCarouseClick(item)">
            <img src="@/assets/images/login/tip.png" alt="" />
            <h3 text="2xl" justify="center">{{ item.title }}</h3>
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="model-title">
        <img src="@assets/images/login/i-a.png" alt="" />
        <div>
          <p>管理模块</p>
          <p>Management Module</p>
        </div>
        <img src="@assets/images/login/i-a.png" alt="" />
      </div>
      <div class="model-box">
        <div @click="modularChange(2)" v-show="roleList.two || loginShow">
          <img src="@assets/images/login/model-e.png" alt="" />
          <p class="cn">
            <span>实验教学</span>
            <span>管理</span>
          </p>
          <p class="en">Experimental teaching management</p>
        </div>
        <div @click="modularChange(3)" v-show="roleList.three || loginShow">
          <img src="@assets/images/login/model-a.png" alt="" />
          <p class="cn">
            <span>实验室及仪器设备</span>
            <span>管理</span>
          </p>
          <p class="en">Laboratory instrument equipment management</p>
        </div>
        <div @click="modularChange(4)" v-show="roleList.four || loginShow">
          <img src="@assets/images/login/model-h.png" alt="" />
          <p class="cn">
            <span>危化品</span>
            <span>管理</span>
          </p>
          <p class="en">Hazardous chemicals management</p>
        </div>
        <div @click="modularChange(5)">
          <img src="@assets/images/login/model-r.png" alt="" />
          <p class="cn">
            <span>资源</span>
            <span>管理</span>
          </p>
          <p class="en">Resource management</p>
        </div>
        <div @click="modularChange(1)" v-show="roleList.one || loginShow">
          <img src="@assets/images/login/model-u.png" alt="" />
          <p class="cn">
            <span>基础数据</span>
            <span>管理</span>
          </p>
          <p class="en">User management</p>
        </div>
      </div>
      <div class="model-title1" v-show="role_id === 1 || (role_id === 100 && level !== 1) || role_id === 102">
        <img src="@assets/images/login/i-a.png" alt="" />
        <div>
          <p>可视化数据展示</p>
          <p>Data Visualization</p>
        </div>
        <img src="@assets/images/login/i-a.png" alt="" />
      </div>
      <div
        class="model-box1"
        v-show="role_id === 1 || (role_id === 100 && level !== 1) || role_id === 102"
        @click="toData"
      >
        <img src="@/assets/images/login/bigData.png" alt="" />
        <div class="ms_box">
          <p>
            <span>可视化大数据中心</span>
            <img src="@/assets/images/login/line.png" alt="" />
          </p>
          <p>
            将大型数据集中的数据以图形图像形式表示，对多维数据进行切片、块、旋转等动作剖析数据，
            从而能多角度多侧面观察数据，并利用数据分析发现其中的未知信息。
          </p>
          <p>
            <span>立刻进入</span>
            <img src="@/assets/images/common/go.png" alt="" />
          </p>
        </div>
      </div>
      <!-- <video id="videoElement" controls autoplay muted width="300px" height="200px"></video>
      <div @click="chushi">初始化</div> -->
    </main>
    <footer v-show="!personShow && !noticeDialogVisible && !dialogVisible">
      Copyright © {{ new Date().getFullYear() }}
      <a href="http://www.sinoswr.com/" target="_blank">江苏苏威尔科技有限公司</a>
      All Rights Reserved
    </footer>
    <div class="personPage" v-if="personShow">
      <div class="personfather-box">
        <div class="edit-box">
          <div class="edit-header">
            <img src="@images/login/user.png" alt="" />
            <span>个人中心</span>
            <div class="return" @click="personShow = false">
              <img src="@images/laboratory/laboratory-standard/cancel.png" alt="" />
              <span>返回当前页面</span>
            </div>
          </div>
          <div class="line">
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div class="img-line">
            <span>头像：</span>
            <div class="img-box">
              <img
                v-if="!userState.logoState"
                :src="
                  userData.headportrait ||
                  'https://wisdomlab.oss-cn-hangzhou.aliyuncs.com/image/20231129/panda-02.png-2023-11-30-14-37-00-449.png'
                "
                class="avatar"
              />
              <span v-if="!userState.logoState" @click.stop="userState.logoState = true">更换头像</span>
              <el-upload
                class="avatar-uploader"
                :action="BASE_URL + 'swrserveadmin/OssImage/uploadImage'"
                :data="{
                  token: localCache.getCookie('swr_token')
                }"
                name="image"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                accept=".jpg,.png,.jpeg"
              >
                <img v-if="userState.logoState && userState.logourl" :src="userState.logourl" class="avatar" />
                <el-icon v-if="userState.logoState && !userState.logourl" class="avatar-uploader-icon">
                  <Plus />
                </el-icon>

                <span v-if="userState.logoState" @click.stop="upadataMsg(4)">确认</span>
                <span v-if="userState.logoState" @click.stop="userState.logoState = false">取消</span>
              </el-upload>
            </div>
          </div>
          <div class="name-line">
            <span>姓名：</span>
            <div class="name" v-show="!userState.nameState">
              {{ userData.username }}
              <span @click="userState.nameState = true">编辑</span>
            </div>
            <div class="nameinput" v-show="userState.nameState">
              <el-input :placeholder="userData.username" v-model="useMsgUp.username"></el-input>
              <span @click="userState.nameState = false">取消</span>
              <span @click="upadataMsg(2)">确认</span>
            </div>
          </div>
          <div class="name-line">
            <span>性别：</span>
            <el-radio-group class="ml-4" v-model="userData.sex" @change="upadataMsg(1)">
              <el-radio :label="1" size="large">男</el-radio>
              <el-radio :label="2" size="large">女</el-radio>
            </el-radio-group>
          </div>
          <div class="name-line">
            <span>手机号：</span>

            <div class="schooladdress" v-show="!editphoneShow">
              {{ userData.phone }}
              <span @click="editStateChange">更换手机号</span>
            </div>
            <div class="phonechange" v-show="editphoneShow">
              <el-input v-model="useMsgUp.phone" placeholder="请输入新的手机号"></el-input>
              <span @click="getCodephone" v-show="useMsgUp.time === 0">发送验证码</span>
              <span v-show="useMsgUp.time !== 0">({{ useMsgUp.time + 's' }})</span>
              <el-input v-model="useMsgUp.code" placeholder="请输入验证码"></el-input>
              <span @click="editStateChangeCancel">取消</span>
              <span @click="checkPhoneCodefun">确认</span>
            </div>
          </div>
          <div class="name-line">
            <span>所属学校：</span>
            <div class="schooladdress">
              {{
                (userData.proname ? userData.proname + '—' : '') +
                (userData.cityname ? userData.cityname + '—' : '') +
                (userData.areaname ? userData.areaname + '—' : '') +
                (userData.school?.name ? userData.school?.name : '')
              }}
            </div>
          </div>
          <div class="name-line">
            <span>当前角色：</span>
            <div class="role-box">
              <p class="now">
                <span>{{ role_name }}</span>
                <span>(当前角色)</span>
              </p>
              <p class="athor" v-for="(item, index) in userIdentity" :key="index">
                <span>{{ item.role_name }}</span>
                <span @click="changeRole(item.role_id)">切换此角色</span>
              </p>
            </div>
          </div>
          <!-- <div class="button-group">
            <div>取消</div>
            <div>确认</div>
          </div> -->
        </div>
      </div>
    </div>
    <div class="registerdDialog" v-if="dialogVisible">
      <div class="bg">
        <register @toggleRegister="toggleRegister"></register>
      </div>
    </div>
    <!-- <el-dialog v-model="dialogVisible" title="注册信息填写" :close-on-click-modal="false" width="40%">
    </el-dialog> -->
    <div class="checkNotice" v-if="noticeDialogVisible">
      <div class="bg">
        <checkNotice :detailNotice="detailNotice" @toggleNotice="toggleNotice" />
        <!-- <notic v-if="noticeData.length > 0" :noticeData="noticeData" @toggleNotice='toggleNotice' /> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// import { loginServer } from '@/service/login/login'
import { reactive, ref, onMounted } from 'vue'

// import router from '@/router'
import { useStore } from '../../store/index'
import localCache from '@/utils/localCache'
import {
  tokenCheck,
  getIdentity,
  changeIdentity,
  getMenu,
  getrolerule,
  getqrCode,
  scanLoginUser,
  getuserMsg,
  updatauserMsg,
  getphoneCode,
  checkphoneCode,
  getphoneCodenoToken,
  updatapswbyphone,
  noticeList,
  seeCount
} from '@service/login/login'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import 'echarts-liquidfill'
import { labApi, teacherApi } from '@service/dataApi/index'
import { useRouter, useRoute } from 'vue-router'
import { BASE_URL } from '@/service/request/config'
import { Phone, Plus } from '@element-plus/icons-vue'
import * as flvjs from 'flv.js'
import Register from '../register/index.vue'
import CheckNotice from './check-notice.vue'
import notic from './notice.vue'
const play: any = ref(null)
const chushi = () => {
  if (flvjs.default.isSupported()) {
    play.value = document.getElementById('videoElement')
    let flvPlayer = flvjs.default.createPlayer({
      type: 'flv',
      isLive: true,
      hasAudio: false,
      url: 'https://rtmp01open.ys7.com:9188/v3/openpb/K66600113_1_2.flv?begin=20230301100000&end=20230301102000&expire=1677815843&id=551372482402058240&rec=local&t=3d12843a8624ef07f397f8d9876e7ddbacd2ccfcb621a6f8b1deb4935b4834fa&ev=100' // 自己的flv视频流
    })
    flvPlayer.attachMediaElement(play.value)
    flvPlayer.load()
    flvPlayer.play()
  }
}

const router = useRouter()
// import cookieCache from '@/utils/cookieCache'
const loginShow = ref(false)
let remember = ref(true)
const store = useStore()
let accountForm = reactive({
  // 如果取不到值 则默认赋值''
  username: '',
  password: ''
})
const userName = ref('未登录')
// let userMsg = localCache.getCookie('swr_u_msg')

if (localCache.getCache('swr_account_pass')) {
  accountForm.username = JSON.parse(localCache.getCache('swr_account_pass')).username
  accountForm.password = JSON.parse(localCache.getCache('swr_account_pass')).password
}
// token校验
let token = localCache.getCookie('swr_token')

if (token) {
  tokenCheck({ token: token }).then((res) => {
    if (res.code === 10) {
      loginSuccess(res.data)
    } else {
      loginShow.value = true
    }
  })
} else {
  loginShow.value = true
}

// if (localCache.getCookie('swr_u_msg')) {
//   console.log(userMsg)
//   loginShow.value = true
//   userName.value = JSON.parse(userMsg).username
// } else {
//   loginShow.value = false
//   userName.value = '未登录'
// }

const loginClick = () => {
  // 登录

  // 通过接口登陆
  store.dispatch('login/actLogin', { ...accountForm, long_time: 1 }).then((res) => {
    if (res.code === 10) {
      // localCache.setCache('swr_u_msg', res.data)
      // localCache.setCookie('swr_u_msg', JSON.stringify(res.data))
      if (remember.value) {
        localCache.setCache('swr_account_pass', JSON.stringify(accountForm))
      } else {
        localCache.deleteCache()
        accountForm.username = ''
        accountForm.password = ''
      }
      ElMessage({
        type: 'success',
        message: res.msg
      })
      loginSuccess(res.data)
      getNoticeData()
      store.commit('common/setSchoolyearList')
    }
  })
}

const loginOut = () => {
  if (wxlogData.state) {
    getqrCode().then((res: any) => {
      console.log(res)
      console.log(res.picture)
      wxlogData.pic = res.data.picture
      wxlogData.token = res.data.token
      timer.value = setInterval(() => {
        console.log('定时')
        scanLoginUser({ token: wxlogData.token }).then((res) => {
          console.log(res)
          if (res.code === 10) {
            clearInterval(timer.value)
            localCache.setCookie('swr_token', res.data.token)
            tokenCheck({ token: res.data.token }).then((res) => {
              console.log(res)
              if (res.code === 10) {
                loginSuccess(res.data)
              } else {
                loginShow.value = true
              }
            })
          }
        })
      }, 100)
    })
  }
  // localCache.deleteCache()
  // localCache.clearCookie('swr_u_msg')
  userIdentity.value = []
  localCache.clearCookie('swr_token')
  loginShow.value = true
  personShow.value = false
  userName.value = '未登录'
}
const toData = () => {
  if (loginShow.value) {
    alert('未登录!请先登录!')
  } else {
    if (role_id.value === 1 || role_id.value === 102 || role_id.value === 100) {
      // dataShow.value = true
      // localCache.setCache('menuItemI', 0)
      // localCache.setCache('menuItemTitle', '数据中心')
      store.commit('router/setHasPermission', false)
      router.push({
        path: '/dataPage'
      })
    } else {
      alert('暂无查看权限！')
    }
  }
}
const modularChange = (value: number) => {
  if (loginShow.value) {
    alert('未登录!请登陆后再选择模块!')
    return
  }
  let urlObj: {
    [key: number]: any
  } = {
    1: process.env.VUE_APP_BASE,
    2: process.env.VUE_APP_TEACH,
    3: process.env.VUE_APP_DVC,
    4: process.env.VUE_APP_HCI,
    5: 'http://ptys.swrcloud.cn/login?swr_name=visitor'
  }
  // if (process.env.NODE_ENV === 'production') {
  //   urlObj = {
  //     1: 'http://base.swrtest.com/market',
  //     2: 'http://school.swrtest.com/market',
  //     3: 'http://lab.swrtest.com/market',
  //     4: 'http://whp.swrtest.com/market'
  //   }
  // }

  if (urlObj[value]) {
    if (value === 5) {
      window.open(urlObj[value])
      return
    }
    getMenu({ roof: value }).then((res) => {
      if (res.data.length === 0) {
        alert('你没有权限...请选择其他模块')
        return
      }
      if (value === 2 && store.state.login.userInfo.school_year === '') {
        alert('当前学期未创建，请联系管理员创建学期')
        return
      }
      window.location.href = urlObj[value]
    })
  } else {
    alert('模块开发中...请选择其他模块')
  }

  //  if (value === 2) {
  //   window.location.href = 'http://localhost:8082/dev'
  // } else if (value === 3) {
  //   window.location.href = 'http://localhost:8083'
  // } else if (value === 4) {
  //   window.location.href = 'http://localhost:8084' + '?token=' + token
  // } else {
  //   alert('模块开发中...请选择其他模块')
  // }
}

let userIdentity = ref(Array<{ role_id: number; role_name: string }>())
const getUser = () => {
  getIdentity().then((res) => {
    userIdentity.value = res.data
  })
}

const changeRole = (id: number) => {
  changeIdentity({ role_id: id }).then((res) => {
    if (res.code === 10) {
      ElMessage({
        type: 'success',
        message: '切换为' + res.data.role_name
      })
      loginSuccess(res.data)
    }
  })
}
const role_id = ref()
const user_id = ref()
const role_name = ref('')
const roleList = reactive({
  one: false,
  two: false,
  three: false,
  four: false,
  five: false,
  six: false
})
const userState = reactive({
  logourl: '',
  logoState: false,
  name: '',
  nameState: false,
  phone: '',
  phoneState: false
})
// 切换到微信登录
const wxlogData = reactive({
  state: false,
  pic: '',
  token: ''
})
const changewx = () => {
  getqrCode().then((res: any) => {
    console.log(res)
    console.log(res.picture)
    wxlogData.state = true
    wxlogData.pic = res.data.picture
    wxlogData.token = res.data.token
    timer.value = setInterval(() => {
      scanLoginUser({ token: wxlogData.token }).then((res) => {
        console.log(res)
        if (res.code === 10) {
          clearInterval(timer.value)
          localCache.setCookie('swr_token', res.data.token)
          tokenCheck({ token: res.data.token }).then((res) => {
            console.log(res)
            if (res.code === 10) {
              loginSuccess(res.data)
            } else {
              loginShow.value = true
            }
          })
        }
      })
    }, 2000)
  })
}
const changeaccount = () => {
  wxlogData.state = false
  wxlogData.pic = ''
  wxlogData.token = ''
  clearInterval(timer.value)
}
const timer: any = ref(null)
let level: any = ref('')
// 循环调用查询
const loginSuccess = (resData: any) => {
  store.commit('login/changeUserInfo', resData)
  if (resData.role_id === 1) {
    localCache.setCache('areaLevel', '校级')
    localCache.setCache('areaName', resData.school.name)
  } else {
    if (resData.area_level === 2) {
      localCache.setCache('areaLevel', '市级')
      localCache.setCache('areaName', resData.cityname)
    } else {
      localCache.setCache('areaLevel', '区级')
      localCache.setCache('areaName', resData.areaname)
    }
  }
  level.value = resData.area_level
  localCache.setCookie('swr_token', resData.token)
  user_id.value = resData.id
  role_id.value = resData.role_id
  loginShow.value = false
  userName.value = resData.username + '(' + resData.role_name + ')'
  role_name.value = resData.role_name
  getrolerule({ id: role_id.value }).then((res) => {
    console.log('角色权限', res)
    let arr = res.data.roof.split(',')
    if (arr.indexOf('1') !== -1) {
      console.log('存在1权限')
      roleList.one = true
    } else {
      console.log('不存在1权限')
      roleList.one = false
    }
    if (arr.indexOf('2') !== -1) {
      console.log('存在2权限')
      roleList.two = true
    } else {
      console.log('不存在2权限')
      roleList.two = false
    }
    if (arr.indexOf('3') !== -1) {
      console.log('存在3权限')
      roleList.three = true
    } else {
      console.log('不存在3权限')
      roleList.three = false
    }
    if (arr.indexOf('4') !== -1) {
      console.log('存在4权限')
      roleList.four = true
    } else {
      console.log('不存在4权限')
      roleList.four = false
    }
    if (arr.indexOf('5') !== -1) {
      console.log('存在5权限')
      roleList.five = true
    } else {
      console.log('不存在5权限')
      roleList.five = false
    }
    console.log(arr)
  })
  getUser()
}
// 修改密码
const changepswState = ref(false)
const cpData = reactive({
  phone: '',
  code: '',
  time: 0,
  psw: '',
  pswchange: ''
})
const getCodephoneCP = () => {
  getphoneCodenoToken({ phone: cpData.phone }).then((res) => {
    if (res.code === 10) {
      cpData.time = 60
      timer.value = setInterval(() => {
        console.log('定时')
        cpData.time = cpData.time - 1
        if (cpData.time === 0) {
          clearInterval(timer.value)
        }
      }, 1000)
    }
  })
}
const upPsw = () => {
  if (cpData.phone !== '' && cpData.psw !== '' && cpData.pswchange !== '' && cpData.code !== '') {
    if (cpData.psw === cpData.pswchange) {
      updatapswbyphone({ phone: cpData.phone, newpassword: cpData.psw, code: cpData.code }).then((res) => {
        console.log(res)
        if (res.code === 10) {
          changepswState.value = false
          cpData.phone = ''
          cpData.code = ''
          cpData.psw = ''
          cpData.pswchange = ''
          cpData.time = 0
          ElMessage({
            type: 'success',
            message: '修改成功！'
          })
        }
      })
    } else {
      cpData.psw = ''
      cpData.pswchange = ''
      ElMessage({
        type: 'error',
        message: '两次密码输入不一致，请重新输入！'
      })
    }
  } else {
    ElMessage({
      type: 'error',
      message: '确认信息填写完毕后再保存'
    })
  }
}
const returnCP = () => {
  changepswState.value = true
  cpData.phone = ''
  cpData.code = ''
  cpData.time = 0

  clearInterval(timer.value)
}
// 个人中心模块
const personShow = ref(false)
const userData: any = ref({}) // 用户信息
// 打开个人中心
const openperson = () => {
  console.log('111')
  getuserMsg({ id: user_id.value }).then((res) => {
    userData.value = res.data
    useMsgUp.username = res.data.username
    personShow.value = true
  })
}
const useMsgUp = reactive({
  phone: '',
  time: 0,
  code: '',
  username: '',
  logo: ''
})
const getCodephone = () => {
  getphoneCode({ phone: useMsgUp.phone }).then((res) => {
    if (res.code === 10) {
      useMsgUp.time = 60
      timer.value = setInterval(() => {
        console.log('定时')
        useMsgUp.time = useMsgUp.time - 1
        if (useMsgUp.time === 0) {
          clearInterval(timer.value)
        }
      }, 1000)
    }
  })
}

const checkPhoneCodefun = () => {
  checkphoneCode({ phone: useMsgUp.phone, code: useMsgUp.code }).then((res) => {
    console.log(res)
    if (res.code === 10) {
      upadataMsg(3)
    }
  })
}
const upadataMsg = (value: any) => {
  if (value === 1) {
    updatauserMsg({
      code: '',
      phone: userData.value.phone,
      sex: userData.value.sex,
      username: userData.value.username
    }).then((res) => {
      if (res.code === 10) {
        getuserMsg({ id: user_id.value }).then((result) => {
          userData.value = result.data
          ElMessage({
            type: 'success',
            message: '修改成功！'
          })
        })
      } else {
        ElMessage({
          type: 'error',
          message: '修改失败！'
        })
      }
    })
  } else if (value === 2) {
    if (useMsgUp.username === '') {
      ElMessage({
        type: 'error',
        message: '姓名不能为空！'
      })
    } else {
      updatauserMsg({
        code: '',
        phone: userData.value.phone,
        sex: userData.value.sex,
        username: useMsgUp.username
      }).then((res) => {
        if (res.code === 10) {
          setTimeout(() => {
            localCache.setCookie('swr_token', res.data.token)
            tokenCheck({ token: localCache.getCookie('swr_token') }).then((result) => {
              if (result.code === 10) {
                loginSuccess(result.data)
              } else {
                loginShow.value = true
              }
            })
            getuserMsg({ id: user_id.value }).then((result) => {
              userData.value = result.data
              userState.nameState = false
              ElMessage({
                type: 'success',
                message: '修改成功！'
              })
            })
          }, 500)
        } else {
          ElMessage({
            type: 'error',
            message: '修改失败！'
          })
        }
      })
    }
  } else if (value === 3) {
    updatauserMsg({
      code: useMsgUp.code,
      phone: useMsgUp.phone,
      sex: userData.value.sex,
      username: userData.value.username
    }).then((res) => {
      if (res.code === 10) {
        tokenCheck({ token: res.data.token }).then((result) => {
          if (result.code === 10) {
            loginSuccess(result.data)
          } else {
            loginShow.value = true
          }
        })
        getuserMsg({ id: user_id.value }).then((result) => {
          userData.value = result.data
          editStateChangeCancel()
          ElMessage({
            type: 'success',
            message: '修改成功！'
          })
        })
      } else {
        ElMessage({
          type: 'error',
          message: '修改失败！'
        })
      }
    })
  } else if (value === 4) {
    updatauserMsg({
      headportrait: userState.logourl,
      code: userData.value.code,
      phone: userData.value.phone,
      sex: userData.value.sex,
      username: userData.value.username
    }).then((res) => {
      if (res.code === 10) {
        userState.logoState = false
        tokenCheck({ token: res.data.token }).then((result) => {
          if (result.code === 10) {
            loginSuccess(result.data)
          } else {
            loginShow.value = true
          }
        })
        getuserMsg({ id: user_id.value }).then((result) => {
          userData.value = result.data
          editStateChangeCancel()
          ElMessage({
            type: 'success',
            message: '修改成功！'
          })
        })
      } else {
        ElMessage({
          type: 'error',
          message: '修改失败！'
        })
      }
    })
  }
}
const editphone = ref('')
const editphoneShow = ref(false)
const editStateChange = () => {
  editphoneShow.value = true
}
const editStateChangeCancel = () => {
  editphoneShow.value = false
  useMsgUp.phone = ''
  useMsgUp.code = ''
  useMsgUp.time = 0
  clearInterval(timer.value)
}
const handleAvatarSuccess: any = (response: any) => {
  userState.logourl = response.data.file_url
  // schoolData.value.logo = URL.createObjectURL(uploadFile.raw!)
}
const beforeAvatarUpload: any = (rawFile: any) => {
  console.log(rawFile)
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}
const register = ref()
const dialogVisible = ref(false)
//打开注册弹窗
const toggleRegister = () => {
  dialogVisible.value = !dialogVisible.value
}
//获取轮播图数据
const carouselData: any = ref([])
// const noticeData: any = ref([])
const getNoticeData = async () => {
  try {
    let params = {
      limit: 3,
      status: 1
    }
    const { data, code } = await noticeList(params)
    if (code === 10) {
      carouselData.value = data.data
      // carouselData.value = data.data.slice(0, 3)
      // noticeData.value = data.data
    }
  } catch (error) {
    console.log(error)
    throw new Error('error')
  }
}
getNoticeData()
const noticeDialogVisible = ref(false)
const detailNotice = ref({})
const updateSeeCount = async (id: number) => {
  try {
    let params = {
      id
    }
    await seeCount(params)
  } catch (error) {
    console.log(error)
    throw new Error('error')
  }
}
const handleCarouseClick = (val: any) => {
  updateSeeCount(val.id)
  // getNoticeData(val)
  carouselData.value.forEach((item: any) => {
    if (item.id === val.id) {
      detailNotice.value = item
    }
  })
  setTimeout(() => {
    noticeDialogVisible.value = true
  }, 100)
}
const toggleNotice = () => {
  getNoticeData()
  noticeDialogVisible.value = false
}
</script>
<style lang="scss" scoped>
input::-webkit-input-placeholder {
  color: #848484;
  font-size: 14px;
}

header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 34px;
  line-height: 34px;
  padding: 13px 0;
  background-color: rgba(255, 255, 255, 0.39);

  & > div {
    margin: auto;
    height: 100%;
    width: 68%;

    .logo {
      float: left;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;

      img {
        margin-right: 4px;
        width: 34px;
        height: 34px;
      }

      span {
        float: left;
        margin-left: 40px;
        color: #848484;
        cursor: pointer;

        &:hover {
          color: #05c65d;
        }
      }
    }

    .user-box {
      float: right;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 34px;

      .user {
        float: right;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        img {
          margin-right: 8px;
          width: 24px;
          height: 24px;
        }
      }

      .change-identity {
        margin: 0 20px;
        color: #05c65d;
        cursor: pointer;
      }
    }
  }
}

main {
  margin-top: 60px;

  .bg-header {
    width: 100%;
    height: 23.4vw;
    background-image: url('../../assets/images/login/bg.png');
    background-size: 100% 100%;

    .operation {
      margin: auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 68%;
      height: 100%;

      img {
        width: 40%;
      }

      .login-prop {
        position: relative;
        height: 90%;
        width: 30%;
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        background-color: rgba(255, 255, 255, 0.9);
        border-radius: 10px;
        .inp-box {
          padding: 0 20px;
        }
        .inp1 {
          margin-bottom: 5px;
        }

        .inp2 {
          // margin: 0 auto 5px;
          // width: 300px;
          display: flex;
          align-items: center;
          justify-content: space-between;

          height: 40px;
          margin-bottom: 5px;
          .ch1 {
            // float: left;
            width: 80%;
            margin-right: 10px;

            :deep(.el-input .el-input__inner) {
              width: 80%;
            }
          }

          .ch2 {
            float: left;
            // margin: 5px 0 0 20px;
            width: 100px;
            height: 30px;
            line-height: 30px;
            box-sizing: border-box;
            border-radius: 4px;
            border: 1px solid #05c65d;
            color: #05c65d;
          }

          .ch3 {
            float: left;
            margin: 5px 0 0 20px;
            width: 100px;
            height: 30px;
            line-height: 30px;
            box-sizing: border-box;
            border-radius: 4px;
            border: 1px solid #848484;
            color: #848484;
          }
        }

        .inp3 {
          margin-bottom: 5px;
        }

        .change-box {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 140px;
          height: 40px;
          cursor: pointer;

          .small {
            float: left;
            margin-top: 10px;
            width: 20px;
            height: 16px;
          }

          .big {
            float: right;
            width: 40px;
            height: 40px;
          }

          p {
            float: left;
            margin-top: 10px;
            width: 80px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            color: #05c65d;
          }
        }

        .pop-title {
          margin: 13%;
          height: 24px;
          line-height: 24px;
          font-size: 18px;
          font-weight: bold;
        }

        .input-box {
          margin: 0 auto 8%;
          height: 30px;
          width: 80%;
          // background-color: rosybrown;
          display: flex;
          justify-content: space-between;
          align-items: center;

          img {
            width: 20px;
            height: 20px;
          }

          input {
            padding: 0 18px;
            width: calc(100% - 64px);
            height: 28px;
            border: 1px solid #c9c7c7;
            background-color: rgba(255, 255, 255, 0.39);
            border-radius: 4px;
          }
        }

        .pas-about {
          margin: 0 auto 8%;
          height: 30px;
          line-height: 30px;
          width: 80%;
          // background-color: rosybrown;
          display: flex;
          justify-content: space-between;
          align-items: center;

          div {
            display: flex;
            align-items: center;
            cursor: pointer;
            user-select: none;

            i {
              margin: 0 8px 0 4px;
              width: 14px;
              height: 14px;
              border: 1px solid #05c65d;
              box-sizing: border-box;
            }

            img {
              margin: 0 8px 0 4px;
              width: 14px;
              height: 14px;
            }
          }

          & > span {
            color: #05c65d;
            cursor: pointer;
          }
        }

        .log-btn {
          margin: auto;
          height: 30px;
          line-height: 30px;
          width: 80%;
          background-color: #05c65d;
          border-radius: 5px;
          color: #fff;
          font-size: 14px;
          cursor: pointer;

          &:hover {
            background-color: #05c65ca6;
          }
        }

        .qr-code {
          width: 160px;
          height: 160px;
        }

        .wx-title {
          margin-top: 25px;
        }
      }
    }
  }

  .model-title {
    margin: 55px auto 40px;
    display: flex;
    width: 190px;
    height: 50px;

    img {
      margin-top: 10px;
      width: 16px;
      height: 38px;
    }

    div {
      flex: 1;
      margin: 0 16px;

      & :nth-child(1) {
        height: 35px;
        line-height: 35px;
        font-size: 26px;
        font-weight: bold;
        color: #404040;
      }

      & :nth-child(2) {
        margin-top: 3px;
        font-size: 12px;
        height: 16px;
        line-height: 12px;
        color: #404040;
      }
    }
  }

  .model-title1 {
    margin: 55px auto 40px;
    display: flex;
    width: 246px;
    height: 50px;

    img {
      margin-top: 10px;
      width: 16px;
      height: 38px;
    }

    div {
      flex: 1;
      margin: 0 16px;

      & :nth-child(1) {
        height: 35px;
        line-height: 35px;
        font-size: 26px;
        font-weight: bold;
        color: #404040;
      }

      & :nth-child(2) {
        margin-top: 3px;
        font-size: 12px;
        height: 16px;
        line-height: 12px;
        color: #404040;
      }
    }
  }

  .model-box {
    margin: 0 auto 126px;
    display: flex;
    justify-content: space-around;
    width: 68%;
    height: 13vw;

    div {
      width: 16%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.39);
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.27);
      border-radius: 10px;
      cursor: pointer;

      &:hover {
        background-color: rgba(213, 252, 213, 0.39);
      }

      img {
        margin: 9% 21%;
        width: 56%;
      }

      .cn {
        min-height: 26px;
        line-height: 26px;
        font-size: 20px;
        font-weight: bold;
        color: #404040;

        & > :nth-child(1) {
          color: #05c65d;
        }
      }

      .en {
        margin-top: 6px;
        font-size: 12px;
        height: 12px;
        line-height: 12px;
        color: #848484;
      }
    }
  }

  .model-box1 {
    margin: 0 auto 126px;
    display: flex;
    justify-content: space-between;
    width: 68%;
    height: 16vw;
    cursor: pointer;

    & > img {
      width: 30%;
      height: 16vw;
    }

    &:hover {
      background-color: rgb(248, 248, 248);
    }

    .ms_box {
      float: right;
      width: 68%;
      height: 16vw;

      & > :nth-child(1) {
        margin-top: 42px;
        margin-right: 10px;
        height: 36px;
        line-height: 36px;
        text-align: left;

        span {
          font-size: 26px;
          font-weight: bold;
          color: #05c65d;
        }

        img {
          float: right;
          margin-top: 10px;
          width: 108px;
        }
      }

      & > :nth-child(2) {
        margin-top: 44px;
        padding-right: 10px;
        height: 52px;
        line-height: 26px;
        font-size: 20px;
        font-weight: bold;
        color: #404040;
        text-align: left;
      }

      & > :nth-child(3) {
        margin-top: 44px;
        height: 34px;
        line-height: 34px;
        text-align: right;

        span {
          padding-right: 20px;
          font-size: 26px;
          font-weight: bold;
          color: #05c65d;
        }

        img {
          float: right;
          margin-right: 10px;
          width: 34px;
          height: 34px;
        }
      }
    }
  }
}

footer {
  padding-bottom: 84px;
  height: 24px;
  line-height: 24px;
  color: #848484;
}

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
    // color: #f39759;
  }
}

video {
  width: 1000px;
  height: 800px;
}

.personPage {
  padding-top: 60px;
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;

  .personfather-box {
    padding-top: 18px;
    width: 100vw;
    min-height: calc(100% - 18px);
    background-image: url('../../assets/images/login/personbg.png');
    background-size: 100% 100%;
  }

  .edit-box {
    margin: auto;
    padding-bottom: 10px;
    width: 1390px;
    min-height: 800px;
    box-sizing: border-box;
    background-color: #fff;

    .edit-header {
      padding-top: 12px;
      margin: auto;
      width: 640px;
      height: 80px;

      img {
        float: left;
        margin: 20px 0 0 200px;
        width: 40px;
        height: 40px;
      }

      span {
        float: left;
        margin: 20px 30px 0;
        font-size: 30px;
        height: 40px;
        line-height: 40px;
        font-weight: bold;
        color: #404040;
      }

      .return {
        float: right;
        width: 130px;
        cursor: pointer;

        img {
          float: left;
          margin: 30px 10px;
          width: 20px;
          height: 20px;
        }

        span {
          float: left;
          margin: 30px 0;
          font-size: 14px;
          font-weight: 400;
          height: 20px;
          line-height: 20px;
        }
      }
    }

    .line {
      margin: auto;
      width: 640px;
      height: 6px;

      div {
        background-color: #05c65d;
      }

      :nth-child(1) {
        float: left;
        margin-right: 10px;
        width: 10px;
        height: 6px;
      }

      :nth-child(2) {
        float: left;
        margin-right: 10px;
        width: 10px;
        height: 6px;
      }

      :nth-child(3) {
        float: left;
        width: 600px;
        height: 6px;
      }
    }

    .img-line {
      margin: 48px auto 0;
      width: 640px;

      // background-color: #05c65c1f;
      & > span {
        float: left;
        padding-left: 20px;
        width: 150px;
        height: 40px;
        line-height: 40px;
        text-align: left;
        color: #848484;
      }

      .img-box {
        display: inline-block;
        width: 470px;
        height: 114px;

        & > img {
          float: left;
          width: 112px;
          height: 112px;
        }

        & > span {
          float: left;
          margin: 46px 30px;
          height: 20px;
          line-height: 20px;
          color: #05c65d;
          cursor: pointer;
        }
      }
    }

    .name-line {
      margin: 30px auto 0;
      width: 640px;
      // background-color: #05c65c1f;
      text-align: left;

      & > .name {
        height: 40px;
        line-height: 40px;

        span {
          margin-left: 30px;
          color: #05c65d;
          cursor: pointer;
        }
      }

      & > span {
        float: left;
        padding-left: 20px;
        width: 150px;
        height: 40px;
        line-height: 40px;
        text-align: left;
        color: #848484;
      }

      .nameinput {
        padding-left: 170px;
        width: 470px;
        text-align: left;
        min-height: 40px;
        line-height: 40px;

        .el-input {
          float: left;
          width: 300px;
          text-align: left;
        }

        span {
          float: left;
          margin-left: 20px;
          color: #05c65d;
        }
      }

      .el-input {
        width: 300px;
        text-align: left;
      }

      .el-radio-group {
        width: 470px;
        text-align: left;
      }

      & > .schooladdress {
        padding-left: 170px;
        width: 470px;
        text-align: left;
        min-height: 40px;
        line-height: 40px;

        span {
          float: right;
          margin-right: 200px;
          height: 40px;
          line-height: 40px;
          color: #05c65d;
          cursor: pointer;
        }
      }

      & > .phonechange {
        padding-left: 170px;
        width: 470px;
        text-align: left;
        min-height: 40px;
        line-height: 40px;

        span {
          float: right;
          margin-right: 30px;
          height: 40px;
          line-height: 40px;
          color: #05c65d;
          cursor: pointer;
        }
      }

      .role-box {
        padding-left: 170px;
        width: 470px;

        .now {
          height: 40px;
          line-height: 40px;

          :nth-child(1) {
            margin-right: 40px;
          }

          :nth-child(2) {
            color: #848484;
          }
        }

        .athor {
          height: 40px;
          line-height: 40px;

          :nth-child(2) {
            float: right;
            margin-right: 200px;
            color: #05c65d;
            cursor: pointer;
          }
        }
      }
    }

    .button-group {
      display: flex;
      margin: 50px auto;
      width: 260px;
      height: 36px;
      justify-content: space-between;

      div {
        cursor: pointer;
      }

      :nth-child(1) {
        width: 100px;
        height: 36px;
        line-height: 36px;
        color: #333;
        border-radius: 10px;
        box-shadow: 0px 1px 4px 1px rgba(0, 0, 0, 0.16);
      }

      :nth-child(2) {
        width: 100px;
        height: 36px;
        line-height: 36px;
        color: #fff;
        background-color: #05c65d;
        border-radius: 10px;
        box-shadow: 0px 1px 4px 1px rgba(0, 0, 0, 0.16);
      }
    }
  }
}

.avatar-uploader {
  text-align: left;
}

.avatar-uploader .avatar {
  float: left;
  width: 112px;
  height: 112px;
  display: block;
}

.avatar-uploader .el-upload {
  // float: left;
  border: 1px dashed #8c939d;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  // transition: var(--el-transition-duration-fast);
  span {
    float: right;
    margin: 46px 20px;
    height: 20px;
    line-height: 20px;
    color: #05c65d;
  }
}

.avatar-uploader .el-upload:hover {
  border-color: #05c65d;
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 112px;
  height: 112px;
  line-height: 122px;
  text-align: center;
  border: 1px dashed #8c939d;
  border-radius: 6px;
}

.personPage {
}

.register {
  margin-top: 15px;

  span {
    color: #05c65d;
    cursor: pointer;
  }
}

::v-deep .el-dialog__header {
  text-align: left;
  border-bottom: 1px solid #05c65d;

  .el-dialog__title {
    color: #05c65d;
  }
}

.carousel {
  width: 1273px;
  height: 50px;
  margin: 10px auto;
  background-color: #fff;
  box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.16);
  border-radius: 10px;
  padding: 0 20px;
  box-sizing: border-box;

  .el-carousel__item {
    display: flex;
    align-items: center;
    cursor: pointer;

    img {
      width: 17px;
      height: 21px;
      margin-right: 10px;
    }
  }

  .el-carousel__item h3 {
    font-size: 14px;
    line-height: 50px;
    text-align: left;
  }
}

.checkNotice {
  width: 100vw;
  height: 100vh;
  padding-top: 60px;
  box-sizing: border-box;

  .bg {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100vw;
    height: calc(100% - 20px);
    background-image: url('../../assets/images/login/personbg.png');
    background-size: 100% 100%;
    padding-top: 20px;
  }
}
.registerdDialog {
  width: 100vw;
  height: 100vh;
  padding-top: 60px;
  box-sizing: border-box;
  .bg {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100vw;
    height: calc(100% - 20px);
    background-image: url('../../assets/images/login/personbg.png');
    background-size: 100% 100%;
    padding-top: 20px;
  }
}
</style>
