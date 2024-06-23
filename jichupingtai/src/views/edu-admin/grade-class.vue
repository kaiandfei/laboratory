<template>
  <header>
    <span>教务管理 > 班级管理 {{ stuShow ? ' > 学生列表' : '' }}</span>
  </header>
  <main>
    <div class="sel-box">
      <div class="operation">
        <span>{{ stuShow ? '学生列表' : '班级管理' }}</span>
        <div class="sel-r" v-show="stuShow">
          <div class="mt-4">
            <el-input v-model="claFrom.name" placeholder="请输入" class="input-with-select">
              <template #append>
                <!-- <el-button :icon="Search"></el-button> -->
                <div class="ser-icon" @click="showStudent1">
                  <img src="@assets/images/account-school/search.png" alt="" />
                </div>
              </template>
            </el-input>
          </div>
        </div>
        <div class="button-box">
          <!-- <div class="btn green-btn" @click="popState = true">+ 新增区域</div> -->
          <!-- <div class="btn white-btn">
            <img src="@assets/images/account-school/exp.png" alt="" />
            导出教师
          </div> -->
          <div @click="returnB" v-show="stuShow" class="btn white-btn">
            <img src="@assets/images/laboratory/laboratory-standard/cancel.png" alt="" />
            返回
          </div>
        </div>
      </div>
    </div>
    <div v-show="!stuShow" class="area-box">
      <p class="area-title">班级</p>
      <button class="btn green-btn" v-show="loginMsg.role_id !== 4" @click="addGrade(0, null, false)">
        + 新增年级
      </button>
      <div>
        <el-tree
          :data="areaTree"
          :props="defaultProps"
          @node-click="handleNodeClick"
          node-key="id"
          :default-expanded-keys="showKey"
        >
          <template #default="{ node }">
            <div class="node-l">
              <span>{{ node.label }}</span>
              <div>
                <img
                  v-show="loginMsg.role_id !== 4"
                  @click.stop="delTree(node.data, node.data.grade_id)"
                  src="@assets/images/common/del-red.png"
                  alt=""
                />
                <img
                  v-show="loginMsg.role_id !== 4"
                  @click.stop="addGrade(1, node.data, node.data.grade_id)"
                  src="@assets/images/common/edit.png"
                  alt=""
                />
                <span @click.stop="addClass(node.data.id)" v-show="!node.data.grade_id && loginMsg.role_id !== 4">
                  +
                </span>
              </div>
            </div>
          </template>
        </el-tree>
      </div>
    </div>
    <div v-show="!stuShow" class="table-box">
      <div class="del-res">
        <!-- <span>当前共查询到</span>
      <span class="green-t">12000</span>
      <span>名教师</span> -->
        <!-- <div class="btn green-btn">
        <img src="@assets/images/account-school/w-reload.png" alt="" />
        批量重置密码
      </div> -->
        <div class="btn green-btn" @click="delBatch" v-show="loginMsg.role_id !== 4">
          <img src="@assets/images/account-school/w-del.png" alt="" />
          批量删除
        </div>
        <div class="btn green-btn" v-show="loginMsg.role_id !== 4" @click="addClass(null)">+ 新增班级</div>
      </div>
      <el-table
        ref="multipleTableRef"
        :data="tableData"
        stripe
        height="562"
        style="width: 100%"
        @current-change="handleSelectionChange"
        @select-all="selChangeAll"
        @select="selChange"
        @sort-change="sortChange"
      >
        <el-table-column align="left" type="selection" width="30" />
        <el-table-column align="left" type="index" label="序号" min-width="5" />
        <el-table-column align="left" property="name" label="班级" min-width="15" sortable="custom" />
        <el-table-column align="left" property="grade_name" label="年级" min-width="15" sortable="custom" />
        <el-table-column align="left" property="wteachert" label="物理老师" min-width="15" />
        <el-table-column align="left" property="hteachert" label="化学老师" min-width="15" />
        <el-table-column align="left" property="steachert" label="生物老师" min-width="15" />
        <el-table-column
          align="left"
          v-if="
            loginMsg.school.school_type_id == 1 ||
            loginMsg.school.school_type_id == 6 ||
            loginMsg.school.school_type_id == 7
          "
          property="xkteachert"
          label="小学科学"
          min-width="15"
        />

        <el-table-column align="left" property="is_open" label="学生人数" min-width="15">
          <template #default="props">
            <span>{{ props.row.student_num }}</span>
            <span v-if="props.row.student_num" class="font-green point" @click="showStudent(props.row.id, true)">
              查看
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" min-width="20">
          <template #default="props">
            <div class="operation-box">
              <div @click="addGrade(1, props.row, true)" v-show="loginMsg.role_id !== 4">
                <img src="@assets/images/common/edit.png" alt="" />
                <span>编辑</span>
              </div>
              <!-- <div @click="rePassword(props)">
              <img src="@assets/images/common/re-password.png" alt="" />
              <span>重置密码</span>
            </div> -->
              <div @click="delClass(props.row.id)" v-show="loginMsg.role_id !== 4">
                <img src="@assets/images/common/del-red.png" alt="" />
                <span>删除</span>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="stuShow" class="table-box1">
      <el-table
        ref="multipleTableRef"
        :data="studetData"
        stripe
        style="width: 100%"
        height="562"
        @current-change="handleSelectionChange"
        @select-all="selChangeAll"
        @select="selChange"
      >
        <!-- <el-table-column align="left" type="selection" width="30" /> -->
        <el-table-column align="left" type="index" label="序号" min-width="5" />
        <el-table-column align="left" property="number" label="学号" min-width="15" />
        <el-table-column align="left" property="name" label="姓名" min-width="15" />
        <el-table-column align="left" property="Gradename" label="年级" min-width="15" />
        <el-table-column align="left" property="ClassName" label="年级" min-width="15" />
        <!-- <el-table-column align="left" property="ClassName" label="班级" min-width="15">
          <template #default="props">
            <span>{{ props.row.grade_id }}</span>
          </template>
        </el-table-column> -->
      </el-table>
    </div>
  </main>
  <footer v-show="!stuShow">
    <el-pagination
      v-model:currentPage="pageData.page"
      v-model:page-size="pageData.limit"
      :page-sizes="[10, 20, 50, 100, 200]"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageTotal"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </footer>
  <footer v-show="stuShow">
    <el-pagination
      v-model:currentPage="claFrom.page"
      v-model:page-size="claFrom.limit"
      :page-sizes="[10, 20, 50, 100, 200]"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="claFrom.total"
      @current-change="handleCurrentChange1"
      @size-change="handleSizeChange1"
    ></el-pagination>
  </footer>
  <PopCurrency :popShow="popState" @close="popState = $event">
    <template v-slot:header>
      <p>新增班级</p>
    </template>
    <template v-slot:main>
      <div class="form-box">
        <div class="mb-20">
          <span class="w-108 fl">年级选择:</span>
          <div class="w-300 fl">
            <el-select v-model="classFrom.grade_id" class="m-2" placeholder="请选择添加的年级">
              <el-option v-for="item in areaTree" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">新增数量:</span>
          <div class="w-300 fl">
            <el-input-number v-model="classFrom.classnumber" :min="1" />
            <!-- <el-input v-model="areaFrom.name" placeholder="请输入自定义区域名称"></el-input> -->
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <div>
        <div class="fr btn green-btn ml-60" @click="saveClass">保存</div>
        <div class="fr btn white-btn ml-60" @click="popState = false">取消</div>
      </div>
    </template>
  </PopCurrency>
  <PopCurrency :popShow="popState1" @close="popState1 = $event">
    <template v-slot:header>
      <p>{{ popTitle }}年级</p>
    </template>
    <template v-slot:main>
      <div class="form-box">
        <div class="mb-20">
          <span class="w-108 fl">对应基础年级:</span>
          <div class="w-300 fl">
            <el-select v-model="addGradeFrom.xu" class="m-2" placeholder="请选择添加的年级">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">年级名称:</span>
          <div class="w-300 fl">
            <el-input v-model="addGradeFrom.name" maxlength="10" placeholder="请输入年级名称"></el-input>
            <span class="tip">*提示：可输入10个字以内的中文、英文、数字</span>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <div>
        <div class="fr btn green-btn ml-60" @click="saveGrade">保存</div>
        <div class="fr btn white-btn ml-60" @click="popState1 = false">取消</div>
      </div>
    </template>
  </PopCurrency>
  <PopCurrency :popShow="popState2" @close="popState2 = $event">
    <template v-slot:header>
      <p>编辑班级</p>
    </template>
    <template v-slot:main>
      <div class="form-box">
        <div class="mb-20">
          <span class="w-108 fl">年级:</span>
          <div class="w-300 fl">
            {{ itemFrom.grade_name }}
            <!-- <el-input v-model="itemFrom.grade_name" placeholder="请输入班级名称"></el-input> -->
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">班级名称:</span>
          <div class="w-300 fl">
            <el-input v-model="itemFrom.name" maxlength="10" placeholder="请输入班级名称"></el-input>
            <span class="tip">*提示：可输入10个字以内的中文、英文、数字</span>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <div>
        <div class="fr btn green-btn ml-60" @click="saveClassItem">保存</div>
        <div class="fr btn white-btn ml-60" @click="popState2 = false">取消</div>
      </div>
    </template>
  </PopCurrency>
  <PopCurrency style="padding: 10px 10px" :popShow="popState3" @close="popState3 = $event">
    <template v-slot:header>
      <p>查看学生</p>
    </template>
    <template v-slot:main>
      <div>
        <span v-for="item in studetData" :key="item.id">{{ item.name + '     ' }}</span>
      </div>
    </template>
    <template v-slot:footer>
      <div>
        <div class="fr btn white-btn ml-10" @click="popState3 = false">取消</div>
      </div>
    </template>
  </PopCurrency>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import type { ElTable } from 'element-plus'
