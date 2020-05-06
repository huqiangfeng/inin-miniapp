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
    searchData: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 聊天记录
    this.selectComponent('#chattingRecordss').getList()
  },
  // 获取数据
  getData() {
    let value = this.data.searchData
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
  }
})