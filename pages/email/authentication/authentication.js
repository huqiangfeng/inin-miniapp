// pages/email//authentication/authentication.js
const req_fn = require("../../../utils/route");
const util = require("../../../utils/util");
const app = getApp();
let phoneTimeout
Page({

  /**
   * 页面的初始数据
   */
  data: {
    localImg: app.localImg,
    imagePath: req_fn.imagePath,
    company: {},
    timer: 60,
    isAuth: false,
    email: "", //邮箱号
    captcha: "", //验证码
    isShowSucceed: false,
    delta: 1 //回退页面
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      delta: options.delta ? Number(options.delta) : 1
    })
    this.hasAttestation();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      company: util.getLocal("card"),
    })
  },

  sumbitToPage() {
    wx.navigateBack({
      delta: this.data.delta, // 回退前 delta(默认为1) 页面
    });
  },
  // 双向绑定email
  bindInputValue(e) {
    let name = e.target ? e.target.id : e.currentTarget.id
    let value = e.detail.value
    if (value === this.data.value) {
      return
    }
    clearTimeout(phoneTimeout)
    phoneTimeout = setTimeout(() => {
      this.setData({
        [name]: value
      })
    }, 300);

  },
  // 编辑个人信息
  onEditCard() {
    wx.navigateTo({
      url: "/pages/personalInfo/myInfo/myInfo"
    });
  },
  // 获取验证码
  getCode() {
    if (this.data.email != "" && util.pattern(this.data.email, "email")) {
      if (this.data.timer == 60) {
        req_fn
          .req(
            "api/user/email-captcha", {
              companyName: this.data.company.name,
              email: this.data.email
            },
            "post"
          )
          .then(res => {
            if (res.code != 0) {
              wx.showToast({
                title: res.msg,
                icon: "none",
                duration: 2000
              });
            } else if (this.data.timer == 60) {
              var timeClear = setInterval(() => {
                this.setData({
                  timer: --this.data.timer
                })
                this.data.timer--;
                if (this.data.timer == 0) {
                  clearInterval(timeClear);
                  this.setData({
                    timer: 60
                  })
                }
              }, 1000);
            }
          });
      }
    } else {
      wx.showToast({
        title: "请填入正确的邮箱",
        icon: "none",
        duration: 2000
      });
    }
  },
  // 解绑
  relieve() {
    wx.showModal({
      title: "解绑",
      content: "是否解除该企业账号的绑定",
      cancelText: "取消",
      cancelColor: "#1882F1",
      confirmText: "确定",
      confirmColor: "#1882F1",
      success: res => {
        if (res.confirm) {
          req_fn
            .req(
              "api/user/card/" + this.data.company.defaultCardId + "/unauth", {},
              "post"
            )
            .then(res => {
              if (res.code == 0) {
                this.setData({
                  isAuth: false
                })
                wx.showToast({
                  title: "解绑成功",
                  icon: 'none',
                  duration: 1500
                });
              } else {
                wx.showToast({
                  title: res.msg,
                  icon: 'none',
                  duration: 1500
                });
              }
              //console.log(res);
            });
        } else if (res.cancel) {}
      }
    });
  },
  // 绑定
  sumbit() {
    if (
      this.data.email != "" &&
      util.pattern(this.data.email, "email") &&
      this.data.captcha != ""
    ) {
      req_fn
        .req(
          "api/user/card/" + this.data.company.defaultCardId + "/auth", {
            captcha: this.data.captcha,
            email: this.data.email
          },
          "post"
        )
        .then(res => {
          if (res.code == 0) {
            this.data.company.defaultAuthEmail = this.data.email
            util.setLocal('card', this.data.company)
            this.setData({
              isShowSucceed: true
            })
          } else {
            wx.showToast({
              title: res.msg ? res.msg : "",
              icon: "none",
              duration: 2000
            });
          }
        });
    } else {
      wx.showToast({
        title: "不能为空",
        icon: 'none',
        duration: 1500
      });
    }
  },
  // 是否认证
  hasAttestation() {
    req_fn.req("api/user/card/authed", {}, "post").then(data => {
      if (data.code == 0) {
        this.setData({
          isAuth: data.data
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