// personalInfo//mySend/mySend.js
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
    sendData: {},
    delta: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInfo(options.id);
  },

  cancel(e) {
    let x = e.detail.x,
      y = e.detail.y;
    if (x > 5 && x < 50 && y > 35 && y < 70) {
      wx.navigateBack({
        delta: 1 // 回退前 delta(默认为1) 页面
      });
    }
  },
  getInfo(id) {
    req_fn.req("api/my/sendbox/" + id, {}, "post").then(res => {
      if (res.code == 0) {
        if (res.data.sendUserAvatar.indexOf("http") == -1)
          res.data.sendUserAvatar = req_fn.imgUrl + res.data.sendUserAvatar;
        res.data.time = util.formatTime(res.data.createTime);
        res.data.firstViewedTime = util.formatTime(
          res.data.firstViewedTime
        );
        res.data.firstTalkTime = util.formatTime(
          res.data.firstTalkTime
        );
        res.data.firstForwardTime = util.formatTime(
          res.data.firstForwardTime
        );
        res.data.keywords = res.data.keywords.split(",");
        // 附件
        if (res.data.attachment) {
          res.data.measurement = util.fileSize(
            res.data.attachment.size
          );
          res.data.fileTime = util.formatTime(
            res.data.attachment.createTime,
            true
          );
        }
        this.setData({
          sendData: res.data
        })
      }
    });
  },
  // 查看附件
  viewAttachment(e) {
    wx.navigateTo({
      url: "/pages/email/download/download?data=" + JSON.stringify(e)
    });
  }
})