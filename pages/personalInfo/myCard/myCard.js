// pages/personalInfo//myCard/myCard.js

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
    userName: '',
    avatar: '',
    list: [],
    isSelect: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.isSelect) {
      this.setData({
        isSelect: true
      })
    }
    this.getInfo()
  },
  onShow: function () {
    this.getList()
  },
  // 选中
  on_tapItem(e) {
    let index = e.currentTarget.dataset.index

    if (this.data.isSelect) {
      const eventChannel = this.getOpenerEventChannel()
      let data = {
        defaultAuthEmail: this.data.list[index].defaultAuthEmail,
        defaultCardId: this.data.list[index].defaultCardId,
        logo: this.data.list[index].avatar,
        name: this.data.list[index].defaultCompanyName,
        personName: this.data.list[index].name,
        defaultCompanyPosition: this.data.list[index].defaultCompanyPosition,
        defaultAuthStatus: this.data.list[index].defaultAuthStatus,
        sendUserName: this.data.list[index].name,
        sendUserPosition: this.data.list[index].defaultCompanyPosition,
        sendUserCompany: this.data.list[index].defaultCompanyName,
        userShortId: this.data.list[index].userShortId,
        userId: this.data.list[index].userId
      };
      eventChannel.emit('getChangeCard', {
        card: data
      });
    } else {
      let data = this.data.list[index].companyInfo
      util.setLocal('companyInfo', data)
      wx.navigateTo({
        url: "/pages/email/demandCompany/demandCompany"
      });
    }
  },
  // 删除
  on_del(e) {
    let index = e.currentTarget.dataset.index
    let _this = this
    wx.showModal({
      content: '确认要删除吗？',
      success(res) {
        if (res.confirm) {
          req_fn
            .req(
              `/api/user/card/${_this.data.list[index].id}/delete`, {
                id: _this.data.list[index].id
              },
              "post"
            )
            .then((result) => {
              wx.showToast({
                title: '删除成功',
                icon: 'none',
                duration: 2000
              })
              _this.getList()
            }).catch((err) => {

            });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 获取列表
  getList() {
    wx.showLoading({
      title: "加载中..."
    });
    req_fn
      .req(
        "api/user/cards", {},
        "post"
      )
      .then(res => {
        wx.hideLoading();
        if (res.code == 0) {
          this.setData({
            list: res.data
          })
        }
      })
      .catch(err => {
        wx.hideLoading();
      });
  },
  // 获取信息
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
          userName: res.data.name,
          avatar: data.logo
        })
      } else if (res.code == 40001) {
        setTimeout(() => {
          this.getInfo();
        }, 1500);
      }
    });
  },
  // 添加
  on_addCard(e) {
    wx.navigateTo({
      url: "/pages/personalInfo/addCard/addCard"
    });
  },
})