// pages/wenjuanDetail/wenjuanDetail.js
let app = getApp();
Page({

  onShareAppMessage() {
    return {
      title: 'checkbox',
      path: 'page/component/pages/checkbox/checkbox'
    }
  },

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
    isShow:false
  },

  // 选项发生变化的回调
  checkboxChange(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)

    const items = this.data.questions[0].items
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
      }
    })


    console.log(this.data.questionList);
  },


  /**
   * 问卷提交的回调
   * @param event
   */
  submitCallback(event) {
    console.log(event.detail.value);
    let result = event.detail.value;

    // 当前用户当前问卷的答案列表
    let answerList = [];

    // 初始化notAnswerQuestionList
    this.setData({
      notAnswerQuestionList: []
    });
    /*将表单数据转换为列表的统一格式*/
    for (let questionIdInValue in result) {

      // 当前问题的id
      let questionId = questionIdInValue.split("/")[1];
      // 当前问题是否必需
      let isNecessary = questionIdInValue.split("/")[2];
      // 当前问题的类型
      let type = questionIdInValue.split("/")[3];
      // 当前问题的序号
      let questionIndex = questionIdInValue.split("/")[4];

      // console.log(result[questionIdInValue]);
      if (isNecessary==='1'&&!result[questionIdInValue]) { // 必须填的问题没填
        let notAnswerQuestionList = this.data.notAnswerQuestionList;
        notAnswerQuestionList.push(questionIndex);
        this.setData({
          notAnswerQuestionList
        });
        // console.log(result[questionIdInValue]);
        // console.log(this.data.notAnswerQuestionList);
      }

      // 当前问题答案id的列表
      let answerIdOrContentList = [];

      // 对三种题型的答案形式进行统一
      if (typeof result[questionIdInValue] === 'string') {
        answerIdOrContentList.push(result[questionIdInValue]);
      } else {
        if (result[questionIdInValue]){ // 不为空
          answerIdOrContentList = result[questionIdInValue];
        }

      }
      let answerItem = {
        questionId,
        answerIdOrContentList,
        type
      };
      answerList.push(answerItem);
    }

    /*如果notAnswerQuestionList不为空则不提交请求*/
    if (this.data.notAnswerQuestionList.length > 0) {
      console.log("必做题没做");
      console.log(this.data.notAnswerQuestionList);

      wx.showToast({
        title: '必做题：' + this.data.notAnswerQuestionList + '未做',
        icon:'none'

      });
    }else{ // 必选题做完
      console.log(answerList);
      console.log(this.data.userId);
      wx.request({
        url: app.globalData.host+'/wenjuan/wenjuanSubmit', //仅为示例，并非真实的接口地址
        data:{
          wjId: this.data.wjId,
          userId: this.data.userId,
          answerList: JSON.stringify(answerList)
        },
        method: "POST",
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: (res) => {
          console.log(res.data)
          if (res.data.code === "200") {
            wx.showToast({
              title: "提交成功",
            });
            let timeout = setTimeout(() => {
              wx.navigateBack();
            }, 1000);
            // clearTimeout(timeout);

            /*wx.redirectTo({
              url: '/pages/index/index'
            })*/


          }else {

          }
        }
      })
    }

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
