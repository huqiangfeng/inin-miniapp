// pages/email//newAccessory/newAccessory.js
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
    state: '0', // 0 填写 1 发送成功 2 检测中 3 上传成功 4 上传失败
    email: '',
    captcha: '' // 验证码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 绑定input值  非双向
  bindValue(e) {
    this.data.email = e.detail.value
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  // 更改状态
  setState(e) {
    //console.log(e);
    let state = e.currentTarget.dataset.state
    this.setData({
      state
    })
    if (state === '2') {
      this.checkEmailUpload()
    }
  },
  // 完成
  succeed() {
    wx.navigateBack({
      delta: 1
    })
  },
  // 发送邮件
  sendEmail() {
    if (!util.pattern(this.data.email, 'email')) {
      wx.showToast({
        title: '请输入正确的邮箱',
        icon: 'none',
        duration: 1500
      })
      return
    }
    req_fn.req('/api/user/attachment/send-email', {
      email: this.data.email
    }, 'post').then(res => {
      //console.log(res)
      if (res.code === 0) {
        this.setData({
          state: '1',
          captcha: res.data
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


  // 检测邮件附件是否已上传
  checkEmailUpload() {
    req_fn.req('/api/user/attachment/check-email-upload', {
      email: this.data.email,
      captcha: this.data.captcha // 验证码
    }, 'post').then(res => {
      //console.log(res)
      if (res.code === 0) {
        this.setData({
          state: '3'
        })
      } else {
        this.setData({
          state: '4'
        })
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
    }).catch((err) => {
      setTimeout(() => {
        this.checkEmailUpload()
      }, 3000);
    });
  }
})