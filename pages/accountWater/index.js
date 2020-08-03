
const moment = require('../../utils/moment.min.js');
const {getWater }=require("../../utils/getWater");
Page({
  data:{
    month:moment().month()+1,
    pathList:[],
  },
  onShow: function () {
    
   this.getWater()
  },
  tapEvent(e){
    let type=e.currentTarget.dataset.type
    wx.navigateTo({
      url:`/pages/accountDetail/index?type=${type}`
    })
  },
  ...getWater
})