// components/question/tiankong/tiankong.js
Component({
  behaviors: ['wx://form-field'],
  /**
   * 组件的属性列表
   */
  properties: {
    num: Number,
    question:Object,
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
    // 输入框失去焦点的回调
    inputBlur(event) {
      console.log("输入框的内容：",event.detail.value);
      this.setData({
        value:event.detail.value
      })
    }
  }
})