import { ElMessageBox, ElMessage } from 'element-plus'
import { findArea } from '@service/area/index'
import {
  getGradeClass,
  getClassData,
  addGradeApi,
  delGradeApi,
  delClassApi,
  addClassApi,
  saveClassApi
} from '@service/school-class/index'
import { PopCurrency } from '@components/pop-currency'
import { useStore } from '@store/index'
import { findClassStudent } from '@service/student'
const stuShow = ref(false)
const returnB = () => {
  console.log('111')
  stuShow.value = false
}
const store = useStore()
const loginMsg = JSON.parse(JSON.stringify(store.state.login.userInfo))
console.log(loginMsg.role_id)

const options: any = ref()
/********** <--- 筛选框 ---> **********/
const options1 = ref([{}])

const options2 = ref([])

const getFindArea = (val: number, id: any) => {
  findArea({ area_level: val, p_id: id }).then((res) => {
    console.log(res)
    if (val === 1) {
      options1.value = res.data
    } else if (val === 2) {
      options2.value = res.data
    }
  })
}
getFindArea(1, 0)
getFindArea(2, 0)
/********** <--- 筛选框 ---> **********/
/********** <--- 获取区域结构树 ---> **********/

const areaTree: any = ref([])
const defaultProps = {
  children: 'schoolClass',
  label: 'name'
}
const getTreeglass = () => {
  getGradeClass({ id: loginMsg.school_id }).then((res) => {
    console.log(res.data.grades)
    // res.data.grades.map((e: any) => {
    //   e.schoolClass = JSON.parse(e.schoolClass)
    //   return e
    // })

    areaTree.value = res.data.grades
    console.log(areaTree)
  })
}
getTreeglass()

