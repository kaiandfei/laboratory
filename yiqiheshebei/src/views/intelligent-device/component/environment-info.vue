<template>
  <div class="container2" :style="{background:obj.bgColor}" @click="test()">
    <div class="info">
      <div class="control-electricity-info">
        <div class="info-title2" :style="{color:obj.color,fontSize:obj.fontSize+'px'}">
          <span>{{ obj.title }}</span>
        </div>
        <div class="info-main2" :style="{color:obj.contentColor,fontSize:obj.contentSize+'px'}">
          <div class="info-main2-icon">
            <span>温湿度:</span>
            <span>32/90</span>
          </div>
          <div class="info-main2-icon">
            <span>烟雾浓度:</span>
            <span>90%(预警)</span>
          </div>
          <div class="info-main2-icon">
            <span>颗粒物:</span>
            <span>PM2.5/10异常</span>
          </div>
          <div class="info-main2-icon">
            <span>可燃气体浓度:</span>
            <span>10%</span>
          </div>
          <div class="info-main2-icon">
            <span>漏水检测:</span>
            <span>无/异常</span>
          </div>
          <div class="info-main2-icon">
            <span>消防用水:</span>
            <span>正常/异常</span>
          </div>
        </div>
      </div>
    </div>
<!--    <div class="note">-->
<!--      <div class="note-title">实验室注意事项</div>-->
<!--      <div class="note-mian">-->
<!--        <div class="context">-->
<!--          <el-input type="textarea" readonly></el-input>-->
<!--        </div>-->
<!--        <div class="not-footer">-->
<!--          <img class="pag" src="@/assets/images/intelligent-device/pre.png" alt="" />-->
<!--          <span>2/6</span>-->
<!--          <img class="pag" src="@/assets/images/intelligent-device/next.png" alt="" />-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
  </div>
</template>
<script setup>
import { computed, ref, onMounted, watch } from 'vue'
let props = defineProps({ itemData: Object,itemDetail: Object,itemId: Number })
const obj = ref({
  'title': props.itemDetail?props.itemDetail.title===''?'实验室环境信息':props.itemDetail.title:'实验室环境信息',
  'fontSize': props.itemDetail?props.itemDetail.fontSize===''?14:props.itemDetail.fontSize:14,
  'color': props.itemDetail?props.itemDetail.color===''?'#61cab5':props.itemDetail.color:'#61cab5',
  'bgColor': props.itemDetail?props.itemDetail.bgColor===''?'#ffffff':props.itemDetail.bgColor:'#ffffff',
  'contentSize': props.itemDetail?props.itemDetail.contentSize===''?14:props.itemDetail.contentSize:14,
  'contentColor': props.itemDetail?props.itemDetail.contentColor===''?'#000000':props.itemDetail.contentColor:'#000000',
})
// onMounted(()=>{
//   document.querySelector('.info-title2').style.color = obj.value.color
//   document.querySelector('.info-title2').style.fontSize = obj.value.fontSize+'px'
//   document.querySelector('.container2').style.background = obj.value.bgColor
//   document.querySelector('.info-main2').style.fontSize = obj.value.contentSize+'px'
//   document.querySelector('.info-main2').style.color = obj.value.contentColor
// })
let emit = defineEmits(['back'])
function test(){
  emit('back',obj.value)
}
watch(obj.value, () => {
  // document.querySelector('.info-title2').style.color = obj.value.color
  // document.querySelector('.info-title2').style.fontSize = obj.value.fontSize+'px'
  // document.querySelector('.container2').style.background = obj.value.bgColor
  // document.querySelector('.info-main2').style.fontSize = obj.value.contentSize+'px'
  // document.querySelector('.info-main2').style.color = obj.value.contentColor
  emit('changeObj', props.itemId)
})
</script>
<style lang="scss" scoped>
.container2 {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  color: #000000;
}
.info {
  display: flex;
  justify-content: space-between;
  height: 100%;
  //margin-bottom: 20px;
  .control-electricity-info {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    //background: #ffffff;
    box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.16);
    border-radius: 10px;
  }
  .info-title2 {
    //font-size: 14px;
    height: 20%;
    color: #61cab5;
    padding: 10px 0;
    span {
      padding-left: 20px;
    }
    &::after {
      content: '';
      display: block;
      width: 50%;
      border: 2px solid #61cab5;
      margin-top: 10px;
    }
  }

  .info-main2 {
    height: 80%;
    //font-size: 14px;
    box-sizing: border-box;
    text-align: left;
    .info-main2-icon {
      height: 16%;
      padding: 0 20px 0px;
    }
  }
}
.note {
  // position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.16);
  border-radius: 10px;
  .note-title {
    height: 80px;
    line-height: 70px;
    //font-size: 20px;
    color: #fff;
    background: #61cab5;
    border-radius: 10px;
    padding-left: 20px;
    box-sizing: border-box;
  }
  .note-mian {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 10px;
    //background-color: #fff;
    margin-top: -20px;
    padding: 20px;
    box-sizing: border-box;
    .context {
      flex: 1;
      ::v-deep .el-textarea {
        height: 100%;
        .el-textarea__inner {
          height: 100%;
          border: none !important;
          resize: none;
        }
      }
    }
    .not-footer {
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      .pag {
        width: 30px;
        height: 30px;
        margin: 0 20px;
        cursor: pointer;
      }
    }
  }
}
.high {
  color: red;
}
.no-data {
  width: 100%;
  //font-size: 30px;
  font-weight: bold;
  text-align: center;
  margin: auto;
}
</style>
