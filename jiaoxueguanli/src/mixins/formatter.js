let mixinsFormatter = {
  computed: {
    computedTeacherName() {
      return (item) => {
        return item.teacher ? item.teacher.map((e) => e.username).join(',') : ''
      }
    },
    computedClassName() {
      return (item) => {
        return item.class
          ? item.class
              .map((e) => {
                return this.$store.state.gradeArr[e.grade] + ' ' + e.name
              })
              .join(',')
          : ''
      }
    },
  },
}

export default mixinsFormatter
