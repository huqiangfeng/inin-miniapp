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
    loading: true,
    loadingShow: false,
    searchData: "",
    peopleData: [],
    company: {
      id: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  // 获取数据
  getData() {
    let value = this.data.searchData
    this.getMailboxes(value)
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
    console.log('123123321231');
    let index = e.detail.index
    wx.navigateTo({
      url: `/pages/email/cooperationOrfinancing/cooperationOrfinancing?companyId=${ this.data.peopleData[index].companyId}`,
    })
  },
  // 获取企业收件箱列表 after上翻(列表排序从旧到新)，before下翻(列表排序从新到旧)
  getMailboxes(value, lastTime = "") {
    this.setData({
      hasNone: false,
      loading: true,
      loadingShow: true,
    })
    wx.showLoading({
      title: "加载中"
    });
    req_fn
      .req('/api/company/mailboxes-in-friend', {
        lastTime: lastTime,
        keyword: value,
        size: 10
      }, "get")
      .then(data => {
        this.setData({
          hasNone: true
        })
        if (data.code == 0) {
          if (data.data != null) this.changeAvatar(data.data);
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
      });
  },
  // 触底事件的处理函数
  onReachBottom() {
    let currentPeopleData = this.data.peopleData;
    console.log('123');
    if (currentPeopleData.length != 0) {
      let lastTime = currentPeopleData[currentPeopleData.length - 1].createTime
      this.getMailboxes(this.data.searchData, lastTime)
    }
  },
  // 映射头像
  changeAvatar(arr) {
    for (let i in arr) {
      try {
        if (
          arr[i].sendUserAvatar &&
          arr[i].sendUserAvatar.indexOf("http") == -1
        ) {
          arr[i].sendUserAvatar = req_fn.imgUrl + arr[i].sendUserAvatar;
        }
        arr[i].time = util.getDate(arr[i].createTime);
        arr[i].keywords = arr[i].keywords.split(",");
        // @repair 公司别名  /\W/g
        arr[i].rename = arr[i].sendUserCompany
          .replace(/(.*?(省|区|市))/, "")
          .substring(0, 2);
      } catch (error) {}
    }
    return arr;
  },
})