<template>
  <header>
    <span>教务管理 > 教师管理</span>
  </header>
  <main>
    <div class="sel-box">
      <div class="operation">
        <span>教师管理</span>
        <div class="button-box">
          <div class="btn green-btn" @click=";(popState = true), sChange(loginMsg.school)">+ 添加教师</div>
          <div class="btn white-btn" @click="exportdata()">
            <img src="@assets/images/account-school/exp.png" alt="" />
            导出账号
          </div>
          <div class="btn white-btn" @click="uploadExcel()">
            <img src="@assets/images/account-school/imp.png" alt="" />
            导入账号
          </div>
          <input type="file" name="file" id="uploadExcel" @change="changeExcel()" style="display: none" />

          <div class="btn white-btn" @click="downloadTemplate('/swrserveadmin/User/downloadtplshool')">
            <img src="@assets/images/account-school/imp.png" alt="" />
            下载模板
          </div>
        </div>
      </div>
      <div class="screen">
        <div class="sel-l">
          <div class="sel-item">
            <span>教师角色:</span>
            <div class="sel">
              <el-select v-model="pageData.role_id" class="m-2" placeholder="请选择" @change="getList">
                <el-option :value="null" label="全部"></el-option>
                <el-option :value="4" label="教师"></el-option>
                <el-option :value="3" label="备课组长"></el-option>
                <el-option :value="1" label="学校管理员"></el-option>
                <el-option :value="2" label="实验室管理员"></el-option>
                <el-option :value="5" label="实验室总管理员"></el-option>
              </el-select>
            </div>
          </div>
          <div class="sel-item">
            <span>年级:</span>
            <div class="sel">
              <el-select v-model="pageData.grade_id" class="m-2" placeholder="请选择" @change="getList">
                <el-option :value="null" label="全部"></el-option>
                <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </div>
          </div>
          <div class="sel-item">
            <span>学科:</span>
            <div class="sel">
              <el-select v-model="pageData.subject_id" class="m-2" placeholder="请选择" @change="getList">
                <el-option :value="null" label="全部"></el-option>
                <el-option
                  v-for="item in options_subjects"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="sel-r">
          <div class="mt-4">
            <el-input v-model="pageData.username" placeholder="请输入关键字" class="input-with-select">
              <template #append>
                <!-- <el-button :icon="Search"></el-button> -->
                <div class="ser-icon" @click="getList()">
                  <img src="@assets/images/account-school/search.png" alt="" />
                </div>
              </template>
            </el-input>
          </div>
        </div>
      </div>
    </div>
    <div class="del-res">
      <span>当前共查询到</span>
      <span class="green-t">{{ total }}</span>
      <span>名教师</span>
      <div class="btn green-btn" @click="rePassword(delIds)">
        <img src="@assets/images/account-school/w-reload.png" alt="" />
        批量重置密码
      </div>
      <div class="btn green-btn" @click="delAccount(delIds)">
        <img src="@assets/images/account-school/w-del.png" alt="" />
        批量删除
      </div>
    </div>
    <el-table
      ref="multipleTableRef"
      :data="tableData"
      stripe
      style="width: 100%"
      @select-all="selChangeAll"
      @select="selChange"
    >
      <el-table-column align="left" type="selection" width="30" />
      <el-table-column align="left" type="index" label="序号" min-width="5" />
      <el-table-column align="left" property="login_name" label="教师账号" min-width="15">
        <template #default="props">
          <span>
            {{ props.row.login_name }}
            <span class="font_green" @click="copyAccount(props.row.login_name)">复制</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column align="left" property="username" label="姓名" min-width="15" />
      <el-table-column align="left" property="role_names" label="角色" min-width="15" />
      <el-table-column align="left" property="phone" label="手机号" min-width="15" />
      <el-table-column align="left" property="school_name" label="所属学校" min-width="36" />
      <el-table-column align="left" property="gradename" label="执教班级" min-width="15">
        <template #default="props">
          <span @click="classWatch(props.row.class_count)" class="font_green">
            {{ props.row.class_count.length + '个 （查看）' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="left" property="subject_name" label="学科" min-width="15" />
      <el-table-column align="center" property="address" label="操作" min-width="36">
        <template #default="props">
          <div class="operation-box">
            <div @click="edit(props.row.id)">
              <img src="@assets/images/common/edit.png" alt="" />
              <span>编辑</span>
            </div>
            <div @click="rePassword(props.row.id)">
              <img src="@assets/images/common/re-password.png" alt="" />
              <span>重置密码</span>
            </div>
            <div @click="delAccountSingle(props.row)">
              <img src="@assets/images/common/del-red.png" alt="" />
              <span>删除</span>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </main>
  <footer>
    <el-pagination
      v-model:currentPage="pageData.page"
      v-model:page-size="pageData.limit"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="prev, pager, next, jumper"
      :total="total"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </footer>
  <el-dialog v-model="dialogVisible" title="删除教师" width="30%">
    <p class="dialog_P">
      <span>账号：</span>
      {{ singleData.data.login_name }}
    </p>
    <p class="dialog_P">
      <span>姓名：</span>
      {{ singleData.data.username }}
    </p>
    <p class="dialog_P">
      <span>手机号：</span>
      {{ singleData.data.phone }}
    </p>
    <p class="dialog_P">
      <span>角色：</span>
      {{ singleData.data.role_names }}
    </p>
    <p class="err_tip">提示！请确认教师已不在学校中再进行操作，操作后数据不可恢复！</p>
    <template #footer>
      <span class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="delsingleSure()">确认</el-button>
      </span>
    </template>
  </el-dialog>
  <PopCurrency :popShow="popState" @close="popState = $event">
    <template v-slot:header>
      <p>添加教师</p>
    </template>
    <template v-slot:main>
      <div class="form-box">
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            账号:
          </span>
          <div class="w-300 fl mr-70">
            <el-input v-model="fromData.login_name" placeholder="请输入教师账号"></el-input>
          </div>
          <span class="w-108 fl">
            <span class="font-red">*</span>
            性别:
          </span>
          <div class="w-300 fl">
            <el-select v-model="fromData.sex" class="m-2" placeholder="选择">
              <el-option label="男" :value="1"></el-option>
              <el-option label="女" :value="2"></el-option>
            </el-select>
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            姓名:
          </span>
          <div class="w-300 fl mr-70">
            <el-input v-model="fromData.username" placeholder="请输入教师姓名"></el-input>
          </div>
          <span class="w-108 fl">
            <span class="font-red">*</span>
            手机号:
          </span>
          <div class="w-300 fl">
            <el-input v-model="fromData.phone" placeholder="请输入教师手机号"></el-input>
          </div>
        </div>
        <!-- <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            学校:
          </span>
          <div class="sch-box">
            <div class="w-180">
              <el-select v-model="fromData.pro" class="m-2" placeholder="请选择" @change="areaChange5">
                <el-option v-for="item in options5" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </div>
            <div class="w-180">
              <el-select
                v-model="fromData.city"
                class="m-2"
                placeholder="请选择"
                @change="areaChange6"
                :disabled="fromData.pro === ''"
              >
                <el-option v-for="item in options6" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </div>
            <div class="w-180">
              <el-select
                v-model="fromData.area_code"
                class="m-2"
                placeholder="请选择"
                @change="areaChange7"
                :disabled="fromData.city === ''"
              >
                <el-option v-for="item in options7" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </div>
            <div class="w-180">
              <el-select
                v-model="fromData.school_code"
                class="m-2"
                placeholder="请选择"
                :disabled="fromData.area_code === ''"
              >
                <el-option
                  v-for="item in options4"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  @click="sChange(item)"
                ></el-option>
              </el-select>
            </div>
          </div>
        </div> -->
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            教师角色:
          </span>
          <div @click="checkRoleId(4)" class="fl f-align-c mr-20">
            <img :src="fromData.role_ids.indexOf(4) !== -1 ? selOn : selOff" alt="" class="mr-18" />
            <!-- <img :src="teacherRole === 1 ? selOn : selOff" alt="" /> -->
            <span>教师</span>
          </div>
          <div @click="checkRoleId(3)" class="fl f-align-c mr-20">
            <img :src="fromData.role_ids.indexOf(3) !== -1 ? selOn : selOff" alt="" class="mr-18" />
            <!-- <img :src="teacherRole === 1 ? selOn : selOff" alt="" /> -->
            <span>备课组长</span>
          </div>
          <div @click="checkRoleId(2)" class="fl f-align-c mr-20">
            <img
              :src="fromData.role_ids.indexOf(2) !== -1 && fromData.role_ids.indexOf(5) === -1 ? selOn : selOff"
              alt=""
              class="mr-18"
            />
            <!-- <img :src="teacherRole === 1 ? selOn : selOff" alt="" /> -->
            <span>实验室管理员</span>
          </div>
          <div @click="checkRoleId(5)" class="fl f-align-c mr-20">
            <img
              :src="fromData.role_ids.indexOf(5) !== -1 && fromData.role_ids.indexOf(2) === -1 ? selOn : selOff"
              alt=""
              class="mr-18"
            />
            <!-- <img :src="teacherRole === 1 ? selOn : selOff" alt="" /> -->
            <span>实验室总管理员</span>
          </div>
          <!-- <div @click="fromData.role_id = 1" class="fl f-align-c">
            <img :src="fromData.role_id === 1 ? selOn : selOff" alt="" class="mr-18" />
            <img :src="teacherRole === 1 ? selOn : selOff" alt="" />
            <span>学校管理员</span>
          </div> -->
        </div>
        <div class="mb-20">
          <span class="w-108 fl">
            <!-- <span class="font-red">*</span> -->
            涉及学段:
          </span>
          <div
            v-if="
              loginMsg.school.school_type_id == 1 ||
              loginMsg.school.school_type_id == 6 ||
              loginMsg.school.school_type_id == 7
            "
            @click="checkPhaseStudyId('1')"
            class="fl f-align-c mr-20"
          >
            <img :src="fromData.phase_study_id.indexOf('1') !== -1 ? selOn : selOff" alt="" class="mr-18" />
            <!-- <img :src="teacherRole === 1 ? selOn : selOff" alt="" /> -->
            <span>小学</span>
          </div>
          <div
            v-if="
              loginMsg.school.school_type_id == 2 ||
              loginMsg.school.school_type_id == 4 ||
              loginMsg.school.school_type_id == 6 ||
              loginMsg.school.school_type_id == 7
            "
            @click="checkPhaseStudyId('2')"
            class="fl f-align-c mr-20"
          >
            <img :src="fromData.phase_study_id.indexOf('2') !== -1 ? selOn : selOff" alt="" class="mr-18" />
            <!-- <img :src="teacherRole === 1 ? selOn : selOff" alt="" /> -->
            <span>初中</span>
          </div>
          <div
            v-if="
              loginMsg.school.school_type_id == 3 ||
              loginMsg.school.school_type_id == 4 ||
              loginMsg.school.school_type_id == 5 ||
              loginMsg.school.school_type_id == 7
            "
            class="fl f-align-c mr-20"
            @click="checkPhaseStudyId('3')"
          >
            <img :src="fromData.phase_study_id.indexOf('3') !== -1 ? selOn : selOff" alt="" class="mr-18" />
            <!-- <img :src="teacherRole === 1 ? selOn : selOff" alt="" /> -->
            <span>高中</span>
          </div>
        </div>
        <div
          class="mb-20"
          v-if="
            fromData.role_ids.indexOf(4) !== -1 ||
            fromData.role_ids.indexOf(3) !== -1 ||
            fromData.role_ids.indexOf(2) !== -1
          "
        >
          <span class="w-108 fl">
            <!-- <span class="font-red">*</span> -->
            执教学科:
          </span>
          <div
            @click="fromData.subject_id = 1"
            class="fl f-align-c mr-20"
            v-if="
              !(
                loginMsg.school.school_type_id == 1 ||
                loginMsg.school.school_type_id == 6 ||
                loginMsg.school.school_type_id == 7
              )
            "
          >
            <img :src="fromData.subject_id === 1 ? selOnG : selOffG" alt="" class="mr-18" />
            <!-- <img :src="teacherRole === 1 ? selOn : selOff" alt="" /> -->
            <span>物理</span>
          </div>
          <div
            @click="fromData.subject_id = 2"
            class="fl f-align-c mr-20"
            v-if="
              !(
                loginMsg.school.school_type_id == 1 ||
                loginMsg.school.school_type_id == 6 ||
                loginMsg.school.school_type_id == 7
              )
            "
          >
            <img :src="fromData.subject_id === 2 ? selOnG : selOffG" alt="" class="mr-18" />
            <!-- <img :src="teacherRole === 1 ? selOn : selOff" alt="" /> -->
            <span>化学</span>
          </div>
          <div
            @click="fromData.subject_id = 3"
            class="fl f-align-c mr-20"
            v-if="
              !(
                loginMsg.school.school_type_id == 1 ||
                loginMsg.school.school_type_id == 6 ||
                loginMsg.school.school_type_id == 7
              )
            "
          >
            <img :src="fromData.subject_id === 3 ? selOnG : selOffG" alt="" class="mr-18" />
            <!-- <img :src="teacherRole === 1 ? selOn : selOff" alt="" /> -->
            <span>生物</span>
          </div>
          <div
            @click="fromData.subject_id = 4"
            class="fl f-align-c mr-20"
            v-if="
              loginMsg.school.school_type_id == 1 ||
              loginMsg.school.school_type_id == 6 ||
              loginMsg.school.school_type_id == 7
            "
          >
            <img :src="fromData.subject_id === 4 ? selOnG : selOffG" alt="" class="mr-18" />
            <!-- <img :src="teacherRole === 1 ? selOn : selOff" alt="" /> -->
            <span>小学科学</span>
          </div>
        </div>
        <div class="mb-20" v-show="fromData.role_ids.indexOf(4) !== -1">
          <span class="w-108 fl">执教班级:</span>
          <div class="fr school-class" v-if="allClass.length !== 0">
            <el-tabs>
              <el-tab-pane v-for="(item, index) in computedGrade" :key="index" :label="item.name">
                <template #label>
                  <span class="custom-tabs-label">
                    <span class="title">{{ item.name }}</span>
                    <span class="tips" v-show="tipsNum(item.schoolClass) !== 0">{{ tipsNum(item.schoolClass) }}</span>
                  </span>
                </template>
                <el-check-tag
                  v-for="(item1, index1) in item.schoolClass"
                  :key="index1"
                  :checked="item1.is_true"
                  @change="item1.is_true = !item1.is_true"
                >
                  {{ item1.name }}
                </el-check-tag>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <div class="mb-20" v-show="fromData.role_ids.indexOf(3) !== -1">
          <span class="w-108 fl">备课年级:</span>
          <div class="fr school-class">
            <el-check-tag
              v-for="(item, index) in fromData.schoolGrade"
              :key="index"
              :checked="item.is_true"
              @change="item.is_true = !item.is_true"
            >
              {{ item.name }}
            </el-check-tag>
          </div>
        </div>
        <div class="mb-20" v-show="fromData.role_ids.indexOf(2) !== -1">
          <span class="w-108 fl">管理实验室:</span>
          <div class="fr school-class" v-if="fromData.subject_laborator.length !== 0">
            <el-tabs>
              <el-tab-pane v-for="(item, index) in fromData.subject_laborator" :key="index" :label="item.name">
                <template #label>
                  <span class="custom-tabs-label">
                    <span class="title">{{ item.name }}</span>
                    <span class="tips" v-show="tipsNum(item.laboratory) !== 0">{{ tipsNum(item.laboratory) }}</span>
                  </span>
                </template>
                <el-check-tag
                  v-for="(item1, index1) in item.laboratory"
                  :key="index1"
                  :checked="item1.is_true"
                  @change="item1.is_true = !item1.is_true"
                >
                  {{ item1.name }}
                </el-check-tag>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <div>
        <div class="fr btn green-btn ml-60" @click="save">保存</div>
        <div class="fr btn white-btn ml-60" @click="popState = false">取消</div>
      </div>
    </template>
  </PopCurrency>
  <PopCurrency :popShow="popState1" @close="popState1 = $event">
    <template v-slot:header>
      <p>编辑教师</p>
    </template>
    <template v-slot:main>
      <div class="form-box">
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            账号:
          </span>
          <div class="w-300 fl mr-70">
            <el-input :disabled="true" v-model="editFrom.login_name" placeholder="请输入教师账号"></el-input>
          </div>
          <span class="w-108 fl">性别:</span>
          <div class="w-300 fl">
            <el-select v-model="editFrom.sex" class="m-2" placeholder="选择">
              <el-option label="男" :value="1"></el-option>
              <el-option label="女" :value="2"></el-option>
            </el-select>
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            姓名:
          </span>
          <div class="w-300 fl mr-70">
            <el-input v-model="editFrom.username" placeholder="请输入教师姓名"></el-input>
          </div>
          <span class="w-108 fl">
            <span class="font-red">*</span>
            手机号:
          </span>
          <div class="w-300 fl">
            <el-input v-model="editFrom.phone" placeholder="请输入教师手机号"></el-input>
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            学校:
          </span>
          <div class="sch-box">
            {{ editFrom.address }}
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            教师角色:
          </span>
          <div @click="checkeditRoleId(4)" class="fl f-align-c mr-20">
            <img :src="editFrom.role_ids.indexOf(4) !== -1 ? selOn : selOff" alt="" class="mr-18" />
            <!-- <img :src="teacherRole === 1 ? selOn : selOff" alt="" /> -->
            <span>教师</span>
          </div>
          <div @click="checkeditRoleId(3)" class="fl f-align-c mr-20">
            <img :src="editFrom.role_ids.indexOf(3) !== -1 ? selOn : selOff" alt="" class="mr-18" />
            <!-- <img :src="teacherRole === 1 ? selOn : selOff" alt="" /> -->
            <span>备课组长</span>
          </div>
          <div @click="checkeditRoleId(2)" class="fl f-align-c mr-20">
            <img
              :src="editFrom.role_ids.indexOf(2) !== -1 && editFrom.role_ids.indexOf(5) === -1 ? selOn : selOff"
              alt=""
              class="mr-18"
            />
            <!-- <img :src="teacherRole === 1 ? selOn : selOff" alt="" /> -->
            <span>实验室管理员</span>
          </div>
          <div @click="checkeditRoleId(5)" class="fl f-align-c mr-20">
            <img
              :src="editFrom.role_ids.indexOf(5) !== -1 && editFrom.role_ids.indexOf(2) === -1 ? selOn : selOff"
              alt=""
              class="mr-18"
            />
            <!-- <img :src="teacherRole === 1 ? selOn : selOff" alt="" /> -->
            <span>实验室总管理员</span>
          </div>
          <div @click="checkeditRoleId(1)" class="fl f-align-c">
            <img :src="editFrom.role_ids.indexOf(1) !== -1 ? selOn : selOff" alt="" class="mr-18" />
            <!-- <img :src="teacherRole === 1 ? selOn : selOff" alt="" /> -->
            <span>学校管理员</span>
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">
            <!-- <span class="font-red">*</span> -->
            涉及学段:
          </span>
          <div
            @click="checkeditPhaseStudyId('1')"
            class="fl f-align-c mr-20"
            v-if="
              loginMsg.school.school_type_id == 1 ||
              loginMsg.school.school_type_id == 6 ||
              loginMsg.school.school_type_id == 7
            "
          >
            <img :src="editFrom.phase_study_id.indexOf('1') !== -1 ? selOn : selOff" alt="" class="mr-18" />
            <!-- <img :src="teacherRole === 1 ? selOn : selOff" alt="" /> -->
            <span>小学</span>
          </div>
          <div
            @click="checkeditPhaseStudyId('2')"
            class="fl f-align-c mr-20"
            v-if="
              loginMsg.school.school_type_id == 2 ||
              loginMsg.school.school_type_id == 4 ||
              loginMsg.school.school_type_id == 6 ||
              loginMsg.school.school_type_id == 7
            "
          >
            <img :src="editFrom.phase_study_id.indexOf('2') !== -1 ? selOn : selOff" alt="" class="mr-18" />
            <!-- <img :src="teacherRole === 1 ? selOn : selOff" alt="" /> -->
            <span>初中</span>
          </div>
          <div
            @click="checkeditPhaseStudyId('3')"
            class="fl f-align-c mr-20"
            v-if="
              loginMsg.school.school_type_id == 3 ||
              loginMsg.school.school_type_id == 4 ||
              loginMsg.school.school_type_id == 5 ||
              loginMsg.school.school_type_id == 7
            "
          >
            <img :src="editFrom.phase_study_id.indexOf('3') !== -1 ? selOn : selOff" alt="" class="mr-18" />
            <!-- <img :src="teacherRole === 1 ? selOn : selOff" alt="" /> -->
            <span>高中</span>
          </div>
        </div>
        <div
          class="mb-20"
          v-if="
            editFrom.role_ids.indexOf(4) !== -1 ||
            editFrom.role_ids.indexOf(3) !== -1 ||
            editFrom.role_ids.indexOf(2) !== -1
          "
        >
          <span class="w-108 fl">
            <!-- <span class="font-red">*</span> -->
            执教学科:
          </span>
          <div
            @click="editFrom.subject_id = 1"
            class="fl f-align-c mr-20"
            v-if="
              !(
                loginMsg.school.school_type_id == 1 ||
                loginMsg.school.school_type_id == 6 ||
                loginMsg.school.school_type_id == 7
              )
            "
          >
            <img :src="editFrom.subject_id === 1 ? selOnG : selOffG" alt="" class="mr-18" />
            <!-- <img :src="teacherRole === 1 ? selOn : selOff" alt="" /> -->
            <span>物理</span>
          </div>
          <div
            @click="editFrom.subject_id = 2"
            class="fl f-align-c mr-20"
            v-if="
              !(
                loginMsg.school.school_type_id == 1 ||
                loginMsg.school.school_type_id == 6 ||
                loginMsg.school.school_type_id == 7
              )
            "
          >
            <img :src="editFrom.subject_id === 2 ? selOnG : selOffG" alt="" class="mr-18" />
            <!-- <img :src="teacherRole === 1 ? selOn : selOff" alt="" /> -->
            <span>化学</span>
          </div>
          <div
            @click="editFrom.subject_id = 3"
            class="fl f-align-c mr-20"
            v-if="
              !(
                loginMsg.school.school_type_id == 1 ||
                loginMsg.school.school_type_id == 6 ||
                loginMsg.school.school_type_id == 7
              )
            "
          >
            <img :src="editFrom.subject_id === 3 ? selOnG : selOffG" alt="" class="mr-18" />
            <!-- <img :src="teacherRole === 1 ? selOn : selOff" alt="" /> -->
            <span>生物</span>
          </div>
          <div
            @click="editFrom.subject_id = 4"
            class="fl f-align-c"
            v-if="
              loginMsg.school.school_type_id == 1 ||
              loginMsg.school.school_type_id == 6 ||
              loginMsg.school.school_type_id == 7
            "
          >
            <img :src="editFrom.subject_id === 4 ? selOnG : selOffG" alt="" class="mr-18" />
            <!-- <img :src="teacherRole === 1 ? selOn : selOff" alt="" /> -->
            <span>小学科学</span>
          </div>
        </div>
        <div class="mb-20" v-show="editFrom.role_ids.indexOf(4) !== -1">
          <span class="w-108 fl">执教班级:</span>
          <div class="fr school-class" v-if="allClass.length !== 0">
            <el-tabs>
              <el-tab-pane v-for="(item, index) in computedEditGrade" :key="index" :label="item.name">
                <el-check-tag
                  v-for="(item1, index1) in item.schoolClass"
                  :key="index1"
                  :checked="item1.is_true"
                  @change="item1.is_true = !item1.is_true"
                >
                  {{ item1.name }}
                </el-check-tag>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <div class="mb-20" v-show="editFrom.role_ids.indexOf(3) !== -1">
          <span class="w-108 fl">备课年级:</span>
          <div class="fr school-class">
            <el-check-tag
              v-for="(item, index) in editFrom.schoolGrade"
              :key="index"
              :checked="item.is_true"
              @change="item.is_true = !item.is_true"
            >
              {{ item.name }}
            </el-check-tag>
          </div>
        </div>
        <div class="mb-20" v-show="editFrom.role_ids.indexOf(2) !== -1">
          <span class="w-108 fl">管理实验室:</span>
          <div class="fr school-class" v-if="editFrom.subject_laborator.length !== 0">
            <el-tabs>
              <el-tab-pane v-for="(item, index) in editFrom.subject_laborator" :key="index" :label="item.name">
                <el-check-tag
                  v-for="(item1, index1) in item.laboratory"
                  :key="index1"
                  :checked="item1.is_true"
                  @change="item1.is_true = !item1.is_true"
                >
                  {{ item1.name }}
                </el-check-tag>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <div>
        <div class="fr btn green-btn ml-60" @click="editSave">保存</div>
        <div class="fr btn white-btn ml-60" @click="popState1 = false">取消</div>
      </div>
    </template>
  </PopCurrency>
  <PopCurrency :popShow="popState2" @close="popState2 = $event">
    <template v-slot:header>
      <p>查看执教班级</p>
    </template>
    <template v-slot:main>
      <div class="class_div_box">
        <div class="class_div" v-for="(item, index) in classData" :key="index">
          <div>
            <span>年级：</span>
            {{ item.GradeName }}
          </div>
          <div>
            <span>班级：</span>
            {{ item.ClassName }}
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <div>
        <div class="fr btn green-btn ml-60" @click="popState2 = false">确定</div>
      </div>
    </template>
  </PopCurrency>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import {
  getaccount,
  getSchoolClass,
  saveSchoolAccount,
  editUser,
  delUser,
  rePsw,
  uploadfileSchool
} from '@service/account/index'

import { PopCurrency } from '@components/pop-currency'
import { getGradeList } from '@service/grade/index'
import { getSubjectList } from '@service/subject/index'
import { useStore } from '@store/index'
import { BASE_URL } from '@service/request/config'
import localCache from '@/utils/localCache'
import axios from 'axios'
const dialogVisible = ref(false)
const store = useStore()
console.log(JSON.parse(JSON.stringify(store.state.login.userInfo)))
const loginMsg = JSON.parse(JSON.stringify(store.state.login.userInfo))
// import selOn from ('@assets/image/common')

// import { getTypeList } from '@/service/laboratory-standard/type-manage'
// 获取用户信息
const popState2 = ref(false)
const classData: any = ref([])
const copyAccount = (str: string) => {
  console.log(str)
  let save = function (e: any) {
    e.clipboardData.setData('text/plain', str)
    e.preventDefault() //阻止默认行为
  }
  document.addEventListener('copy', save) //添加一个copy事件
  document.execCommand('copy') //执行copy方法
  ElMessage({
    type: 'success',
    message: '复制成功!'
  })
}
const classWatch = (item: any) => {
  if (item.length !== 0) {
    console.log(item)
    classData.value = item
    popState2.value = true
  } else {
    ElMessage({
      type: 'error',
      message: '当前教师无执教班级!'
    })
  }
}
const pageData = reactive({
  page: 1,
  limit: 10,
  pro: '',
  city: '',
  area: '',
  role_id: '',
  subject_id: null,
  grade_id: null,
  subject: '',
  username: '',
  school_id: loginMsg.school_id
})
const checkRoleId = (id: number) => {
  if (id == 2 && fromData.role_ids.indexOf(5) !== -1) {
    fromData.role_ids.splice(fromData.role_ids.indexOf(5), 1)
  }
  if (id == 5 && fromData.role_ids.indexOf(2) !== -1) {
    fromData.role_ids.splice(fromData.role_ids.indexOf(2), 1)
  }
  if (fromData.role_ids.indexOf(id) === -1) {
    fromData.role_ids.push(id)
  } else {
    fromData.role_ids.splice(fromData.role_ids.indexOf(id), 1)
  }
  console.log(fromData)
}
const checkeditRoleId = (id: number) => {
  if (id == 2 && editFrom.role_ids.indexOf(5) !== -1) {
    editFrom.role_ids.splice(editFrom.role_ids.indexOf(5), 1)
  }
  if (id == 5 && editFrom.role_ids.indexOf(2) !== -1) {
    editFrom.role_ids.splice(editFrom.role_ids.indexOf(2), 1)
  }
  if (editFrom.role_ids.indexOf(id) === -1) {
    editFrom.role_ids.push(id)
  } else {
    editFrom.role_ids.splice(editFrom.role_ids.indexOf(id), 1)
  }
  console.log(editFrom)
}
const checkPhaseStudyId = (id: string) => {
  if (fromData.phase_study_id.indexOf(id) === -1) {
    fromData.phase_study_id.push(id)
  } else {
    fromData.phase_study_id.splice(fromData.phase_study_id.indexOf(id), 1)
  }
  console.log(fromData)
}
const checkeditPhaseStudyId = (id: string) => {
  if (editFrom.phase_study_id.indexOf(id) === -1) {
    editFrom.phase_study_id.push(id)
  } else {
    editFrom.phase_study_id.splice(editFrom.phase_study_id.indexOf(id), 1)
  }
  console.log(editFrom)
}

const sChange = (item: any) => {
  console.log(1111)

  console.log(item)
  getSchoolClass({ id: item.id }).then((res) => {
    console.log(res)
    fromData.schoolGrade = res.data.grades
    fromData.subject_laborator = res.data.subject_laborator
    fromData.school_type_id = item.school_type_id
    fromData.school_id = item.id
  })
}
sChange(loginMsg.school)

/*  <--  弹窗相关事件  -->  */
const fromData: any = reactive({
  login_name: '',
  username: '',
  password: '',
  sex: null,
  phone: '',
  pro: loginMsg.pro,
  city: loginMsg.city,
  area_code: loginMsg.area,
  school_code: loginMsg.school_code,
  school_id: loginMsg.school_id,
  area_level: '1,2,3',
  subject_id: 0,
  phase_study_id: [],
  role_id: null,
  role_ids: [],
  grades: [],
  subject_laborator: []
})

const popState = ref(false)
const period = ref([false, false, false])
const schoolClass1 = [
  {
    title: '一年级',
    list: [
      { name: '1班', status: false },
      { name: '2班', status: false },
      { name: '3班', status: false }
    ]
  },
  {
    title: '二年级',
    list: [
      { name: '1班', status: false },
      { name: '2班', status: false },
      { name: '3班', status: false }
    ]
  },
  {
    title: '三年级',
    list: [
      { name: '1班', status: false },
      { name: '2班', status: false },
      { name: '3班', status: false }
    ]
  },
  {
    title: '四年级',
    list: [
      { name: '1班', status: false },
      { name: '2班', status: false },
      { name: '3班', status: false }
    ]
  },
  {
    title: '五年级',
    list: [
      { name: '1班', status: false },
      { name: '2班', status: false },
      { name: '3班', status: false }
    ]
  },
  {
    title: '六年级',
    list: [
      { name: '1班', status: false },
      { name: '2班', status: false },
      { name: '3班', status: false }
    ]
  }
]
const schoolClass2 = [
  {
    title: '七年级',
    list: [
      { name: '1班', status: false },
      { name: '2班', status: false },
      { name: '3班', status: false }
    ]
  },
  {
    title: '八年级',
    list: [
      { name: '1班', status: false },
      { name: '2班', status: false },
      { name: '3班', status: false }
    ]
  },
  {
    title: '九年级',
    list: [
      { name: '1班', status: false },
      { name: '2班', status: false },
      { name: '3班', status: false }
    ]
  }
]
const schoolClass3 = [
  {
    title: '高一',
    list: [
      { name: '1班', status: false },
      { name: '2班', status: false },
      { name: '3班', status: false }
    ]
  },
  {
    title: '高二',
    list: [
      { name: '1班', status: false },
      { name: '2班', status: false },
      { name: '3班', status: false }
    ]
  },
  {
    title: '高三',
    list: [
      { name: '1班', status: false },
      { name: '2班', status: false },
      { name: '3班', status: false }
    ]
  }
]
const schoolGrade1 = [
  {
    title: '一年级',
    status: false
  },
  {
    title: '二年级',
    status: false
  },
  {
    title: '三年级',
    status: false
  },
  {
    title: '四年级',
    status: false
  },
  {
    title: '五年级',
    status: false
  },
  {
    title: '六年级',
    status: false
  }
]
const schoolGrade2 = [
  {
    title: '七年级',
    status: false
  },
  {
    title: '八年级',
    status: false
  },
  {
    title: '九年级',
    status: false
  }
]
const schoolGrade3 = [
  {
    title: '高一',
    status: false
  },
  {
    title: '高二',
    status: false
  },
  {
    title: '高三',
    status: false
  }
]

const allClass = ref([{ title: '暂无', list: [{ name: '1班', status: false }] }])
const allGrade = ref([{ title: '暂无', is_true: false }])
const allClassScreen = (value: number) => {
  period.value[value] = !period.value[value]
  let arr: any
  let arr1: any
  arr = []
  arr1 = []
  if (period.value[0]) {
    arr = [...arr, ...schoolClass1]
    arr1 = [...arr1, ...schoolGrade1]
  }
  if (period.value[1]) {
    arr = [...arr, ...schoolClass2]
    arr1 = [...arr1, ...schoolGrade2]
  }
  if (period.value[2]) {
    arr = [...arr, ...schoolClass3]
    arr1 = [...arr1, ...schoolGrade3]
  }
  console.log('111')

  console.log(arr)
  allClass.value = JSON.parse(JSON.stringify(arr))
  allGrade.value = JSON.parse(JSON.stringify(arr1))
  console.log(allClass.value)
}
allClassScreen(0)
// 新建，编辑保存
const save = () => {
  saveSchoolAccount(fromData).then((res) => {
    if (res.code === 10) {
      popState.value = false
      console.log(res)
      getList()
      ElMessage({
        type: 'success',
        message: '添加成功!'
      })
      // fromData = reactive({
      fromData.login_name = ''
      fromData.username = ''
      fromData.password = ''
      fromData.sex = null
      fromData.phone = ''
      fromData.pro = loginMsg.pro
      fromData.city = loginMsg.city
      fromData.area_code = loginMsg.area
      fromData.school_code = loginMsg.school_code
      fromData.school_id = loginMsg.school_id
      fromData.area_level = '1,2,3'
      fromData.subject_id = 0
      fromData.school_type_id = loginMsg.school.school_type_id
      fromData.role_id = null
      fromData.grades = []
      fromData.subject_laborator = []
      // })
    }
  })
}
// 编辑
const popState1 = ref(false)
const editFrom: any = reactive({
  id: null,
  role_id: null,
  role_ids: [],
  login_name: '',
  sex: null,
  username: '',
  phone: '',
  address: '',
  subject_id: '',
  phase_study_id: [],
  school_id: null,
  school_code: null,
  school: [],
  schoolGrade: [],
  subject_laborator: []
})
const edit = (id: number) => {
  console.log(id)
  editUser({ id: id }).then((res) => {
    console.log(res)
    editFrom.id = res.data.id
    editFrom.role_id = res.data.role_id
    editFrom.role_ids = res.data.role_ids
    editFrom.login_name = res.data.login_name
    editFrom.sex = res.data.sex
    editFrom.username = res.data.username
    editFrom.phone = res.data.phone
    editFrom.phase_study_id = res.data.phase_study_id ? (res.data.phase_study_id + '').split(',') : []
    editFrom.area_code = res.data.area
    editFrom.school_id = res.data.school.id
    editFrom.school_code = res.data.school.code
    editFrom.pro = res.data.pro
    editFrom.subject_id = res.data.subject_id
    editFrom.schoolGrade = res.data.schoolGrade
    editFrom.subject_laborator = res.data.subject_laborator
    let str =
      res.data.school.proName.name +
      '/' +
      res.data.school.cityName.name +
      '/' +
      res.data.school.areaName.name +
      '/' +
      res.data.school.name
    editFrom.address = str
    popState1.value = true
  })
}
const editSave = () => {
  saveSchoolAccount(editFrom).then((res) => {
    if (res.code === 10) {
      popState1.value = false
      console.log(res)
      getList()
      ElMessage({
        type: 'success',
        message: '修改成功!'
      })
    }
  })
}

const selOn = require('@images/common/sel-on.png')
const selOff = require('@images/common/sel-off.png')
const selOffG = require('@images/common/gray-ring.png')
const selOnG = require('@images/common/green-ring.png')

/*---  <------------>  ---*/

const options: any = ref([])
const getschoolgrade = () => {
  getGradeList({ school_id: loginMsg.school_id }).then((res) => {
    if (res.code === 10) {
      options.value = res.data
    }
  })
}
getschoolgrade()

const options_subjects: any = ref([])
const getSubject = () => {
  getSubjectList().then((res) => {
    if (res.code === 10) {
      options_subjects.value = res.data
    }
  })
}
getSubject()
const tableData: any = ref([])
const selChangeAll = (selection: any) => {
  console.log(JSON.parse(JSON.stringify(selection)))
  let ids = ''
  JSON.parse(JSON.stringify(selection)).forEach((e: { id: any }) => {
    ids = ids + JSON.stringify(e.id) + ','
  })
  delIds.value = ids as any
}
// 分页
const total = ref(1)
const small = ref(true)
const background = ref(true)
const disabled = ref(false)
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
  pageData.page = val
  getList()
}
// 操作
const rePassword = (id: any) => {
  console.log(id)
  ElMessageBox.confirm('确定重置选择账号的登录密码!', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'error'
  })
    .then(() => {
      rePsw({ id: id }).then((res) => {
        console.log(res)
        if (res.code === 10) {
          getList()
          ElMessage({
            type: 'success',
            message: '重置成功!'
          })
        } else {
          ElMessage({
            type: 'error',
            message: '重置失败!'
          })
        }
      })
    })
    .catch(() => {
      console.log('取消操作')
    })
}
const singleData = reactive({ data: {} as any })
// 删除单个
const delAccountSingle = (row: any) => {
  dialogVisible.value = true
  singleData.data = row
  console.log(singleData.data)
}
const delsingleSure = () => {
  delUser({ id: singleData.data.id }).then((res) => {
    console.log(res)
    if (res.code === 10) {
      dialogVisible.value = false
      getList()
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
  })
}
// 删除批量
const delAccount = (id: any) => {
  if (id === '') {
    ElMessage({
      type: 'error',
      message: '请选择要删除的数据'
    })
  } else {
    ElMessageBox.confirm('删除账号将清空账号的所有数据!', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    })
      .then(() => {
        delUser({ id: id }).then((res) => {
          console.log(res)
          if (res.code === 10) {
            getList()
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
        })
      })
      .catch(() => {
        console.log('取消操作')
      })
  }
}
// 获取账号列表
const getList = () => {
  getaccount(pageData).then((res) => {
    console.log(res)
    console.log(tableData)
    tableData.value = res.data.data
    console.log(tableData.value)
    total.value = res.data.total
  })
}

// 初始获取列表
getList()
const downloadTemplate = (url: any) => {
  window.location.href = BASE_URL + url
}
const uploadExcel = () => {
  let filedom: any = document.getElementById('uploadExcel')
  filedom.value = ''
  filedom.click()
}
const exportdata = () => {
  const token = localCache.getCookie('swr_token')
  axios
    .post(BASE_URL + '/swrserveadmin/User/exportUser', { ...pageData, token }, { responseType: 'blob' })
    .then((res) => {
      const blob = new Blob([res.data]) //处理文档流
      const fileName = '导出账号.xlsx'
      const elink = document.createElement('a')
      elink.download = fileName
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href) // 释放URL 对象
      document.body.removeChild(elink)
    })
}
const changeExcel = () => {
  let fileObj: any = (document.getElementById('uploadExcel') as any).files[0]
  let formdata = new FormData()
  formdata.append('file', fileObj)
  formdata.append('school_id', loginMsg.school_id)
  uploadfileSchool(formdata).then((res) => {
    if (res.code === 10) {
      popState1.value = false
      console.log(res)
      getList()
      ElMessage({
        type: 'success',
        message: '导入成功!'
      })
    }
  })
}
const delIds = ref([])
const selChange = (selection: any) => {
  selection = selection.map((item: any) => item.id)
  delIds.value = selection
  console.log(delIds.value)
}
const tipsNum = computed(() => (arr: any) => {
  console.log('班级', arr)
  let a = 0
  arr.forEach((e: any) => {
    if (e.is_true) {
      a = a + 1
    }
  })
  return a
})
const computedGrade = computed(() => {
  let arr = []
  if (fromData.phase_study_id.indexOf('1') !== -1) {
    arr.push(...fromData.schoolGrade.filter((item: any) => item.xu < 7))
  }
  if (fromData.phase_study_id.indexOf('2') !== -1) {
    arr.push(...fromData.schoolGrade.filter((item: any) => item.xu < 10 && item.xu > 6))
  }
  if (fromData.phase_study_id.indexOf('3') !== -1) {
    arr.push(...fromData.schoolGrade.filter((item: any) => item.xu < 13 && item.xu > 9))
  }
  return arr
})
const computedEditGrade = computed(() => {
  let arr = []

  if (editFrom.phase_study_id.indexOf('1') !== -1) {
    arr.push(...editFrom.schoolGrade.filter((item: any) => item.xu < 7))
  }
  if (editFrom.phase_study_id.indexOf('2') !== -1) {
    arr.push(...editFrom.schoolGrade.filter((item: any) => item.xu < 10 && item.xu > 6))
  }
  if (editFrom.phase_study_id.indexOf('3') !== -1) {
    arr.push(...editFrom.schoolGrade.filter((item: any) => item.xu < 13 && item.xu > 9))
  }
  return arr
})
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
        float: left;
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
.form-box {
  width: 886px;
  & > div {
    min-height: 30px;
    line-height: 30px;
    text-align: left;
    overflow: hidden;
    & > span {
      height: 100%;
    }
  }
  .school-class {
    width: 778px;
  }
  .school-class > .el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
  }
  .school-class .custom-tabs-label {
    min-width: 60px;
  }
  .school-class .el-tabs__item .custom-tabs-label .tips {
    min-width: 16px;
    float: right;
    color: #fff;
    height: 16px;
    line-height: 16px;
    border-radius: 8px;
    font-size: 12px;
    text-align: center;
    background-color: red;
  }
  .school-class .el-tabs__item .custom-tabs-label .title {
    padding: 0 12px;
    float: left;
  }
  .school-class ::v-deep .el-tabs__nav {
    height: 30px;
  }
}
.sch-box {
  display: flex;
  justify-content: space-between;
}
.font_green {
  color: #05c65d;
  cursor: pointer;
}
.class_div_box {
  width: 360px;
  & > :nth-last-child(1) {
    border: none;
  }
}
.class_div {
  width: 360px;
  height: 30px;
  line-height: 30px;
  color: #05c65d;
  border-bottom: 1px dashed #05c65d;
  div {
    float: left;
    width: 180px;
  }
  span {
    padding: 0 40rpx;
    color: #333;
  }
}
.dialog_P {
  margin: 0 auto;
  width: 60%;
  height: 40px;
  line-height: 40px;
  text-align: left;
  span {
    display: inline-block;
    width: 120px;
    text-align: left;
  }
}
.err_tip {
  margin: 20px 10% 0;
  width: 80%;
  text-align: left;
  color: rgb(189, 0, 0);
}
</style>
