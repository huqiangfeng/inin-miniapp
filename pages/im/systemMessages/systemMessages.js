// im//systemMessages/systemMessages.js
const req_fn = require("../../../utils/route");
const util = require("../../../utils/util");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    localImg: app.localImg,
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMsg();
  },
  getMsg() {
    req_fn.req("api/user/sys-msg", {}, "post").then(res => {
      //console.log("系统信息: ", res);
      if (res.code == 0) {

        res.data.forEach((element, i) => {
          res.data[i].time = util.formatTime(
            element.createTime,
            true
          );
        });

        this.setData({
          list: res.data
        })
      } else {
        wx.showToast({
          title: data.msg,
          icon: 'none',
          duration: 1500
        });
      }
    });
  }
})