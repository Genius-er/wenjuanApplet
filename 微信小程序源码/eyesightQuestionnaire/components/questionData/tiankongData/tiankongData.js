// components/questionData/tiankongData/tiankongData.js
let app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    num: Number,
    question: Object,
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
    // 获取填空题数据的回调
    showData(e) {
      console.log(e.currentTarget.dataset.questionid);
      let url = `/pages/showTiankongDataList/showTiankongDataList?questionId=${e.currentTarget.dataset.questionid}`;
      wx.navigateTo({
        url,
      })
    }

  },
})


