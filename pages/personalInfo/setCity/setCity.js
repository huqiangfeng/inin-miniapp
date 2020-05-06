// pages/personalInfo//setCity/setCity.js
const req_fn = require("../../../utils/route");
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 选中
  regionChecked(e) {
    let id = e.detail.id
    req_fn
      .req(
        "api/user/update", {
          areaId: id
        },
        "post"
      )
      .then(res => {
        if (res.code == 0) {
          wx.navigateBack({
            delta: 1
          });
        } else {
          wx.showToast({
            title: res.msg,
            icon: "none",
            duration: 2000
          });
        }
      });
  },
})