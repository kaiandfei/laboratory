<template>
  <div class="main">
    <header>
      <div class="fl">
        仪器设备采购计划
        <el-icon><arrow-right /></el-icon>
        <span class="router" @click="back">供应商管理</span>
        <el-icon><arrow-right /></el-icon>
        添加供应商
      </div>
    </header>
    <div class="top">
      <span class="title">添加供应商</span>
    </div>
    <div class="forms">
      <div class="modules w-60">
        <div class="name">
          <span class="is-must-div">供应商名称</span>
        </div>
        <div class="values">
          <el-input
            ref="inputName"
            v-model="editForm.name"
            :maxlength="30"
            show-word-limit
            placeholder="请输入供应商名称"
          ></el-input>
        </div>
      </div>
      <div class="modules w-60">
        <div class="name">详细地址</div>
        <div class="values">
          <el-input v-model="editForm.address" :maxlength="30" show-word-limit placeholder="请输入详细地址"></el-input>
        </div>
      </div>
      <div class="modules w-30">
        <div class="name">邮编</div>
        <div class="values">
          <el-input v-model="editForm.postal_code" :maxlength="6" show-word-limit placeholder="请输入邮编"></el-input>
        </div>
      </div>
      <div class="modules w-30">
        <div class="name">法人代表</div>
        <div class="values">
          <el-input
            v-model="editForm.legal_person"
            :maxlength="20"
            show-word-limit
            placeholder="请输入法人代表"
          ></el-input>
        </div>
      </div>
      <div class="modules w-30">
        <div class="name">企业性质</div>
        <div class="values">
          <el-input
            v-model="editForm.enterprise_type"
            :maxlength="20"
            show-word-limit
            placeholder="请输入企业性质"
          ></el-input>
        </div>
      </div>
      <div class="modules w-30">
        <div class="name">注册资金</div>
        <div class="values">
          <el-input
            v-model="editForm.registered_capital"
            :maxlength="20"
            show-word-limit
            placeholder="请输入注册资金"
          ></el-input>
        </div>
      </div>
      <div class="modules w-30">
        <div class="name">传真</div>
        <div class="values">
          <el-input v-model="editForm.fax" placeholder="请输入传真"></el-input>
        </div>
      </div>
      <div class="modules w-30">
        <div class="name">网址</div>
        <div class="values">
          <el-input v-model="editForm.website" placeholder="请输入网址"></el-input>
        </div>
      </div>
      <div class="modules w-30"></div>
      <div class="modules w-30">
        <div class="name">营业面积</div>
        <div class="values">
          <el-input v-model="editForm.area" :maxlength="20" show-word-limit placeholder="请输入营业面积"></el-input>
        </div>
      </div>
      <div class="modules w-30">
        <div class="name">在册职工</div>
        <div class="values">
          <el-input v-model="editForm.staff_count" :maxlength="20" show-word-limit placeholder="请输入在册职工">
            <template #append>名</template>
          </el-input>
        </div>
      </div>
      <div class="modules w-30">
        <div class="name">技术人员</div>
        <div class="values">
          <el-input v-model="editForm.technicians_count" :maxlength="20" show-word-limit placeholder="请输入技术人员">
            <template #append>名</template>
          </el-input>
        </div>
      </div>
      <div class="modules w-99">
        <div class="name">企业概况</div>
        <div class="values">
          <el-input
            type="textarea"
            v-model="editForm.summary"
            :maxlength="300"
            show-word-limit
            placeholder="请输入企业概况"
          ></el-input>
        </div>
      </div>
      <div class="modules w-99">
        <div class="name">主要业绩</div>
        <div class="values">
          <el-input
            v-model="editForm.performance"
            type="textarea"
            :maxlength="300"
            show-word-limit
            placeholder="请输入主要业绩"
          ></el-input>
        </div>
      </div>
      <div class="modules w-99">
        <div class="name name-bold">联系人信息</div>
        <div class="values">
          <div class="btn" @click="incrementContact">+添加联系人</div>
        </div>
      </div>
      <div v-for="(item, index) in editForm.contact_list" :key="index" class="modules w-99 border">
        <div class="modules w-30">
          <div class="name"><span class="is-must-div">联系人</span></div>
          <div class="values">
            <el-input v-model="item.contact_name" :maxlength="30" show-word-limit placeholder="请输入联系人"></el-input>
          </div>
        </div>
        <div class="modules w-30">
          <div class="name"><span class="is-must-div">职务</span></div>
          <div class="values">
            <el-input v-model="item.duty" :maxlength="20" show-word-limit placeholder="请输入联系人职务"></el-input>
          </div>
        </div>
        <div class="modules w-30">
          <div class="name"><span class="is-must-div">手机号</span></div>
          <div class="values">
            <el-input v-model="item.phone" :maxlength="11" show-word-limit placeholder="请输入联系人手机号"></el-input>
          </div>
        </div>
        <div v-if="editForm.contact_list.length > 1" class="delete" @click="decrementContact(index)">-</div>
      </div>
    </div>
    <div class="btn-box">
      <div class="btn btn-white" @click="back">取消</div>
      <div class="btn" @click="save">确认</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
