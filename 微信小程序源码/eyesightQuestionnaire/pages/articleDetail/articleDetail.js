// pages/articleDetail/articleDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /*文章内容*/
    article:[]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*获取文章内容*/
    let app = getApp();
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let articleId = currentPage.options.id;

    wx.request({
      url: app.globalData.host+'/article/getArticleById', //仅为示例，并非真实的接口地址
      data:JSON.stringify({
        // 问卷的id
        id: articleId
      }),
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        console.log(res.data.data[0])
        this.setData({
          article:res.data.data[0]
        })
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
