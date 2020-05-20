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
      const worker = wx.createWorker('workers/request/index.js')
      worker.postMessage({
        value,
        msgList: this.data.msgList
      })
      worker.onMessage((lists) => {
        console.log(lists);
        this.setData({
          lists: lists
        })
        worker.terminate()
      })
      this.setData({
        worker: worker
      })
    },
    // 聊天页面跳转
    changePage(e) {
      let index = e.currentTarget.dataset.index
      let lists = this.data.lists
      wx.navigateTo({
        url: "/pages/im/chat/chat?id=" + lists[index].listid.replace("p2p-", "")
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