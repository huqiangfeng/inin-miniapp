// components/chattingRecords/chattingRecords.js
const req_fn = require("../../utils/route");
const util = require("../../utils/util");
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    userObj: {
      type: Object,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    localImg: app.localImg,
    lists: [], // 会话列表
    worker: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getList(value) {
      if (this.data.worker) {
        this.data.worker.terminate()
      }
      if (!value.trim()) {
        return
      }
      let msgList = JSON.stringify([this.properties.userObj])
      const worker = wx.createWorker('workers/request/index.js')
      worker.postMessage({
        value,
        msgList: msgList
      })
      worker.onMessage((lists) => {
        this.triggerEvent('reset', lists);
        worker.terminate()
      })
      this.setData({
        worker: worker
      })
    },
    // 聊天页面跳转
    changePage(e) {
      // let index = e.currentTarget.dataset.index
      let id = this.properties.userObj.listid.replace("p2p-", "")
      console.log('12123213');
      wx.navigateTo({
        url: "/pages/im/chat/chat?id=" + id
      });
    },
  },
  lifetimes: {
    attached: function () {

    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  }
})