const showKey = ref([])
const handleNodeClick = (data: any) => {
  console.log(data)
  let arr = JSON.parse(JSON.stringify(showKey.value))
  let id = JSON.parse(JSON.stringify(data)).id
  if (arr.includes(id)) {
    console.log('true')
    arr.splice(
      arr.findIndex((item: { id: any }) => item.id === id),
      1
    )
    showKey.value = arr
    console.log(arr)
  } else {
    console.log(false)

    arr = [...arr, id]
    console.log(arr)
    showKey.value = arr
  }
}

const delBatch = () => {
  if (Array.isArray(delIds.value) && !delIds.value.length) {
    ElMessage({
      type: 'error',
      message: '请选择要删除的数据'
    })
  } else {
    delClass(delIds.value)
  }
}

const handleSelectionChange = (val: any) => {
  console.log(val)
}
const delIds = ref([])
const selChange = (selection: any) => {
  selection = selection.map((item: any) => item.id)
  delIds.value = selection
  console.log(delIds.value)
}
const selChangeAll = (selection: any) => {
  selection = selection.map((item: any) => item.id)
  delIds.value = selection
}
// 分页
const pageTotal = ref(1)
const small = ref(true)
const background = ref(true)
const disabled = ref(false)

let pageData = reactive({
  limit: 10,
  page: 1,
  school_id: loginMsg.school_id
})

