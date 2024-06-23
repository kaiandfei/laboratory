/*
    "component":当前页面路径（如果路径为：@/views/admin/orderList，填admin/orderList即可）
    meta:{
        title:侧边栏名字,
        icon:侧边栏图标,
    }
*/
const permissionList = [
  {
    // 账户管理
    path: '/account-manage',
    name: 'AccountManage',
    component: '',
    meta: {
      title: '账户管理',
      icon: 'experiment-plan'
    },
    children: [
      {
        // 学校账户管理
        path: '/schoolAccount',
        name: 'SchoolAccount',
        component: 'account-manage/school',
        meta: {
          title: '学校账户管理'
        }
      },
      {
        // 区域账户管理
        path: '/regionAccount',
        name: 'RegionAccount',
        component: 'account-manage/region',
        meta: {
          title: '区域账户管理'
        }
      }
    ]
  },
  {
    // 学校管理
    path: '/schoolManage',
    name: 'SchoolManage',
    component: 'school-manage/school-manage',
    meta: {
      title: '学校管理',
      icon: 'experiment-plan'
    }
  },
  {
    // 权限管理
    path: '/permission-manage',
    name: 'PermissionManage',
    component: '',
    meta: {
      title: '权限管理',
      icon: 'experiment-plan'
    },
    children: [
      {
        // 角色权限
        path: '/rolePermissions',
        name: 'RolePermissions',
        component: 'authority-manage/role-permissions',
        meta: {
          title: '角色权限'
        }
      },
      {
        // 菜单列表
        path: '/menulist',
        name: 'menulist',
        component: 'authority-manage/menulist',
        meta: {
          title: '菜单列表'
        }
      }
    ]
  },
  {
    // 参考标准
    path: '/guideline',
    name: 'Guideline',
    component: '',
    meta: {
      title: '参考标准',
      icon: 'experiment-plan'
    },
    children: [
      {
        // 仪器设备参考标准
        path: '/equReferenceStandard',
        name: 'EquReferenceStandard',
        component: 'reference-standard/equ',
        meta: {
          title: '仪器设备参考标准'
        }
      },
      {
        // 实验室参考标准
        path: '/laboratoryReferenceStandard',
        name: 'LaboratoryReferenceStandard',
        component: 'reference-standard/laboratory',
        meta: {
          title: '实验室参考标准'
        }
      }
    ]
  },
  {
    // 区域管理
    path: '/area',
    name: 'Area',
    component: 'area-manage/area',
    meta: {
      title: '区域管理',
      icon: 'experiment-plan'
    }
  },
  {
    // 危化品管理
    path: '/hc-manage',
    name: 'HcManage',
    component: '',
    meta: {
      title: '危化品管理',
      icon: 'experiment-plan'
    },
    children: [
      {
        // 危化品表单
        path: '/hCInventory',
        name: 'HCInventory',
        component: 'h-c-management/h-c-inventory',
        meta: {
          title: '危化品表单'
        }
      },
      {
        // 危废物表单
        path: '/hWInventory',
        name: 'HWInventory',
        component: 'h-c-management/h-w-inventory',
        meta: {
          title: '危废物表单'
        }
      }
    ]
  },
  {
    // 教务管理
    path: '/edu-admin',
    name: 'EduAdmin',
    component: '',
    meta: {
      title: '教务管理',
      icon: 'experiment-plan'
    },
    children: [
      {
        // 教师管理
        path: '/teacherAdmin',
        name: 'TeacherAdmin',
        component: 'edu-admin/teacher-manage',
        meta: {
          title: '教师管理'
        }
      },
      {
        // 学生管理
        path: '/studentAdmin',
        name: 'StudentAdmin',
        component: 'edu-admin/student-manage',
        meta: {
          title: '学生管理'
        }
      },
      {
        // 学期管理
        path: '/semesterManage',
        name: 'SemesterManage',
        component: 'edu-admin/semester-manage',
        meta: {
          title: '学期管理'
        }
      },
      {
        // 班级管理
        path: '/gradeClass',
        name: 'GradeClass',
        component: 'edu-admin/grade-class',
        meta: {
          title: '班级管理'
        }
      }
    ]
  }
]
export default permissionList
