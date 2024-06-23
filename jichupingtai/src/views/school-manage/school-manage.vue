<template>
  <header>
    <span>学校管理</span>
  </header>
  <main>
    <div class="sel-box">
      <div class="operation">
        <span>学校管理</span>
        <div class="button-box">
          <div class="btn green-btn" @click="popState = true">+ 新增学校</div>
          <div class="btn white-btn" @click="exportdata()">
            <img src="@assets/images/account-school/exp.png" alt="" />
            导出账号
          </div>
          <div class="btn white-btn" @click="uploadExcel()">
            <img src="@assets/images/account-school/imp.png" alt="" />
            导入账号
          </div>
          <input type="file" name="file" id="uploadExcel" @change="changeExcel()" style="display: none" />

          <div class="btn white-btn" @click="downloadTemplate('/swrserveadmin/School/downloadtpl')">
            <img src="@assets/images/account-school/imp.png" alt="" />
            下载模板
          </div>
        </div>
      </div>
      <div class="screen">
        <div class="sel-l">
          <div class="sel-item">
            <span>省:</span>
            <div class="sel">
              <el-select v-model="area1" class="m-2" placeholder="请选择" @change="areaChange1">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in options1" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </div>
          </div>
          <div class="sel-item">
            <span>市:</span>
            <div class="sel">
              <el-select v-model="area2" class="m-2" placeholder="请选择" @change="areaChange2">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in options2" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </div>
          </div>
          <div class="sel-item">
            <span>区域:</span>
            <div class="sel">
              <el-select v-model="area3" class="m-2" placeholder="请选择" @change="areaChange3">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in options3" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </div>
          </div>
          <div class="sel-item">
            <span>开启状态:</span>
            <div class="sel">
              <el-select v-model="area4" class="m-2" placeholder="请选择" @change="areaChange4">
                <el-option label="全部" value=""></el-option>
                <el-option
                  v-for="item in options4"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="sel-r">
          <div class="mt-4">
            <el-input v-model="pageData.name" placeholder="请选择" class="input-with-select">
              <template #append>
                <!-- <el-button :icon="Search"></el-button> -->
                <div class="ser-icon" @click="getPageData()">
                  <img src="@assets/images/account-school/search.png" alt="" />
                </div>
              </template>
            </el-input>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="area-box">
      <p class="area-title">区域</p>
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
                <img @click.stop="delNodeClick(node.data)" src="@assets/images/common/del-red.png" alt="" />
                <img @click.stop="editNodeClick(node.data)" src="@assets/images/common/edit.png" alt="" />
                <span @click.stop="addNodeClick(node.data)" v-show="node.data.area_level !== 3">+</span>
              </div>
            </div>
          </template>
        </el-tree>
      </div>
    </div> -->
    <div class="table-box">
      <div class="del-res">
        <!-- <span>当前共查询到</span>
      <span class="green-t">12000</span>
      <span>名教师</span> -->
        <!-- <div class="btn green-btn">
        <img src="@assets/images/account-school/w-reload.png" alt="" />
        批量重置密码
      </div> -->
        <div class="btn green-btn" @click="delBatch">
          <img src="@assets/images/account-school/w-del.png" alt="" />
          批量删除
        </div>
        <!-- <div class="btn white-btn" @click="allUpdata">
          <img src="@assets/images/common/on.png" alt="" />
          一键开启
        </div> -->
      </div>
      <el-table
        ref="multipleTableRef"
        :data="tableData"
        stripe
        style="width: 100%"
        @current-change="handleSelectionChange"
        @select-all="selChange"
        @select="selChange"
      >
        <el-table-column align="left" type="selection" width="30" />
        <el-table-column align="left" type="index" label="序号" min-width="5" />
        <el-table-column align="left" property="code" label="学校代码" min-width="15" />
        <el-table-column align="left" property="name" label="学校名称" min-width="20" />
        <el-table-column align="left" property="schoolareaName" label="区域" min-width="20" />
        <el-table-column align="left" label="学校logo" min-width="15">
          <template #default="props">
            <div>
              <span v-show="props.row.logo === ''">暂无</span>
              <el-image
                v-show="props.row.logo !== ''"
                style="width: 100px; height: 100px"
                :src="props.row.logo"
                :initial-index="4"
                fit="cover"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" property="is_open" label="开启状态" min-width="15">
          <template #default="props">
            <el-switch
              v-model="props.row.is_open"
              :active-value="1"
              :inactive-value="2"
              class="ml-2"
              active-color="#13ce66"
              inactive-color="#8f8f8f"
              @click="changeState(props.row)"
            />
          </template>
        </el-table-column>
        <el-table-column align="left" property="use_start_time" label="开通时间" min-width="20" />
        <el-table-column align="left" property="use_end_time" label="关闭时间" min-width="20" />
        <el-table-column align="left" property="userCount" label="账号数量" min-width="10" />
        <el-table-column align="center" label="操作" min-width="40">
          <template #default="props">
            <div class="operation-box">
              <div @click="rePassword1(props.row)">
                <img src="@assets/images/common/details.png" alt="" />
                <span>详情</span>
              </div>
              <div @click="rePassword(props.row)">
                <img src="@assets/images/common/edit.png" alt="" />
                <span>编辑</span>
              </div>
              <div @click="toAccount(props.row)">
                <img src="@assets/images/common/account.png" alt="" />
                <span>账号信息</span>
              </div>
              <div @click="delNodeClick(props.row)">
                <img src="@assets/images/common/del-red.png" alt="" />
                <span>删除</span>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </main>
  <footer>
    <el-pagination
      v-model:currentPage="pageData.page"
      v-model:page-size="pageData.limit"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="prev, pager, next, jumper"
      :total="pageTotal"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </footer>
  <PopCurrency :popShow="popState" @close="popState = $event">
    <template v-slot:header>
      <p>新增学校</p>
    </template>
    <template v-slot:main>
      <div class="form-box">
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            学校名称:
          </span>
          <div class="w-300 fl mr-70">
            <el-input v-model="schoolFrom.name" placeholder="请输入学校名称"></el-input>
          </div>
          <span class="w-108 fl">
            <span class="font-red">*</span>
            学校代码:
          </span>
          <div class="w-300 fl">
            <el-input v-model="schoolFrom.code" placeholder="请输入学校账号"></el-input>
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            学校类别:
          </span>
          <div class="sel-school">
            <div @click="chanege_school(1)" class="fl f-align-c mr-20">
              <img :src="schoolFrom.school_type_id === 1 ? selOnG : selOffG" alt="" class="mr-18" />
              <span>普通小学</span>
            </div>
            <div @click="chanege_school(2)" class="fl f-align-c mr-20">
              <img :src="schoolFrom.school_type_id === 2 ? selOnG : selOffG" alt="" class="mr-18" />
              <span>普通初中</span>
            </div>
            <div @click="chanege_school(3)" class="fl f-align-c mr-20">
              <img :src="schoolFrom.school_type_id === 3 ? selOnG : selOffG" alt="" class="mr-18" />
              <span>普通高中</span>
            </div>
            <div @click="chanege_school(4)" class="fl f-align-c mr-20">
              <img :src="schoolFrom.school_type_id === 4 ? selOnG : selOffG" alt="" class="mr-18" />
              <span>完全中学</span>
            </div>
            <div @click="chanege_school(5)" class="fl f-align-c mr-20">
              <img :src="schoolFrom.school_type_id === 5 ? selOnG : selOffG" alt="" class="mr-18" />
              <span>职业高中</span>
            </div>
            <div @click="chanege_school(6)" class="fl f-align-c mr-20">
              <img :src="schoolFrom.school_type_id === 6 ? selOnG : selOffG" alt="" class="mr-18" />
              <span>九年一贯制学校</span>
            </div>
            <div @click="chanege_school(7)" class="fl f-align-c">
              <img :src="schoolFrom.school_type_id === 7 ? selOnG : selOffG" alt="" class="mr-18" />
              <span>十二年一贯制学校</span>
            </div>
          </div>
        </div>
        <div
          class="mb-20"
          v-show="schoolFrom.school_type_id == 4 || schoolFrom.school_type_id == 6 || schoolFrom.school_type_id == 7"
        >
          <span class="w-108 fl">
            <span class="font-red">*</span>
            统一管理:
          </span>
          <div class="sch-box">
            <div class="w-180">
              <el-select v-model="schoolFrom.is_management" class="m-2" placeholder="选择学校所在省份">
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="2"></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            学制管理:
          </span>
          <div class="sch-box">
            <template v-for="(item1, index1) in schoolFrom.phase_studyArr" :key="index1">
              <span>{{ ['小学', '初中', '高中'][item1.phase_study_id - 1] }}:</span>
              <div class="w-180">
                <el-select v-model="item1.len" class="m-2" placeholder="请输入学制">
                  <el-option
                    v-for="item in optionsx"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </template>
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            学校轨数:
          </span>
          <div class="sch-box">
            <template v-for="(item1, index1) in schoolFrom.phase_studyArr" :key="index1">
              <span>{{ ['小学', '初中', '高中'][item1.phase_study_id - 1] }}:</span>
              <div class="w-180">
                <el-input v-model="item1.gui" placeholder="请输入具体轨数"></el-input>
              </div>
            </template>
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            学校logo:
          </span>
          <el-upload
            class="avatar-uploader"
            :action="BASE_URL + 'swrserveadmin/OssImage/uploadImage'"
            :data="fileData"
            name="image"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            accept=".jpg,.png,.jpeg"
          >
            <img v-if="schoolFrom.logo" :src="schoolFrom.logo" class="avatar" />
            <el-icon v-if="!schoolFrom.logo" class="avatar-uploader-icon"><Plus /></el-icon>
            <span v-if="schoolFrom.logo">点击切换</span>
          </el-upload>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            学校地址:
          </span>
          <div class="sch-box">
            <span>省:</span>
            <div class="w-180">
              <el-select v-model="schoolFrom.pro" class="m-2" placeholder="选择学校所在省份" @change="areaChange5">
                <el-option v-for="item in options5" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </div>
            <span>市:</span>
            <div class="w-180">
              <el-select
                v-model="schoolFrom.city"
                class="m-2"
                placeholder="选择学校所在城市"
                @change="areaChange6"
                :disabled="schoolFrom.pro === null"
              >
                <el-option v-for="item in options6" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </div>
            <span>区:</span>
            <div class="w-180">
              <el-select
                v-model="schoolFrom.area"
                class="m-2"
                @change="areaChange7"
                placeholder="选择学校所在区域"
                :disabled="schoolFrom.city === null"
              >
                <el-option v-for="item in options7" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl"></span>
          <div class="sel-school">
            <el-input v-model="schoolFrom.address" placeholder="请输入具体地址"></el-input>
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">使用期限:</span>
          <div class="sel-school">
            <el-date-picker
              v-model="value1"
              type="datetimerange"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :default-time="defaultTime1"
              value-format="YYYY-MM-DD hh:mm:ss"
              @change="dateSure"
            ></el-date-picker>
          </div>
        </div>
        <div class="mb-20 star-flex">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            学校星级:
          </span>
          <div class="w-300">
            <el-select v-model="schoolFrom.level" class="m-2" placeholder="请选择学校星级">
              <el-option v-for="item in starOptions" :key="item.id" :label="item.label" :value="item.id"></el-option>
            </el-select>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <div>
        <div class="fr btn green-btn ml-60" @click="save(schoolFrom)">保存</div>
        <div class="fr btn white-btn ml-60" @click="popState = false">取消</div>
      </div>
    </template>
  </PopCurrency>
  <PopCurrency :popShow="popState1" @close="popState1 = $event">
    <template v-slot:header>
      <p>编辑学校</p>
    </template>
    <template v-slot:main>
      <div class="form-box">
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            学校名称:
          </span>
          <div class="w-300 fl mr-70">
            <el-input v-model="schoolFrom1.name" placeholder="请输入学校账号"></el-input>
          </div>
          <span class="w-108 fl">
            <span class="font-red">*</span>
            学校代码:
          </span>
          <div class="w-300 fl">
            <el-input v-model="schoolFrom1.code" placeholder="请输入学校账号"></el-input>
          </div>
        </div>

        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            学校类别:
          </span>
          <span>
            {{ schoolFrom1.school_type_id === 1 ? '小学' : schoolFrom1.school_type_id === 2 ? '初中' : '高中' }}
          </span>
        </div>

        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            学制管理:
          </span>
          <div class="sch-box">
            <template v-for="(item1, index1) in schoolFrom1.phase_studyArr" :key="index1">
              <span>{{ ['小学', '初中', '高中'][item1.phase_study_id - 1] }}:</span>
              <div class="w-180">
                <el-select v-model="item1.len" class="m-2" placeholder="请输入学制">
                  <el-option
                    v-for="item in optionsx"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </template>
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            学校轨数:
          </span>
          <div class="sch-box">
            <template v-for="(item1, index1) in schoolFrom1.phase_studyArr" :key="index1">
              <span>{{ ['小学', '初中', '高中'][item1.phase_study_id - 1] }}:</span>
              <div class="w-180">
                <el-input v-model="item1.gui" placeholder="请输入具体轨数"></el-input>
              </div>
            </template>
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            学校logo:
          </span>
          <el-upload
            class="avatar-uploader"
            :action="BASE_URL + 'swrserveadmin/OssImage/uploadImage'"
            :data="fileData"
            name="image"
            :show-file-list="false"
            :on-success="handleAvatarSuccess1"
            :before-upload="beforeAvatarUpload1"
            accept=".jpg,.png,.jpeg"
          >
            <img v-if="schoolFrom1.logo" :src="schoolFrom1.logo" class="avatar" />
            <el-icon v-if="!schoolFrom1.logo" class="avatar-uploader-icon"><Plus /></el-icon>
            <span v-if="schoolFrom1.logo">点击切换</span>
          </el-upload>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            学校地址:
          </span>
          <div class="sch-box">
            <span>省:</span>
            <div class="w-180">
              <el-select v-model="schoolFrom1.pro" class="m-2" placeholder="选择学校所在省份" @change="areaChange8">
                <el-option v-for="item in options8" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </div>
            <span>市:</span>
            <div class="w-180">
              <el-select
                v-model="schoolFrom1.city"
                class="m-2"
                placeholder="选择学校所在城市"
                @change="areaChange9"
                :disabled="schoolFrom1.pro === null"
              >
                <el-option v-for="item in options9" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </div>
            <span>区域:</span>
            <div class="w-180">
              <el-select v-model="schoolFrom1.area" class="m-2" placeholder="选择学校所在区域" @change="areaChange10">
                <el-option
                  v-for="item in options10"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                  :disabled="schoolFrom1.city === null"
                ></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl"></span>
          <div class="sel-school">
            <el-input v-model="schoolFrom1.address" placeholder="请输入具体地址"></el-input>
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">使用期限:</span>
          <div class="sel-school">
            <el-date-picker
              v-model="value2"
              type="datetimerange"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :default-time="defaultTime1"
              value-format="YYYY-MM-DD hh:mm:ss"
              @change="dateSure"
            ></el-date-picker>
          </div>
        </div>
        <div class="mb-20 star-flex">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            学校星级:
          </span>
          <div>
            <el-select v-model="schoolFrom1.level" class="m-2" placeholder="请选择学校星级" style="width: 400px">
              <el-option v-for="item in starOptions" :key="item.id" :label="item.label" :value="item.id"></el-option>
            </el-select>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <div>
        <div class="fr btn green-btn ml-60" @click="save(schoolFrom1)">保存</div>
        <div class="fr btn white-btn ml-60" @click="popState1 = false">取消</div>
      </div>
    </template>
  </PopCurrency>
  <PopCurrency :popShow="popState2" @close="popState2 = $event">
    <template v-slot:header>
      <p>学校详情</p>
    </template>
    <template v-slot:main>
      <div class="form-box">
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            学校名称:
          </span>
          <div class="w-300 fl mr-70">
            <span>{{ schoolFrom1.name }}</span>
            <!-- <el-input v-model="schoolFrom1.name" placeholder="请输入学校账号"></el-input> -->
          </div>
          <span class="w-108 fl">学校代码:</span>
          <div class="w-300 fl">
            <span>{{ schoolFrom1.code }}</span>

            <!-- <el-input v-model="schoolFrom1.code" placeholder="请输入学校账号"></el-input> -->
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            学校类别:
          </span>
          <span>
            {{
              ['小学', '初中', '高中', '完全中学', '职业高中', '九年一贯制学校', '十二年一贯制学校'][
                schoolFrom1.school_type_id - 1
              ]
            }}
          </span>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            学制:
          </span>

          <div class="sch-box">
            <template v-for="(item1, index1) in schoolFrom1.phase_studyArr" :key="index1">
              <span
                v-show="
                  schoolFrom1.school_type_id != 1 &&
                  schoolFrom1.school_type_id != 2 &&
                  schoolFrom1.school_type_id != 3 &&
                  schoolFrom1.school_type_id != 5
                "
              >
                {{ ['小学', '初中', '高中'][item1.phase_study_id - 1] }}:
              </span>
              <div class="w-180">
                <span>{{ item1.len + '年' }}</span>
              </div>
            </template>
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            学校轨数:
          </span>
          <div class="sch-box">
            <template v-for="(item1, index1) in schoolFrom1.phase_studyArr" :key="index1">
              <span>{{ ['小学', '初中', '高中'][item1.phase_study_id - 1] }}:</span>
              <div class="w-180">
                <span>{{ item1.gui + '轨' }}</span>
              </div>
            </template>
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            学校logo:
          </span>
          <el-upload
            class="avatar-uploader"
            :action="BASE_URL + 'swrserveadmin/OssImage/uploadImage'"
            :data="fileData"
            name="image"
            :show-file-list="false"
            :on-success="handleAvatarSuccess1"
            :before-upload="beforeAvatarUpload1"
            accept=".jpg,.png,.jpeg"
            disabled
          >
            <img v-if="schoolFrom1.logo" :src="schoolFrom1.logo" class="avatar" />
            <el-icon v-if="!schoolFrom1.logo" class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            学校地址:
          </span>
          <div class="sch-box">
            <span>省:</span>
            <div class="w-180">
              <el-select v-model="schoolFrom1.pro" disabled class="m-2" placeholder="选择学校所在省份">
                <el-option v-for="item in options8" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </div>
            <span>市:</span>
            <div class="w-180">
              <el-select v-model="schoolFrom1.city" class="m-2" placeholder="选择学校所在城市" disabled>
                <el-option v-for="item in options9" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </div>
            <span>区域:</span>
            <div class="w-180">
              <el-select v-model="schoolFrom1.area" class="m-2" placeholder="选择学校所在区域" disabled>
                <el-option v-for="item in options10" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">具体地址:</span>
          <div class="sel-school">
            <span>{{ schoolFrom1.address }}</span>

            <!-- <el-input v-model="schoolFrom1.address" placeholder="请输入具体地址"></el-input> -->
          </div>
        </div>
        <div class="mb-20">
          <span class="w-108 fl">使用期限:</span>
          <div class="sel-school">
            <!-- <span>{{ value2[0] + ' -' + value2[1] }}</span> -->
            <el-date-picker
              v-model="value2"
              type="datetimerange"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :default-time="defaultTime1"
              value-format="YYYY-MM-DD hh:mm:ss"
              @change="dateSure"
              :disabled="true"
            ></el-date-picker>
          </div>
        </div>
        <div class="mb-20 star-flex">
          <span class="w-108 fl">
            <span class="font-red">*</span>
            学校星级:
          </span>
          <div>
            <el-select
              v-model="schoolFrom1.level"
              class="m-2"
              placeholder="请选择学校星级"
              style="width: 400px"
              disabled
            >
              <el-option v-for="item in starOptions" :key="item.id" :label="item.label" :value="item.id"></el-option>
            </el-select>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <div>
        <div class="fr btn green-btn ml-60" @click="popState2 = false">确认</div>
        <div class="fr btn white-btn ml-60" @click="popState2 = false">取消</div>
      </div>
    </template>
  </PopCurrency>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import type { ElTable } from 'element-plus'
