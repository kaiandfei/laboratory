<template>
  <div class="page-sortable">
    <div class="sortable">
      <div class="header">创建报告</div>
      <div class="row">
        <div class="title">基本信息</div>
        <div class="btn-box">
          <el-button class="btn gray-btn" @click="back()">返回</el-button>
          <el-button :loading="loading" class="btn" @click="submitForm()">保存</el-button>
        </div>
      </div>

      <div class="headline">
        <div class="title">实验：</div>
        <div class="input-box">
          <el-input class="border-b" v-model="expName" placeholder="请输入实验名称" />
        </div>
      </div>
      <div class="draggable-module">
        <draggable
          v-bind="optionsLeft"
          v-model="tagTableLeft"
          @start="drag = true"
          @end="drag = false"
          item-key="template"
          tag="transition-group"
        >
          <template #item="{ element, index }">
            <div>
              <sortTable
                :name="element.title"
                :index="index"
                :propsData="element.teachercontent"
                :type="element.template"
                @removeCallback="removeCallback"
              />
            </div>
          </template>
        </draggable>
        <!-- 添加元素 -->
        <div class="placeholder" v-if="tagTableLeft.length == 0">
          <h1>添加模块</h1>
          <p>选中右侧模块，点击或拖动到这里</p>
        </div>
      </div>
    </div>
    <div class="tag-table">
      <div class="title">选择模块添加</div>
      <div class="draggable-right">
        <draggable
          v-model="tagTableRight"
          @start="drag = true"
          @end="drag = false"
          v-bind="optionsRight"
          :clone="cloneDog"
          :move="onMove"
          item-key="template"
          @update="datadragEnd"
        >
          <template #item="{ element: item }">
            <div @click="addToLeft(item)" class="module-right">
              <p>{{ item.title }}:</p>
              <div class="modules">
                <template v-if="item.template === 'introductionVue'">
                  <p>这是一段可编辑的文字说明，可以插入介绍实验</p>
                </template>
                <template v-if="item.template === 'questionVue'">
                  <p>这是一段可编辑的文字说明，可以插入问题说明</p>
                  <el-input type="textarea" :rows="2" placeholder="多行输入" disabled></el-input>
                </template>
                <template v-if="item.template === 'imageVue'">
                  <img src="@/assets/images/common/image.png" alt="" />
                </template>
                <template v-if="item.template === 'videoVue'">
                  <img src="@/assets/images/common/video.png" alt="" />
                </template>
                <template v-if="item.template === 'fillVue1'">
                  这是一个
                  <span>填空题</span>
                  模版
                </template>
                <template v-if="item.template === 'fillVue2'">
                  这是一个
                  <span>填空题</span>
                  <span>填空题</span>
                  <span>填空题</span>
                </template>
                <template v-if="item.template === 'chooseVue'">
                  <div>
                    <p>这是一个选择题</p>
                    <p v-for="e in ['A', 'B', 'C', 'D']" :key="e" class="option">这是一个选项{{ e }}</p>
                  </div>
                </template>
              </div>
            </div>
          </template>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script>
