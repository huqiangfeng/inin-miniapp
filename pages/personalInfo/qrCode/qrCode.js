// pages/personalInfo//qrCode/qrCode.js
import drawQrcode from 'weapp.qrcode.esm.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    avatar: '',
    userId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      name: options.name,
      avatar: options.avatar,
      userId: options.userId
    })
    drawQrcode({
      canvasId: 'myQrcode',
      // ctx: wx.createCanvasContext('myQrcode'),
      text: options.userId,
      width: 250,
      height: 250,
      // v1.0.0+版本支持在二维码上绘制图片
      // image: {
      //   imageResource: '',
      //   dx: 70,
      //   dy: 70,
      //   dWidth: 60,
      //   dHeight: 60
      // }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  }
})