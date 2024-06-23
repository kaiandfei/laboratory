<template>
  <div v-if="pages === 1">
    <header>
      <div class="fl">
        <span>智能设备管理</span>
        <el-icon><arrow-right /></el-icon>
        <span>智慧班牌</span>
      </div>
    </header>
    <div class="sel-box">
      <div class="operation">
        <div class="button-box">
<!--          <div class="btn green-btn" @click="popState = true">新增</div>-->
        </div>
        <div class="button-box" style="float: right">
          <div class="btn white-btn" @click="pageRetuen">
            <img src="@assets/images/laboratory-standard/cancel.png" alt="" />
            返回
          </div>
        </div>
      </div>
      <div class="screen">
        <div class="sel-l">
          <div class="sel-item">
            <span>学校:</span>
            <span class="sel" style="text-align: left;color: #000000">
              {{schoolName}}
            </span>
          </div>
          <div class="sel-item">
            <span>模版类型:</span>
            <div class="sel">
              <el-select v-model="selFrom.school_id" placeholder="" @change="cateChange">
                <el-option label="全部" value=""></el-option>
                <el-option label="系统模版" value="-1"></el-option>
                <el-option label="自定义模版" :value="schoolId"></el-option>
              </el-select>
            </div>
          </div>
          <div class="sel-item">
            <span>状态:</span>
            <div class="sel">
              <el-select v-model="selFrom.status" placeholder="" @change="cateChange">
                <el-option label="全部" value=""></el-option>
                <el-option label="启用" value="1"></el-option>
                <el-option label="未启用" value="2"></el-option>
              </el-select>
            </div>
          </div>
          <div class="sel-item">
            <span>创建人:</span>
            <div class="sel">
              <el-select v-model="selFrom.create_user_id" placeholder="" @change="cateChange">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="(item,index) in user" :key="index" :label="item.username" :value="item.id"></el-option>
              </el-select>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="content">
        <div class="item-box">
<!--          <div class="item-page">-->
<!--            <p class="one-line flexd" title="88888">-->
<!--              <span class="icon"/>-->
<!--              <span class="title">智慧班牌展示页面</span>-->
<!--              <span style="width: 30%">-->
<!--                <button class="type">系统模版</button>-->
<!--              </span>-->
<!--            </p>-->
<!--            <div class="item-content">-->
<!--              <div class="detail-box">-->
<!--                <div class="img-box">-->
<!--                  <img src="@/assets/images/laboratory-manage/cam.png" alt="" />-->
<!--                </div>-->
<!--              </div>-->
<!--              <div class="click-box">-->
<!--                <p style="justify-content: left;cursor: pointer;" @click="edits">-->
<!--                  <img src="@assets/images/laboratory-standard/edit.png" alt="" />-->
<!--                  启用该模版-->
<!--                </p>-->
<!--                <p>-->
<!--                  创建人：系统-->
<!--                </p>-->
<!--                <p style="justify-content: right;cursor: pointer;">-->
<!--                  <img class="open-close" src="@assets/images/intelligent-device/open.png" alt="" />-->
<!--                </p>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
          <div class="item-page" v-for="(item,index) in data" :key="index">
            <p class="one-line flexd">
              <span class="icon"/>
              <span class="title">{{ index===0?'智慧班牌展示页面':item.name }}</span>
              <span style="width: 30%;padding-left: 31px">
                <button v-if="item.school_id<0" class="type">系统模版</button>
                <button v-else class="type" style="background: #5FAFE4">自定义模版</button>
              </span>
            </p>
            <div class="item-content" style="margin-top: -5px">
              <div class="detail-box"  @click="edits(item)">
                <div class="img-box">
                  <img v-if="item.img_url===''" src="@/assets/images/intelligent-device/template.jpg" alt="" />
                  <img v-else :src="item.img_url" alt="" />
                </div>
              </div>
              <div class="click-box">
                <p v-if="item.status===1" style="justify-content: left;width: 30%">
<!--                  <img src="@assets/images/laboratory-standard/edit.png" alt="" @click="edits(item)"/>-->
                  <img v-if="item.status===1" class="open-close" src="@assets/images/intelligent-device/open.png" alt="" @click="openM(item,2)"/>
                  模版已启用
                </p>
                <p v-if="item.status===2" style="justify-content: left;width: 30%">
                  <img v-if="item.status===2" class="open-close" src="@assets/images/intelligent-device/close.png" alt="" @click="openM(item,1)"/>
                  启用模板
                </p>
                <p style="width: 50%">
                  创建人：{{ item.create_user_name }}
                </p>
                <p style="justify-content: right;width: 20%">
                  <img v-if="item.school_id>0" class="del-all" src="@assets/images/common/del.png" alt="" @click="delM(item)"/>
                </p>
              </div>
            </div>
          </div>
          <div class="item-page" style="background: #C9C7C7;min-height: 390px" @click="add()">
            <div class="add-page">新增模板</div>
            <img class="add-img" src="@assets/images/intelligent-device/add-big.png"/>
          </div>
        </div>
      </div>
      <div class="pagination-block">
