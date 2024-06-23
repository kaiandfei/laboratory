<template>
  <div class="room-item">
    <div class="item-box">
      <p class="item-title">
        <span>物理柜1</span>
      </p>
      <p class="subject">柜层数: 5</p>
      <div class="img-box">
        <img class="picture" src="@/assets/images/test/bg.png" alt="" />
        <img class="qr" src="@/assets/images/test/qr.png" alt="" />
      </div>
      <div class="operation">
        <div>
          <img src="@/assets/images/common/record.png" alt="" />
          <span>编辑</span>
        </div>
        <div>
          <img src="@/assets/images/common/del.png" alt="" />
          <span>删除</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped lang="scss">
.room-item {
  float: left;
  position: relative;
  margin: 0 0.5% 30px;
  width: 24%;
  min-width: 400px;
  height: 345px;
  background-color: #fff;
  border-radius: 0 10px 10px 10px;
  .item-box {
    position: absolute;
    padding: 0 9.25% 0 6.75%;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    .item-title {
      margin-top: 20px;
      height: 26px;
      line-height: 26px;
      font-size: 20px;
      font-weight: bold;
      color: #333;
      & > :nth-child(1) {
        float: left;
      }
      & > :nth-child(2) {
        float: right;
      }
    }
    .subject {
      margin-top: 10px;
      height: 20px;
      line-height: 20px;
      color: #333;
      font-size: 14px;
      text-align: left;
    }
    .operation {
      margin-top: 10px;
      height: 40px;
      line-height: 40px;
      color: #333;
      font-size: 16px;
      & > div {
        float: left;
        height: 100%;
        width: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          margin-right: 6px;
          width: 24px;
          height: 24px;
        }
        span {
          color: #333;
          cursor: pointer;
          &:hover {
            color: #05c65d;
          }
        }
      }
      & > :nth-child(1) {
        border-right: 1px solid #c9c7c7;
        box-sizing: border-box;
      }
    }
    .img-box {
      position: relative;
      width: 100%;
      height: 200px;
      border-bottom: 1px dashed #333;
      .picture {
        position: absolute;
        left: 0;
        width: 60%;
        height: 95%;
      }
      .qr {
        position: absolute;
        top: 46px;
        right: 5px;
        width: 30%;
        z-index: 1;
      }
    }
  }
}
</style>
