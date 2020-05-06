// components/chattingRecords/chattingRecords.js
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
    localImg: app.localImg,
    lists: [], // 会话列表
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getList() {
      if (util.getLocal("msgList")) {
        this.setData({
          lists: this.setListDate(util.getLocal("msgList")),
        })
      }
    },
    // 设置时间格式化
    setListDate(list) {
      for (let i = 0; i < list.length; i++) {
        list[i].data[list[i].data.length - 1].day = util.getDate(list[i].data[list[i].data.length - 1].time);
      }
      return list
    },
    // 聊天页面跳转
    changePage(e) {
      let index = e.currentTarget.dataset.index
      let lists = this.data.lists
      lists[index].unread = 0
      if (lists instanceof Array) {
        util.setLocal("msgList", lists)
      }
      this.setData({
        lists: lists
      })
      wx.navigateTo({
        url: "/pages/im/chat/chat?id=" + lists[index].listid.replace("p2p-", "")
      });


    },
  }
})