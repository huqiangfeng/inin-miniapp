// pages/im//friendRequest/friendRequest.js
const req_fn = require("../../../utils/route");
const util = require("../../../utils/util");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    localImg: app.localImg,
    lists: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList();
  },
  getList() {
    req_fn
      .req("api/user/friend-applies", {}, "post")
      .then(res => {
        //console.log("好友请求列表: ", res);
        if (res.code == 0) {
          res.data.forEach(element => {
            if (element.avatar.indexOf("http") == -1)
              element.avatar = req_fn.imgUrl + element.avatar;
          });
          this.setData({
            lists: res.data
          })
        }
      })
      .catch(err => {});
  },
  // 点击好友名片，跳转聊天页面
  changePage(e) {
    let userid = e.currentTarget.dataset.userid
    wx.navigateTo({
      url: "/pages/im/chat/chat?id=" + userid
    });
  },
  // 忽略/同意好友添加 friend,applying,null
  addFriend(e) {
    let index = e.currentTarget.dataset.index
    let type = e.currentTarget.dataset.type
    let item = this.data.lists[index]
    if (item.friendStatus == null) {
      req_fn
        .req(
          "api/user/friend/apply/operate", {
            applyUserId: item.userId,
            status: type
          },
          "post"
        )
        .then(res => {
          if (res.code == 0) {
            wx.showToast({
              title: type == "ignore" ? "已忽略" : "添加成功",
              icon: 'none',
              duration: 1500
            });
            this.getList();
          } else {
            wx.showToast({
              title: res.msg,
              icon: "none",
              duration: 2000
            });
          }
        });
    }
  }
})