import { saveSupplier } from '@/service/instrument-procurement-plan/supplier-management'
import { ElMessage } from 'element-plus'

const Props = defineProps({
  itemData: {
    type: Object as any,
    required: true
  }
})

const Emits = defineEmits(['back'])

console.log('itemData', Props.itemData)

let editForm = ref(JSON.parse(JSON.stringify(Props.itemData)))
editForm.value.contact_list = editForm.value.contact_list.map((e: any) => {
  return {
    contact_name: e.name,
    phone: e.phone,
    duty: e.duty
  }
})
const back = () => {
  Emits('back')
}

const save = () => {
  saveSupplier(editForm.value).then((res) => {
    if (res.code === 10) {
      ElMessage({
        type: 'success',
        message: res.msg
      })
      Emits('back', true)
    }
  })
}

const incrementContact = () => {
  editForm.value.contact_list.push({
    contact_name: '',
    phone: '',
    duty: ''
  })
}

const decrementContact = (index: number) => {
  editForm.value.contact_list.splice(index, 1)
}
</script>

<style scoped lang="scss">
.main {
  text-align: left;
}
header {
  height: 30px;
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  line-height: 30px;
  color: #626572;

  .cancel-box {
    padding-right: 20px;
    display: flex;
    align-items: center;
    cursor: pointer;
    .cancel {
      margin-right: 8px;
      width: 20px;
      height: 20px;
    }
  }
  .router {
    cursor: pointer;
  }
  .search-box {
    position: relative;
    :deep(.el-input) {
      position: absolute;
      right: 0;
      top: 0;
      width: 360px;
      line-height: 30px;
    }
    img {
      position: absolute;
      right: 0;
      top: 0;
      width: 20px;
      height: 20px;
      padding: 5px 10px;
      background: #05c65d;
      cursor: pointer;
    }
  }
}
.top {
  display: flex;
  align-items: center;
  margin: 10px 0 0;
  padding: 20px;
  background: #dcece3;
  text-align: right;
  :deep(.el-input) {
    width: 400px;
  }
  .title {
    margin-right: auto;
    font-weight: bold;
    font-size: 22px;
    color: #05c65d;
  }
  .btn {
    margin-left: 32px;
  }
  // .ser-icon {
  //   padding: 0 10px;
  //   cursor: pointer;
  //   img {
  //     width: 20px;
  //     height: 20px;
  //   }
  // }
}
.click-text {
  display: inline-flex;
  align-items: center;
  // vertical-align: middle;
  margin: 0 10px;
  color: #05c65d;
  cursor: pointer;
}
.forms {
  display: flex;
  flex-wrap: wrap;
  padding: 0 10px 0;
  background: #fff;
  .modules {
    display: flex;
    margin: 12px 0;
    .name {
      margin-right: 12px;
      width: 120px;
      height: 40px;
      line-height: 40px;
      text-align: end;
      .is-must-div {
        line-height: normal;
      }
    }
    .name::after {
      content: '：';
      display: inline-block;
    }
    .name-bold {
      font-size: 18px;
      font-weight: bold;
    }
    .values {
      flex: 1;
    }
  }
  .w-30 {
    width: 33%;
  }
  .w-60 {
    width: 66%;
  }
  .w-99 {
    width: 99%;
  }
  .border {
    position: relative;
    border: #05c65d 1px dotted;
    .delete {
      position: absolute;
      right: 0;
      top: 0;
      width: 20px;
      height: 20px;
      line-height: 18px;
      font-size: 16px;
      text-align: center;
      font-weight: bold;
      color: #fff;
      background: #de4747;
      border-radius: 50%;
      transform: translate(50%, -50%);
      cursor: pointer;
    }
  }
}

.btn-box {
  text-align: center;
  .btn {
    margin: 20px 30px;
    padding-left: 50px;
    padding-right: 50px;
  }
}

.danger {
  color: rgb(240, 16, 16);
}
.black-text {
  color: #333;
}
.btn {
  display: inline-flex;
  align-items: center;
  margin: 0 6px;
  padding: 0 16px;
  height: 36px;
  line-height: 36px;
  background: #05c65d;
  color: #ffffff;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
  text-align: center;
  border-radius: 10px;
  cursor: pointer;
}
.btn-white {
  border: #05c65d 1px solid;
  background: #fff;
  color: #05c65d;
}
</style>
