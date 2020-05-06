// pages/login/login.js
const req_fn = require("../../../utils/route");
const util = require("../../../utils/util");
const app = getApp();


// //console.log(app);

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse("button.open-type.getUserInfo"), //判断小程序的API
    localImg: app.localImg, // icon图标地址
    imagePath: req_fn.imagePath,
    // 授权信息和手机
    impower: false, //show获取用户信息/获取手机号
    isProtocol: false, // 协议
    url: app.pageIndex //首页
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.hasUserInfo();
    this.setData({
      url: app.pageIndex
    })
    //console.log(app.pageIndex);

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 判断是否授权
  hasUserInfo() {
    // 获取用户的当前设置。返回值中只会出现小程序已经向用户请求过的权限
    wx.getSetting({
      success: res => {
        if (res.authSetting["scope.userInfo"]) {
          this.getCode();
        }
      }
    });
  },
  //   获取用户信息授权 button
  onGotUserInfo(res) {
    if (res.detail.errMsg === "getUserInfo:ok") {
      this.getCode();
    }
  },
  // 获取用户手机号授权 button
  getPhoneNumber(e) {
    //console.log(e);
    if (e.detail.errMsg === "getPhoneNumber:ok") {
      wx.login({
        success: data => {
          req_fn
            .req(
              "/account/weixin-applet/bind-auth-phone", {
                code: data.code,
                encryptedData: e.detail.encryptedData,
                iv: e.detail.iv
              },
              "post"
            )
            .then(res => {
              //console.log("微信手机号授权: ", res);
              if (res.code == 0) {

                wx.showToast({
                  title: "成功登录",
                  icon: "none",
                  duration: 15000
                });
                this.getCode()
                // app.globalData.islogin = 1;
              } else if (res.code == 40007 || res.code == 40008) {
                // 第三方帐号已绑定手机
                // app.globalData.islogin = 0;
              } else {
                // app.globalData.islogin = 0;
              }
              wx.showToast({
                title: res.msg != null ? res.msg : "授权成功",
                icon: "none",
                duration: 2000
              });
            })
            .catch(err => {
              //console.log(err);
              wx.showToast({
                title: "登录失败",
                icon: "none",
                duration: 2000
              });
            });
        }
      });
    }
  },

  //跳转绑定自定义手机
  changePageToLoginTel() {
    wx.navigateTo({
      url: '/pages/home/loginTel/loginTel'
    });
  },

  // 登录
  getCode() {
    req_fn
      .getToken()
      .then(res => {
        // 登录完成跳转页面
        this.successToPage()
      })
      .catch(err => {
        this.setData({
          impower: true
        })
      });
  },
  // 跳转登录协议
  changePageToLoginProtocol() {
    wx.navigateTo({
      url: '/pages/home/LoginProtocol/LoginProtocol'
    });
  },
  // 登录成功跳转页面
  successToPage() {
    // 判断是否已绑定公司
    req_fn
      .req("api/user/init-status", {}, "post")
      .then(res => {
        if (res.data.savedUserCard) {
          // 记录公司绑定
          util.setLocal("companyName", true)
          // 已绑定公司
          if (this.data.url) {
            // 开启im链接
            app.conn.open();
            wx.reLaunch({
              url: this.data.url
            });
          } else {
            wx.reLaunch({
              url: '/pages/home/email/email'
            });
          }
        } else {
          wx.reLaunch({
            url: "/pages/home/companyName/companyName"
          });
        }
      })
      .catch(err => {
        wx.reLaunch({
          url: "/pages/home/companyName/companyName"
        });
      });
  }

})