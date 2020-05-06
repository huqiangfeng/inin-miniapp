// pages/im//map/map.js
const amapFile = require('./../../../utils/amap-wx'); //引入高德js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude: '',
    latitude: '',
    markers: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    var key = 'd99cf7c21d908110e1fafd498db355fe'
    var myAmapFun = new amapFile.AMapWX({
      key: key
    });
    myAmapFun.getRegeo({
      // iconPath: "../../img/marker.png",
      // iconWidth: 22,
      // iconHeight: 32,
      location: options.contactAddressLocation,
      success: function (data) {
        console.log(data);
        var marker = [{
          id: data[0].id,
          latitude: data[0].latitude,
          longitude: data[0].longitude,
          iconPath: data[0].iconPath,
          width: data[0].width,
          height: data[0].height
        }]
        _this.setData({
          markers: marker,
          latitude: data[0].latitude,
          longitude: data[0].longitude
        })
      },
      fail: function (info) {}
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