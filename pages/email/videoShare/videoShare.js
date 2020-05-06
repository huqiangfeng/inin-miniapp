// pages/email/videoShare/videoShare.js
const util = require("../../../utils/util")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    playUrl:'',
    name:'',
    createTime:'',
    description:'',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.playUrl == undefined || options.playUrl == ''){
      wx.showToast({
        title:"获取视频失败",
        icon:'none',
        duration:1000
      })
    }else{
      let _createTime = util.formatTime(Number(options.createTime),true,false);
      this.setData({
        playUrl:options.playUrl,
        name:options.name,
        createTime:_createTime,
        description:options.description,
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