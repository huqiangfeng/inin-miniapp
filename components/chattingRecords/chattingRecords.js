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
    msgList: [],
    value: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getList(value) {
      if (value.trim() === '') {
        this.setData({
          lists: [],
          value: value
        })
        return
      }
      console.log('onMessage');
      let lists = this.on_Message({
        value,
        msgList: this.data.msgList
      })
      this.setData({
        lists: lists,
        value: value
      })
    },
    on_Message({
      value,
      msgList
    }) {
      let _this = this
      console.log('onMessage');
      try {
        msgList = JSON.parse(msgList) // 聊天数据
      } catch (error) {}
      let lists = msgList.filter(element => {
        let dataArr = element.data
        let countArr = [] // 符合条件的条数
        for (const item of dataArr) {
          let flg = false
          if (item.type === 'emoji' || item.type === 'txt') {
            let textArr = item.text
            for (const chatItem of textArr) {
              if (chatItem.type === 'txt') {
                if (_this.filtrate(value, chatItem.data)) {
                  flg = true
                }
              }
            }
          }
          if (flg) {
            countArr.push(item)
          }
        }
        if (countArr.length > 0) {
          element.searchData = countArr
          element.sum = countArr.length
        } else {
          element.searchData = []
          element.sum = 0
        }
        return countArr.length > 0
      });
      return lists

    },
    filtrate(val, txt) {
      return txt.includes(val)
    },
    // 聊天页面跳转
    changePage(e) {
      let index = e.currentTarget.dataset.index
      let lists = this.data.lists
      wx.navigateTo({
        url: "/pages/im/userChattingRecords/userChattingRecords",
        success: (res) => {

          this.data.msgList

          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('getPageData', {
            userObj: lists[index],
            value: this.data.value
          })
        }
      });
    },
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      let msgList = util.getLocal("msgList")
      if (msgList) {
        this.setData({
          msgList: JSON.stringify(msgList)
        })
      }
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  }
})