// 表格相关
const tableData = ref([])
let sortData: any = reactive({})
const sortChange = ({ column, prop, order }) => {
  if (prop !== null) {
    sortData = {}
    if (order === 'descending') {
      sortData[`order_${prop}`] = 2
    } else {
      sortData[`order_${prop}`] = 1
    }
    agetPageData()
    console.log(column, prop, order)
  }
}
const agetPageData = () => {
  let params = { ...pageData, ...sortData }
  getClassData(params).then((res) => {
    console.log(22222)

    console.log(res)
    pageTotal.value = res.data.total
    tableData.value = res.data.data
    console.log(tableData.value)
  })
}
agetPageData()
const handleSizeChange = (val: number) => {
  console.log(val)
  agetPageData()
}
const handleSizeChange1 = (val: number) => {
  console.log(val)
  showStudent1()
}
const handleCurrentChange = (val: number) => {
  pageData.page = val
  agetPageData()
}
const handleCurrentChange1 = (val: number) => {
  claFrom.page = val
  showStudent1()
}

/********** <--- 获取区域列表 ---> **********/

/**
 * 树删除
 */
const delTree = (itemdata: any, type: any) => {
  if (type) {
    console.log(11111)
    delClass(itemdata.id)
  } else {
    console.log(22222)
    ElMessageBox.confirm('删除将删除当前年级包括年级下的所有班级!', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    })
      .then(() => {
        delGradeApi({ id: itemdata.id }).then((res) => {
          console.log(res)
          if (res.code === 10) {
            agetPageData()
            // getLeafTree()
            getTreeglass()
            ElMessage({
              type: 'success',
              message: '删除成功!'
            })
          } else {
            ElMessage({
              type: 'error',
              message: '删除失败!'
            })
          }
          agetPageData()
          // getLeafTree()
          getTreeglass()
        })
      })
      .catch(() => {
        console.log('取消操作')
      })
  }
}
const delClass = (id: any) => {
  if (loginMsg.role_id === 4) {
    ElMessage({
      type: 'error',
      message: '无修改权限'
    })
  } else {
    ElMessageBox.confirm('确认删除当前班级!', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    })
      .then(() => {
        delClassApi({ id: id }).then((res) => {
          console.log(res)
          if (res.code === 10) {
            agetPageData()
            // getLeafTree()
            getTreeglass()
            ElMessage({
              type: 'success',
              message: '删除成功!'
            })
          } else {
            ElMessage({
              type: 'error',
              message: '删除失败!'
            })
          }
          agetPageData()
          // getLeafTree()
          getTreeglass()
        })
      })
      .catch(() => {
        console.log('取消操作')
      })
  }
}
/*  <--  弹窗相关事件  -->  */

