<template>
  <div class="registerForm">
    <div class="edit-header">
      <img src="@images/login/user.png" alt="" />
      <span>注册信息填写</span>
      <div class="return" @click="cancel">
        <img src="@images/laboratory/laboratory-standard/cancel.png" alt="" />
        <span>返回当前页面</span>
      </div>
    </div>
    <div class="line">
      <div></div>
      <div></div>
      <div></div>
    </div>
    <el-form :model="form" label-position="right" label-width="80px" :rules="rules" ref="ruleForm">
      <el-form-item label="学校" prop="school">
        <el-cascader v-model="form.school" :props="props" @change="handleChange" placeholder="请选择省/市/区/学校" />
      </el-form-item>
      <el-form-item label="账号" prop="login_name">
        <el-input v-model="form.login_name" clearable placeholder="请输入注册账号" />
      </el-form-item>
      <el-form-item label="姓名" prop="username">
        <el-input v-model="form.username" clearable placeholder="请输入您的姓名" />
      </el-form-item>
      <el-form-item label="申请角色" prop="role_ids">
        <el-checkbox-group v-model="form.role_ids" @change="handleRolesChange">
          <el-checkbox v-for="(item, index) in optionsrole" :key="index" :label="item.id" name="type">
            {{ item.desc }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item
        label="学科"
        prop="subject_id"
        v-if="
          (form.role_ids.includes('1') && form.role_ids.length > 1) ||
          (!form.role_ids.includes('1') && form.role_ids.length > 0)
        "
      >
        <el-radio-group v-model="form.subject_id">
          <el-radio v-for="(item, index) in subject_ids" :key="index" :label="item.id">{{ item.key }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="执教年级" prop="schoolGrade" v-if="form.role_ids.includes('3')">
        <el-check-tag
          v-for="(item, index) in form.schoolGrade"
          :key="index"
          :checked="item.is_true"
          @change="item.is_true = !item.is_true"
        >
          {{ item.name }}
        </el-check-tag>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input type="number" v-model="form.phone" clearable placeholder="请输入您的手机号" />
      </el-form-item>
      <el-form-item label="验证码" prop="check_code">
        <el-input v-model="form.check_code" class="sendCodeInp" clearable placeholder="请输入您的验证码" />
        <span class="sendCode" @click="getCode" v-show="countdown === 0">获取验证码</span>
        <span class="sendCode" v-show="countdown !== 0">{{ countdown }}</span>
      </el-form-item>
      <el-form-item label="设置密码" prop="password">
        <el-input
          :class="{ ipt: passwordType !== '' && form.password !== '' }"
          v-model="form.password"
          :type="passwordType"
          placeholder="设置密码：6-16位字符，包含字母数字"
        />
        <span class="show-pwd" @click="showPwd">
          <img src="@/assets/icons/eye.png" alt="" v-if="passwordType === ''" />
          <img src="@/assets/icons/eye-close.png" alt="" v-else />
        </span>
      </el-form-item>
    </el-form>
    <div class="registerTips">请如实填写以上信息，以供审核，管理员审核后我们将通过短信告知您结果，祝您生活愉快！</div>
    <div class="foot-btn">
      <div class="btn white-btn" @click="cancel">取消</div>
      <div class="btn green-btn" :class="submitLoading ? 'isDisabled' : ''" @click="submitForm(ruleForm)">确定</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
/* eslint-disable */
// eslint-disable-next-line vue/no-setup-props-destructure
import { reactive, ref, defineProps, defineEmits } from 'vue'
import type { CascaderProps, ElForm } from 'element-plus'
import { ElMessage } from 'element-plus'
import { register, getMakeUserDoSendMsg, findArea, getSchoolList, getSchoolClass } from '@service/login/login'
import { School } from '@element-plus/icons-vue'
// import { findArea } from '@service/area/index'
// let $props = defineProps({
//   isShowRegister: {
//     type: Boolean,
//     default: false
//   }
// })
let emit = defineEmits(['toggleRegister'])
let schoolArr = ref([])
const props: CascaderProps = {
  lazy: true,
  lazyLoad(node, resolve) {
    const { level } = node
    console.log(69, level)
    if (level <= 2) {
      const params = {
        area_level: level + 1,
        p_id: node.value
      }
      findArea(params).then((res) => {
        const nodes = res.data.map((ele: any) => ({
          value: ele.code,
          label: ele.name,
          leaf: level >= 3
        }))
        resolve(nodes)
      })
    } else if (level === 3) {
      const params = {
        area: node.value
      }
      getSchoolList(params).then((res) => {
        console.log(105, res.data)
        const nodes = res.data.map((ele: any) => ({
          value: ele.id,
          label: ele.name,
          leaf: level >= 3
        }))
        schoolArr.value = res.data
        resolve(nodes)
      })
    }
  }
}
let schoolType = ref<number>()
const subject_ids = ref<any>([])
const handleChange = async (val: any) => {
  try {
    const params = {
      area: val[2]
    }
    const { data, code } = await getSchoolList(params)
    if (code === 10) {
      schoolArr.value = data
    }
  } catch (error) {
    console.log('err', error)
  }
  subject_ids.value = []
  schoolArr.value.forEach((item: any) => {
    if (item.id === val[3]) {
      schoolType.value = item.school_type_id
    }
  })
  if (schoolType.value === 1) {
    subject_ids.value.push({ id: 4, key: '小学科学' })
  } else if (schoolType.value === 6 || schoolType.value === 7) {
    subject_ids.value.push(
      { id: 4, key: '小学科学' },
      { id: 1, key: '物理' },
      { id: 2, key: '化学' },
      { id: 3, key: '生物' }
    )
  } else {
    subject_ids.value.push({ id: 1, key: '物理' }, { id: 2, key: '化学' }, { id: 3, key: '生物' })
  }
  console.log(133, schoolType.value)

  getSchoolClass({ id: val[3] }).then((res) => {
    form.schoolGrade = res.data.grades
    console.log(118, res)
  })
}
const handleRolesChange = (val: any) => {
  if (val.length === 0 || (val.includes('1') && val.length === 1)) {
    delete form.subject_id
    form.schoolGrade.forEach((item: any) => {
      item.is_true = false
    })
  }
  if (!val.includes('3')) {
    form.schoolGrade.forEach((item: any) => {
      item.is_true = false
    })
  }
}
const optionsrole: any = ref([
  { id: '1', desc: '学校管理员' },
  { id: '2', desc: '实验室管理员' },
  { id: '3', desc: '备课组长' },
  { id: '4', desc: '教师' }
  // { id: '5', desc: '实验室总管理员' }
  // { id: '100', desc: '区域管理员' },
  // { id: '101', desc: '区域学科管理员' },
  //{ id: '102', desc: 'swr后台管理员' }
])

const form: any = reactive({
  school: '',
  login_name: '',
  username: '',
  role_ids: [],
  subject_id: [],
  schoolGrade: [],
  check_code: '',
  password: '',
  phone: ''
})
const regPhone = /^1[3456789]\d{9}$/
const validatePhone = (rule: any, value: any, callback: any) => {
  if (regPhone.test(value)) {
    callback()
  } else if (value === '') {
    callback(new Error('手机号不能为空'))
  } else {
    callback(new Error('请输入正确的手机号'))
  }
}
const regPass = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
const validatepass = (rule: any, value: any, callback: any) => {
  if (regPass.test(value)) {
    callback()
  } else if (value === '') {
    callback(new Error('密码不能为空'))
  } else {
    callback(new Error('请输入6-16位字符，包含字母数字'))
  }
}
const rules = reactive({
  school: [{ required: true, message: '请选择学校', trigger: 'blur' }],
  login_name: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  username: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  role_ids: [{ required: true, message: '请选择角色', trigger: 'blur' }],
  subject_id: [{ required: true, message: '请选择学科', trigger: 'blur' }],
  // schoolGrade: [{ required: true, message: '请选择执教年级', trigger: 'blur' }],
  phone: [{ required: true, validator: validatePhone, trigger: 'blur' }],
  check_code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
  password: [{ required: true, validator: validatepass, trigger: 'blur' }]
})
let countdown = ref(0)
const timer: any = ref(null)
const isSubmit = ref(false)
const getCode = () => {
  form['area'] = form.school[2]
  form['city'] = form.school[1]
  form['pro'] = form.school[0]
  form['school_id'] = form.school[3]
  let params = JSON.parse(JSON.stringify(form))
  getMakeUserDoSendMsg(params).then((res) => {
    if (res.code === 10) {
      isSubmit.value = true
      countdown.value = 60
      timer.value = setInterval(() => {
        console.log('定时')
        countdown.value = countdown.value - 1
        if (countdown.value === 0) {
          clearInterval(timer.value)
        }
      }, 1000)
    }
  })
}
const ruleForm = ref<InstanceType<typeof ElForm>>()
let submitLoading = ref(false)
const submitForm = (formEl: InstanceType<typeof ElForm> | undefined) => {
  console.log(243, form)
  if (!formEl) return

  if (!isSubmit.value) {
    ElMessage({
      type: 'warning',
      message: '请先获取验证码信息'
    })
    return
  }
  formEl.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true
      try {
        form['area'] = form.school[2]
        form['city'] = form.school[1]
        form['pro'] = form.school[0]
        form['school_id'] = form.school[3]
        form['is_register'] = 1
        const { code } = await register(form)
        if (code === 10) {
          ElMessage({
            type: 'success',
            message: '注册成功'
          })
          emit('toggleRegister')
          setTimeout(() => {
            submitLoading.value = false
          }, 1000)
        } else {
          setTimeout(() => {
            submitLoading.value = false
          }, 1000)
        }
      } catch (error) {
        setTimeout(() => {
          submitLoading.value = false
        }, 1000)
        console.log(error)
      }
    }
  })
}
const passwordType = ref('text')
const showPwd = () => {
  if (passwordType.value === 'text') {
    passwordType.value = ''
  } else {
    passwordType.value = 'text'
  }
  // this.$nextTick(() => {
  //   this.$refs.password.focus()
  // })
}
const cancel = () => {
  emit('toggleRegister')
}
</script>

