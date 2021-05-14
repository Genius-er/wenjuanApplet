// pages/feedbackPage/feedbackPage.js
/*
Page({

  /!**
   * 页面的初始数据
   *!/
  data: {

  },

  /!**
   * 生命周期函数--监听页面加载
   *!/
  onLoad: function (options) {

  },

  /!**
   * 生命周期函数--监听页面初次渲染完成
   *!/
  onReady: function () {

  },

  /!**
   * 生命周期函数--监听页面显示
   *!/
  onShow: function () {

  },

  /!**
   * 生命周期函数--监听页面隐藏
   *!/
  onHide: function () {

  },

  /!**
   * 生命周期函数--监听页面卸载
   *!/
  onUnload: function () {

  },

  /!**
   * 页面相关事件处理函数--监听用户下拉动作
   *!/
  onPullDownRefresh: function () {

  },

  /!**
   * 页面上拉触底事件的处理函数
   *!/
  onReachBottom: function () {

  },

  /!**
   * 用户点击右上角分享
   *!/
  onShareAppMessage: function () {

  }
})*/
let app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    contact: '',
    contant: ''
  },

  formSubmit: function (e) {
    let _that = this;
    let content = e.detail.value.opinion;
    let contact = e.detail.value.contact;
    let regPhone = /^1[3578]\d{9}$/;
    let regEmail = /^[a-z\d_\-\.]+@[a-z\d_\-]+\.[a-z\d_\-]+$/i;
    if (content == "") {
      wx.showModal({
        title: '提示',
        content: '反馈内容不能为空!',
      })
      return false
    }
    if (contact == "") {
      wx.showModal({
        title: '提示',
        content: '手机号或者邮箱不能为空!',
      })
      return false
    }
    if (contact == "" && content == "") {
      wx.showModal({
        title: '提示',
        content: '反馈内容,手机号或者邮箱不能为空!',
      })
      return false
    }
    if ((!regPhone.test(contact) && !regEmail.test(contact)) || (regPhone.test(contact) && regEmail.test(contact))) { //验证手机号或者邮箱的其中一个对
      wx.showModal({
        title: '提示',
        content: '您输入的手机号或者邮箱有误!',
      })
      return false
    } else {
      this.setData({
        loading: true
      })
      let model, system, platform;
      wx.getSystemInfo({
        success: function (res) {
          model = res.model;
          system = res.system;
          platform = res.platform;
        }
      })
      wx.request({
        url: app.globalData.host + '/user/feedbackSubmit',
        header: {
          // 'content-type': 'application/x-www-form-urlencoded'
          'content-type': 'application/json' // 默认值
        },
        data: {
          /*
          * content：反馈内容
          * contact：反馈联系方式
          * 'device_model': model, //手机型号
          'device_system ': system, //操作系统版本
          'app_version': platform  //客户端平台
          * */
          'userId': app.globalData.userId,
          'content': content,
          'contact': contact,
          'deviceModel': model, //手机型号
          'system': system, //操作系统版本
          'appVersion': platform  //客户端平台
        },
        method: 'POST',
        success: (res) => {
          console.log(res.data);
          if (res.data.code === "200"){
            this.setData({
              loading: false,
              contact: '',
              contant: ''
            })
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 1500
            })
            setTimeout(() => {
              wx.navigateBack();
            },1500);

          }
          /*let status = res.data.status;
          if (status == 1) {
            _that.setData({
              loading: false,
              contact: '',
              contant: ''
            })
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 1500
            })
          }*/
        },
        fail: function () {
          console.log("意见反馈接口调用失败")
        }
      })
    }
  },
})
