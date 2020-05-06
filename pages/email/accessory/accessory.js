// pages/email//accessory/accessory.js
const req_fn = require('../../../utils/route')
const util = require('../../../utils/util')
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    localImg: app.localImg,
    imagePath: req_fn.imagePath,
    list: [],
    overlayShow: false,
    delID: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onShow: function (options) {
    this.getAttachments()
  },
  // 关闭遮罩
  hiddenOverlay() {
    this.setData({
      overlayShow: false
    })
  },
  showOverlay(e) {
    //console.log(e);
    let delID = e.currentTarget.dataset.id
    this.setData({
      overlayShow: true,
      delID: delID
    })
  },

  // 附件列表
  getAttachments() {
    req_fn.req('/api/user/attachments', {}, 'post').then(res => {
      //console.log(res)
      if (res.code === 0) {
        this.setData({
          list: this.initData(res.data)
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1500
        })
      }
    })
  },
  // 删除
  del() {
    wx.showLoading({
      title: '加载中',
    })


    req_fn.req(`/api/user/attachment/${this.data.delID}/delete`, {
      id: this.data.delID
    }, 'post').then(res => {
      wx.hideLoading()
      if (res.code === 0) {
        this.getAttachments()
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1500
        })
      }
    })
    this.hiddenOverlay()
  },
  // 查看附件
  viewAttachment(e) {
    let data = this.data.list[e.currentTarget.dataset.index]
    wx.navigateTo({
      url: "/pages/email/download/download?data=" + JSON.stringify(data)
    });
  },
  // 上传新附件
  newAccessory() {
    wx.navigateTo({
      url: '/pages/email/newAccessory/newAccessory'
    })
  },
  initData(arr) {
    arr.forEach(element => {
      element.size = (element.size / 1024).toFixed(1) + 'M　'
      element.time = util.formatTime(element.createTime, true) + ' 上传'
    });
    return arr
  }
})