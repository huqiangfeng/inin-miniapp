// components/pushList/pushList.js
const req_fn = require("../..//utils/route");
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
    list: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getPushList() {
      let list = []
      list.forEach(item => {
        // item.shortContent = item.content.replace(/<\/?.+?\/?>|\\r|\\n|\\t/g, '')
        item.shortContent = item.content.replace(/<\/?.+?\/?>/g, '')
        item.time = util.formatTime(item.crawl_date, true)
      })

      this.setData({
        list: list
      })
    },
    tapItem(e) {
      // this.triggerEvent('tapItem', e.currentTarget.dataset.index);
      let data = this.data.list[e.currentTarget.dataset.index]
      util.setLocal('pushData', data)
      wx.navigateTo({
        url: `/pages/email/pushDatalist/pushDatalist`
      })
    }
  },
  lifetimes: {
    // 在组件实例进入页面节点树时执行
    attached() {},
    //在组件在视图层布局完成后执行
    ready() {
      this.getPushList()
    },
    // 在组件实例被移动到节点树另一个位置时执行
    moved() {},
    // 在组件实例被从页面节点树移除时执行
    detached() {

    },
    // 每当组件方法抛出错误时执行
    error() {

    }
  },
})