const permissionList = [
  {
    path: '/experimentPlan',
    name: 'ExperimentPlan',
    component: 'ExperimentPlan',
    meta: {
      title: '实验教学计划',
      icon: 'experiment-plan',
      keepAlive: true,
    },
  },
  {
    path: '/myExperiment',
    name: 'MyExperiment',
    component: 'myExperiment/MyExperiment',
    meta: {
      title: '我的实验方案',
      icon: 'my-experiment',
    },
  },
  {
    path: '/subscribe',
    name: 'subscribe',
    component: 'Subscribe',
    meta: {
      title: '实验预约',
      icon: 'subscribe',
    },
  },
  {
    path: '/subscribeExamine',
    name: 'SubscribeExamine',
    component: 'SubscribeExamine',
    meta: {
      title: '实验预约审核',
      icon: 'examine',
    },
  },
  {
    path: '/examineList',
    name: 'ExamineList',
    component: 'examineList/ExamineList',
    meta: {
      title: '实验预约列表',
      icon: 'examine-list',
    },
  },
  {
    path: '/instrumentPre',
    name: 'InstrumentPre',
    component: 'Instrument/InstrumentPre',
    meta: {
      title: '仪器准备',
      icon: 'instrument',
    },
  },
  {
    path: '/experimentalRecord',
    name: 'ExperimentalRecord',
    component: 'ExperimentalRecord',
    meta: {
      title: '实验课记录',
      icon: 'experimental-record',
    },
  },
  {
    path: '/taskFeedback',
    name: 'TaskFeedback',
    component: 'TaskFeedback',
    meta: {
      title: '学生实验任务反馈',
      icon: 'taskFeedback',
    },
  },
  {
    path: '/experimentalEvaluation',
    name: 'ExperimentalEvaluation',
    component: 'ExperimentalEvaluation',
    meta: {
      title: '实验评价',
      icon: 'experimental-evaluation',
    },
  },
  {
    path: '/dataStatistics',
    name: 'DataStatistics',
    component: 'dataStatistics/DataStatistics',
    meta: {
      title: '实验数据统计',
      icon: 'data-statistics',
    },
  },
  {
    path: '/bigData',
    name: 'BigData',
    component: 'BigData',
    meta: {
      title: '',
      icon: '',
    },
  },
  // {
  //   path: '/subscribeList',
  //   name: 'SubscribeList',
  //   component: 'SubscribeList'
  // }

  // {
  //   path: '/about',
  //   name: 'About',
  //
  //
  //
  //   component: 'About'
  // },
  // {
  //   path: '/addExperment',
  //   name: 'AddExperment',
  //
  //
  //
  //   component: 'myExperiment/AddExperment',
  //   meta: {
  //     title: '新增实验教学计划'
  //   }
  // },
  // {
  //   path: '/detail',
  //   name: 'Detail',
  //
  //
  //
  //   component: 'myExperiment/Detail',
  //   meta: {
  //     title: '新增实验教学计划'
  //   }
  // },

  // {
  //   path: '/commonExp',
  //   name: 'CommonExp',
  //
  //
  //
  //   component: 'CommonExp',
  //   meta: {
  //     title: '公共实验资源'
  //   }
  // },
  // {
  //   path: '/instrumentManage',
  //   name: 'InstrumentManage',
  //
  //
  //
  //   component: 'InstrumentManage',
  //   meta: {
  //     title: '仪器管理'
  //   }
  // },
  // {
  //   path: '/dangerousGoodsManage',
  //   name: 'DangerousGoodsManage',
  //
  //
  //
  //   component: 'DangerousGoodsManage',
  //   meta: {
  //     title: '危险品管理'
  //   }
  // },
  // {
  //   path: '/teachingSetting',
  //   name: 'TeachingSetting',
  //
  //
  //
  //   component: 'TeachingSetting',
  //   meta: {
  //     title: '教学设置'
  //   }
  // }
]

export default permissionList
