// pages/personal/personal.js

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
    peopleInfo: {},
    isLogin: false
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (util.isLogin()) {
      this.setData({
        isLogin: true
      })
      this.getInfo();
    }
  },
  getInfo() {
    //console.log('this localImg',this.data.localImg)
    req_fn.req("api/user", {}, "post").then(res => {
      if (res.code == 0) {
        let data = {
          defaultAuthEmail: res.data.defaultAuthEmail,
          defaultCardId: res.data.defaultCardId,
          logo: res.data.avatar,
          name: res.data.defaultCompanyName,
          personName: res.data.name,
          defaultCompanyPosition: res.data.defaultCompanyPosition,
          defaultAuthStatus: res.data.defaultAuthStatus,
          sendUserName: res.data.name,
          sendUserPosition: res.data.defaultCompanyPosition,
          sendUserCompany: res.data.defaultCompanyName
        };
        if(data.logo != null){
          if (data.logo.indexOf("http") == -1)
          data.logo = req_fn.imgUrl + data.logo;
          util.setLocal("card", data);
          if (res.data.avatar.indexOf("http") == -1){
            res.data.avatar = req_fn.imgUrl + res.data.avatar;
          }
          if(res.data.defaultCompanyName.length > 10){
            res.data.defaultCompanyName = res.data.defaultCompanyName.substring(0,15) + '...'
          }
            //console.log(res.data,'console')
            this.setData({
              peopleInfo: res.data
            })
            console.log(this.data.peopleInfo,'peopleInfo')
        }else{
          this.setData({
            peopleInfo: res.data
          })
        }
        
      } else if (res.code == 40001) {
        setTimeout(() => {
          this.getInfo();
        }, 1500);
      }
    });
  },
  // 去认证
  approve() {
    if (this.data.peopleInfo.defaultAuthStatus == "no")
      wx.navigateTo({
        url: "/pages/email/authentication/authentication"
      });
  },
  // 跳转页面
  changePage(e) {
    let url = e.currentTarget.dataset.url
    if (this.data.isLogin)
      wx.navigateTo({
        url: url
      });
    else {
      if (url.indexOf('authentication') > 0) {
        util.modalIsLogin('企业认证', '登录后可进行企业认证。')
      } else if (url.indexOf('myKeyword') > 0) {
        util.modalIsLogin('我的关键词', '登录后可选择我的关键词。')
      } else
        util.modalIsLogin()
    }
  },
  // 我的投递
  mySend(e) {
    //console.log(e);

    let status = e.currentTarget.dataset.status
    //console.log(status);

    if (this.data.isLogin)
      wx.navigateTo({
        url: "/pages/personalInfo/mySend/mySend?nav=" + status
      });
    else
      util.modalIsLogin()
  },
  // 跳转我的信息页面
  toMyInfo() {
    wx.navigateTo({
      url: "/pages/personalInfo/myInfo/myInfo"
    });
  },
  download() {
    // app下载页
    wx.navigateTo({
      url: "/pages/else/downloadApp/downloadApp"
    });
  }
})