import { ElMessageBox, ElMessage } from 'element-plus'
import { findArea } from '@service/area/index'
import { getSchoolPageData, delSchool, saveSchool, updataStatus } from '@service/school-manage/index'
import { PopCurrency } from '@components/pop-currency'
import { uploadSchool } from '@/service/account'
import { BASE_URL } from '@/service/request/config'
import localCache from '@/utils/localCache'
import axios from 'axios'
import { Plus } from '@element-plus/icons-vue'

let router = useRouter()
const toAccount = (item: any) => {
  console.log(item)
  router.push({ name: 'TeacherManage', params: { school_id: item.id } })
}

const starOptions = ref([
  {
    label: '5星级',
    id: 1
  },
  {
    label: '4星级',
    id: 2
  },
  {
    label: '3星级',
    id: 3
  }
])
const fileData = reactive({
  token: localCache.getCookie('swr_token')
})
const imageUrl = ref('')

const handleAvatarSuccess: any = (response: any, uploadFile: { raw: Blob | MediaSource }) => {
  console.log('上传图片', response)
  schoolFrom.logo = response.data.file_url
  // schoolData.value.logo = URL.createObjectURL(uploadFile.raw!)
}

const beforeAvatarUpload: any = (rawFile: any) => {
  console.log(rawFile)
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('学校logo上传图片不能大于2M！')
    return false
  }
  return true
}
const handleAvatarSuccess1: any = (response: any, uploadFile: { raw: Blob | MediaSource }) => {
  console.log('上传图片', response)
  schoolFrom1.logo = response.data.file_url
  // schoolData.value.logo = URL.createObjectURL(uploadFile.raw!)
}

