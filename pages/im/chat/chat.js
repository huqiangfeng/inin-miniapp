const util = require('../../../utils/util')
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userId: '' // 对方id
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,'chat options')
    if (options.id) {
      this.setData({
        userId: options.id
      })
    } else {
      // let str = decodeURIComponent(JSON.stringify(options.q))
      let str = decodeURIComponent(options.q)
      this.setData({
        userId: str.substring(str.indexOf('?id=') + 4)
      })
      wx.showModal({
        title: 'id',
        content: str.substring(str.indexOf('?id=') + 4),
      })
    }


    if (!!!wx.getStorageSync('Login')) {
      setTimeout(() => {
        let pages = getCurrentPages()
        let url =
          '/' +
          pages[pages.length - 1].__displayReporter.route +
          '?id=' + this.data.userId
        app.pageIndex = url
        wx.showModal({
          title: 'url',
          content: app.pageIndex,
        })
        wx.navigateTo({
          url: '/pages/home/login/login'
        })
      }, 1)
    } else if (!app.globalData.webSocket) {
      // 开启im链接
      app.conn.open();
    }
  }
})