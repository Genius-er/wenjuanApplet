// components/questionData/duoxuanData/duoxuanData.js
import * as echarts from '../../../ec-canvas/echarts.min'

var Chart = null;
const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    num: Number,
    question: Object,
  },

  /**
   * 组件的初始数据
   */
  data: {
    ec: {
      lazyLoad: true // 延迟加载
    },
    echartsData:{},//图表的数据,
    canvasImg: null,
    isShow: true
  },
  lifetimes: {
    ready() {
      this.echartsComponnet = this.selectComponent('#xuanzePie');//一定要初始化
      this.init_echarts(); //初始化图表
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    init_echarts() {
      this.echartsComponnet.init((canvas, width, height) => {
        // 初始化图表
        Chart = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        Chart.setOption(this.getOption());
        Chart.on('finished', () => {
          console.log("渲染完成了");
          // this.handleCanvasToImg(this);
          // console.log(this.canvasImg);
          this.selectComponent('#xuanzePie').canvasToTempFilePath({
            success: res => {
              console.log("转换图片成功");
              this.setData({
                canvasImg: res.tempFilePath
              })
            },
            fail: res => console.log('转换图片失败', res)
          });
        });
        // 注意这里一定要返回 chart 实例，否则会影响事件处理等
        return Chart;
      });
    },


    getOption(){
      let data = [];
      let candidate = this.properties.question.candidate;
      // console.log("candidate///////////");
      // console.log(candidate);
      for (let i = 0; i < candidate.length; i++) {
        let dataItem = {
          value:candidate[i].selectedTime,
          name: "选项" + (i + 1)
        };
        data.push(dataItem);

      }
      var option={
        //这里是你的echarts配置项,从后端接口拿到的数据就可以使用
        backgroundColor: "#ffffff",
        // color: ["#37A2DA", "#32C5E9", "#67E0E3", "#91F2DE", "#FFDB5C", "#FF9F7F"],
        color: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
        series: [{
          label: {
            normal: {
              fontSize: 14,
              // formatter: '{b}: {c}次: {d}%',
              formatter(v) {
                let text = v.name;
                let value_format = v.value;
                let percent_format = Math.round(v.percent) + '%';
                if (text.length <= 6) {
                  return `${text}\n${value_format}\n${percent_format}`;
                } else if (text.length > 6 && text.length <= 12) {
                  return text = `${text.slice(0, 6)}\n${text.slice(6)}\n${value_format}\n${percent_format}`
                } else if (text.length > 12 && text.length <= 18) {
                  return text = `${text.slice(0, 6)}\n${text.slice(6, 12)}\n${text.slice(12)}\n${value_format}\n${percent_format}`
                } else if (text.length > 18 && text.length <= 24) {
                  return text = `${text.slice(0, 6)}\n${text.slice(6, 12)}\n${text.slice(12, 18)}\n${text.slice(18)}\n${value_format}\n${percent_format}`
                } else if (text.length > 24 && text.length <= 30) {
                  return text = `${text.slice(0, 6)}\n${text.slice(6, 12)}\n${text.slice(12, 18)}\n${text.slice(18, 24)}\n${text.slice(24)}\n${value_format}\n${percent_format}`
                } else if (text.length > 30) {
                  return text = `${text.slice(0, 6)}\n${text.slice(6, 12)}\n${text.slice(12, 18)}\n${text.slice(18, 24)}\n${text.slice(24, 30)}\n${text.slice(30)}\n${value_format}\n${percent_format}`
                }
              },
              width:50,
              overflow:"break"
            },
          },
          type: 'pie',
          center: ['50%', '50%'],
          radius: ['40%', '60%'],
          data: data/*[{
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
          }]*/
        }]
      }
      return option;
    },


    handleCanvasToImg(that){
      console.log(that);
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 260,
        height: 180,
        canvasId: 'mychart-pie',
        success: (res) => {
          console.log(res);
          that.setData({canvasImg: res.tempFilePath});
        },
        fail: (err) =>{
          console.log("失败了");
          console.log(err);
        }
      })
      ;
    }
  },



  /*attached:function () {
    this.echartsComponnet = this.selectComponent('#xuanzePie');
    this.getData(); //获取数据
  }*/
})