// 新建年级弹窗
const popState1 = ref(false)
const popState3 = ref(false)
const popTitle = ref('新建')
const optionBack = (schoolType: number) => {
  if (schoolType === 1) {
    options.value = [
      {
        value: 1,
        label: '一年级'
      },
      {
        value: 2,
        label: '二年级'
      },
      {
        value: 3,
        label: '三年级'
      },
      {
        value: 4,
        label: '四年级'
      },
      {
        value: 5,
        label: '五年级'
      },
      {
        value: 6,
        label: '六年级'
      }
    ]
  } else if (schoolType === 2) {
    options.value = [
      {
        value: 7,
        label: '七年级'
      },
      {
        value: 8,
        label: '八年级'
      },
      {
        value: 9,
        label: '九年级'
      }
    ]
  } else if (schoolType === 3) {
    options.value = [
      {
        value: 10,
        label: '高一'
      },
      {
        value: 11,
        label: '高二'
      },
      {
        value: 12,
        label: '高三'
      }
    ]
  } else if (schoolType === 4) {
    options.value = [
      {
        value: 7,
        label: '七年级'
      },
      {
        value: 8,
        label: '八年级'
      },
      {
        value: 9,
        label: '九年级'
      },
      {
        value: 10,
        label: '高一'
      },
      {
        value: 11,
        label: '高二'
      },
      {
        value: 12,
        label: '高三'
      }
    ]
  } else if (schoolType === 5) {
    options.value = [
      {
        value: 10,
        label: '高一'
      },
      {
        value: 11,
        label: '高二'
      },
      {
        value: 12,
        label: '高三'
      }
    ]
  } else if (schoolType === 6) {
    options.value = [
      {
        value: 1,
        label: '一年级'
      },
      {
        value: 2,
        label: '二年级'
      },
      {
        value: 3,
        label: '三年级'
      },
      {
        value: 4,
        label: '四年级'
      },
      {
        value: 5,
        label: '五年级'
      },
      {
        value: 6,
        label: '六年级'
      },
      {
        value: 7,
        label: '七年级'
      },
      {
        value: 8,
        label: '八年级'
      },
      {
        value: 9,
        label: '九年级'
      }
    ]
  } else if (schoolType === 7) {
    options.value = [
      {
        value: 1,
        label: '一年级'
      },
      {
        value: 2,
        label: '二年级'
      },
      {
        value: 3,
        label: '三年级'
      },
      {
        value: 4,
        label: '四年级'
      },
      {
        value: 5,
        label: '五年级'
      },
      {
        value: 6,
        label: '六年级'
      },
      {
        value: 7,
        label: '七年级'
      },
      {
        value: 8,
        label: '八年级'
      },
      {
        value: 9,
        label: '九年级'
      },
      {
        value: 10,
        label: '高一'
      },
      {
        value: 11,
        label: '高二'
      },
      {
        value: 12,
        label: '高三'
      }
    ]
  }
}
const studetData: any = ref([])
const claFrom = reactive({
  limit: 15,
  page: 1,
  class_id: null,
  total: 1,
  name: ''
})

