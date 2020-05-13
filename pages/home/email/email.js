// pages/inbox/inbox.js

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
    companyName: "",
    companyLists: [],
    companyInfo: null,
    login: false,
    overlayShow: false,
    currentSendIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let me = this;

    if (util.isLogin()) {
      // 发送链接请求
      app.conn.open();
    }
    // 注册全局方法，接收消息
    app.onMessage = e => {
      wx.showTabBarRedDot({
        index: 0,
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.companyLists.length > 0) this.getData();
    else this.initPage();
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
    wx.showLoading({
      title: "加载中"
    });
    this.getCollectList(this.data.companyLists[this.data.companyLists.length - 1].time);
  },
  // 跳到搜索页
  onChangePageSearch(e) {
    // this.getCompanyId();
    wx.navigateTo({
      url: "/pages/email/search/search"
    });
  },
  // 点击列表进入收件箱
  onChangeCompanyPage(e) {
    let index = e.detail.index
    //console.log(index)
    let data = this.data.companyLists[index]
    util.setLocal('companyInfo', data)
    wx.navigateTo({
      url: "/pages/email/demandCompany/demandCompany"
    });
  },
  // 显示modal
  showModal(e) {
    this.setData({
      overlayShow: true,
      currentSendIndex: e.detail.index
    });
  },
  onClickHide() {
    this.setData({
      overlayShow: false
    });
  },
  visitEvent() {
    let index = this.data.currentSendIndex;
    let companyItem = this.data.companyLists[index];
    //console.log(companyItem,'companyItem')
    let companyName, companyID, logo, userName;
    companyName = companyItem.statistics.companyName;
    companyID = companyItem.statistics.companyId;
    userName = companyItem.rename;
    logo = companyItem.logoUrl;
    wx.navigateTo({
      url: '/pages/email/visitHome/visitHome?companyName=' + companyName + '&companyID=' + companyID + '&logo=' + logo + '&userName=' + userName
    })
  },
  cooperationEvent() {
    this.onIconSendEvent()
    this.setData({
      overlayShow: false
    })
  },
  // 一键投递
  onIconSendEvent() {
    let index = this.data.currentSendIndex;
    let companyItem = this.data.companyLists[index]
    if (companyItem.canSendRequirement) {
      // let companyInfo = this.data.companyInfo;
      let companyInfo = util.getLocal("card");
      // 判断有无公司信息
      if (!companyInfo) {
        this.getCompanyId();
        wx.showToast({
          title: "请稍后重试",
          icon: "none",
          duration: 2000
        });
      } else {
        companyInfo.companyId = companyItem.statistics.companyId;
        companyInfo.nameCompany = companyItem.statistics.name;
        req_fn.req("api/user/card/authed", {}, "post").then(res => {
          if (res.code == 0) {
            // if (res.data) {
            let tempString = JSON.stringify(companyInfo);
            wx.navigateTo({
              url: "/pages/email/outDemandCard/outDemandCard?companyInfo=" + encodeURIComponent(tempString)
            });

            return;
            // } else {
            //   //未认证的情况下跳转认证页面
            //   wx.navigateTo({
            //     url: "/pages/email/authentication/authentication?companyItem=" +
            //       JSON.stringify(companyItem)
            //   });
            // }
          } else {
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 1500
            });
          }
        });
      }
    } else {
      wx.showToast({
        title: "24小时内不能重复投递",
        icon: "none",
        durtation: 2000
      });
    }
  },
  // 获取绑定名片信息
  getCompanyId() {
    wx.showLoading({
      title: "加载中"
    });

    req_fn.req("api/user", {}, "post").then(res => {
      wx.hideLoading();
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
          sendUserCompany: res.data.defaultCompanyName,
          userShortId: res.data.userShortId,
          userId: res.data.userId
        };
        if (data.logo != null) {
          if (data.logo.indexOf("http") == -1) {
            data.logo = req_fn.imgUrl + data.logo;
          }
        }
        util.setLocal("card", data);
        this.setData({
          companyInfo: data
        })
      } else if (res.code == 40001) {
        setTimeout(() => {
          this.initPage();
        }, 1500);
      }
    });
  },
  // 获取收件箱名片列表
  getData() {
    let _this = this
    wx.showLoading({
      title: "加载中"
    });

    let companies = this.getCompaniesList()
    let collect = this.getCollectList()
    Promise.all([companies, collect]).then((res) => {
      wx.hideLoading();
      let tempArr = [...res[0], ...res[1]];
      let unArr = this.uniqueArr(tempArr)
      _this.setData({
        companyLists: unArr
      })
    })
    console.log(this.data.companyLists, 'companyLists')
  },
  uniqueArr(arr) {
    //console.log(arr,'uniqueArr')
    for (let i = 0; i < arr.length; i++) {
      var item = arr[i]
      for (var j = i + 1; j < arr.length; j++) {
        if (item.id == arr[j].id) {
          arr.splice(j, 1)
          i--
        }
      }
    }
    return arr;
  },
  // 获取名片公司列表
  getCompaniesList() {
    let _this = this
    return new Promise(function (resolve, reject) {
      req_fn.req("api/user/card-companies", {}, "post").then(data => {
        if (data.code == 0) {
          if (data.data != null) _this.changeAvatar(data.data);
          let response = data.data;
          for (let index = 0; index < response.length; index++) {
            const element = response[index];
            element.id = element.statistics.companyId;
          }
          resolve(data.data != null ? response : [])
        } else if (data.code != 40001) {
          wx.showToast({
            title: data.msg,
            icon: 'none',
            duration: 1500
          });
        } else if (data.code == 40001) {
          setTimeout(() => {
            _this.initPage();
          }, 1500);
        }
      });
    })
  },
  // 获取收藏列表
  getCollectList(lastTime = "") {
    let _this = this
    return new Promise(function (resolve, reject) {
      req_fn
        .req("api/user/company/collections", {
          lastTime: lastTime
        }, "post")
        .then(res => {
          if (res.code == 0) {
            if (res.data != null) {
              _this.changeAvatar(res.data);
            }
            if (lastTime == "") {
              let response = res.data;
              if (response != null) {
                for (let index = 0; index < response.length; index++) {
                  const element = response[index];
                  element.id = element.statistics.companyId;
                }
              }
              resolve(res.data != null ? response : [])
            } else if (res.data != null) {
              let response = res.data;
              for (let index = 0; index < response.length; index++) {
                const element = response[index];
                element.id = element.statistics.companyId;
              }
              let tempArr = [..._this.data.companyLists, ...response];
              _this.setData({
                loading: false,
                companyLists: tempArr
              })
            } else {
              _this.setData({
                loading: false
              })
            }
            // resolve(res.data)
          }
          wx.hideLoading();
        });
    })
  },
  // 映射头像
  changeAvatar(arr) {
    arr.forEach((element, i) => {
      if (element.logo) {
        element.logo = element.logo.replace(/\s/g, '')
      }
      if (element.logoUrl) {
        element.logoUrl = element.logoUrl.replace(/\s/g, '')
      }
      if (element.logo && element.logo.indexOf("http") == -1)
        element.logo = req_fn.imgUrl + element.logo;

      // @repair 公司别名  /\W/g
      // element.rename = element.name
      //   .replace(/(.*?（省|区|市）)/g, "")
      //   .substring(0, 4);
      element.rename = util.getCompanName(element.name)
    });

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
  // 登录
  initPage() {
    // 判断登录
    if (util.isLogin()) {
      this.setData({
        login: true
      })
      // 判断绑定公司
      if (util.hasCompanyName()) {
        util.clearLocal("card");
      } else {
        req_fn.hasCompanyName()
      }
      this.getCompanyId();
      this.getData();
    } else {
      // 没有登录
      this.setData({
        login: false
      })
    }
  },
  // 跳全球传递
  goGlobalTransmit() {
    wx.navigateTo({
      // url: "/pages/email/search/search?transmit=true"
      url: "/pages/email/bussiness/bussiness"
    });
  }
})