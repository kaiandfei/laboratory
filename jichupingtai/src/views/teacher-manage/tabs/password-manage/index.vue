<template>
  <div class="passContainer">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      status-icon
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm passContainer-form"
    >
      <el-form-item label="原始密码" prop="oldPass">
        <el-input v-model="ruleForm.oldPass" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item label="新密码" prop="pass">
        <el-input v-model="ruleForm.pass" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item label="新密码确认" prop="checkPass">
        <el-input v-model="ruleForm.checkPass" type="password" autocomplete="off" />
      </el-form-item>
      <!-- <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)">Submit</el-button>
        <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
      </el-form-item> -->
      <div class="tip">*注意：密码要求6—12位，⾄少包括数字、字⺟（区分⼤⼩写）</div>
    </el-form>
    <div class="btnBox">
      <div class="btn white-btn" @click="backBtn(ruleFormRef)">返回</div>
      <div class="btn green-btn" @click="submitForm(ruleFormRef)">保存</div>
      <div class="btn green-btn resetBBtn" @click="resetPass">重置为初始密码</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { updatemobilepassword, rePsw } from '@service/account/index'
import { reactive, ref, defineEmits, defineProps } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
const props = defineProps({
  detailFrom: {
    type: Object,
    default: () => ({})
  }
})
const detailFromData = reactive(props.detailFrom)

const $emit = defineEmits(['back'])
const ruleFormRef = ref<FormInstance>()
const validateOldPass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    callback()
  }
}
const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入新密码'))
  } else {
    if (value.length < 6 || value.length > 12) {
      callback(new Error('密码长度要求6—12位'))
    }
    if (ruleForm.checkPass !== '') {
      if (!ruleFormRef.value) return
      ruleFormRef.value.validateField('checkPass', () => null)
    }
    callback()
  }
}
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== ruleForm.pass) {
    callback(new Error('请确认新密码是否正确'))
  } else {
    callback()
  }
}

const ruleForm = reactive({
  oldPass: '',
  pass: '',
  checkPass: ''
})

const rules = reactive<FormRules<typeof ruleForm>>({
  oldPass: [{ validator: validateOldPass, trigger: 'blur' }],
  pass: [{ validator: validatePass, trigger: 'blur' }],
  checkPass: [{ validator: validatePass2, trigger: 'blur' }]
})

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      let params = {
        id: detailFromData.id,
        oldpassword: ruleForm.oldPass,
        password: ruleForm.pass
      }
      try {
        const { code } = await updatemobilepassword(params)
        if (code == 10) {
          ElMessage({
            type: 'success',
            message: '修改密码成功!'
          })
          $emit('back')
        }
      } catch (error) {
        throw new Error('error')
      }
    } else {
      console.log('error submit!')
      return false
    }
  })
}

//重置为初始密码
const resetPass = async (): void => {
  let params = {
    id: detailFromData.id
  }
  try {
    const { code } = await rePsw(params)
    if (code == 10) {
      ElMessage({
        type: 'success',
        message: '重置密码成功!'
      })
      $emit('back')
    }
  } catch (error) {
    throw new Error('error')
  }
}
//返回按钮
const backBtn = (): void => {
  $emit('back')
}
</script>
<style lang="scss" scope>
.passContainer {
  display: flex;
  justify-content: space-between;
}
.passContainer-form {
  width: 50%;
}
.btnBox {
  display: flex;
  // width: 30%;
  .btn {
    width: 100px;
    height: 36px;
    margin-right: 20px;
  }
  .resetBBtn {
    width: 150px;
    height: 36px;
  }
}
.tip {
  color: #ee9a59;
}
</style>
