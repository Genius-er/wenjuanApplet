// components/question/duoxuan/duoxuan.js
Component({
  behaviors: ['wx://form-field'],
  /**
   * 组件的属性列表
   */
  properties: {
    num: Number,
    question: Object,
    isShow: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 多选题选项发生变化的回调
    checkboxChange(e) {
      console.log('checkbox发生change事件，携带value值为：', e.detail.value)
      this.setData({
        value:e.detail.value
      })
      const items = this.data.question.candidate
      const values = e.detail.value
      for (let i = 0, lenI = items.length; i < lenI; ++i) {
        items[i].checked = false
        for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
          if (items[i].value === values[j]) {
            items[i].checked = true
            break
          }
        }
      }
      this.setData({
        items
      })
    }
  }
})
