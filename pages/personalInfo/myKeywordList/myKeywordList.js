// personalInfo//myKeywordList/myKeywordList.js
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
    type: "", //我的关键词-mine 期待结识关键词-meet
    // 关键词列表
    list: [],
    bar: 0, //关键词标签index
    keywords: [],
    searchList: [], //搜索列表
    value: "" //搜索关键词
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getKeywords();
    let keywords = []
    if (util.getLocal("myWords") && options.type == "mine") {
      keywords = util.getLocal("myWords");
    }
    if (util.getLocal("wantWords") && options.type == "meet") {
      keywords = util.getLocal("wantWords");
    }
    this.setData({
      type: options.type,
      keywords: keywords
    })
  },
  // 改变  tabbar 选项卡
  barchange(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      bar: index
    })
  },
  // 获取关键词列表
  getKeywords() {
    req_fn.req("/key-words", {}, "post").then(res => {
      //console.log("关键词分类及分类下的关键词列表: ", res);
      if (res.code == 0) {
        this.setData({
          list: res.data
        })
      }
    });
  },
  // 选择标签
  chooseBar(e) {
    let typeName = e.currentTarget.dataset.name
    let keywords = this.data.keywords
    //console.log(typeName);
    if (keywords.includes(typeName)) {
      keywords.splice(keywords.indexOf(typeName), 1);
    } else if (
      !keywords.includes(typeName) &&
      keywords.length < 4
    ) {
      keywords.push(typeName);
    } else {
      wx.showToast({
        title: '最多只能选择4个关键词',
        icon: 'none',
        duration: 2000
      })
      return
    }
    this.setData({
      keywords: keywords
    })

  },
  // 取消选择
  delKeyword(e) {
    let typeName = e.currentTarget.dataset.name
    let keywords = this.data.keywords
    //console.log(typeName);

    keywords.forEach((element, i) => {
      if (element == typeName) keywords.splice(i, 1);
    });
    this.setData({
      keywords: keywords
    })
  },
  // 保存
  saveKeywords() {
    let keywords = this.data.keywords
    if (keywords.length == 0) {
      wx.showToast({
        title: "请选择关键词",
        icon: "none",
        duration: 2000
      });
    } else {
      app.globalData.keywords = {
        type: this.data.type,
        data: keywords
      };
      wx.navigateBack({
        delta: 1 // 回退前 delta(默认为1) 页面
      });
    }
  },
  // 搜索
  onSearch() {
    let value = this.data.value.trim()
    // if (!value) return
    let searchList = []
    let list = this.data.list
    list.forEach((item1) => {
      item1.dataList.forEach((item2) => {
        if (item2.word.includes(value)) {
          searchList.push(item2.word)
        }
      })
    })
    this.setData({
      searchList: searchList
    })
  },
  // 清空
  onClear() {
    setTimeout(() => {
      this.setData({
        value: '',
        searchList: []
      })
    }, 100);
  },
  // value值改变
  onChangeValue(e) {
    let value = e.detail
    this.setData({
      value: value
    })
    this.onSearch()
  },
  onselectedItem(e) {
    this.setData({
      value: '',
      searchList: []
    })
    this.chooseBar(e)
  }

})