<style lang="scss" scoped>
.isDisabled {
  pointer-events: none;
}
.registerForm {
  width: 1390px;
  height: 800px;
  overflow-y: auto;
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
  .el-form {
    width: 50%;
    margin: 20px auto 0;
  }
}
::v-deep .el-form-item__content {
  text-align: left;

  .el-cascader {
    width: 90%;

    .el-input {
      width: 100%;
    }
  }

  .el-input {
    width: 90%;

    .el-input__inner {
      width: 100%;
      line-height: 1px !important;
    }
  }

  .el-checkbox__original {
    width: 0;
  }
}

.sendCodeInp {
  width: 72% !important;
}

.sendCode {
  display: inline-block;
  text-align: center;
  width: 80px;
  height: 30px;
  line-height: 30px;
  color: #05c65d;
  margin-left: 10px;
  padding: 0 10px;
  border: 1px solid #05c65d;
  border-radius: 30px;
  cursor: pointer;
}

.foot-btn {
  display: flex;
  justify-content: center;

  .btn {
    margin: 0 20px;
  }
}

::v-deep .el-form-item__content {
  display: flex;
  align-items: center;
}
.registerTips {
  font-size: 16px;
  color: #de4747;
  margin: 20px 0;
}
.show-pwd {
  display: flex;
  align-items: center;
  position: relative;
  left: -30px;
  img {
    width: 25px;
    height: 25px;
    cursor: pointer;
  }
}
.ipt {
  ::v-deep .el-input__inner {
    -webkit-text-security: disc !important;
  }
}
</style>
