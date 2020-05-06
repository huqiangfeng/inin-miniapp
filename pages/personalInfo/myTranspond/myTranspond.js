const req_fn = require("../../../utils/route");
const util = require("../../../utils/util");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    localImg: app.localImg,
    cardList: [],
    imagePath: req_fn.imagePath
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList(options.id);
  },
  getList(id) {
    req_fn
      .req("api/company/mailbox/" + id + "/forward-users", {}, "post")
      .then(res => {
        //console.log("我的投递被转发列表: ", res);
        if (res.code == 0) {
          res.data.forEach((element, i) => {
            res.data[i].time = util.formatTime(
              element.forwardTime
            );
            if (res.data[i].avatar && res.data[i].avatar.indexOf('http') == -1) {
              res.data[i].avatar = req_fn.imgUrl + res.data[i].avatar
            }
          });

          this.setData({
            cardList: res.data
          })
        }
      });
  }
})