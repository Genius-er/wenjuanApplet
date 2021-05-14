// components/user/user.js
let startY = 0; // 手指起始的坐标
let moveY = 0; // 手指移动的实时坐标
let moveDistance = 0; // 手指移动的距离
let app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    userInfo:Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    hasUserInfo:false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleTouchStart(event) {
      // 点击时干掉回弹时的特效
      this.setData({
        coverTransition: ''
      });
      // 获取手指的起始坐标
      // console.log("handleTouchStart()");
      startY = event.touches[0].clientY;
    },

    handleTouchMove(event) {
      // 获取手指移动的实时坐标
      // console.log("handleTouchMove()");
      moveY = event.touches[0].clientY;

      // 获取手指移动的距离
      moveDistance = moveY - startY;
      // console.log(moveDistance);
      // 实时更新页面
      if (moveDistance <= 0) {
        return;
      }
      if (moveDistance >= 80) {
        moveDistance = 80;
      }
      this.setData({
        coverTransform:`translateY(${moveDistance}rpx)`
      });
    },

    handleTouchEnd() {
      // 让页面返回原态
      // console.log("handleTouchEnd()");
      this.setData({
        coverTransform:'translateY(0)',
        coverTransition:'transform 1s linear'
      })

    },

    /**
     * 跳转到问题反馈页面的回调
     */
    navigateToFeedback() {
      wx.navigateTo({
        url: '/pages/feedbackPage/feedbackPage'
      })
    },

    /**
     * 跳转到关于页面的回调
     */
    navigateToAbout() {
      wx.navigateTo({
        url: '/pages/aboutPage/aboutPage'
      })
    }
  },
  attached() {
    /*console.log(this);*/
    /*this.setData({
      userInfo: app.globalData.userInfo
    });*/
    console.log(this.properties.userInfo);
  }

})