const beforeAvatarUpload1: any = (rawFile: any) => {
  console.log(rawFile)
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('学校logo上传图片不能大于2M！')
    return false
  }
  return true
}

const selOffG = require('@images/common/gray-ring.png')
const selOnG = require('@images/common/green-ring.png')

const value1 = ref('')
const value2 = ref()
const defaultTime1 = [new Date(2000, 1, 1, 12, 0, 0)] // '12:00:00'
const dateSure = (val: any) => {
  let value = JSON.parse(JSON.stringify(val))
  console.log(1111, value)
  if (value) {
    schoolFrom.use_start_time = value[0]
    schoolFrom.use_end_time = value[1]
    schoolFrom1.use_start_time = value[0]
    schoolFrom1.use_end_time = value[1]
  } else {
    schoolFrom.use_start_time = ''
    schoolFrom.use_end_time = ''
    schoolFrom1.use_start_time = ''
    schoolFrom1.use_end_time = ''
  }
}
const optionsx = [
  {
    value: 1,
    label: '一年'
  },
  {
    value: 2,
    label: '二年'
  },
  {
    value: 3,
    label: '三年'
  },
  {
    value: 4,
    label: '四年'
  },
  {
    value: 5,
    label: '五年'
  },
  {
    value: 6,
    label: '六年'
  },
  {
    value: 7,
    label: '七年'
  }
]

