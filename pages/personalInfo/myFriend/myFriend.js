// personalInfo//myFriend/myFriend.js
const req_fn = require("../../../utils/route");
const util = require("../../../utils/util");
const app = getApp();
let phoneTimeout;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    localImg: app.localImg,
    imagePath: req_fn.imagePath,
    slideButtons1: [{ // 删除滑块的配置
      type: 'warn',
      text: ' 删除 ',
    }],
    slideButtons2: [{ // 删除滑块的配置
      type: 'warn',
      text: '确认删除',
    }],
    name: "",
    lists: [],
    datas: [],
    locate: "A",
    locateTags: [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "I",
      "M",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      "#"
    ],
    delBtnId: "", //要删除的id
    confirmDel: false,
    X: 0 //移动的距离单位px
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    wx.getSystemInfo({
      success(res) {
        _this.data.X = 180 * (res.windowWidth / 750)
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showLoading({
      title: "加载中"
    });
    this.setData({
      delBtnId: '',
      confirmDel: false
    })
    this.getData();
  },
  getData(name = "") {
    req_fn.req("api/user/friends", {
      name: name
    }, "post").then(res => {
      //console.log("好友列表: ", res.data);
      if (res.code == 0) {
        let lists = [];
        for (let i = 0; i < this.data.locateTags.length; i++) {
          res.data.forEach(element => {
            if (element.avatar.indexOf("http") == -1)
              element.avatar = req_fn.imgUrl + element.avatar;
            if (element.nameFirstLetter.toUpperCase() == this.data.locateTags[i]) {
              lists.push(element);
            }
          });
        }
        this.setData({
          lists: lists
        })
        wx.hideLoading();
      }
    });
  },
  onTapgitData() {
    this.getData(this.data.name);
  },
  // 搜索框改变
  changeName(e) {
    let name = e.detail.value
    if (name === this.data.name) {
      return
    }
    clearTimeout(phoneTimeout)
    phoneTimeout = setTimeout(() => {
      this.data.name = name
      this.getData(name);
    }, 300);
  },
  // 前往聊天页面
  changePage(e) {
    let id = e.currentTarget.dataset.id
    // 跳转页面
    wx.navigateTo({
      url: "/pages/im/chat/chat?id=" + id
    });
  },
  // 锚点定位
  LocationChange(e) {
    // //console.log(e.target.dataset.item);
    let item = e.currentTarget.dataset.item
    this.setData({
      locate: item
    })
  },
  // 删除好友
  del(friendId) {
    if (this.data.confirmDel) {
      req_fn
        .req("api/user/friend/" + friendId + "/delete", {}, "post")
        .then(res => {
          //console.log(res.data);
          if (res.code == 0) {
            wx.showToast({
              title: "删除成功",
              icon: 'none',
              duration: 1500
            });
            this.getData();
          } else {
            wx.showToast({
              title: res.msg,
              icon: "none",
              duration: 1500
            });
          }
        });
    }
    this.setData({
      confirmDel: !this.data.confirmDel
    })
  },
  // 点击删除按钮
  slideButtonTap(e) {
    let index = e.detail.index
    let userId = this.data.lists[index].userId

    if (this.data.confirmDel && this.data.delBtnId == userId) {

      this.del(userId)
      this.setData({
        delBtnId: userId,
        confirmDel: true
      })
    } else {
      this.setData({
        delBtnId: userId,
        confirmDel: false
      })
      this.del(userId)
    }

  },

  hideDel(e) {
    let index = e.detail.index
    this.setData({
      delBtnId: '',
      confirmDel: false
    })

  },
  showDel(e) {
    let index = e.detail.index
    this.setData({
      delBtnId: '',
      confirmDel: false
    })
  }
})