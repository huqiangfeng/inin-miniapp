// pages/home/SearchCompanyName/SearchCompanyName.js

const util = require("../../../utils/util");
const req_fn = require("../../../utils/route");
const app = getApp();
let phoneTimeout
Page({

  /**
   * 页面的初始数据
   */
  data: {
    localImg: app.localImg, // icon图标地址
    imagePath: req_fn.imagePath,
    myCompany: {},
    isSearch: false,
    tags: [],
    companyLists: [],
    canSend: false,
    loading: true,
    loadingShow: false,
    canSearch: true,
    searchData: "", //公司
    page: 1,
    amend: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.name) {
      this.setData({
        searchData: options.name
      })
    }
    let setObj = new Object()
    if (options.name)
      setObj.searchData = options.name
    if (options.amend)
      setObj.amend = options.amend

    this.setData(setObj)


    util.isLogin()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //console.log('cd');

    this.setData({
      loadingShow: true,
      loading: true
    })
    this.data.page = ++this.data.page
    this.getData(
      this.data.searchData,
      this.data.page
    );
  },
  // 获取公司数据
  getData(keyword, page = 1) {
    this.setData({
      canSearch: false
    })
    req_fn
      .req(
        "api/search/companies", {
          keyword: keyword,
          page: page,
          size: 20
        },
        "post"
      )
      .then(res => {

        this.setData({
          canSearch: true
        })
        if (res.code == 0) {
          //console.log("搜索企业列表: ", res);
          if (res.data != null) {
            res.data.forEach((element, i) => {
              if (element.logo == null)
                element.img = element.name
                .replace(/[^\u4e00-\u9fa5]/, "")
                .slice(0, 2);
            });
            if (page == 1) {
              this.setData({
                companyLists: res.data != null ? res.data : []
              })
            } else {
              if (res.data[res.data.length - 1].id !== this.data.companyLists[this.data.companyLists.length - 1].id) {
                setTimeout(() => {
                  this.setData({
                    loading: false,
                    companyLists: [...this.data.companyLists, ...res.data]
                  })
                }, 500);
              }
            }
          } else if (page != 1)
            this.setData({
              loading: false,
            })
        }
      })
      .catch(err => {
        this.setData({
          canSearch: true
        })
      });
  },
  // 改变searchData
  onChangeValue(e) {
    let value = e.detail.value
    clearTimeout(phoneTimeout)
    phoneTimeout = setTimeout(() => {
      this.setData({
        searchData: value,
        canSend: false,
        page: 1
      })

      if (this.data.canSearch && value.length > 0) this.getData(value);

      if (value == "")
        this.setData({
          isSearch: false
        })
      else
        this.setData({
          isSearch: true
        })
    }, 300);
  },
  // 搜索
  search(e) {
    this.setData({
      canSend: true
    })
    if (this.data.searchData == "") {
      wx.showToast({
        title: "公司名称不能为空",
        icon: "none",
        duration: 2000
      });
    } else {
      this.data.page = 1
      this.getData(this.data.searchData);
    }
  },
  // 清空searchData
  onDelData() {
    this.setData({
      searchData: ''
    })
  },
  // 需求名片详情
  changeCompanyPage(e) {
    let index = e.currentTarget.dataset.index
    wx.redirectTo({
      url: `/pages/home/companyName/companyName?name=${this.data.companyLists[index].name}&amend=${this.data.amend}`
    })
  },
  // (取消) 返回上一页
  returnPage(e) {
    wx.redirectTo({
      url: '/pages/home/companyName/companyName'
    })
  }
})