// components/friendList/friendList.js
const req_fn = require("../../utils/route");
const util = require("../../utils/util");
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    lists: [],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getData(name = "") {
      req_fn.req("api/user/friends", {
        name: name
      }, "post").then(res => {
        if (res.code == 0) {
          let lists = res.data;
          lists.forEach(element => {
            if (element.avatar.indexOf("http") == -1)
              element.avatar = req_fn.imgUrl + element.avatar;
          });
          this.setData({
            lists: lists
          })
          wx.hideLoading();
        }
      });
    },
    // 前往聊天页面
    changePage(e) {
      let id = e.currentTarget.dataset.id
      // 跳转页面
      wx.navigateTo({
        url: "/pages/im/chat/chat?id=" + id
      });
    }
  }
})