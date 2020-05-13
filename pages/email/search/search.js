// inbox//search/search.js
const req_fn = require("../../../utils/route");
const util = require("../../../utils/util");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    option1: [{
        text: '不限',
        value: 0
      },
      {
        text: '1km',
        value: 1
      },
      {
        text: '2km',
        value: 2
      },
      {
        text: '3km',
        value: 3
      },
      {
        text: '4km',
        value: 4
      },
      {
        text: '5km',
        value: 5
      },
    ],
    currentVal: 0,
    localImg: app.localImg,
    imagePath: req_fn.imagePath,
    transmit: false, // 是否业务广场
    location: '', // 位置
    businessType: [], // 业务类型
    companyInfo: null,
    isSearch: false,
    searchData: "",
    tags: [],
    lists: null,
    companyLists: [],
    canSend: false,
    // loading: true,
    // loadingShow: false,
    hasNone: false,
    limits: 0,
    interval: 0,
    icon: '',
    page: 1,
    searchCheckde: '', // 搜索条件展开判断 region / businessType
    showModal: false,
    currentSendIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isLogin: util.isLogin(),
      transmit: options.transmit
    })
    this.getData("", '', '', '');
    if (app.globalData.locationAuth == false) {
      wx.showToast({
        title: "请开启小程序的定位权限",
        icon: 'none',
        duration: 2000
      });
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.setData({
    //   companyLists: [],
    //   searchData: "",
    //   isSearch: false,
    //   isLogin: util.isLogin()
    // })
  },
  // 触底事件的处理函数
  on_scrollLower() {
    //console.log('123');
    this.data.page = ++this.data.page
    this.getData(
      this.data.searchData,
      this.data.page
    );
  },
  changeDistance(e) {
    console.log(e);
    if (e.detail == 0) {
      this.getData(this.data.searchData, '', '', '')
    } else {
      this.getData(this.data.searchData, app.globalData.currentLat, app.globalData.currentLng, Number(e.detail * 1000))
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // this.setData({
    //   loadingShow: true,
    //   loading: true
    // })

    // 调用搜索接口
  },
  changePage(e) {

  },
  // 清空
  clear() {
    this.setData({
      searchData: '',
      isSearch: false,
    })
  },
  showModal(e) {
    this.setData({
      showModal: true,
      currentSendIndex: e.detail.index
    })
  },
  onClickHide() {
    this.setData({
      showModal: false
    });
  },
  visitEvent() {
    let index = this.data.currentSendIndex;
    let companyItem = this.data.companyLists[index];
    let companyName, companyID, logo, userName;
    companyName = companyItem.name;
    companyID = companyItem.id;
    userName = companyItem.rename;
    logo = companyItem.logoUrl;
    wx.navigateTo({
      url: '/pages/email/visitHome/visitHome?companyName=' + companyName + '&companyID=' + companyID + '&logo=' + logo + '&userName=' + userName
    })
    this.setData({
      showModal: false
    })
  },
  cooperationEvent() {
    this.onIconSendEvent()
    this.setData({
      showModal: false
    })
  },
  getData(keyword, lat, lng, distance, page = 1, ) {
    this.setData({
      hasNone: false,
      // 切换显示列表
      isSearch: true,
    })
    let url = "public/search/companies";
    if (util.isLogin()) {
      url = "api/search/companies";
    }
    wx.showLoading({
      title: "加载中..."
    });
    req_fn
      .req(url, {
        keyword: keyword instanceof Object ? this.data.searchData : keyword,
        page: page,
        lat: lat,
        lng: lng,
        distance: distance
      }, "post")
      .then(res => {
        this.setData({
          hasNone: true,

        })
        if (res.code == 0) {
          if (res.data != null) {
            res.data.forEach(element => {
              if (element.logo) {
                element.logo = element.logo.replace(/\s/g, '')
              }
              if (element.logoUrl) {
                element.logoUrl = element.logoUrl.replace(/\s/g, '')
              }
              if (element.logo && element.logo.indexOf("http") == -1) {
                element.logo = req_fn.imgUrl + element.logo;
              }
              // @repair 公司别名  /\W/g
              element.rename = util.getCompanName(element.name)
              // element.rename = element.name
              //   .replace(/(.*?(省|区|市))/, "")
              //   .substring(0, 2);
            });
            if (page == 1) {
              this.setData({
                companyLists: res.data != null ? res.data : []
              })
            } else
              setTimeout(() => {
                this.setData({
                  // loading: false,
                  companyLists: [...this.data.companyLists, ...res.data]
                })
              }, 500);
          } else if (lastId == "") {
            this.setData({
              // loading: false,
              companyLists: []
            })
          }
        }
        wx.hideLoading();
      })
      .catch(err => {
        this.setData({
          hasNone: true
        })
        wx.showToast({
          title: "加载失败",
          icon: "none",
          duration: 2000
        });
      });
  },
  // // 推荐类别
  // getCategory() {
  //   let url = "public/company/recommend-industries";

  //   if (util.isLogin()) {
  //     url = "api/company/recommend-industries";
  //   }
  //   req_fn.req(url, {}, "post").then(res => {
  //     if (res.code == 0) {
  //       if (res.data) {
  //         this.setData({
  //           tags: res.data.length % 3 == 2 ? [...res.data, ''] : res.data
  //         })
  //       }
  //     }
  //   });
  // },
  // 搜索推荐类别
  searchCategory(e) {
    let value = e.currentTarget.dataset.text
    this.setData({
      searchData: value,
      page: 1
    })
    this.getData(value, '', '', '');
  },
  // 同步input值获取数据
  onChangeValue(e) {
    let value = e.detail
    this.setData({
      searchData: value,
      canSend: false,
      page: 1
    })
    // if (value.length > 0)
    this.getData(value, '', '', '');
  },
  // 需求名片详情
  onChangeCompanyPage(e) {
    let index = e.detail.index
    let data = this.data.companyLists[index]
    data.url = "back";
    util.setLocal('companyInfo', data)
    wx.navigateTo({
      url: "/pages/email/demandCompany/demandCompany"
    });
  },
  // 发送需求名片
  onIconSendEvent() {
    let index = this.data.currentSendIndex;
    let companyItem = this.data.companyLists[index]
    if (companyItem.canSendRequirement) {
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
        companyInfo.companyId = companyItem.id;
        companyInfo.nameCompany = companyItem.name;
        req_fn.req("api/user/card/authed", {}, "post").then(res => {
          if (res.code == 0) {
            // if (res.data) {
            let tempString = JSON.stringify(companyInfo);
            wx.navigateTo({
              url: `/pages/email/outDemandCard/outDemandCard?companyInfo=${encodeURIComponent(tempString)}`
              // url: `/pages/email/outDemandCard/outDemandCard?companyInfo=${JSON.stringify(companyInfo)}&delta=2`
            });
            // } else {
            //   //未认证的情况下跳转认证页面
            //   wx.navigateTo({
            //     url: `/pages/email/authentication/authentication?companyItem=${JSON.stringify(companyItem)}`
            //     // url: `/pages/email/authentication/authentication?companyItem=${JSON.stringify(companyItem)}&delta=2`
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
          sendUserCompany: res.data.defaultCompanyName
        };
        if (data.logo.indexOf("http") == -1)
          data.logo = req_fn.imgUrl + data.logo;
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
  // (取消) 返回上一页
  returnPage(e) {
    this.setData({
      searchData: '',
      companyLists: []
    })
    wx.reLaunch({
      url: "/pages/home/email/email"
    });
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
  // 条件类型显示/隐藏
  navType(e) {
    let type = e.currentTarget.dataset.type
    this.setData({
      searchCheckde: this.data.searchCheckde === type ? '' : type
    })
  },
  // 条件类型隐藏
  on_huddenSearchCheckde() {
    this.setData({
      searchCheckde: ''
    })
  },
  // 位置条件选中
  regionChecked(e) {
    //console.log(e.detail)
    this.setData({
      location: e.detail,
      searchCheckde: ''
    })
  },
  // 类型选中
  typeChecked(e) {
    //console.log(e.detail)
    this.setData({
      businessType: e.detail,
      searchCheckde: ''
    })
  }
})