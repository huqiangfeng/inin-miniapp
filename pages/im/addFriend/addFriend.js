// im//addFriend/addFriend.js

const req_fn = require("../../../utils/route");
const util = require("../../../utils/util");
const app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    localImg: app.localImg,
    userId: '',
    title: "",
    imagePath: req_fn.imagePath,
    searchData: "", //18911111111
    lists: [],
    isPhone: false, //不是手机号
    // 立即邀请
    isButtomShow: false,
    // 是否是返回
    isRetuen: false,
    // 翻页
    loading: true,
    loadingShow: false,
    page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.title) {
      wx.setNavigationBarTitle({
        title: options.title
      })
    }
    if (options.userId) {
      this.setData({
        userId: options.userId,
        title: options.title && options.title
      })
    }
    // this.getList();
    // this.setData({
    //   isRetuen: false
    // })
    wx.setNavigationBarColor({
      frontColor: "#000000",
      backgroundColor: "#ffffff",
      animation: {
        duration: 400,
        timingFunc: "easeIn"
      }
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.isRetuen == false) {
      this.getList();
      this.setData({
        searchData: ''
      })
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.lists.length % 20 !== 0) {
      return
    }
    this.setData({
      loadingShow: true,
      loading: true
    })
    this.setData({
      page: ++this.data.page
    })
    this.getList("", this.data.lists[this.data.lists.length - 1].createTime);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (ops) {
    if (ops.from === "button") {
      // 来自页面内转发按钮
      //console.log("转发微信: ", ops.target);
    }
    return {
      title: '一传人脉企业版',
      path: 'pages/home/email/email',
      imageUrl: '/static/images/inbox/send_blue.png'
    }
  },
  cancel() {
    this.setData({
      searchData: '',
      isRetuen: false
    })
    this.getList();
    // this.setData({
    //   isRetuen: false
    // })
  },
  getList(keyword = "", lastTime = "") {
    if (lastTime == "")
      wx.showLoading({
        title: "加载中..."
      });

    let url = "api/user/maybe-friends"
    if (this.data.userId) {
      url = `/api/user/${this.data.userId}/visit-users`
    }
    req_fn
      .req(
        url, {
          id: this.data.userId,
          keyword: keyword,
          lastTime: lastTime,
          size: 20,
          page: this.data.page
        },
        "post"
      )
      .then(res => {
        let setObj = {}
        wx.hideLoading();
        //console.log("感兴趣的好友列表: ", res);
        if (res.code == 0) {
          if (res.data != null) {
            res.data.forEach(element => {
              if (
                element.avatar != null &&
                element.avatar.indexOf("http") == -1
              ) {
                element.avatar = req_fn.imgUrl + element.avatar + "?width=50";
              }
            });
          }

          if (lastTime == "") {
            setObj.lists = res.data != null ? res.data : [];
          } else {
            // 下一页
            setObj.loading = false;
            setObj.lists = [...this.data.lists, ...res.data];
          }

          setObj.isPhone = util.pattern(keyword, "phone");
        }
        this.setData(setObj)
      })
      .catch(err => {
        wx.hideLoading();
      });
  },
  // 点击好友名片，跳转聊天页面
  changePage(e) {
    let id = e.currentTarget.dataset.id
    if (id) {
      wx.navigateTo({
        url: "/pages/im/chat/chat?id=" + id
      });
    } else {
      wx.showToast({
        title: "暂未开放和自己聊天",
        icon: "none",
        duration: 1500
      });
    }
    this.setData({
      isRetuen: true
    })
  },
  // 点击添加好友 friend,applying,null
  addFriend(e) {
    let index = e.currentTarget.dataset.index
    let item = this.data.lists[index]
    if (item.friendStatus == null) {
      req_fn
        .req("api/user/friend-apply", {
          friendUserId: item.userId
        }, "post")
        .then(res => {
          if (res.code == 0) {
            let lists = this.data.lists
            lists.forEach((element, i) => {
              if (element.userId == item.userId) {
                lists[i].friendStatus = "applying";
              }
            });
            this.setData({
              lists: lists
            })
          } else {
            wx.showToast({
              title: res.msg,
              icon: "none",
              duration: 2000
            });
          }
        });
    }
  },
  // 立即邀请
  invite() {
    this.setData({
      isButtomShow: true
    })
  },
  // 搜索
  search() {
    this.getList(this.data.searchData);
  },
  // 双向绑定value值
  changeValue(e) {
    let value = e.detail
    this.setData({
      searchData: value,
      isPhone: util.pattern(this.data.searchData, "phone")
    })
    this.getList(value);
  },
  // 关闭邀请框
  onIsButtomShow() {
    this.setData({
      isButtomShow: false
    })
  },
  // 跳用户信息
  to_userInfo(e) {
    let userId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: "/pages/im/userInfo/userInfo?userId=" + userId
    });
  },
})