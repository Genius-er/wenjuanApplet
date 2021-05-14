// pages/showTiankongDataList/showTiankongDataList.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionId: null,
    dataList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let questionId = currentPage.options.questionId;
    this.setData({
      questionId
    });

    // TODO: 根据questionId获取填空题答案数据
    wx.request({
      url: app.globalData.host+'/wenjuan/getTiankongDataListByQuestionId',
      data: {
        questionId:this.data.questionId
      },
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        console.log("填空题答案数据：");
        console.log(res.data);
        this.setData({
          dataList: res.data.data
        });
      }
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
