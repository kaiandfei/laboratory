<template>
  <div class="equ">
    <p>
      <span>计算机(02001-1),多媒体</span>
      <span>I类</span>
    </p>
    <div class="details">
      <img src="@/assets/images/logo.png" alt="" />
      <img src="@/assets/images/logo.png" alt="" />
      <span>详情</span>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped lang="scss">
.equ {
  float: left;
  width: 32%;
  height: 130px;
  border: 1px dotted #b5b5b5;
  & > p {
    margin: 14px 18px;
    display: flex;
    justify-content: space-between;
    height: 26px;
    line-height: 26px;
    font-size: 20px;
    font-weight: bold;
    span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .details {
    margin-top: 30px;
    width: 100%;
    height: 50px;
    img {
      margin: 0 20px;
      float: left;
      width: 50px;
    }
    span {
      float: right;
      margin-top: 30px;
      width: 50px;
      height: 20px;
      line-height: 20px;
      color: #05c65d;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
    }
  }
}
</style>