<!--        <el-pagination-->
<!--            v-model:currentPage="currentPage"-->
<!--            :page-size="10"-->
<!--            @current-change="handleCurrentChange"-->
<!--            background-->
<!--            layout="total, prev, pager, next, jumper"-->
<!--            :total="total"-->
<!--        ></el-pagination>-->
      </div>
    </div>
  </div>
  <Edit v-if="pages === 2"
        :selectDate="selectDate"
        @back="pageRetuen2"
  ></Edit>
</template>

<script lang="ts" setup>
import { reactive, toRefs, ref, inject, computed, onMounted } from 'vue'
import { useStore } from '@store/index'
import { ArrowRight } from '@element-plus/icons-vue'
import Edit from '@views/intelligent-device/wisdom-class/set-page/edit/index.vue'
import { findTypeClassCardSetting,
  updateTypeClassCardSetting,
  deleteTypeClassCardSetting,
  findSchoolUser } from '@service/intelligent-device/wisdom-class/index'
import {ElMessage} from "element-plus";
const store = useStore()
const schoolName = store.state.login.userInfo.school.name
const schoolId = store.state.login.userInfo.school_id
console.log(store.state.login.userInfo.school_id)
const pages = ref(1)
const data = ref([
  {
    create_user_name:"测试学校",
    img_url:"",
    status:1,
    id:0,
    templateList:[],
  }
])
const selectDate = ref([])
let selFrom = reactive({
  school_id: '',
  template: '',
  status: '',
  create_user_id: ''
})
let user = ref([])
let emit = defineEmits(['back'])
const pageRetuen = () => {
  console.log(512132321)
  emit('back')
}
const edits = (data: any) => {
  if(data.school_id>0){
    selectDate.value = data
    console.log(data)
    pages.value = 2
  }
}
const add = () => {
  selectDate.value = []
  pages.value = 2
}
const pageRetuen2 = () => {
  pages.value = 1
  initDate()
}
const initDate = () => {
  findTypeClassCardSetting().then((res)=>{
    console.log(res)
    if(res.code===10){
      data.value = res.data
    }

  })
}
initDate()
const initUser = () => {
  findSchoolUser({role_id:1}).then((res)=>{
    if(res.code===10){
      user.value = res.data
    }
  })
}
initUser()
const openM = (item:any,type: number) =>{
  updateTypeClassCardSetting({id:item.id,status:type}).then((res)=>{
    if(res.code===10){
      ElMessage({
        type: 'success',
        message: res.msg
      })
      initDate()
    }
  })
}

const delM = (item:any) =>{
  deleteTypeClassCardSetting({id:item.id}).then((res)=>{
    if(res.code===10){
      ElMessage({
        type: 'success',
        message: res.msg
      })
      initDate()
    }
  })
}

const cateChange = () => {
  console.log(selFrom)
  findTypeClassCardSetting(selFrom).then((res)=>{
    console.log(res)
    if(res.code===10){
      data.value = res.data
    }
  })
}
</script>

<style scoped lang="scss">
header {
  height: 30px;
  & > span {
    float: left;
    margin-right: 6px;
    font-size: 16px;
    color: #626572;
  }
}