/********** <--- 筛选框 ---> **********/
const area1 = ref('')
const area2 = ref('')
const area3 = ref('')
const options3: any = ref([])
const options1: any = ref([])
const options2: any = ref([])
const options5: any = ref([])
const options6: any = ref([])
const options7: any = ref([])
const options8: any = ref([])
const options9: any = ref([])
const options10: any = ref([])
const options11: any = ref([])
const options12: any = ref([])
const options13: any = ref([])
const areaChange1 = () => {
  options2.value = []
  options3.value = []
  area2.value = ''
  area3.value = ''
  pageData.pro = area1.value
  pageData.city = ''
  pageData.area = ''
  getFindArea(2, area1.value, 2)
  getPageData()
}
const areaChange2 = () => {
  options3.value = []
  area3.value = ''
  pageData.city = area2.value
  pageData.area = ''
  getFindArea(3, area2.value, 3)
  getPageData()
}
const areaChange3 = () => {
  pageData.area = area3.value
  getPageData()
}
const areaChange5 = () => {
  options6.value = []
  options7.value = []
  schoolFrom.city = ''
  schoolFrom.area = ''
  getFindArea(2, schoolFrom.pro, 6)
}
const areaChange6 = () => {
  options7.value = []
  schoolFrom.area = ''
  getFindArea(3, schoolFrom.city, 7)
}
const areaChange7 = () => {
  console.log(area3)
}
const areaChange8 = () => {
  options9.value = []
  options10.value = []
  schoolFrom1.city = ''
  schoolFrom1.area = ''
  getFindArea(2, schoolFrom1.pro, 9)
}
const areaChange9 = () => {
  options10.value = []
  schoolFrom1.area = ''
  getFindArea(3, schoolFrom1.city, 10)
}
const areaChange10 = () => {
  console.log(area3)
}
const area4 = ref('')
const options4 = ref([
  {
    value: '1',
    label: '开启'
  },
  {
    value: '2',
    label: '关闭'
  }
])
const areaChange4 = () => {
  pageData.is_open = area4.value
  getPageData()
}
const getFindArea = (val: number, id: any, sel: any) => {
  findArea({ area_level: val, p_id: id }).then((res) => {
    console.log(res)
    if (sel === 1) {
      options1.value = res.data
      options5.value = res.data
      options8.value = res.data
      options11.value = res.data
    } else if (sel === 2) {
      options2.value = res.data
    } else if (sel === 3) {
      options3.value = res.data
    } else if (sel === 5) {
      options5.value = res.data
    } else if (sel === 6) {
      options6.value = res.data
    } else if (sel === 7) {
      options7.value = res.data
    } else if (sel === 8) {
      options8.value = res.data
    } else if (sel === 9) {
      options9.value = res.data
    } else if (sel === 10) {
      options10.value = res.data
    } else if (sel === 11) {
      options11.value = res.data
    } else if (sel === 12) {
      options12.value = res.data
    } else if (sel === 13) {
      options13.value = res.data
    }
  })
}
getFindArea(1, 0, 1)