import sortTable from './sortTable/index.vue'
import draggable from 'vuedraggable'
export default {
  props: {
    propsData: Object
  },
  data() {
    return {
      expName: '',
      drag: false,
      tagTableLeft: [],
      tagTableRight: [
        {
          type: 1,
          title: '简介',
          template: 'introductionVue',
          teachercontent: {
            input: ''
          }
        },
        {
          type: 2,
          title: '问题',
          template: 'questionVue',
          teachercontent: {
            title: '',
            input: ''
          }
        },
        {
          type: 3,
          title: '图片',
          template: 'imageVue',
          teachercontent: {
            fileList: []
          }
        },
        {
          type: 4,
          title: '视频',
          template: 'videoVue',
          teachercontent: {
            fileList: []
          }
        },
        {
          type: 5,
          title: '填空题',
          template: 'fillVue1',
          teachercontent: {
            input1: '',
            input2: '',
            input3: ''
          }
        },
        {
          type: 6,
          title: '填空题',
          template: 'fillVue2',
          teachercontent: {
            input1: '',
            input2: '',
            input3: '',
            input4: ''
          }
        },
        {
          type: 7,
          title: '选择题',
          template: 'chooseVue',
          teachercontent: {
            title: '',
            A: '',
            B: '',
            C: '',
            D: '',
            value: ''
          }
        }
      ],
      loading: false
    }
  },
  components: {
    draggable,
    sortTable
  },
  computed: {
    optionsLeft() {
      return {
        handle: '.handle',
        animation: 0,
        group: 'people',
        scroll: true,
        ScrollSensitivity: 100
      }
    },
    optionsRight() {
      return {
        animation: 150,
        group: {
          name: 'people',
          pull: 'clone',
          put: false
        },
        ghostClass: 'ghost',
        sort: false
      }
    }
  },
  created() {
    this.expName = this.propsData.reportTempletName
    if (this.propsData.reportTempletData) {
      this.tagTableLeft = this.propsData.reportTempletData.map((e) => {
        return {
          ...e,
          key: Date.now()
        }
      })
    } else {
      this.tagTableLeft = this.tagTableRight.map((e) => {
        return {
          ...e,
          key: Date.now()
        }
      })
    }
  },
  updated() {
    console.log(this.tagTableLeft)
  },
  methods: {
    addToLeft(item) {
      let o = JSON.parse(JSON.stringify(item))
      this.tagTableLeft.push({
        ...o,
        key: Date.now()
      })
    },
    cloneDog(obj) {
      console.log('🚀 ~ file: edit.vue:164 ~ cloneDog ~ obj:', obj)
      let o = JSON.parse(JSON.stringify(obj))
      return {
        ...o,
        key: Date.now()
      }
    },
    onMove(evt) {
      console.log('🚀 ~ file: edit.vue:167 ~ onMove ~ evt:', evt)
      // console.log(evt.draggedContext.index)
      // console.log(evt.draggedContext.element)
      // console.log(evt.draggedContext.futureIndex)
      // console.log(evt.relatedContext.index)
      // console.log(evt.relatedContext.element)
      // console.log(evt.relatedContext.list)
      // console.log(evt.relatedContext.component)
    },
    datadragEnd(item) {
      console.log('🚀 ~ file: edit.vue:177 ~ datadragEnd ~ item:', item)
    },
    removeCallback(index) {
      this.tagTableLeft.splice(index, 1)
      console.log(this.tagTableLeft)
    },
    back() {
      this.$emit('back')
    },
    submitForm() {
      // this.loading = true

      console.log('🚀 ~ file: edit.vue:197 ~ submitForm ~ tagTableLeft:', this.tagTableLeft)
      let list = this.tagTableLeft.map((e, i) => {
        return {
          ...e,
          t_sort: i + 1
        }
      })
      this.$emit('changeData', {
        reportTempletName: this.expName,
        reportTempletData: list
      })
      // setTimeout(() => {
      //   this.loading = false
      // }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.page-sortable {
  position: relative;
  display: flex;
  .sortable {
    flex: 1;
    background: #fff;
    .header {
      height: 60px;
      line-height: 60px;
      background: #dcece3;
      color: #05c65d;
      font-size: 20px;
    }
    .row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title {
        width: 230px;
        height: 46px;
        line-height: 46px;
        border-bottom: #05c65d 4px solid;
      }
    }

    .headline {
      padding: 20px 50px 10px 20px;
      display: flex;
      .title {
        // margin-right: 8px;
        // height: 30px;
        line-height: 30px;
        min-width: 80px;
        text-align: left;
        color: #848484;
      }
      .input-box {
        flex: 1;
      }
    }
  }
  .tag-table {
    position: sticky;
    top: 30px;
    margin-left: 30px;
    padding: 0 0 20px;
    background: #d9d9d9;
    width: 480px;
    height: calc(100vh - 190px);

    box-sizing: border-box;

    .title {
      height: 60px;
      line-height: 60px;
      font-size: 16px;
      color: #05c65d;
      text-align: center;
      border-bottom: #05c65d 4px solid;
      box-sizing: border-box;
      background: #fff;
    }
    .draggable-right {
      padding: 2px 34px;
      height: calc(100% - 60px);
      overflow-y: scroll;

      .module-right {
        margin: 20px 0;
        padding: 12px 20px;
        text-align: left;
        background: #fff;
        box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.16);
        border-radius: 10px;
        & > p {
          font-size: 16px;
          font-weight: bold;
          color: #05c65d;
        }
        .modules {
          padding: 10px 16px;
          overflow-y: scroll;
          p {
            margin-bottom: 6px;
          }
          img {
            width: 120px;
          }
          .option {
            padding-left: 20px;
            // color: #b5b5b5;
          }
          span {
            padding: 0 8px;
            border-bottom: 1px solid #b5b5b5;
          }
        }
      }
    }
  }
  ::v-deep .el-input {
    .el-input__inner {
      width: 100% !important;
    }
  }
  ::v-deep .border-b {
    line-height: 30px;

    .el-input__inner {
      border: none;
      border-bottom: 1px solid #c9c7c7;
    }
  }
  .btn-box {
    // width: 270px;
    display: flex;
    // justify-content: space-between;
    .btn {
      margin: 0 10px;
      padding: 10px 30px;
      background: #05c65d;
      box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
      border-radius: 10px;
      color: #fff;
      cursor: pointer;
    }
    .gray-btn {
      background: #fff;
      color: #333333;
      border: 1px solid #c9c7c7;
    }
  }
  .ghost {
    img {
      width: 60px !important;
    }
  }
}
</style>
