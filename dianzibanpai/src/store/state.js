const state = sessionStorage.getItem('state')
  ? JSON.parse(sessionStorage.getItem('state'))
  : {
      userMsg: {},
      schoolDate: {},
      gradeArr: [
        '',
        '一年级',
        '二年级',
        '三年级',
        '四年级',
        '五年级',
        '六年级',
        '七年级',
        '八年级',
        '九年级',
        '高一',
        '高二',
        '高三',
      ],
      weekArr: ['', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
      sectionArr: [
        '',
        '第一节',
        '第二节',
        '第三节',
        '第四节',
        '第五节',
        '第六节',
        '第七节',
        '第八节',
        '第九节',
      ],
      weekTimeArr: [
        '',
        '第一周',
        '第二周',
        '第三周',
        '第四周',
        '第五周',
        '第六周',
        '第七周',
        '第八周',
        '第九周',
        '第十周',
        '十一周',
        '十二周',
        '十三周',
        '十四周',
        '十五周',
        '十六周',
        '十七周',
        '十八周',
        '十九周',
        '二十周',
        '二十一周',
        '二十二周',
        '二十三周',
        '二十四周',
        '二十五周',
        '二十六周',
        '二十七周',
        '二十八周',
        '二十九周',
        '三十周',
        '三十一周',
        '三十二周',
        '三十三周',
        '三十四周',
        '三十六周',
        '三十周',
      ],
      labList: [],
      teacher: [],
      teacherArr: [],
      manage: [],
      classList: [],
      subjectArr: [],
    }
export default state