const delNodeClick = (data: any) => {
  console.log(data)
  let nodeData = JSON.parse(JSON.stringify(data))
  ElMessageBox.confirm('删除将删除当前学校包括学校内的账号!', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'error'
  })
    .then(() => {
      delSchool({ id: nodeData.id }).then((res) => {
        console.log(res)
        getPageData()
      })
      ElMessage({
        type: 'success',
        message: '删除成功!'
      })
    })
    .catch(() => {
      console.log('取消操作')
    })
}
const delBatch = () => {
  if (Array.isArray(delIds.value) && !delIds.value.length) {
    ElMessage({
      type: 'error',
      message: '请选择要删除的数据'
    })
  } else {
    ElMessageBox.confirm('删除将删除当前学校包括学校内的账号!', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    })
      .then(() => {
        delSchool({ id: delIds.value }).then((res) => {
          delIds.value = []
          console.log(res)
          getPageData()
        })
        ElMessage({
          type: 'success',
          message: '删除成功!'
        })
      })
      .catch(() => {
        console.log('取消操作')
      })
  }
}

/********** <--- 获取区域结构树 ---> **********/

/********** <--- 获取区域列表 ---> **********/

// const multipleTableRef = ref<InstanceType<typeof ElTable>>()
// const tableData: User[] = [
//   {
//     date: '2016-05-03',
//     name: 'Tom',
//     address: 'No. 189, Grove St, Los Angeles'
//   }
// ]
const handleSelectionChange = (val: any) => {
  console.log(val)
}
const delIds: any = ref([])

