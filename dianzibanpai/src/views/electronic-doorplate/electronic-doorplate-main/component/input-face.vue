<template>
  <div>
    <div class="desc">录入信息之前，请登录确认您的个人信息~</div>
    <el-form :model="ruleForm" status-icon ref="ruleForm" class="demo-ruleForm">
      <el-form-item prop="user">
        <el-input v-model.trim="ruleForm.user" autocomplete="off">
          <img
            class="icon"
            slot="prefix"
            src="@/assets/images/laboratory/user.png"
            alt=""
          />
        </el-input>
      </el-form-item>
      <el-form-item prop="pass">
        <el-input type="password" v-model.trim="ruleForm.pass" autocomplete="off">
          <img
            class="icon"
            slot="prefix"
            src="@/assets/images/laboratory/pwd.png"
            alt=""
          />
        </el-input>
      </el-form-item>
      <el-form-item>
        <div class="primary-btn" @click="handleNext">下一步</div>
      </el-form-item>
    </el-form>
    <div class="footer">
      <span class="exit" @click="handleExit">退出当前信息采集</span>
    </div>
  </div>
</template>

<script>
import { login } from '@/network/log.js'
import enterFace from './enter-face.vue'
export default {
  name: 'InputFace',
  data() {
    return {
      ruleForm: {
        user: '',
        pass: '',
      },
    }
  },
  methods: {
    async handleNext() {
      // 通过接口登陆
      try {
        let params = {
          username: this.ruleForm.user,
          password: this.ruleForm.pass,
        }
        const { data, code } = await login(params)
        if (code === 10) {
          this.$store.commit('mutLoginMsg', data)
          this.$emit('getRuleForm', this.ruleForm)
          this.$emit('toggleComponent', enterFace, 2)
        }
      } catch (error) {
        console.log('error', error)
        // location.href = `https://stackoverflow.com/search?q=js+${error.message}`
      }
    },
    handleExit() {
      this.$emit('handleClose')
    },
  },
}
</script>

<style lang="scss" scoped>
.desc {
  font-size: 16px;
  margin: 20px;
}
:deep .el-input__prefix {
  display: flex;
  justify-content: center;
  align-items: center;
}
.icon {
  width: 20px;
  height: 20px;
}
.exit {
  font-size: 12px;
  color: #329581;
  cursor: pointer;
}
</style>
