// pages/im//search/search.js
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
    loading: true,
    loadingShow: false,
    searchData: "",
    company: {
      id: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // // 好友
    // this.selectComponent('#friendList').getData()
    // // 推送
    // // this.selectComponent('#pushList').getPushList()
    // // 聊天记录
    // this.selectComponent('#chattingRecordss').getList()
    // this.getMailboxes()
  },
  // 获取数据
  getData() {
    let value = this.data.searchData
    this.selectComponent('#friendList').getData(value)
    this.selectComponent('#chattingRecordss').getList(value)
  },
  // 清空
  clear() {
    this.setData({
      searchData: '',
      isSearch: false,
    })
  },
  // 同步input值获取数据
  onChangeValue(e) {
    let value = e.detail
    this.setData({
      searchData: value,
    })
    this.getData();
  },
  // 跳转页面
  changePage(e) {
    let url = e.currentTarget.dataset.url
    //console.log(url);
    wx.navigateTo({
      url: url
    })
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
  },
  // 去登录
  toLogin() {
    app.pageIndex = util.logoToPage()
    wx.navigateTo({
      url: "/pages/home/login/login"
    });
  },
  // 去认证
  toAttestation() {
    wx.navigateTo({
      url: "/pages/email/authentication/authentication?card=" +
        JSON.stringify(util.getLocal("card"))
    });
  },
  // 点击某一项
  ontapItem(e) {
    let index = e.detail.index
    if (!this.data.isAuth && index > 2) {
      return
    }
    wx.navigateTo({
      url: `/pages/email/cooperationOrfinancing/cooperationOrfinancing?companyId=${ this.data.company.id}&index=${index}`,
    })
  },
  // 获取企业收件箱列表 after上翻(列表排序从旧到新)，before下翻(列表排序从新到旧)
  getMailboxes(timeDirection = "before", lastTime = "") {
    this.setData({
      hasNone: false
    })
    if (app.globalData.url == "cardInfo") delete app.globalData.url;
    else
      wx.showLoading({
        title: "加载中"
      });

    let url = "public/company/" + this.data.company.id + "/mailboxes";
    if (this.data.login) {
      url = "api/company/" + this.data.company.id + "/mailboxes";
    }
    req_fn
      .req(url, {
        timeDirection: timeDirection,
        lastTime: lastTime,
        readStatus: this.data.readStatus
      }, "post")
      .then(data => {
        this.setData({
          hasNone: true
        })
        if (data.code == 0) {
          if (data.data != null) this.changeAvatar(data.data);
          if (timeDirection == "after") {
            //上一页
            data.data.reverse();
            this.setData({
              peopleData: [...data.data, ...this.data.peopleData]
            })
            // wx.stopPullDownRefresh();
          } else {
            //下一页
            if (lastTime != "") {
              this.setData({
                loading: false,
                peopleData: [...this.data.peopleData, ...data.data]
              })
            } else {
              this.setData({
                peopleData: data.data
              })
            }
          }
        } else if (data.data == null) {
          // 没有上一页或者下一页
        } else {
          wx.showToast({
            title: data.msg,
            icon: "none",
            duration: 2000
          });
        }
        //console.log(timeDirection + " 获取企业收件箱列表: ", data);
        setTimeout(() => {
          wx.hideLoading();
        }, 100);
      })
      .catch(err => {
        this.setData({
          hasNone: false
        })
        wx.hideLoading();
        //console.log(err);
        // wx.showToast({
        //   title: "加载失败",
        //   icon: "none",
        //   duration: 2000
        // });
      });
  },
})