const selChange = (selection: any, row: any) => {
  console.log(JSON.parse(JSON.stringify(selection)))
  console.log(row)
  let ids = ''
  JSON.parse(JSON.stringify(selection)).forEach((e: { id: any }) => {
    ids = ids + JSON.stringify(e.id) + ','
  })
  delIds.value = ids
}
// 分页
const pageTotal = ref(1)
const small = ref(true)
const background = ref(true)
const disabled = ref(false)

const pageData = reactive({
  limit: 10,
  page: 1,
  pro: '',
  city: '',
  area: '',
  name: '',
  is_open: ''
})

// 表格相关
const tableData = ref([])
const getPageData = () => {
  getSchoolPageData(pageData).then((res) => {
    console.log(res)
    pageTotal.value = res.data.total
    tableData.value = res.data.data
    console.log(tableData.value)
  })
}
getPageData()
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  pageData.page = val
  getPageData()
}
const changeState = (val: any) => {
  console.log(1111)
  let item = JSON.parse(JSON.stringify(val))
  console.log(item)
  updataStatus({ ids: item.id, is_open: item.is_open }).then((res) => {
    if (res.code === 10) {
      ElMessage({
        type: 'success',
        message: '修改成功!'
      })
    } else {
      getPageData()
      // ElMessage({
      //   type: 'error',
      //   message: '修改失败!'
      // })
    }
  })
}
// const allUpdata = () => {
//   updataStatus({ ids: delIds.value, is_open: 1 }).then((res) => {
//     if (res.code === 10) {
//       getPageData()
//       ElMessage({
//         type: 'success',
//         message: '修改成功!'
//       })
//     } else {
//       getPageData()
//       ElMessage({
//         type: 'error',
//         message: '修改失败!'
//       })
//     }
//   })
// }
/********** <--- 获取区域列表 ---> **********/

