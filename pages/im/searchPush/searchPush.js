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
    // 推送
    this.selectComponent('#pushList').getPushList()
  },
  // 获取数据
  getData() {
    let value = this.data.searchData
    // 推送
    this.selectComponent('#pushList').getPushList(value)
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
  }
})