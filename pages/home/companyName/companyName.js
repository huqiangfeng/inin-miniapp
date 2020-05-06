// pages/home/companyName/companyName.js
const util = require('../../../utils/util')
const req_fn = require('../../../utils/route')
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    companyName: '',
    url: app.pageIndex, //首页,
    amend: false,
    positionName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options);

    util.isLogin()
    let setObj = new Object()
    if (options.url) setObj.url = options.url
    if (options.name) setObj.companyName = options.name
    if (options.amend) setObj.amend = options.amend === "false" ? false : true
    this.setData(setObj)
  },

  changePage() {
    wx.redirectTo({
      url: `/pages/home/SearchCompanyName/SearchCompanyName?name=${this.data.companyName}&amend=${this.data.amend}`
    })
  },
  sumbit(e) {
    if (this.data.companyName == '') {
      wx.showToast({
        title: '公司名称不能为空',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (this.data.amend) {
      req_fn
        .req(
          'api/user/update', {
            companyName: this.data.companyName
          },
          'post'
        )
        .then(res => {
          if (res.code == 0) {
            wx.navigateBack({
              delta: 1
            })
          } else {
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2000
            })
          }
        })
    } else {
      if (this.data.positionName == '') {
        wx.showToast({
          title: '职位不能为空',
          icon: 'none',
          duration: 2000
        })
        return
      }
      req_fn
        .req(
          'api/user/card', {
            companyName: this.data.companyName
          },
          'post'
        )
        .then(data => {
          if (data.code == 0) {
            util.setLocal('companyName', true)
            if (this.data.url) {
              // 开启im链接
              app.conn.open();
              wx.reLaunch({
                url: this.data.url
              })
            } else {
              wx.reLaunch({
                url: '/pages/home/email/email'
              });
            }
          } else {
            wx.showToast({
              title: data.msg,
              icon: 'none',
              duration: 1500
            })
          }
        })

      req_fn
        .req(
          'api/user/update', {
            positionName: this.data.positionName
          },
          'post'
        )
        .then(res => {
          if (res.code == 0) {
            wx.navigateBack({
              delta: 1
            })
          } else {
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2000
            })
          }
        })
    }
  },

  onInput(e) {
    this.data.positionName = e.detail.value
  }
})