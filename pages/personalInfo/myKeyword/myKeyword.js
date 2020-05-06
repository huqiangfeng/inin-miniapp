// personalInfo//myKeyword/myKeyword.js
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
    myWords: [],
    wantWords: [],
    renew: false
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.keywords) {
      let myWords = this.data.myWords
      let wantWords = this.data.wantWords
      if (app.globalData.keywords.type == "mine")
        myWords = app.globalData.keywords.data;
      if (app.globalData.keywords.type == "meet")
        wantWords = app.globalData.keywords.data;
      delete app.globalData.keywords;
      this.setData({
        myWords: myWords,
        wantWords: wantWords
      })

    } else {
      wx.showLoading({
        title: "加载中"
      });
      this.getData();
    }
  },
  //获取关键词数据
  getData() {
    req_fn.req("api/user/keywords", {}, "post").then(res => {
      //console.log("获取用户关键词列表: ", res);
      if (res.code == 0) {

        let myWords = [];
        let wantWords = [];
        if (res.data != null)
          res.data.forEach(element => {
            if (!util.getLocal("myWords") && element.type == "my") {
              myWords.push(element.word);
            } else if (util.getLocal("myWords")) {
              myWords = util.getLocal("myWords");
            }
            if (
              !util.getLocal("wantWords") &&
              element.type == "want"
            ) {
              wantWords.push(element.word);
            } else if (util.getLocal("wantWords")) {
              wantWords = util.getLocal("wantWords");
            }
          });
        setTimeout(() => {
          wx.hideLoading();
        }, 300);
        this.setData({
          myWords: myWords,
          wantWords: wantWords
        })
      }
    });
  },
  // 保存按钮
  addKeyword() {
    req_fn
      .req(
        "api/user/keyword", {
          myWords: this.data.myWords.join(","),
          wantWords: this.data.wantWords.join(",")
        },
        "post"
      )
      .then(res => {
        if (res.code == 0) {
          util.clearLocal("myWords");
          util.clearLocal("wantWords");
          wx.showToast({
            title: "保存成功",
            icon: 'none',
            duration: 1500
          });
          setTimeout(() => {
            wx.switchTab({
              url: "/pages/home/personal/personal"
            });
          }, 1000);
        }
      });
  },
  // 删除关键词
  delKeyword(e) {
    let type = e.currentTarget.dataset.type
    let typeName = e.currentTarget.dataset.item

    //console.log(typeName + "----" + type);

    if (type == "mine") {
      let myWords = this.data.myWords
      let index = myWords.indexOf(typeName);
      if (index != -1) {

        myWords.splice(index, 1);
        util.setLocal("myWords", myWords);
        this.setData({
          myWords: myWords
        })
      }
    } else if (type == "meet") {
      let wantWords = this.data.wantWords
      let index = wantWords.indexOf(typeName);
      if (index != -1) {
        wantWords.splice(index, 1);
        util.setLocal("wantWords", wantWords);
        this.setData({
          wantWords: wantWords
        })
      }
    }
  },
  // 跳转页面
  showAddKeyword(e) {
    let type = e.currentTarget.dataset.type
    let isedit = e.currentTarget.dataset.isedit
    //console.log(isedit + "----" + type);
    if (isedit) {
      switch (type) {
        case "mine": {
          util.setLocal("myWords", this.data.myWords);
          break;
        }
        case "meet": {
          util.setLocal("wantWords", this.data.wantWords);
          break;
        }
      }
    } else {
      util.clearLocal("myWords");
      util.clearLocal("wantWords");
    }
    wx.navigateTo({
      url: "/pages/personalInfo/myKeywordList/myKeywordList?type=" + type
    });
  }
})