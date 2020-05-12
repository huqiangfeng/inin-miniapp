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
    newCard: {
      positionName: '', //公司职位
      companyName: '', //公司
      phone: '', // 手机号
      otherContact: '' // 其他联系方式
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getInfo();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
  on_setInputVal(e) {
    let k = e.currentTarget.dataset.valk
    let value = e.detail.value
    let newCard = this.data.newCard
    newCard[k] = value
    this.setData({
      newCard: newCard
    })
  },
  // 去填公司
  on_getCompanyName() {
    let _this = this
    wx.navigateTo({
      url: '/pages/home/SearchCompanyName/SearchCompanyName?isBack=true&name=' + _this.data.newCard.companyName,
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        getCompanyName: function (data) {
          _this.data.newCard.companyName = data.companyName
          _this.setData({
            newCard: _this.data.newCard
          })
        }
      }
    })
  },
  addCard() {

    for (const key in this.data.newCard) {
      if (!this.data.newCard[key]) {
        wx.showToast({
          title: '请完善信息',
          icon: 'none',
          duration: 2000
        })
        return
      }
    }
    let myreg = /^1[0-9]{10}$/
    if (!myreg.test(this.data.newCard.phone)) {
      wx.showToast({
        title: '请填写真确的手机号',
        icon: 'none',
        duration: 2000
      })
      return
    }

    req_fn
      .req(
        '/api/user/card', {
          ...this.data.newCard
        },
        "post"
      )
      .then((result) => {
        wx.showToast({
          title: '添加成功',
          icon: 'none',
          duration: 2000
        })
        wx.navigateBack({
          delta: 1 // 回退前 delta(默认为1) 页面
        });
      }).catch((err) => {

      });
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
  // 返回上一页
  back() {
    if (this.data.inputData != "" && this.data.oldInput != this.data.inputData) {
      wx.showModal({
        content: "信息还未保存是否退出",
        cancelText: "退出",
        cancelColor: "#1882F1",
        confirmText: "保存",
        confirmColor: "#1882F1",
        success(res) {
          if (res.confirm) {
            this.sumbit();
          } else if (res.cancel) {
            wx.navigateBack({
              delta: 1 // 回退前 delta(默认为1) 页面
            });
          }
        }
      });
    } else {
      wx.navigateBack({
        delta: 1 // 回退前 delta(默认为1) 页面
      });
    }
  },
})