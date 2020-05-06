// pages/personalInfo//myCard/myCard.js

const req_fn = require("../../../utils/route");
const util = require("../../../utils/util");
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    localImg: app.localImg,
    imagePath: req_fn.imagePath,
    list: [1]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  on_del(e) {
    console.log(e.currentTarget);
    wx.showModal({
      content: '确认要删除吗？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  getList(keyword = "", lastTime = "") {
    if (lastTime == "")
      wx.showLoading({
        title: "加载中..."
      });
    req_fn
      .req(
        "api/user/maybe-friends", {
          keyword: keyword,
          lastTime: lastTime
        },
        "post"
      )
      .then(res => {
        let setObj = {}
        wx.hideLoading();
        //console.log("感兴趣的好友列表: ", res);
        if (res.code == 0) {
          if (res.data != null) {
            res.data.forEach(element => {
              if (
                element.avatar != null &&
                element.avatar.indexOf("http") == -1
              ) {
                element.avatar = req_fn.imgUrl + element.avatar + "?width=50";
              }
            });
          }

          if (lastTime == "") {
            setObj.lists = res.data != null ? res.data : [];
          } else {
            // 下一页
            setObj.loading = false;
            setObj.lists = [...this.data.lists, ...res.data];
          }

          setObj.isPhone = util.pattern(keyword, "phone");
        }
        this.setData(setObj)
      })
      .catch(err => {
        wx.hideLoading();
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
})