<template>
  <div class="note" :style="{background:obj.bgColor}" @click="test()">
    <div class="note-title" :style="{color:obj.color,fontSize:obj.fontSize+'px'}">{{ obj.title }}</div>
    <div class="note-mian">
      <div class="context" :style="{color:obj.contentColor,fontSize:obj.contentSize+'px'}">
        {{ content }}
      </div>
      <div class="not-footer">
        <img
            class="pag"
            src="@/assets/images/common/pre.png"
            alt=""
        />
        <span>2</span>
        <img
            class="pag"
            src="@/assets/images/common/next.png"
            alt=""
            @click="handleNext"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, ref, onMounted, watch } from 'vue'
const content='实验室的注意事项.....'
let props = defineProps({ itemData: Object,itemDetail: Object,itemId: Number })
const obj = ref({
  'title': props.itemDetail?props.itemDetail.title===''?'实验室注意事项':props.itemDetail.title:'实验室注意事项',
  'fontSize': props.itemDetail?props.itemDetail.fontSize===''?14:props.itemDetail.fontSize:14,
  'color': props.itemDetail?props.itemDetail.color===''?'#ffffff':props.itemDetail.color:'#ffffff',
  'bgColor': props.itemDetail?props.itemDetail.bgColor===''?'#ffffff':props.itemDetail.bgColor:'#ffffff',
  'contentSize': props.itemDetail?props.itemDetail.contentSize===''?14:props.itemDetail.contentSize:14,
  'contentColor': props.itemDetail?props.itemDetail.contentColor===''?'#000000':props.itemDetail.contentColor:'#000000',
})
// onMounted(()=>{
//   document.querySelector('.note-title').style.color = obj.value.color
//   document.querySelector('.note-title').style.fontSize = obj.value.fontSize+'px'
//   document.querySelector('.note').style.background = obj.value.bgColor
//   document.querySelector('.context').style.fontSize = obj.value.contentSize+'px'
//   document.querySelector('.context').style.color = obj.value.contentColor
// })
let emit = defineEmits(['back'])
function test(){
  emit('back',obj.value)
}
watch(obj.value, () => {
  emit('changeObj', props.itemId)
})
</script>

<style lang="scss" scoped>
.note {
/*// position: relative;*/
  flex: 1;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.16);
  border-radius: 10px;
  .note-title {
    height: 20%;
    display: flex;
    align-items: center;
    justify-content: center;
    //font-size: 20px;
    color: #fff;
    background: #61cab5;
    border-radius: 10px;
    padding-left: 20px;
    box-sizing: border-box;
  }
  .note-mian {
    height: 80%;
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
      height: 80%;
      padding: 20px;
      display: flex;
      justify-content: center; /* 水平居中 */
      align-items: center; /* 垂直居中 */
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
</style>