// components/data/data.js
let app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    wenjuanList:[],
    wenjuanIsAnswerList:[],
    host:app.globalData.host

  },

  /**
   * 组件的方法列表
   */
  methods: {
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


  // 初始化请求数据
  attached:function () {
    /*获取问卷列表同wenjuan的请求*/
    wx.request({
      url: app.globalData.host+'/wenjuan/getWenjuanList', //仅为示例，并非真实的接口地址
      data: {
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        console.log(res.data);
        this.setData({
          wenjuanList: res.data.data
        });

        //TODO：这个请求需要打包，与show里面的相同
        wx.request({
          url: app.globalData.host+'/wenjuan/getWenjuanIsAnswerList',
          data: {
            userId:app.globalData.userId
          },
          method: "POST",
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: (res) => {
            console.log(res.data);
            let result = res.data.data;
            let wenjuanIsAnswerList = [];
            for (let i = 0; i < result.length; i++) {
              // console.log(wenjuanIsAnswerList.indexOf(result[i])=== -1);

              if (wenjuanIsAnswerList.indexOf(result[i].wjId)=== -1) {
                wenjuanIsAnswerList.push(result[i].wjId);
              }
            }
            console.log(wenjuanIsAnswerList);
            let wenjuanList = this.data.wenjuanList;
            for (let j = 0;j<wenjuanList.length;j++) {
              if (wenjuanIsAnswerList.indexOf(wenjuanList[j].id) !== -1) {
                wenjuanList[j].isAnswered = true;
              }
            }
            console.log(wenjuanList);
            this.setData({
              wenjuanIsAnswerList,
              wenjuanList
            });
          }


        })
      }
    })
  }
})

/*function initChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  var option = {
    backgroundColor: "#ffffff",
    color: ["#37A2DA", "#32C5E9", "#67E0E3", "#91F2DE", "#FFDB5C", "#FF9F7F"],
    series: [{
      label: {
        normal: {
          fontSize: 14
        }
      },
      type: 'pie',
      center: ['50%', '50%'],
      radius: ['40%', '60%'],
      data: [{
        value: 55,
        name: '北京'
      }, {
        value: 20,
        name: '武汉'
      }, {
        value: 10,
        name: '杭州'
      }, {
        value: 20,
        name: '广州'
      }, {
        value: 38,
        name: '上海'
      }]
    }]
  };

  chart.setOption(option);
  return chart;
}*/