/*  <--  弹窗相关事件  -->  */

const popState = ref(false)
const popState1 = ref(false)
const popState2 = ref(false)
let schoolFrom: any = reactive({
  id: null, // 学校id
  name: null, // 学校名称
  code: null, // 学校code
  phase_study_id: null, // 学段id
  hase_study: null,
  school_type_id: 1, // 学校类别
  phase_studyArr: [{ phase_study_id: 1, len: 6, gui: 0, classnum: 0, studentnum: 0 }],
  school_teacher_seniority: [],
  leng: 3,
  logo: '',
  address: null, // 详细地址
  use_start_time: null, // 开始时间
  use_end_time: null, // 结束时间
  pro: null, // 省编号
  city: null, // 市
  area: null, // 区
  is_del: 0,
  is_city: null,
  is_management: 1,
  level: ''
})
const chanege_school = (val: any) => {
  schoolFrom.school_type_id = val
  schoolFrom.phase_studyArr = []
  if (val == 1) {
    schoolFrom.phase_studyArr = [{ phase_study_id: 1, len: 6, gui: 0, classnum: 0, studentnum: 0 }]
  }
  if (val == 2) {
    schoolFrom.phase_studyArr = [{ phase_study_id: 2, len: 3, gui: 0, classnum: 0, studentnum: 0 }]
  }
  if (val == 3) {
    schoolFrom.phase_studyArr = [{ phase_study_id: 3, len: 3, gui: 0, classnum: 0, studentnum: 0 }]
  }
  if (val == 4) {
    schoolFrom.phase_studyArr = [
      { phase_study_id: 2, len: 3, gui: 0, classnum: 0, studentnum: 0 },
      { phase_study_id: 3, len: 3, gui: 0, classnum: 0, studentnum: 0 }
    ]
  }
  if (val == 5) {
    schoolFrom.phase_studyArr = [{ phase_study_id: 3, len: 3, gui: 0, classnum: 0, studentnum: 0 }]
  }
  if (val == 6) {
    schoolFrom.phase_studyArr = [
      { phase_study_id: 1, len: 6, gui: 0, classnum: 0, studentnum: 0 },
      { phase_study_id: 2, len: 3, gui: 0, classnum: 0, studentnum: 0 }
    ]
  }
  if (val == 7) {
    schoolFrom.phase_studyArr = [
      { phase_study_id: 1, len: 6, gui: 0, classnum: 0, studentnum: 0 },
      { phase_study_id: 2, len: 3, gui: 0, classnum: 0, studentnum: 0 },
      { phase_study_id: 3, len: 3, gui: 0, classnum: 0, studentnum: 0 }
    ]
  }
}
let schoolFrom1: any = reactive({
  id: null,
  name: '',
  code: '',
  phase_studyArr: [],
  phase_study_id: null,
  school_type_id: 0,
  logo: '',
  school_teacher_seniority: [],
  address: '',
  use_start_time: '',
  use_end_time: '',
  is_city: 0,
  gui: null,
  pro: null,
  city: null,
  area: null,
  is_del: null,
  create_time: '',
  is_open: null,
  userCount: 0,
  level: ''
})
// 新建，编辑保存
const save = (data: any) => {
  saveSchool(data).then((res) => {
    if (res.code === 10) {
      getPageData()
      popState.value = false
      popState1.value = false
      ElMessage({
        type: 'success',
        message: '保存成功!'
      })
    }
    // else {
    //   ElMessage({
    //     message: '添加失败!请检查输入内容!',
    //     type: 'error'
    //   })
    // }
  })
  // if (areaFrom.name !== null || areaFrom.code !== null) {
  //   saveArea(areaFrom).then((res) => {
  //     if (res.code === 10) {
  //       console.log(res)
  //       getLeafTree()
  //       getPageData()
  //       areaFrom.id = null
  //       areaFrom.name = null
  //       areaFrom.name = null
  //       areaFrom.p_name = '省级区域'
  //       ElMessage({
  //         type: 'success',
  //         message: '操作成功!'
  //       })
  //     } else {
  //       ElMessage({
  //         message: '添加失败!',
  //         type: 'error'
  //       })
  //     }
  //   })
  // } else {
  //   ElMessage({
  //     message: '地区信息填写不完整!',
  //     type: 'warning'
  //   })
  // }
}

/*---  <------------>  ---*/

