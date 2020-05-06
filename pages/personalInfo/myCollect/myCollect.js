// personalInfo//myCollect/myCollect.js

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
    companyLists: [],
    loading: true,
    loadingShow: false,
    listsHeight: 518
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.showLoading({
      title: "加载中"
    });
    this.getList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {


  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    if (this.data.companyLists.length + 1 % 10 > 0) return

    this.setData({
      loadingShow: true,
      loading: true
    })
    this.getList(this.data.companyLists[this.data.companyLists.length - 1].time);
  },
  getList(lastTime = "") {
    req_fn
      .req("api/user/company/collections", {
        lastTime: lastTime
      }, "post")
      .then(res => {
        //console.log("获取用户收藏的所有企业: ", res);
        if (res.code == 0) {
          if (res.data != null) this.changeAvatar(res.data);
          if (lastTime == "") {
            this.setData({
              companyLists: res.data != null ? res.data : []
            })
          } else if (res.data != null) {
            this.setData({
              loading: false,
              companyLists: [...this.data.companyLists, ...res.data]
            })
          } else {
            this.setData({
              loading: false
            })
          }

          // if (res.data.length > 9) this.getList(res.data[res.data.length].time);
        }
        wx.hideLoading();
      });
  },
  // 点击列表进入收件箱
  changeCompanyPage(e) {
    let index = e.detail.index
    //console.log(index)
    let data = this.data.companyLists[index]
    util.setLocal('companyInfo', data)
    wx.navigateTo({
      url: "/pages/email/demandCompany/demandCompany"
    });
  },
  // 点击心心
  onIconCollectEvent(e) {
    let index = e.detail.index
    let item = this.data.companyLists[index]
    let url = "";
    if (item.canSendRequirement) {
      url = "api/user/company/collection/delete";
    } else {
      url = "api/user/company/collection";
    }
    let companyLists = this.data.companyLists
    companyLists[index].canSendRequirement = !companyLists[index]
      .canSendRequirement;
    companyLists[index].grey = !companyLists[index]
      .canSendRequirement;

    this.setData({
      companyLists: companyLists
    })

    req_fn.req(url, {
      id: item.id
    }, "post").then(res => {
      if (res.code == 0) {
        // wx.showToast({
        //   title: "取消成功",
        //   icon: "success",
        //   durtation: 2000
        // });
      } else {
        wx.showToast({
          title: "操作失败",
          icon: 'none',
          duration: 1500
        });
      }
      //console.log(res);
    });
  },
  // 映射头像
  changeAvatar(arr) {
    for (let i in arr) {
      if (arr[i].logo && arr[i].logo.indexOf("http") == -1) {
        arr[i].logo = req_fn.imgUrl + arr[i].logo;
      }
      if (arr[i].logo) {
        arr[i].logo = arr[i].logo.replace(/\s/g, '')
      }

      if (arr[i].logoUrl) {
        arr[i].logoUrl = arr[i].logoUrl.replace(/\s/g, '')
      }

      // @repair 公司别名  /\W/g
      if (arr[i].statistics)
        arr[i].rename = util.getCompanName(arr[i].name)
      // arr[i].rename = arr[i].name
      // .replace(/(.*?(省|区|市))/, "")
      // .substring(0, 2);
      else arr[i].rename = "";
    }
    return arr;
  },
  // 图片加载失败
  titleImgErr(e) {
    //console.log(e.detail.index);
    let companyLists = this.data.companyLists
    companyLists[e.detail.index].logoUrl = null
    this.setData({
      companyLists: companyLists
    })
  },
})