const showStudent1 = () => {
  findClassStudent(claFrom).then((res) => {
    if (res.code === 10) {
      studetData.value = res.data.data
      claFrom.total = res.data.total
      console.log(res)
    } else {
      ElMessage({
        type: 'error',
        message: '查看失败'
      })
    }
  })
}
const showStudent = (class_id: any, status: any) => {
  if (status) {
    claFrom.class_id = class_id
    findClassStudent(claFrom).then((res) => {
      if (res.code === 10 && res.data.total !== 0) {
        studetData.value = res.data.data
        claFrom.total = res.data.total
        console.log(res)
        stuShow.value = true
        // popState3.value = true
      } else {
        ElMessage({
          type: 'error',
          message: '查看失败！只可查看自己的执教班级！'
        })
      }
    })
  }
}
const addGrade = (type: any, itemData: any, status: any) => {
  if (loginMsg.role_id === 4) {
    ElMessage({
      type: 'error',
      message: '无修改权限'
    })
  } else {
    if (status) {
      console.log('选中', itemData)
      popState2.value = true
      // itemFrom.value = itemData
      itemFrom.id = itemData.id
      itemFrom.name = itemData.name
      itemFrom.grade_id = itemData.grade_id
      itemFrom.grade_name = itemData.grade_name
      itemFrom.school_id = itemData.school_id
      itemFrom.school_code = itemData.school_code
      itemFrom.student_num = itemData.student_num
      itemFrom.is_del = itemData.is_del
      itemFrom.phase_study_id = itemData.phase_study_id
      itemFrom.create_time = itemData.create_time
      itemFrom.is_true = itemData.is_true
    } else {
      popState1.value = true
      optionBack(loginMsg.school.school_type_id)
      if (type === 0) {
        popTitle.value = '新建'
        addGradeFrom.id = null
        addGradeFrom.name = ''
        addGradeFrom.xu = null
      }
      if (type === 1) {
        popTitle.value = '修改'
        console.log(itemData)
        let item = JSON.parse(JSON.stringify(itemData))
        addGradeFrom.id = item.id
        addGradeFrom.name = item.name
        addGradeFrom.xu = item.xu
      }
    }
  }
}
const addGradeFrom: any = reactive({
  id: null,
  name: '',
  xu: null,
  phase_study_id: loginMsg.school.phase_study_id,
  school_id: loginMsg.school_id,
  school_code: loginMsg.school_code
})
const saveGrade = () => {
  console.log(addGradeFrom)
  addGradeApi(addGradeFrom).then((res) => {
    console.log(res)
    if (res.code === 10) {
      getTreeglass()
      agetPageData()
      popState1.value = false
      ElMessage({
        type: 'success',
        message: '操作成功!'
      })
    }
  })
}
// ------
// 新建班级弹窗
const popState = ref(false)
const classFrom: any = reactive({
  grade_id: null,
  classnumber: 1,
  phase_study_id: loginMsg.school.phase_study_id,
  school_id: loginMsg.school_id,
  school_code: loginMsg.school_code
})
const addClass = (grade_id: any) => {
  popState.value = true
  classFrom.grade_id = grade_id
  classFrom.classnumber = 1
}
const saveClass = () => {
  addClassApi(classFrom).then((res) => {
    console.log(res)
    if (res.code === 10) {
      getTreeglass()
      agetPageData()
      popState.value = false
      ElMessage({
        type: 'success',
        message: '操作成功!'
      })
    }
  })
}
// ------
// 编辑班级
const popState2 = ref(false)
const itemFrom: any = reactive({
  id: null,
  name: null,
  grade_id: null,
  school_id: null,
  school_code: null,
  student_num: null,
  is_del: null,
  phase_study_id: null,
  create_time: null,
  is_true: null
})
const saveClassItem = () => {
  console.log(itemFrom.value)
  saveClassApi(itemFrom).then((res) => {
    if (res.code === 10) {
      getTreeglass()
      agetPageData()
      popState2.value = false
      ElMessage({
        type: 'success',
        message: '操作成功!'
      })
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
  overflow: hidden;
  .sel-box {
    width: 100%;
    height: 60px;
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
    }
  }
  .sel-r {
    float: right;
    width: 80%;
    .mt-4 {
      float: right;
      margin: 16px auto;
      width: 200px;
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
  .del-res {
    margin-top: 10px;
    height: 56px;
    span {
      float: left;
      height: 56px;
      line-height: 56px;
      font-size: 20px;
      color: #404040;
    }
    .green-t {
      padding: 0 8px;
      color: #05c65d;
    }
    & > div {
      float: right;
      margin: 10px 20px 0 0;
      display: flex;
      align-items: center;
      img {
        margin-right: 4px;
        width: 20px;
        height: 20px;
      }
    }
  }
}
footer {
  margin: 28px 0 16px;
  text-align: right;
}
.operation-box {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: space-around;
  div {
    display: flex;
    align-items: center;
    cursor: pointer;
    img {
      margin-right: 12px;
      width: 20px;
      height: 20px;
    }
  }
}
.area-box {
  float: left;
  width: 440px;
  margin-right: 38px;
  & > button {
    float: right;
    border: #05c65d;
    margin-top: 28px;
  }
  .area-title {
    float: left;
    margin-top: 28px;
    width: 150px;
    height: 40px;
    line-height: 40px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.16);
  }
  & > div {
    margin-top: 68px;
    width: 440px;
    max-height: 558px;
    background-color: #fff;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    overflow-y: auto;
  }
}
.table-box {
  float: left;
  width: calc(100% - 478px);
}

.table-box1 {
  float: left;
  width: 100%;
  height: 540px;
}
.node-l {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  div {
    span {
      margin-right: 20px;
      float: right;
      font-size: 20px;
      width: 18px;
      height: 18px;
      line-height: 18px;
      border: 1px solid #05c65d;
      color: #05c65d;
      border-radius: 100%;
      cursor: pointer;
    }
  }
  img {
    float: right;
    margin-right: 20px;
    z-index: 100;
  }
}
.form-box {
  & > div {
    min-height: 30px;
    line-height: 30px;
    text-align: left;
    overflow: hidden;
    & > span {
      height: 100%;
    }
  }
}
.sch-box {
  display: flex;
  justify-content: space-between;
}
.form-box .el-input-number {
  width: 80px;
}
.tip {
  color: #f3c74d;
}
</style>
