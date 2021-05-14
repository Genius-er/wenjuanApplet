// components/article/article.js
let app = getApp();
Component({
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
// 轮播图的数据
    cardCur: 0,
    /*热门文章数据*/
    hotArticleList: [],
    notHotArticleList:[],
    host:app.globalData.host


  },

  /**
   * 组件的方法列表
   */
  methods: {
    // cardSwiper
    cardSwiper(e) {
      this.setData({
        cardCur: e.detail.current
      })
    },

    formatData(articleList){
      let articleListFormat = [];
      for (let i=0;i<articleList.length;i++) {
        let articleItem = articleList[i];
        articleItem.keyword = articleItem.keyword.split("/");
        articleListFormat.push(articleItem);
      }
      return articleListFormat;
    },
    goto: function (e) {
      var url = e.currentTarget.dataset.url;
      wx.navigateTo({
        url,
      })
    },

    //手指触摸开始赋值
    touchStart: function (e) {
      this.startTime = e.timeStamp;
    },

    //手指触摸结束赋值
    touchEnd: function (e) {
      this.endTime = e.timeStamp;
    },

    // nophonefull 不管点击还是长按都会触发的事件
    nophonefull: function (e) {
      //通过判断手指触摸时间来判断是否是点击事件，当时间差小于350时，为点击事件
      if (this.endTime - this.startTime < 350) {
        this.goto(e);
      }
    },


  },

  attached: function () {
    /*从服务器拿到数据*/
    /*1、取得热门文章数据*/
    wx.request({
      url: app.globalData.host+'/article/getAllArticle', //仅为示例，并非真实的接口地址
      data: {
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        console.log(res.data);

        this.setData({
          hotArticleList:this.formatData(res.data.data.hotArticleList),
          notHotArticleList:this.formatData(res.data.data.notHotArticleList)
        });
      }
    })

    /*2、取得非热门文章数据*/

  },


})

