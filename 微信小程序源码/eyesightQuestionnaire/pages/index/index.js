//index.js

//获取应用实例
let app = getApp()

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    // motto: 'Hi 开发者！',
    userInfo: {},
    userId: null,
    hasUserInfo: false, // 是否有用户信息
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    PageCur: 'article', // 当前导航到的页面

    wenjuanIsAnswerList: [] // 当前用户已经回答的问卷id

  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  // tapbar切换
  NavChange(e) {
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
  },

  onLoad: function () {
    // 判断是否授权
    if (app.globalData.hasUserInfo) { // 已经授权
      console.log("已经授权");
      //获取用户信息
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      });
      wx.checkSession({
        success: () => {
          /*不需要登录*/
          console.log("不需要登录");
          console.log(wx.getStorageSync('sessionKey'));
          console.log(wx.getStorageSync('userId'));
          console.log(app.globalData.userInfo);
          console.log({...app.globalData.userInfo});
          let userId = parseInt(wx.getStorageSync('userId'));
          /*将用户信息存入后台数据库*/
          wx.request({
            url: app.globalData.host + '/user/saveUserInfo', //接口地址
            data: {
              ...app.globalData.userInfo,// 内涵用户数据
              userId,
            },
            method: "POST",
            header: {
              'content-type': 'application/json' //默认值
            },
            success: (res) => {
              console.log(res.data)


            },
            fail: () => {

            }
          });

        },
        fail: () => {
          /*需要登录*/
          console.log("需要登录");
          wx.login({
            success: (res) => {
              console.log(res.code);
              wx.request({
                url: app.globalData.host + '/user/userLogin', //接口地址
                data: {
                  code: res.code,
                },
                method: "POST",
                header: {
                  'content-type': 'application/json' //默认值
                },
                success: (res) => {

                  console.log(res.data)
                  /*将sessionKey和userId存到本地*/
                  wx.setStorageSync('sessionKey', res.data.data.sessionKey);
                  wx.setStorageSync('userId', res.data.data.userId);
                  app.globalData.userId = res.data.data.userId;

                  this.setData({
                    userId: app.globalData.userId
                  })

                  /*将用户信息存入后台数据库*/
                  wx.request({
                    url: app.globalData.host + '/user/saveUserInfo', //接口地址
                    data: {
                      ...app.globalData.userInfo,// 内涵用户数据
                      userId:res.data.data.userId,
                    },
                    method: "POST",
                    header: {
                      'content-type': 'application/json' //默认值
                    },
                    success: (res) => {
                      console.log(res.data)


                    },
                    fail: () => {

                    }
                  });
                },
                fail: () => {

                }
              });
            }

          })
        }
      })

      /*wx.getUserInfo({
        success: (res) => {
          console.log("获取用户信息4");
          console.log(this.data.hasUserInfo);
          console.log(res);
          app.globalData.userInfo = res.userInfo
          console.log(app.globalData.userInfo);
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          });
          console.log(this.data.userInfo);
          console.log(this.data.hasUserInfo);

          wx.checkSession({
            success: () => {
              /!*不需要登录*!/
              console.log("不需要登录");
              console.log(wx.getStorageSync('sessionKey'));
              console.log(wx.getStorageSync('userId'));
              console.log(app.globalData.userInfo);
              console.log({...app.globalData.userInfo});
              let userId = parseInt(wx.getStorageSync('userId'));
              /!*将用户信息存入后台数据库*!/
              wx.request({
                url: app.globalData.host + '/user/saveUserInfo', //接口地址
                data: {
                  ...app.globalData.userInfo,// 内涵用户数据
                  userId,
                },
                method: "POST",
                header: {
                  'content-type': 'application/json' //默认值
                },
                success: (res) => {
                  console.log(res.data)


                },
                fail: () => {

                }
              });

            },
            fail: () => {
              /!*需要登录*!/
              console.log("需要登录");
              wx.login({
                success: (res) => {
                  console.log(res.code);
                  wx.request({
                    url: app.globalData.host + '/user/userLogin', //接口地址
                    data: {
                      code: res.code,
                    },
                    method: "POST",
                    header: {
                      'content-type': 'application/json' //默认值
                    },
                    success: (res) => {

                      console.log(res.data)
                      /!*将sessionKey和userId存到本地*!/
                      wx.setStorageSync('sessionKey', res.data.data.sessionKey);
                      wx.setStorageSync('userId', res.data.data.userId);
                      app.globalData.userId = res.data.data.userId;

                      this.setData({
                        userId: app.globalData.userId
                      })

                      /!*将用户信息存入后台数据库*!/
                      wx.request({
                        url: app.globalData.host + '/user/saveUserInfo', //接口地址
                        data: {
                          ...app.globalData.userInfo,// 内涵用户数据
                          userId:res.data.data.userId,
                        },
                        method: "POST",
                        header: {
                          'content-type': 'application/json' //默认值
                        },
                        success: (res) => {
                          console.log(res.data)


                        },
                        fail: () => {

                        }
                      });
                    },
                    fail: () => {

                    }
                  });
                }

              })
            }
          })
        }
      });*/
    }
    else { // 未授权，前往授权页面
      console.log("未授权");
      wx.showToast({
        title: '请授权登录！',
        icon: 'none',
        duration: 1500,
        success: function () {
          //定时器，未授权1.5秒后跳转授权页面
          setTimeout(function () {
            wx.navigateTo({
              url: '../denglu/denglu',
            })
          }, 1500);
        }
      })
    }
    /*this.setData({
      userInfo: app.globalData.userInfo,
      hasUserInfo: true
    });*/


    if (wx.getStorageSync('userId')){
      this.data.userId = wx.getStorageSync('userId');
      app.globalData.userId = wx.getStorageSync('userId');
    }




