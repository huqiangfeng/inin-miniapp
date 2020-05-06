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
    nav: "", //viewed：被查看、talked：有意向、forward：被转发
    cardList: [],
    navList: [{
        name: '全部',
        value: ''
      },
      {
        name: '被查看',
        value: 'viewed'
      },
      {
        name: '有意向',
        value: 'talked'
      },
      {
        name: '被转发',
        value: 'forward'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      nav: options.nav
    })
    this.getList(options.nav);
  },

  // status viewed：被查看、talked：有意向、forward：被转发
  getList(status = "") {
    req_fn
      .req("api/my/sendboxes", {
        status: status
      }, "post")
      .then(res => {
        //console.log("我的投递列表: ", res);
        if (res.code == 0) {
          let cardList = res.data

          cardList.forEach((element, i) => {
            cardList[i].time = util.getDate(element.createTime);
          });
          this.setData({
            cardList: cardList
          })
        }
      });
  },
  // 导航栏切换
  changeNav(e) {
    let tab = e.detail
    //console.log(tab);
    this.setData({
      nav: tab
    })
    this.getList(tab);
  },
  // 被转发-转发列表
  forwardList(e) {
    let item = e.currentTarget.dataset.item
    if (item.statusDisplay == "被转发") {
      wx.navigateTo({
        url: "/pages/personalInfo/myTranspond/myTranspond?id=" + item.id
      });
    }
  },
  // 投递进展
  sendProgress(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: "/pages/personalInfo/mySendEvolve/mySendEvolve?id=" + id
    });
  }
})