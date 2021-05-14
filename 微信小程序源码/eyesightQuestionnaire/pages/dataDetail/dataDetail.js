// pages/dataDetail/dataDetail.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 当前问卷的id
    wjId: null,
    // 当前问卷的所有问题的列表
    questionList:[],
    // 当前用户的id
    userId: null,
    // 当前用户的用户信息
    userInfo: [],
    // 不能为空的问题且为回答的列表
    notAnswerQuestionList: [],
    isShow:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let wjId = currentPage.options.id;
    this.setData({
      wjId,
      userInfo: app.globalData.userInfo,
      userId: app.globalData.userId
    });

    wx.request({
      url: app.globalData.host+'/wenjuan/getAllQuestion', //仅为示例，并非真实的接口地址
      data:JSON.stringify({
        // 问卷的id
        id: wjId
      }),
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        console.log(res.data.data);
        // _this.setQuestionList(res.data.data)
        this.setData({
          questionList:res.data.data
        });
        console.log(this.data.questionList);
      }
    })


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
