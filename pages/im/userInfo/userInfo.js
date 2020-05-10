// pages/im//userInfo/userInfo.js
const req_fn = require("../../../utils/route");
const util = require("../../../utils/util");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    localImg: app.localImg,
    userVisitLogTotal: 0, // 访问数 （这些人也在看）
    keywordList: [], // 关键字
    userInfo: {}, // 用户信息
    userList: [], //用户列表
    userTagTotal: 10, //用户标签数
    userTotal: 1, // 用户数 （人脉）
    userTagList: [], //用户标签
    userVisitLogList: [], //访问列表
    keywordTotal: 0, //关键词数
    vodPages: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let userId = 'c5c8aef83bd74d94bf373e1d646020d9'
    let userId = '1227588784409804800'
    wx.showLoading({
      title: "加载中..."
    });
    req_fn
      .req(
        `/api/user/${userId}/index`, {
          id: userId
        },
        "post"
      )
      .then((res) => {
        wx.hideLoading();
        if (res.code === 0) {
          console.log(res);
          this.setData({
            userInfo: res.data.userInfo,
            userVisitLogTotal: res.data.userVisitLogTotal, // 访问数 （这些人也在看）
            keywordList: res.data.keywordList, // 关键字
            userInfo: res.data.userInfo, // 用户信息
            userList: res.data.userList, //用户列表
            userTagTotal: res.data.userTagTotal, //用户标签数
            userTotal: res.data.userTotal, // 用户数 （人脉）
            userTagList: res.data.userTagList, //用户标签
            userVisitLogList: res.data.userVisitLogList, //访问列表
            keywordTotal: res.data.keywordTotal, //关键词数
            vodPages: res.data.vodPages
          })
        }
      }).catch((err) => {
        wx.hideLoading();
      });
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