/*    // 用户已经获取授权的情况
    // 获取用户信息
    if (app.globalData.userInfo) {
      console.log("获取用户信息1");
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      });
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        console.log("获取用户信息2");
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          console.log("获取用户信息3");
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      });
    }*/

    // 判断用户是否授权登录
  /*  wx.getSetting({
      success: (res) => {
        console.log(app.globalData.userInfo);
        // 判断是否授权
        if (app.globalData.hasUserInfo) { // 已经授权
          console.log("已经授权");
          console.log(app.globalData.userInfo);
          //获取用户信息
          this.setData({
            userInfo: app.globalData.userInfo,
            hasUserInfo: true
          });
          wx.checkSession({
            success: () => {
              /!*不需要登录*!/
              console.log("不需要登录");
              console.log(wx.getStorageSync('sessionKey'));
              console.log(wx.getStorageSync('userId'));
              console.log(app.globalData.userInfo);
              console.log({...app.globalData.userInfo});
              let userId = parseInt(wx.getStorageSync('userId'));
              /!*将用户信息存入后台数据库*!/
              wx.request({
                url: app.globalData.host + '/user/saveUserInfo', //接口地址
                data: {
                  ...app.globalData.userInfo,// 内涵用户数据
                  userId,
                },
                method: "POST",
                header: {
                  'content-type': 'application/json' //默认值
                },
                success: (res) => {
                  console.log(res.data)


                },
                fail: () => {

                }
              });

            },
            fail: () => {
              /!*需要登录*!/
              console.log("需要登录");
              wx.login({
                success: (res) => {
                  console.log(res.code);
                  wx.request({
                    url: app.globalData.host + '/user/userLogin', //接口地址
                    data: {
                      code: res.code,
                    },
                    method: "POST",
                    header: {
                      'content-type': 'application/json' //默认值
                    },
                    success: (res) => {

                      console.log(res.data)
                      /!*将sessionKey和userId存到本地*!/
                      wx.setStorageSync('sessionKey', res.data.data.sessionKey);
                      wx.setStorageSync('userId', res.data.data.userId);
                      app.globalData.userId = res.data.data.userId;

                      this.setData({
                        userId: app.globalData.userId
                      })

                      /!*将用户信息存入后台数据库*!/
                      wx.request({
                        url: app.globalData.host + '/user/saveUserInfo', //接口地址
                        data: {
                          ...app.globalData.userInfo,// 内涵用户数据
                          userId:res.data.data.userId,
                        },
                        method: "POST",
                        header: {
                          'content-type': 'application/json' //默认值
                        },
                        success: (res) => {
                          console.log(res.data)


                        },
                        fail: () => {

                        }
                      });
                    },
                    fail: () => {

                    }
                  });
                }

              })
            }
          })

          /!*wx.getUserInfo({
            success: (res) => {
              console.log("获取用户信息4");
              console.log(this.data.hasUserInfo);
              console.log(res);
              app.globalData.userInfo = res.userInfo
              console.log(app.globalData.userInfo);
              this.setData({
                userInfo: res.userInfo,
                hasUserInfo: true
              });
              console.log(this.data.userInfo);
              console.log(this.data.hasUserInfo);

              wx.checkSession({
                success: () => {
                  /!*不需要登录*!/
                  console.log("不需要登录");
                  console.log(wx.getStorageSync('sessionKey'));
                  console.log(wx.getStorageSync('userId'));
                  console.log(app.globalData.userInfo);
                  console.log({...app.globalData.userInfo});
                  let userId = parseInt(wx.getStorageSync('userId'));
                  /!*将用户信息存入后台数据库*!/
                  wx.request({
                    url: app.globalData.host + '/user/saveUserInfo', //接口地址
                    data: {
                      ...app.globalData.userInfo,// 内涵用户数据
                      userId,
                    },
                    method: "POST",
                    header: {
                      'content-type': 'application/json' //默认值
                    },
                    success: (res) => {
                      console.log(res.data)


                    },
                    fail: () => {

                    }
                  });

                },
                fail: () => {
                  /!*需要登录*!/
                  console.log("需要登录");
                  wx.login({
                    success: (res) => {
                      console.log(res.code);
                      wx.request({
                        url: app.globalData.host + '/user/userLogin', //接口地址
                        data: {
                          code: res.code,
                        },
                        method: "POST",
                        header: {
                          'content-type': 'application/json' //默认值
                        },
                        success: (res) => {

                          console.log(res.data)
                          /!*将sessionKey和userId存到本地*!/
                          wx.setStorageSync('sessionKey', res.data.data.sessionKey);
                          wx.setStorageSync('userId', res.data.data.userId);
                          app.globalData.userId = res.data.data.userId;

                          this.setData({
                            userId: app.globalData.userId
                          })

                          /!*将用户信息存入后台数据库*!/
                          wx.request({
                            url: app.globalData.host + '/user/saveUserInfo', //接口地址
                            data: {
                              ...app.globalData.userInfo,// 内涵用户数据
                              userId:res.data.data.userId,
                            },
                            method: "POST",
                            header: {
                              'content-type': 'application/json' //默认值
                            },
                            success: (res) => {
                              console.log(res.data)


                            },
                            fail: () => {

                            }
                          });
                        },
                        fail: () => {

                        }
                      });
                    }

                  })
                }
              })
            }
          });*!/
        }
        else { // 未授权，前往授权页面
          console.log("未授权");
          wx.showToast({
            title: '请授权登录！',
            icon: 'none',
            duration: 1500,
            success: function () {
              //定时器，未授权1.5秒后跳转授权页面
              setTimeout(function () {
                wx.reLaunch({
                  url: '../denglu/denglu',
                })
              }, 1500);
            }
          })
        }
      }
    });*/

  },

  /*onshow: function () {
    /!*wx.request({
      url: app.globalData.host + '/user/getAnsweredList', //接口地址
      data: {
        userId: this.data.userId
      },
      method: "POST",
      header: {
        'content-type': 'application/json' //默认值
      },
      success: (res) => {
        console.log(res.data)

      },
      fail: () => {

      }
    });*!/
    console.log("onshow");

  }*/



})
