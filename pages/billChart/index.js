// pages/billChart/index.js
import * as echarts from '../../components/ec-canvas/echarts';
const {getWater }=require("../../utils/getWater");
let chart = null;
let itemWidth = 0;
var option ={
  tooltip: {
      trigger: 'item',
      formatter: `{a} 
{b}: {c} ({d}%)`
  },
  legend: {
      orient: 'horizontal',
      bottom: 40,
      data: []
  },
  series: [
      {
          name: '访问来源',
          type: 'pie',
          center: ['50%', '42%'],
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
              show: false,
              position: 'center'
          },
          emphasis: {
              label: {
                  show: true,
                  fontSize: '30',
                  fontWeight: 'bold'
              }
          },
          labelLine: {
              show: false
          },
          data: []
      }
  ]
};
function initChart(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);
  chart.setOption(option);
  return chart;
}



Page({
  /**
   * 页面的初始数据
   */
  data: {
    canvasShow:true,
    sliderOffset: 0,
    sliderOffsets: [],
    sliderLeft: 0,
    tabs: ["支出", "收入"],
    tab1Index: "0",
    ec: {
      onInit: initChart
    }
  },
  clueOffset() {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        itemWidth = Math.ceil(res.windowWidth / that.data.tabs.length);
        let tempArr = [];
        for (let i in that.data.tabs) {
          tempArr.push(itemWidth * i);
        }
        // tab 样式初始化
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - 50) / 2,
          sliderOffsets: tempArr,
          sliderOffset: 0
        });
      }
    });
  },
  onTab1Click(event) {
    let index = event.currentTarget.dataset.index;
    let {incomeLegendArr,spendLegendArr,incomeArr,spendArr}=this.data
    let canvasShow=true
    if(index=='0'){
      if(spendLegendArr.length==0){
        canvasShow=false
      }
      option.legend.data=spendLegendArr
      option.series[0].data=spendArr
    }else if(index=='1'){
      if(incomeLegendArr.length==0){
        canvasShow=false
      }
      option.legend.data=incomeLegendArr
      option.series[0].data=incomeArr
    }
    this.setData({
      canvasShow,
      sliderOffset: this.data.sliderOffsets[index],
      tab1Index: index,
    },()=>{
      if(canvasShow){
        chart.setOption(option)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onReady: function (options) {
    this.clueOffset();
    this.getData()
  },
  getLastMonthData:getWater.getLastMonthData,
  async getData(){
      await this.getLastMonthData()
      //console.log(this.data.lastMonthData)
      let income={},spend={},canvasShow=true;
      const {incomeList,spendList,timeRange}=this.data.lastMonthData
      incomeList.forEach(item=>{
        if(income[item.classification]){
          income[item.classification]+=Number(item.amount)
        }else{
          income[item.classification]=0
        }
      })
      spendList.forEach(item=>{
        if(spend[item.classification]){
          spend[item.classification]+=Number(item.amount)
        }else{
          spend[item.classification]=0
        }
      })
      let incomeArr=[],spendArr=[]
      Object.keys(income).forEach(key=>{
        incomeArr.push({value:income[key],name:key})
      })
      Object.keys(spend).forEach(key=>{
        spendArr.push({value:income[key],name:key})
      })
      if(spendArr.length==0){
        canvasShow=false
      }
      option.legend.data=Object.keys(spend)
      option.series[0].data=spendArr
     
      this.setData({
        canvasShow,
        incomeLegendArr:Object.keys(income),
        spendLegendArr:Object.keys(spend),
        incomeArr,
        spendArr,
      },()=>{
        if(canvasShow){
          chart.setOption(option)
        }
      })
      wx.setNavigationBarTitle({
        title: timeRange
      })
  }
})