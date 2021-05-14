// pages/wenjuanShowAnswer/wenjuanShowAnswer.js
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
    isShow: true
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
        let questionList = res.data.data;
        /*this.setData({
          questionList
        });*/

        /*获取用户当前问卷选择题的答案*/
        wx.request({
          url: app.globalData.host+'/wenjuan/getAnswerByUserIdAndWjId', //仅为示例，并非真实的接口地址
          data:JSON.stringify({
            // 问卷的id
            wjId,
            userId:this.data.userId
          }),
          method: "POST",
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: (res) => {
            console.log("获取用户答案");
            console.log(res.data.data);
            let answerList = JSON.parse(res.data.data);
            let answerMap = {}
            for (let i = 0; i < answerList.length; i++) {
              // console.log(answerMap["kasjd"]===undefined);
             /* console.log(answerList[i].questionId);
              console.log(answerList[i].answerIdOrContentList);
              console.log(answerList[i].type);*/
              for (let j = 0; j < answerList[i].answerIdOrContentList.length; j++) {
                let answerItem = answerList[i].answerIdOrContentList[j];
                answerMap["answer" + answerItem] = true;
              }
            }

            /*将选择题的选项情况融入questionList*/
            for (let i = 0; i < questionList.length; i++) {
              // if (questionList[i].isNecessary === 1) {
              if (questionList[i].type===0||questionList[i].type===1) { // 单选题或多选题
                for (let j = 0; j < questionList[i].candidate.length; j++) {
                  let candidateItem = questionList[i].candidate[j];
                  if (answerMap["answer" + candidateItem.id] !== undefined) {
                    candidateItem.isSelected = answerMap["answer" + candidateItem.id];
                  }
                }
              }

              // }
            }
            // 选择题的答案已经放进questionList
            console.log(questionList);
            /*获取用户当前问卷填空题的答案*/
            wx.request({
              url: app.globalData.host+'/wenjuan/getTiankongAnswerByWjId',
              data:JSON.stringify({
                // 问卷的id
                wjId
              }),
              method: "POST",
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: (res) => {
                console.log(res.data.data);
                let tiankongAnswerList = res.data.data;
                /*tiankongAnswerObj
                * {
                *   questionId23:"问题id为23的填空题的答案"
                * }
                * */
                let tiankongAnswerObj = {};
                for (let i = 0; i < tiankongAnswerList.length; i++) {
                  let tiankongAnswerItem = tiankongAnswerList[i];
                  tiankongAnswerObj["questionId" + tiankongAnswerItem.questionId] = tiankongAnswerItem.content;
                }

                /*将填空题的答案情况融入questionList*/
                for (let i = 0; i < questionList.length; i++) {
                  // if (questionList[i].isNecessary === 1) {
                  if (questionList[i].type===2) { // 填空题
                    let tiankongItem = questionList[i];
                    if (tiankongAnswerObj["questionId" + tiankongItem.id] !== undefined) {
                      tiankongItem["value"]=tiankongAnswerObj["questionId" + tiankongItem.id];
                    }
                    questionList[i] = tiankongItem;
                  }
                  // }
                }
                // 填空题已经融入questionList的value字段
                console.log(questionList);
                this.setData({
                  questionList
                });
                console.log(this.data.questionList);
              }
            })


          }
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