// 操作
const rePassword = (val: any) => {
  let nodeData = JSON.parse(JSON.stringify(val))
  schoolFrom1.address = nodeData.address
  schoolFrom1.area = nodeData.area
  schoolFrom1.code = nodeData.code
  schoolFrom1.city = nodeData.city
  schoolFrom1.create_time = nodeData.create_time
  schoolFrom1.id = nodeData.id
  schoolFrom1.phase_studyArr = nodeData.schoolPhaseStudy
  schoolFrom1.is_management = 1
  schoolFrom1.is_city = nodeData.is_city
  schoolFrom1.is_del = nodeData.is_del
  schoolFrom1.is_open = nodeData.is_open
  schoolFrom1.len = nodeData.len
  schoolFrom1.logo = nodeData.logo
  schoolFrom1.name = nodeData.name
  schoolFrom1.phase_study_id = nodeData.phase_study_id
  schoolFrom1.pro = nodeData.pro
  schoolFrom1.school_type_id = nodeData.school_type_id
  schoolFrom1.use_end_time = nodeData.use_end_time
  schoolFrom1.use_start_time = nodeData.use_start_time
  schoolFrom1.userCount = nodeData.userCount
  schoolFrom1.school_teacher_seniority = nodeData.schoolTeacherSeniority
  schoolFrom1.level = nodeData.level
  let arr = [nodeData.use_start_time, nodeData.use_end_time]
  getFindArea(1, 0, 8)
  getFindArea(2, schoolFrom1.pro, 9)
  getFindArea(3, schoolFrom1.city, 10)
  value2.value = arr
  popState1.value = true
}
const rePassword1 = (val: any) => {
  console.log(val)

  let nodeData = JSON.parse(JSON.stringify(val))
  schoolFrom1.address = nodeData.address
  schoolFrom1.area = nodeData.area
  schoolFrom1.code = nodeData.code
  schoolFrom1.city = nodeData.city
  schoolFrom1.create_time = nodeData.create_time
  schoolFrom1.phase_studyArr = nodeData.schoolPhaseStudy
  schoolFrom1.id = nodeData.id
  schoolFrom1.is_city = nodeData.is_city
  schoolFrom1.is_del = nodeData.is_del
  schoolFrom1.is_open = nodeData.is_open
  schoolFrom1.len = nodeData.len
  schoolFrom1.logo = nodeData.logo
  schoolFrom1.name = nodeData.name
  schoolFrom1.phase_study_id = nodeData.phase_study_id
  schoolFrom1.pro = nodeData.pro
  schoolFrom1.school_type_id = nodeData.school_type_id
  schoolFrom1.use_end_time = nodeData.use_end_time
  schoolFrom1.use_start_time = nodeData.use_start_time
  schoolFrom1.userCount = nodeData.userCount
  schoolFrom1.school_teacher_seniority = []
  schoolFrom1.is_management = 1
  schoolFrom1.level = nodeData.level
  getFindArea(2, schoolFrom1.pro, 9)
  getFindArea(3, schoolFrom1.city, 10)
  let arr = [nodeData.use_start_time, nodeData.use_end_time]
  value2.value = arr
  popState2.value = true
}
const downloadTemplate = (url: string) => {
  window.location.href = BASE_URL + url
}
const exportdata = () => {
  const token = localCache.getCookie('swr_token')
  axios
    .post(BASE_URL + '/swrserveadmin/School/exportData', { ...pageData, token }, { responseType: 'blob' })
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
const uploadExcel = () => {
  let filedom: any = document.getElementById('uploadExcel')
  filedom.value = ''
  filedom.click()
}

const changeExcel = () => {
  let fileObj: any = (document.getElementById('uploadExcel') as any).files[0]
  let formdata = new FormData()
  formdata.append('file', fileObj)
  uploadSchool(formdata).then((res) => {
    if (res.code === 10) {
      popState1.value = false
      console.log(res)
      getPageData()
      ElMessage({
        type: 'success',
        message: '导入成功!'
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

.area-box {
  float: left;
  width: 440px;
  margin-right: 38px;

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

// .node-l {
//   width: 100%;
//   height: 50px;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   div {
//     span {
//       margin-right: 20px;
//       float: right;
//       font-size: 20px;
//       width: 18px;
//       height: 18px;
//       line-height: 18px;
//       border: 1px solid #05c65d;
//       color: #05c65d;
//       border-radius: 100%;
//       cursor: pointer;
//     }
//   }
//   img {
//     float: right;
//     margin-right: 20px;
//     z-index: 100;
//   }
// }
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
}

.sch-box {
  display: flex;
  flex-direction: row;

  & > span {
    margin: 0 18px;
  }
}
.avatar-uploader .avatar {
  width: 64px;
  height: 64px;
  display: block;
}
.avatar-uploader .el-upload {
  border: 1px dashed #8c939d;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  // transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: #05c65d;
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 64px;
  height: 64px;
  line-height: 72px;
  text-align: center;
  border: 1px dashed #8c939d;
  border-radius: 6px;
}
.sel-school {
  float: right;
  width: 778px;
}
.star-flex {
  display: flex;
}
</style>
