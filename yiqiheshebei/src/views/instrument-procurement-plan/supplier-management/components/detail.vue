<template>
  <div class="main">
    <header>
      <div class="fl">
        仪器设备采购计划
        <el-icon><arrow-right /></el-icon>
        <span class="router" @click="back">供应商管理</span>
        <el-icon><arrow-right /></el-icon>
        查看供应商
      </div>
    </header>
    <div class="top">
      <span class="title">查看供应商</span>
    </div>
    <div class="forms">
      <div class="modules w-60">
        <div class="name">供应商名称</div>
        <div class="values">{{ detailItem.name }}</div>
      </div>
      <div class="modules w-60">
        <div class="name">详细地址</div>
        <div class="values">
          {{ detailItem.address }}
        </div>
      </div>
      <div class="modules w-30">
        <div class="name">邮编</div>
        <div class="values">
          {{ detailItem.postal_code }}
        </div>
      </div>
      <div class="modules w-30">
        <div class="name">法人代表</div>
        <div class="values">
          {{ detailItem.legal_person }}
        </div>
      </div>
      <div class="modules w-30">
        <div class="name">企业性质</div>
        <div class="values">
          {{ detailItem.enterprise_type }}
        </div>
      </div>
      <div class="modules w-30">
        <div class="name">注册资金</div>
        <div class="values">
          {{ detailItem.registered_capital }}
        </div>
      </div>
      <div class="modules w-30">
        <div class="name">传真</div>
        <div class="values">
          {{ detailItem.fax }}
        </div>
      </div>
      <div class="modules w-30">
        <div class="name">网址</div>
        <div class="values">
          {{ detailItem.website }}
        </div>
      </div>
      <div class="modules w-30"></div>
      <div class="modules w-30">
        <div class="name">营业面积</div>
        <div class="values">
          {{ detailItem.area }}
        </div>
      </div>
      <div class="modules w-30">
        <div class="name">在册职工</div>
        <div class="values">{{ detailItem.staff_count }}名</div>
      </div>
      <div class="modules w-30">
        <div class="name">技术人员</div>
        <div class="values">{{ detailItem.technicians_count }}名</div>
      </div>
      <div class="modules w-99">
        <div class="name">企业概况</div>
        <div class="values">
          {{ detailItem.summary }}
        </div>
      </div>
      <div class="modules w-99">
        <div class="name">主要业绩</div>
        <div class="values">
          {{ detailItem.performance }}
        </div>
      </div>
      <div class="modules w-99">
        <div class="name name-bold">联系人信息</div>
      </div>
      <div v-for="(item, index) in detailItem.contracts" :key="index" class="modules w-99 border">
        <div class="modules w-30">
          <div class="name">联系人</div>
          <div class="values">
            {{ item.name }}
          </div>
        </div>
        <div class="modules w-30">
          <div class="name">职务</div>
          <div class="values">
            {{ item.duty }}
          </div>
        </div>
        <div class="modules w-30">
          <div class="name">手机号</div>
          <div class="values">
            {{ item.phone }}
          </div>
        </div>
      </div>
    </div>
    <div class="btn-box">
      <div class="btn btn-white" @click="back">取消</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
// import { ElMessage, ElMessageBox } from 'element-plus'
import { supplierDetail } from '@/service/instrument-procurement-plan/supplier-management'

const Props = defineProps({
  itemData: {
    type: Object as any,
    required: true
  }
})

const Emits = defineEmits(['back'])

console.log('itemData', Props.itemData)

let detailItem = ref<any>({})
supplierDetail({
  id: Props.itemData.id
}).then((res) => {
  detailItem.value = res.data
})

// let itemData = ref(JSON.parse(JSON.stringify(Props.itemData)))
const back = () => {
  Emits('back')
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
    margin: 18px 0;
    .name {
      padding-left: 24px;
      min-width: 110px;
      text-align: left;
      color: #626572;
      box-sizing: border-box;
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
      word-break: break-all;
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
