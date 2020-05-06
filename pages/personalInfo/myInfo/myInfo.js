// personalInfo//myInfo/myInfo.js

const req_fn = require("../../../utils/route");
const util = require("../../../utils/util");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    localImg: app.localImg,
    peopleInfo: {},
    preventClick: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getInfo();
  },

  getInfo() {
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
        if (data.logo.indexOf("http") == -1)
          data.logo = req_fn.imgUrl + data.logo;
        util.setLocal("card", data);
        let peopleInfo = res.data
        if (peopleInfo.avatar.indexOf("http") == -1) {
          peopleInfo.avatar =
            req_fn.imgUrl + peopleInfo.avatar + "?width=50";
        } else if (res.code == 40001) {
          setTimeout(() => {
            this.getInfo();
          }, 1500);
        }
        this.setData({
          peopleInfo: peopleInfo
        })
      }
    });
  },
  // 调用本地头像
  getAvatar() {
    if (this.data.preventClick) {

      this.data.preventClick = false;
      wx.chooseImage({
        count: 1,
        sizeType: ["original", "compressed"],
        sourceType: ["album", "camera"],
        success: res => {
          this.data.preventClick = true;
          const tempFilePaths = res.tempFilePaths;
          // 上传头像
          wx.uploadFile({
            url: req_fn.imgUrl,
            filePath: tempFilePaths[0],
            name: "file",
            success: res1 => {
              //  更新头像
              req_fn
                .req(
                  "api/user/update", {
                    avatar: JSON.parse(res1.data).data.id
                  },
                  "post"
                )
                .then(res2 => {
                  if (res2.code == 0) {
                    this.getInfo();
                  } else {
                    wx.showToast({
                      title: res2.msg,
                      icon: "none",
                      duration: 2000
                    });
                  }
                });
            }
          });
        }
      });
      setTimeout(() => {
        this.data.preventClick = true;
      }, 2000);
    }
  },
  changeSex(e) {

    let sex = e.currentTarget.dataset.sex
    //console.log(sex);

    req_fn.req("api/user/update", {
      gender: sex
    }, "post").then(res => {
      if (res.code == 0) {
        this.getInfo();
      } else {
        wx.showToast({
          title: res.msg,
          icon: "none",
          duration: 2000
        });
      }
    });
  }
})