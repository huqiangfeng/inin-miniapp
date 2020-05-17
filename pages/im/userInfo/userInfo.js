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
    userId: '', // 用户id
    tagsValue: '', // 标记
    dialogVisible: false, // 弹框
    imgUrl: req_fn.imgUrl,
    userVisitLogTotal: 0, // 访问数 （这些人也在看）
    userVisitLogList: [], //访问列表（这些人也在看）
    keywordList: [], // 关键字
    userInfo: {}, // 用户信息
    userList: [], // 相关人脉
    userTagTotal: 10, //用户标签数
    userTotal: 1, // 用户数 （人脉）
    userTagList: [], //用户标签
    keywordTotal: 0, //关键词数
    vodPages: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.userId) {
      this.setData({
        userId: options.userId
      })
    }
    // let userId = 'c5c8aef83bd74d94bf373e1d646020d9'
    this.getPageData()
  },
  // 获取页面数据
  getPageData() {
    let userId = this.data.userId
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
  // 绑定input值
  changeTags(e) {
    this.setData({
      tagsValue: e.detail.value
    })
  },
  // 切换添加关键词弹框
  tagsClose() {
    this.setData({
      dialogVisible: !this.data.dialogVisible,
    })
  },
  // 添加关键词
  tagsSubmit() {

    if (this.data.tagsValue.trim() === '') {
      wx.showToast({
        title: '关键词不能为空哦.',
        icon: "none",
        duration: 2000
      });
      return
    }

    req_fn
      .req(`/api/user/${this.data.userId}/tag`, {
        userId: this.data.userId,
        tagName: this.data.tagsValue
      }, "post")
      .then(res => {
        if (res.code == 0) {
          this.tagsClose()
          this.getPageData()
        } else {
          wx.showToast({
            title: res.msg,
            icon: "none",
            duration: 2000
          });
        }
      });
  },
  // 跳有关好友
  to_friend(e) {
    let type = e.currentTarget.dataset.type
    let title = '相关人脉'
    if (type == 'kk') {
      title = '同看'
      wx.navigateTo({
        url: `/pages/im/addFriend/addFriend?userId=${this.data.userId }&title=${title}`
      });
    }
  },
  // 跳用户信息
  to_userInfo(e) {
    let userId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: "/pages/im/userInfo/userInfo?userId=" + userId
    });
  },
  // 点击好友名片，跳转聊天页面
  changePage(e) {
    let id = e.currentTarget.dataset.id
    if (id) {
      wx.navigateTo({
        url: "/pages/im/chat/chat?id=" + id
      });
    } else {
      wx.showToast({
        title: "暂未开放和自己聊天",
        icon: "none",
        duration: 1500
      });
    }
    this.setData({
      isRetuen: true
    })
  },
  // 点击添加好友 friend,applying,null
  addFriend(e) {
    let index = e.currentTarget.dataset.index
    console.log(index);
    let item = this.data.userList[index]
    if (!index) {
      item = this.data.userInfo
    }
    if (item.friendStatus == null) {
      req_fn
        .req("api/user/friend-apply", {
          friendUserId: item.userId
        }, "post")
        .then(res => {
          if (res.code == 0) {
            if (index) {
              let userList = this.data.userList
              userList.forEach((element, i) => {
                if (element.userId == item.userId) {
                  userList[i].friendStatus = "applying";
                }
              });
              this.setData({
                userList: userList
              })
            } else {
              this.getPageData()
            }
          } else {
            wx.showToast({
              title: res.msg,
              icon: "none",
              duration: 2000
            });
          }
        });
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