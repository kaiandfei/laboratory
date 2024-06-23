<template>
  <div class="main">
    <div class="l-main">
      <div class="button-box">
        <div class="btn green-btn" @click="submitForm(ruleFormRef)">保存</div>
        <div class="btn white-btn" @click="back">返回</div>
      </div>
      <el-form ref="ruleFormRef" :model="editItem" :rules="rules" label-width="auto" class="demo-ruleForm">
        <el-form-item label="设备类型" prop="type">
          <el-input v-model="editItem.type" />
        </el-form-item>

        <el-form-item label="接口来源" prop="interface">
          <el-select v-model="editItem.interface" placeholder="请选择">
            <el-option label="dd" value="1" />
            <el-option label="two" value="2" />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="form">
        <div class="list">
          <div class="item title">设备参数：</div>
          <div class="item" v-for="(item, index) in keyList" :key="index">
            <el-checkbox v-model="item.isCheck" :label="item.keyName"></el-checkbox>
          </div>
        </div>
        <div class="list">
          <div class="item title">对应接口参数：</div>
          <div class="item" v-for="(item, index) in keyList" :key="index">
            <el-select v-model="item.value" placeholder="请选择">
              <el-option v-for="(m, n) in paramsList" :key="n" :label="m.title" :value="m.id" />
            </el-select>
          </div>
        </div>
      </div>
    </div>
    <div class="r-main">
      <div class="b-title">已有设备类型</div>
      <ul>
        <li v-for="item in 3" :key="item">
          <div class="title">教室灯光</div>
          <div class="interface">xx接口</div>
          <div class="info">xx接口</div>
          <div class="btn green-btn">应用</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, toRefs, reactive } from 'vue'

import { useStore } from '@/store/index'

const props = defineProps({ propsItem: { type: Object, required: true } })
const { propsItem: editItem } = toRefs(props)

let keyList = ref([
  {
    keyName: '序列号',
    value: '',
    isCheck: true
  },
  {
    keyName: '型号',
    value: '',
    isCheck: true
  },
  {
    keyName: '温度',
    value: '',
    isCheck: true
  },
  {
    keyName: '湿度',
    value: '',
    isCheck: true
  },
  {
    keyName: '二氧化碳',
    value: '',
    isCheck: true
  },
  {
    keyName: '设备状态',
    value: '',
    isCheck: true
  },
  {
    keyName: '厂家',
    value: '',
    isCheck: true
  },
  {
    keyName: '添加时间',
    value: '',
    isCheck: true
  }
])

let paramsList = ref([
  {
    id: 1,
    title: 'df'
  }
])

const ruleFormRef = ref<any>()

const rules = reactive({
  type: [
    { required: true, message: '请输入设备类型', trigger: 'blur' }
    // { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
  ],
  interface: [
    {
      required: true,
      message: '请选择接口来源',
      trigger: 'change'
    }
  ]
})

const emit = defineEmits(['back'])

const submitForm = async (formEl: any) => {
  if (!formEl) return
  await formEl.validate((valid: any, fields: any) => {
    if (valid) {
      console.log('submit!')
      emit('back')
    } else {
      console.log('error submit!', fields)
    }
  })
}

const back = () => {
  emit('back')
}
</script>

<style scoped lang="scss">
.main {
  display: flex;
  min-height: calc(100% - 30px);
  overflow: hidden;
}
.l-main {
  position: relative;
  flex: 4;
  background: #fff;
  .demo-ruleForm {
    padding: 16px 40px 6px;
    width: 30vw;
    text-align: left;
  }
  .form {
    display: flex;
    width: 30vw;
    text-align: left;
    .item {
      padding: 0 40px;
      height: 36px;
      line-height: 36px;
    }
  }
  .button-box {
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    div {
      margin-left: 20px;
      margin-right: 20px;
      display: flex;
      align-items: center;
      box-sizing: border-box;

      img {
        margin-right: 4px;
        width: 20px;
        height: 20px;
      }
    }
  }
}
.r-main {
  margin-left: 1%;
  padding: 16px;
  flex: 1;
  background: #fff;
  .b-title {
    font-size: 20px;
    font-weight: bold;
  }
  ul {
    li {
      margin: 20px 0;
      padding: 16px 20px;
      border: 1px solid #330;
      border-radius: 10px;
      .title,
      .interface {
        text-align: left;
        font-size: 18px;
      }
      .info {
        text-align: left;
        color: rgb(32, 32, 9);
      }
      .btn {
        margin: 10px auto 0;
      }
    }
  }
  .btn {
    display: inline-block;
  }
}
</style>
