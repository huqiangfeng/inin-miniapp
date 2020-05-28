// inbox//outDemandCard/outDemandCard.js
const req_fn = require("../../../utils/route");
const util = require("../../../utils/util");
const app = getApp();
let phoneTimeout
Page({

  /**
   * 页面的初始数据
   */
  data: {
    localImg: app.localImg,
    imagePath: req_fn.imagePath,
    recommendCompanies: false, //推荐公司页显示
    company: {},
    content: "",
    keywordsTitle: "商务合作", //
    keywords: [],
    showKeyword: [], //高亮已选择的关键词
    keywordLists: [], //所有关键词列表
    dialogVisible: false,
    delta: 1, //回退页面
    record: { //记录上次选择的！
      showKeyword: [],
      keywords: []
    },
    wechatSIIsShow: false, // 听写
    isToRecommend: false, //是否可以跳推荐页
    __comps__: {
      recommendCompanies: null
    },
    fromOrigin: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // getCurrentPages(); // 获取页面栈
    let tempObj = decodeURIComponent(options.companyInfo);
    let _tempObj_ = JSON.parse(tempObj);
    if (_tempObj_.name.length > 10) {
      _tempObj_.name = _tempObj_.name.substring(0, 12) + '...';
    }
    this.setData({
      company: _tempObj_,
      delta: options.delta ? Number(options.delta) : 1,
      fromOrigin: options.from ? Number(options.from) : 100
    })
    this.getKeywordTitle(this.data.company.companyId);
    this.getKeywordList(this.data.company.nameCompany);
    this.setData({
      content: "您好，我是" + this.data.company.sendUserName + "，我对贵公司非常感兴趣，"
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 双向绑定value值
  onChangeValue(e) {
    let value = e.detail.value
    if (value === this.data.content) {
      return
    }
    this.setData({
      content: value
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      // keywords: [],
      dialogVisible: false
    })
    this.data.__comps__.recommendCompanies = this.selectComponent('#recommend-companies')
  },
  // 显示听写
  on_showWechatSI() {
    this.setData({
      wechatSIIsShow: true
    })
  },
  on_hiddenWechatSI() {
    this.setData({
      wechatSIIsShow: false
    })
  },
  on_WechatSIValue(e) {
    if (e.detail !== this.data.content) {
      this.setData({
        content: e.detail
      })
    }
  },
  // 编辑个人信息
  onEdit() {
    let _this = this
    wx.navigateTo({
      url: "/pages/personalInfo/myCard/myCard?isSelect=true",
      events: {
        getChangeCard: function (data) {
          data.card.companyId = _this.company.companyId
          _this.setData({
            company: data.card
          })
        }
      }
    });
  },
  // 获取企业关键词标题
  getKeywordTitle(companyId) {
    req_fn
      .req("api/company/company-type", {
        companyId: companyId
      }, "post")
      .then(res => {
        if (res.code == 0) {
          switch (res.data) {
            case "companystar": {
              this.setData({
                keywordsTitle: "企业明星"
              })
              break;
            }
            case "investment": {
              this.setData({
                keywordsTitle: "投融资"
              })
              break;
            }
            case "cooperation": {
              this.setData({
                keywordsTitle: "商务合作"
              })
              break;
            }
          }
        }
      });
  },
  // 获取企业关键词列表
  getKeywordList(companyName) {
    req_fn
      .req("api/company/base-keywords", {
        companyName: companyName
      }, "post")
      .then(res => {
        if (res.code == 0) {
          this.setData({
            keywordLists: res.data
          })
          let showKeyword = this.data.showKeyword
          for (let i = 0; i < showKeyword.length; i++) {
            showKeyword[i] = false;
          }
          this.setData({
            showKeyword: showKeyword
          })
        }
        // this.keywordLists.sort(function compareFunction(param1, param2) {
        //   return param1.localeCompare(param2, "zh");
        // });
      });
  },
  // 显示添加关键词弹框
  showAddKeyword() {
    this.setData({
      dialogVisible: true,
      record: {
        keywords: [...this.data.keywords],
        showKeyword: [...this.data.showKeyword]
      }
    })
  },
  // 添加关键词
  addKeyword(e) {
    let item = e.currentTarget.dataset.item

    let keywords = this.data.keywords
    let showKeyword = this.data.showKeyword
    if (!keywords.includes(item) && keywords.length < 4) {
      keywords = [...keywords, item]
    } else if (keywords.includes(item)) {
      keywords.splice(keywords.indexOf(item), 1);
    }

    for (let i = 0; i < this.data.keywordLists.length; i++) {
      showKeyword[i] = false;
    }
    this.data.keywordLists.forEach((el1, j) => {
      keywords.forEach(el2 => {
        if (el1 == el2) showKeyword[j] = true;
      });
    });
    this.setData({
      keywords: keywords,
      showKeyword: showKeyword
    })
  },
  // 关闭添加关键词弹框
  tagsClose() {
    this.setData({
      dialogVisible: false,
      keywords: this.data.record.keywords,
      showKeyword: this.data.record.showKeyword
    })
  },
  // 完成添加
  tagsSubmit() {
    this.setData({
      dialogVisible: false,
    })
  },
  // 发送
  sumbit() {
    if (this.data.keywords.length > 0 && this.data.content != "") {
      this.mailboxes()
    } else if (this.data.keywords.length == 0) {
      wx.showToast({
        title: '请选择关键词',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.showToast({
        title: '请填写内容',
        icon: 'none',
        duration: 2000
      })
    }
  },
  // 发送推荐的all
  allSumbit(e) {
    // this.data.companyIds = e.detail
    // // this.mailboxes()
  },
  // 发送需求
  mailboxes() {
    if (this.data.fromOrigin == 200) {
      let url = "/api/company/mailboxes";
      let data = {
        content: this.data.content, //打招呼内容
        keywords: this.data.keywords.join(","), //关键词
        sendUserName: this.data.company.sendUserName != null ? this.data.company.sendUserName : "",
        sendUserPosition: this.data.company.sendUserPosition != null ? this.data.company.sendUserPosition : "",
        sendUserCompany: this.data.company.sendUserCompany != null ? this.data.company.sendUserCompany : "",
        companyIds: util.getLocal('comapnyIDs'),
        requirementType: 'deliver'
      }
      req_fn.req(url, data, "post").then(res => {
        if (res.code == 0) {
          wx.showToast({
            title: "发送成功",
            icon: 'none',
            duration: 1500
          });
          setTimeout(() => {
            wx.reLaunch({
              url: "/pages/home/email/email"
            })
          }, 1800);
          wx.removeStorageSync('comapnyIDs');

        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 1500
          });
        }
      })
    } else {
      let data = this.getUpData()
      let url = "api/company/" + this.data.company.companyId + "/mailbox"
      if (this.data.company.companyIds) {
        url = "/api/company/mailboxes"
      }
      req_fn.req(url, data, "post").then(res => {
        if (res.code == 0) {
          wx.showToast({
            title: "发送成功",
            icon: 'none',
            duration: 1500
          });
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1800);
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000
          });
        }
      });
    }
  },
  // 获取发送数据
  getUpData() {
    let data = {};
    data.content = this.data.content; //打招呼内容
    data.keywords = this.data.keywords.join(","); //关键词
    data.sendUserName = this.data.company.sendUserName != null ? this.data.company.sendUserName : "";
    data.sendUserPosition = this.data.company.sendUserPosition != null ? this.data.company.sendUserPosition : "";
    data.sendUserCompany = this.data.company.sendUserCompany != null ? this.data.company.sendUserCompany : "";
    let url = "api/company/" + this.data.company.companyId + "/mailbox"
    if (this.data.company.companyIds) {
      url = "/api/company/mailboxes"
      data.companyIds = this.data.company.companyIds
    } else {
      data.companyId = this.data.company.companyId;
    }
    return data
  },
  toRecommend(e) {
    if (e.detail) {
      this.setData({
        recommendCompanies: true
      })
    } else {
      wx.showToast({
        title: "发送成功",
        icon: 'none',
        duration: 1500
      });
      setTimeout(() => {
        wx.navigateBack({
          delta: this.data.delta
        });
      }, 1000);
    }
  },
  // 投递按钮变灰色
  setBtnColor() {
    // 投递按钮变灰色
    let pages = getCurrentPages(); // 获取页面栈
    let currPage = pages[pages.length - 1]; // 当前页面
    let prevPage = pages[pages.length - 2]; // 上一个页面
    // 公司列表投递按钮
    if (
      prevPage.data.companyLists &&
      prevPage.data.companyLists.length > 0
    ) {
      prevPage.data.companyLists.forEach((el, i) => {
        if (el.id == this.data.company.companyId) {
          prevPage.data.companyLists[
            i
          ].canSendRequirement = false;
        }
      });
    }
    // 公司详情大投递按钮
    if (prevPage.data.company) {
      prevPage.data.company.canSendRequirement = false;
    }
  }
})