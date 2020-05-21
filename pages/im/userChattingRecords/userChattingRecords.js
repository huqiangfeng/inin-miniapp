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
    userObj: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {

    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('getPageData', (data) => {
      this.setData({
        searchData: data.value,
        userObj: data.userObj
      })
      this.selectComponent('#publicSearch').updataPublicValue()
    })

  },
  // 获取数据
  getData() {
    let value = this.data.searchData
    if (!value.trim()) {
      this.data.userObj.searchData = this.data.userObj.data
      this.setData({
        userObj: this.data.userObj
      })
      return
    }
    this.selectComponent('#chattingRecordsDetails').getList(value)
  },
  on_reset(e) {
    console.log(e);
    let userObj = e.detail[0]
    if (userObj) {
      this.setData({
        userObj: userObj
      })
    }
  },
  // 清空
  clear() {
    this.data.userObj.searchData = this.data.userObj.data
    this.setData({
      searchData: '',
      isSearch: false,
      userObj: this.data.userObj
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