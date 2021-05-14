const app = getApp()
Page({
    data: {
        //判断小程序的API，回调，参数，组件等是否在当前版本可用。
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        userInfo: {},
        hasUserInfo: false,
        isHide: true,
        canIUseGetUserProfile: false,
    },

    onLoad: function () {
        if (wx.getUserProfile) {
            this.setData({
                canIUseGetUserProfile: true
            })
        }

        var that = this;
        // 查看是否授权
        /*wx.getSetting({
            success: function (res) {
                if (res.authSetting['scope.userInfo']) {
                    console.log("已经授权");
                    wx.getUserInfo({
                        success: function (res) {
                            console.log("userInfo：", res.userInfo);
                            that.setData({
                                userInfo: res.userInfo,
                                hasUserInfo: true
                            })
                            // 用户已经授权过,不需要显示授权页面,所以不需要改变 isHide 的值
                            // 根据自己的需求有其他操作再补充
                            wx.navigateBack(1) //返回前一页 返回前一页 返回前一页
                        }
                    });
                } else {
                    // 用户没有授权
                    // 改变 isHide 的值，显示授权页面
                    console.log("没有授权");
                    that.setData({
                        isHide: true
                    });
                }
            }
        });*/
    },

    bindGetUserInfo: function (e) {
        console.log("---点击了授权");
        console.log("---"+e.detail.userInfo);
        if (e.detail.userInfo) {
            console.log("已经授权");
            console.log(e.detail.userInfo);
            this.setData({
                userInfo: e.detail.userInfo,
                hasUserInfo: true
            })
            app.globalData.userInfo = e.detail.userInfo;
            app.globalData.hasUserInfo = true;
            wx.navigateTo({
                url:"../index/index"
            })
        }
        else {
            //用户按了拒绝按钮
            wx.showModal({
                title: '警告',
                content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
                showCancel: false,
                confirmText: '返回授权',
                success: function (res) {
                    // 用户没有授权成功，不需要改变 isHide 的值
                    if (res.confirm) {
                        console.log('用户点击了“返回授权”');
                    }
                }
            });
        }
    },
    getUserProfile: function (e) {
        wx.getUserProfile({
            desc: '用于完善用户资料',
            success: (res) => {
                this.setData({
                    userInfo: res.userInfo
                })
                app.globalData.userInfo = res.userInfo;
                app.globalData.hasUserInfo = true;
                console.log(app.globalData.userInfo);
                wx.navigateTo({
                    url:"../index/index"
                })
            },
            fail: () => {
                //用户按了拒绝按钮
                wx.showModal({
                    title: '警告',
                    content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
                    showCancel: false,
                    confirmText: '返回授权',
                    success: function (res) {
                        // 用户没有授权成功，不需要改变 isHide 的值
                        if (res.confirm) {
                            console.log('用户点击了“返回授权”');
                        }
                    }
                });
            }
        })
    },

    // 点击获取用户信息的回调
    /*getUserInfo: function (e) {
        wx.checkSession({
            fail: () => {

            },
            success: () => { // 已经登录，可把信息放在
                console.log(e)

                this.setData({
                    userInfo: e.detail.userInfo,
                    hasUserInfo: true
                })
            }
        });
    }*/
})