main {
  width: 100%;

  .sel-box {
    width: 100%;
    height: 120px;

    .operation {
      float: left;
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      background-color: rgb(220, 236, 227);
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);

      & > span {
        float: left;
        margin-left: 1.8%;
        font-size: 20px;
        color: #05c65d;
        font-weight: bold;
      }

      .button-box {
        display: flex;
        justify-content: space-between;

        div {
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

    .screen {
      height: 60px;
      width: 100%;
      background-color: #fff;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      clear: both;

      .sel-l {
        float: left;
        width: 80%;

        .sel-item {
          float: left;
          margin-top: 16px;
          width: 25%;
          display: flex;
          justify-content: space-between;

          & > span {
            float: left;
            width: 20%;
            height: 30px;
            line-height: 30px;
            text-align: right;
            color: #848484;
          }

          .sel {
            float: left;
            margin-right: 10%;
            width: 60%;
          }
        }
      }

      .sel-r {
        float: right;
        width: 20%;

        .mt-4 {
          margin: 16px auto;
          width: calc(100% - 40px);

          .ser-icon {
            padding: 0 10px;
            cursor: pointer;

            img {
              width: 20px;
              height: 20px;
            }
          }
        }
      }
    }
  }
  .msg-box {
    margin-top: 20px;
    height: 350px;
    width: 100%;
    .all-lab {
      float: left;
      width: 350px;
      height: 350px;
      background-color: #fff;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      p {
        margin-top: 75px;
        height: 26px;
        line-height: 26px;
      }
      & > div {
        margin: 30px auto;
        padding: 10px;
        width: 120px;
        height: 120px;
        border-radius: 50%;
        background-color: #05c65d;
        & > div {
          margin: auto;
          padding: 10px;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background-color: #fff;
          & > div {
            margin: auto;
            padding: 10px;
            width: 80px;
            height: 80px;
            line-height: 80px;
            font-size: 40px;
            color: #fff;
            border-radius: 50%;
            background-color: #05c65d;
          }
        }
      }
    }
    .pie-box {
      float: right;
      width: calc(100% - 370px);
      height: 350px;
      background-color: #fff;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    }
  }
  .table-box {
    margin-top: 20px;
    width: 100%;
  }
  .card_box {
    margin: 20px 0;
    height: 60px;
    line-height: 60px;
    width: 100%;
    display: flex;
    background-color: #fff;
    border-radius: 10px;
    font-size: 20px;
    font-weight: bold;
    color: #626572;
    div {
      flex: 1;
      cursor: pointer;
      border-radius: 10px;
    }
    .card-active {
      color: #05c65d;
      background-color: #bef1d5;
    }
  }
}
.btn {
  margin-right: 20px;
  padding: 8px 21px;
  border-radius: 10px;
  box-sizing: border-box;
  cursor: pointer;
}
.content {
  margin-top: 20px;
  .item-box {
    display: flex;
    flex-wrap: wrap;
    .item-page {
      margin: 0 2% 20px 0;
      width: 32%;
      max-width: 600px;
      .add-page {
        color: #60A5DB;font-size: 40px;font-weight: bold;margin-top: 40px;
      }
      .add-img {
        width: 200px;
        margin-top: 20px;
      }
      .flexd {
        display: flex;
      }
      & > p {
        position: relative;
        padding-left: 18px;
        height: 40px;
        line-height: 40px;
        background: white;
        font-size: 16px;
        font-weight: bold;
        color: #60a5db;
        .icon {
          position: absolute;
          left: 6px;
          top: 7px;
          width: 11px;
          height: 26px;
          background: #05C65D;
          border-radius: 13px;
        }
        .title {
          width: 60%;
          text-align: left;
          padding-left: 20px;
          color: #05C65D;
          font-size: 18px
        }
        .type {
          width: 100px;
          height: 23px;
          background: #05C65D;
          border-radius: 13px 13px 13px 13px;
          font-size: 14px;
          line-height: 23px;
          color: white;
          margin-top: 10px;
          border:0px;
          margin-left: 25px;
        }
      }
    }
    .item-content {
      position: relative;
      padding: 1px 25px;
      width: 100%;
      background: #ffffff;
      text-align: left;
      box-sizing: border-box;
      p {
        color: #333333;
      }
      .detail-box {
        cursor: pointer;
        & > p:nth-of-type(1) {
          height: 40px;
          line-height: 40px;
        }
        & > p:nth-of-type(2) {
          height: 30px;
          line-height: 30px;
          color: #848484;
        }
        & > p:nth-of-type(3) {
          height: 20px;
          padding-left: 20px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .camera-state {
          width: 100%;
          text-align: center;
          .green {
            color: #05c65d;
          }
          .red {
            color: red;
          }
        }
      }
      .img-box {
        margin: 6px 0;
        position: relative;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 279px;
        border: 1px solid #61CAB5;
        img {
          width: 100%;
          max-width: 100%;
          max-height: 100%;
          // width: 340px;
          // height: 230px;
        }
        img:nth-of-type(1) {
          margin-right: 20px;
        }
        .cameraicon {
          position: absolute;
          top: -10px;
          left: -15px;
          width: 50px;
          height: 50px;
        }
        .qrcode {
          margin: auto;
        }
      }
      .click-box {
        display: flex;
        justify-content: center;
        align-items: center;
        & > p {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 38px;
          img {
            margin-right: 6px;
          }
        }
      }
    }
  }
}
.open-close {
  width: 50px;
  cursor: pointer;
}
.del-all {
  width: 30px;
  cursor: pointer;
}
.green {
  color: #05c65d;
}
.white-btn {
  color: #05c65d;
  border: 0px solid #dcece3;
  background: #dcece3;
}
:deep(.el-form-item__label){
  text-align: left;
}
:deep(.el-form-item__content){
  display: flex;
}
</style>
